# 🎬 Netflix Hybrid Recommendation Engine

A full-stack video recommendation system that mimics the Netflix experience. It uses a **Hybrid AI Engine** combining **Collaborative Filtering** (SVD) and **Content-Based Filtering** (TF-IDF) to deliver personalized movie suggestions in real-time.


## 🚀 Key Features

* **Hybrid AI Algorithm:** Combines user interaction history (SVD) with metadata matching (TF-IDF) to solve the "Cold Start" problem.
* **Big Data Ready:** Optimized with Sparse Matrices (SciPy) to handle **100,000+ movies** without memory crashes.
* **Infinity Scroll:** High-performance frontend that loads content dynamically as you scroll.
* **Netflix Dark UI:** Authentic dark mode aesthetic with cinematic typography, hover animations, and dynamic "Play" overlays.
* **Real-Time Interactions:** Tracks user ratings (1-5 stars) and instantly updates recommendations.
* **Direct Play:** Integrated deep links to launch Netflix search for any movie directly from the dashboard.

---

## 🛠️ Tech Stack

### **Backend (Python & Flask)**
* **Flask:** RESTful API server.
* **Scikit-Learn & SciPy:** Machine learning algorithms (TruncatedSVD, Cosine Similarity).
* **Pandas & NumPy:** Efficient data manipulation.
* **PyMongo:** Database driver for MongoDB.

### **Frontend (React.js)**
* **React:** Component-based UI.
* **Styled-Components:** CSS-in-JS for dynamic styling and animations.
* **Axios:** HTTP client for API communication.
* **Intersection Observer:** For high-performance infinite scrolling.

### **Database**
* **MongoDB:** NoSQL database storing users, movies, and interaction logs.

---

## 📂 Project Structure

```bash
netflix-recommender/
├── backend/
│   ├── app.py                 # Application Entry Point
│   ├── config.py              # Environment Configuration
│   ├── .env                   # Secrets (Not uploaded to Git)
│   ├── models/
│   │   ├── engine.py          # The Hybrid Recommendation Logic
│   │   └── seed.py            # Data Generator (100k+ items)
│   └── routes/
│       └── api.py             # API Endpoints
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MovieCard.jsx  # Interactive Movie Component
│   │   ├── App.js             # Main UI Layout
│   │   └── App.css            # Global Styles
│   └── package.json
└── README.md

```

---

## ⚡ Getting Started

### Prerequisites

* Node.js & npm installed.
* Python 3.8+ installed.
* MongoDB running locally on port `27017`.

### 1. Backend Setup

Navigate to the backend folder and install dependencies:

```bash
cd backend
pip install flask flask-cors pymongo pandas scikit-learn numpy scipy python-dotenv
```

**Configure Environment:**
Create a file named `.env` in the `backend/` folder:

```ini
FLASK_APP=app.py
FLASK_ENV=development
MONGO_URI=mongodb://localhost:27017/
SECRET_KEY=your_secret_key
```

**Seed the Database:**
Generate 100,000 dummy movies and interactions:

```bash
python models/seed.py
```

*(Wait for the "Database Hydrated" message)*

**Start the Server:**

```bash
python app.py
```

*Server runs on: `http://localhost:5000*`

### 2. Frontend Setup

Open a new terminal, navigate to the frontend folder, and install dependencies:

```bash
cd frontend
npm install axios styled-components
```

**Start the React App:**

```bash
npm start
```

*App runs on: `http://localhost:3000*`

---

## 🧠 How the Algorithm Works

1. **Content-Based Filtering:**
* The engine analyzes movie genres, descriptions, and directors using **TF-IDF Vectorization**.
* If you like "Inception", it finds other movies with similar keywords (e.g., "Dream", "Sci-Fi", "Nolan").

2. **Collaborative Filtering:**
* The engine builds a User-Item Interaction Matrix.
* It uses **Truncated SVD (Singular Value Decomposition)** to decompose the matrix and find hidden patterns between users.
* If User A and User B liked similar movies, User A's unseen favorites are recommended to User B.

3. **Hybridization:**
* The system weights both scores. If a user is new (Cold Start), it relies on Content-Based. As the user interacts more, Collaborative Filtering takes over for better accuracy.

---

## 📸 Screenshots

***

---

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

