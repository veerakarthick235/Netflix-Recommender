from pymongo import MongoClient
import random
import time
import urllib.parse 

client = MongoClient("mongodb://localhost:27017/")
db = client['netflix_db']

def fast_seed():
    print("⚠️  Starting Massive Data Injection with Netflix Links...")
    start_time = time.time()

    # 1. Clear existing
    db.movies.drop()
    db.interactions.drop()
    
    # 2. Config
    TOTAL_MOVIES = 100000
    BATCH_SIZE = 5000
    
    genres = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Romance", "Documentary"]
    directors = ["Nolan", "Spielberg", "Tarantino", "Scorsese", "Unknown"]
    
    # 3. Batch Insert
    for i in range(0, TOTAL_MOVIES, BATCH_SIZE):
        batch = []
        for j in range(BATCH_SIZE):
            movie_num = i + j
            title = f"Movie Title {movie_num}"
            
            # Create a real Netflix Search URL
            # Example: https://www.netflix.com/search?q=Movie%20Title%20500
            encoded_title = urllib.parse.quote(title)
            netflix_link = f"https://www.netflix.com/search?q={encoded_title}"

            batch.append({
                "title": title,
                "genre": random.choice(genres),
                "description": f"Plot summary for {title}",
                "director": random.choice(directors),
                "poster": f"https://picsum.photos/seed/{movie_num}/200/300",
                "netflix_url": netflix_link, # <--- NEW FIELD
                "popularity": random.randint(1, 100)
            })
        
        db.movies.insert_many(batch)
        print(f"   Inserted batch {i} to {i+BATCH_SIZE}...")

    print(f"✅ {TOTAL_MOVIES} Movies inserted with Netflix links.")
    


if __name__ == "__main__":
    fast_seed()