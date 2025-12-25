from flask import Flask
from flask_cors import CORS
from config import Config
from routes.api import api_bp 

app = Flask(__name__)

# 1. Load Configuration (from config.py which reads .env)
app.config.from_object(Config)

# 2. Enable CORS
CORS(app)

# 3. Register Blueprints
# This connects the logic from routes/api.py to this main app
app.register_blueprint(api_bp, url_prefix='/api')

if __name__ == '__main__':
    print("Starting Netflix Recommender Engine...")
    app.run(debug=app.config['DEBUG'], port=5000)