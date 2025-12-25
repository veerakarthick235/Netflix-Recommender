import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import MovieCard from './components/MovieCard';
import './App.css'; 

const USER_ID = "user_1"; 

// --- STYLED COMPONENTS FOR LAYOUT ---

const Navbar = styled.nav`
  position: fixed;
  top: 0;
  width: 100%;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%);
  z-index: 100;
`;

const Logo = styled.h1`
  color: #E50914; /* Netflix Red */
  font-size: 40px;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  cursor: pointer;
`;

const NavButton = styled.button`
  background-color: transparent;
  color: white;
  border: 1px solid white;
  padding: 8px 15px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
  &:hover { background-color: white; color: black; }
`;

const HeroSection = styled.header`
  height: 80vh;
  background: url('https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg') center/cover no-repeat;
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 50px;
  box-shadow: inset 0 -150px 100px -20px #141414; /* Fade to black at bottom */
`;

const HeroContent = styled.div`
  max-width: 600px;
  z-index: 10;
`;

const HeroTitle = styled.h1`
  font-size: 80px;
  margin-bottom: 20px;
  text-shadow: 3px 3px 5px rgba(0,0,0,0.8);
`;

const HeroDesc = styled.p`
  font-size: 18px;
  line-height: 1.5;
  margin-bottom: 30px;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
`;

const HeroButton = styled.button`
  padding: 12px 30px;
  font-size: 18px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 15px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: transform 0.2s, background 0.2s;
  
  /* Variant: Primary (White) */
  background-color: ${props => props.primary ? 'white' : 'rgba(109, 109, 110, 0.7)'};
  color: ${props => props.primary ? 'black' : 'white'};

  &:hover {
    transform: scale(1.05);
    background-color: ${props => props.primary ? '#e6e6e6' : 'rgba(109, 109, 110, 0.4)'};
  }
`;

// --- MAIN APP LOGIC ---

function App() {
  const [movies, setMovies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();
  const lastMovieElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [page]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/movies?page=${page}`);
      setMovies(prev => {
        const newMovies = res.data.movies.filter(n => !prev.some(p => p._id === n._id));
        return [...prev, ...newMovies];
      });
      setHasMore(res.data.has_more);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const fetchRecommendations = async () => {
    const res = await axios.get(`http://localhost:5000/api/recommend/${USER_ID}`);
    setRecommendations(res.data);
  };

  const handleRate = async (movieId, rating) => {
    await axios.post('http://localhost:5000/api/interact', {
      user_id: USER_ID, movie_id: movieId, rating: rating
    });
    alert(`Rated ${rating} stars! Updating suggestions...`);
    fetchRecommendations();
  };

  return (
    <div>
      <Navbar>
        <Logo>NETFLIX <span style={{fontSize: '15px', color: '#fff', letterSpacing: '2px'}}>ENGINE</span></Logo>
        <div style={{display:'flex', gap:'20px', alignItems:'center'}}>
          <span>User: {USER_ID}</span>
          <NavButton>Sign Out</NavButton>
        </div>
      </Navbar>

      <HeroSection>
        <HeroContent>
          <HeroTitle>INTERSTELLAR</HeroTitle>
          <HeroDesc>
            When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.
          </HeroDesc>
          <HeroButton primary>▶ Play</HeroButton>
          <HeroButton>ℹ More Info</HeroButton>
        </HeroContent>
      </HeroSection>

      <div style={{ padding: '20px 50px', marginTop: '-100px', position: 'relative', zIndex: '20' }}>
        
        <h2>Recommended For You</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '50px' }}>
          {recommendations.map(m => <MovieCard key={m._id} movie={m} onRate={handleRate} />)}
        </div>

        <h2>New Releases</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {movies.map((m, index) => {
            if (movies.length === index + 1) {
              return <div ref={lastMovieElementRef} key={m._id}><MovieCard movie={m} onRate={handleRate} /></div>;
            } else {
              return <div key={m._id}><MovieCard movie={m} onRate={handleRate} /></div>;
            }
          })}
        </div>
        
        {loading && <p style={{textAlign:'center'}}>Loading...</p>}
      </div>
    </div>
  );
}

export default App;