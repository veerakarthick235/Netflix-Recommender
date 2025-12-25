import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCard from './components/MovieCard';
import './App.css'; // Assume basic dark mode css

const USER_ID = "user_1"; // Hardcoded for demo

function App() {
  const [movies, setMovies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    fetchMovies();
    fetchRecommendations();
  }, []);

  const fetchMovies = async () => {
    const res = await axios.get('http://localhost:5000/api/movies');
    setMovies(res.data);
  };

  const fetchRecommendations = async () => {
    const res = await axios.get(`http://localhost:5000/api/recommend/${USER_ID}`);
    setRecommendations(res.data);
  };

  const handleRate = async (movieId, rating) => {
    await axios.post('http://localhost:5000/api/interact', {
      user_id: USER_ID,
      movie_id: movieId,
      rating: rating
    });
    alert(`Rated ${rating} stars! Refreshing recommendations...`);
    // Re-fetch recommendations to see impact immediately
    fetchRecommendations();
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#141414', minHeight: '100vh', color: 'white' }}>
      <h1>Netflix Hybrid Engine</h1>
      
      <h2>Recommended For You</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {recommendations.length > 0 ? recommendations.map(m => (
          <MovieCard key={m._id} movie={m} onRate={handleRate} />
        )) : <p>Watch and rate movies to get recommendations!</p>}
      </div>

      <h2>All Movies</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {movies.map(m => (
          <MovieCard key={m._id} movie={m} onRate={handleRate} />
        ))}
      </div>
    </div>
  );
}

export default App;