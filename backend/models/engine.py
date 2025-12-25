import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import TruncatedSVD
from scipy.sparse import csr_matrix

class HybridRecommender:
    def __init__(self, db):
        self.db = db
        # Limit content processing to top 5000 popular movies to save RAM
        # We cannot run TF-IDF on 100k items in real-time on a laptop easily
        self.content_limit = 5000 
        self.svd = None
        self.user_index_map = {}
        self.movie_index_map = {}
        self.reverse_movie_index_map = {}
        
    def fetch_data(self):
        print("Loading data for Engine...")
        # Only fetch necessary fields to save memory
        movies = list(self.db.movies.find({}, {"_id": 1, "title": 2, "genre": 3, "description": 4}).limit(self.content_limit))
        interactions = list(self.db.interactions.find())
        
        self.df_movies = pd.DataFrame(movies)
        self.df_interactions = pd.DataFrame(interactions)
        
        # ID Mapping
        self.df_movies['_id'] = self.df_movies['_id'].astype(str)
        self.movie_ids = self.df_movies['_id'].tolist()

    def train_content_model(self):
        print("Training Content Model...")
        if self.df_movies.empty: return

        self.df_movies['soup'] = self.df_movies.apply(
            lambda x: f"{x['genre']} {x['description']}", axis=1
        )
        # TF-IDF is memory efficient
        tfidf = TfidfVectorizer(stop_words='english', max_features=5000)
        self.content_matrix = tfidf.fit_transform(self.df_movies['soup'])
        
        # We do NOT calculate the full Cosine Similarity matrix (100k x 100k)
        # That would be 80GB RAM. We will calculate on-the-fly.

    def train_collab_model(self):
        print("Training Collaborative Model (Sparse SVD)...")
        if self.df_interactions.empty: return

        # 1. Map String IDs to Integer Indices for Matrix
        unique_users = self.df_interactions['user_id'].unique()
        unique_movies = self.df_interactions['movie_id'].unique()
        
        self.user_index_map = {user: i for i, user in enumerate(unique_users)}
        self.movie_index_map = {movie: i for i, movie in enumerate(unique_movies)}
        self.reverse_movie_index_map = {i: movie for movie, i in self.movie_index_map.items()}

        # 2. Create Sparse Matrix (CSR) - efficient memory usage
        row_ind = [self.user_index_map[u] for u in self.df_interactions['user_id']]
        col_ind = [self.movie_index_map[m] for m in self.df_interactions['movie_id']]
        data = self.df_interactions['rating'].values

        user_movie_sparse = csr_matrix((data, (row_ind, col_ind)), shape=(len(unique_users), len(unique_movies)))

        # 3. SVD on Sparse Matrix
        n_components = min(20, len(unique_movies)-1)
        self.svd = TruncatedSVD(n_components=n_components, random_state=42)
        self.matrix_reduced = self.svd.fit_transform(user_movie_sparse)
        
        # Compute correlation matrix on the REDUCED (small) dataset
        self.collab_corr = np.corrcoef(self.matrix_reduced)

    def get_content_recommendations(self, movie_id, top_n=10):
        # Find the index of the movie in our content subset
        matching_movies = self.df_movies[self.df_movies['_id'] == movie_id]
        
        if matching_movies.empty:
            return [] # Movie not in our analysis subset
            
        idx = matching_movies.index[0]
        
        # Calculate similarity ONLY for this specific movie vector against all others
        # This is fast and uses minimal RAM
        cosine_sim = cosine_similarity(self.content_matrix[idx:idx+1], self.content_matrix).flatten()
        
        sim_scores = list(enumerate(cosine_sim))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        movie_indices = [i[0] for i in sim_scores[1:top_n+1]]
        
        return self.df_movies.iloc[movie_indices][['_id', 'title', 'genre']].to_dict('records')

    def hybrid_recommendation(self, user_id, movie_id_currently_viewing=None, top_n=12):
        # Fallback: Random sample if user is unknown (Fastest for 100k items)
        if user_id not in self.user_index_map:
            random_sample = self.db.movies.aggregate([{"$sample": {"size": top_n}}])
            result = []
            for r in random_sample:
                r['_id'] = str(r['_id'])
                result.append(r)
            return result

  
        
        if movie_id_currently_viewing:
            return self.get_content_recommendations(movie_id_currently_viewing, top_n)
            
        # Return popular movies from DB (efficient aggregation)
        popular_cursor = self.db.movies.find().sort("popularity", -1).limit(top_n)
        popular_movies = list(popular_cursor)
        for m in popular_movies: m['_id'] = str(m['_id'])
        return popular_movies