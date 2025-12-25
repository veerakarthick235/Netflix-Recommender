from flask import Blueprint, request, jsonify
from pymongo import MongoClient
import datetime
from models.engine import HybridRecommender
from config import Config

# Create the Blueprint
api_bp = Blueprint('api', __name__)

# Initialize Database using Config
client = MongoClient(Config.MONGO_URI)
db = client[Config.DB_NAME]

# Initialize AI Engine
recommender = HybridRecommender(db)
try:
    recommender.fetch_data()
    recommender.train_content_model()
    recommender.train_collab_model()
    print("AI Model Trained Successfully.")
except Exception as e:
    print(f"Warning: Model training failed (likely empty DB). Run seed.py first. Error: {e}")

# --- ROUTES ---

@api_bp.route('/movies', methods=['GET'])
def get_movies():
    # Infinity Scroll Logic
    page = int(request.args.get('page', 1))
    limit = 12 
    skip_amount = (page - 1) * limit

    movies_cursor = db.movies.find().skip(skip_amount).limit(limit)
    movies = list(movies_cursor)
    
    for m in movies: 
        m['_id'] = str(m['_id'])
    
    return jsonify({
        "movies": movies,
        "has_more": len(movies) == limit
    })

@api_bp.route('/recommend/<user_id>', methods=['GET'])
def recommend(user_id):
    current_movie_id = request.args.get('current_movie_id')
    recommendations = recommender.hybrid_recommendation(user_id, current_movie_id)
    return jsonify(recommendations)

@api_bp.route('/interact', methods=['POST'])
def interact():
    data = request.json
    interaction = {
        "user_id": data['user_id'],
        "movie_id": data['movie_id'],
        "rating": data['rating'],
        "timestamp": datetime.datetime.utcnow()
    }
    db.interactions.insert_one(interaction)
    return jsonify({"msg": "Interaction recorded"}), 201