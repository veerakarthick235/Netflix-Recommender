import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  width: 220px;
  height: 340px;
  background: #181818;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 20px rgba(0,0,0,0.8);
    z-index: 100;
  }
`;

const Poster = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s;
  
  ${Card}:hover & {
    opacity: 0.3; /* Darken image on hover to show buttons */
  }
`;

const ContentOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease-in-out;
  background: linear-gradient(to top, #141414 10%, transparent);

  ${Card}:hover & {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Title = styled.h3`
  margin: 0 0 5px 0;
  font-size: 16px;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Genre = styled.p`
  font-size: 11px;
  color: #aaa;
  margin: 0 0 10px 0;
`;

/* STYLISH BUTTONS */
const ActionRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const PlayButton = styled.button`
  background-color: white;
  color: black;
  border: none;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  transition: 0.2s;
  
  &:hover {
    background-color: #e6e6e6;
    transform: scale(1.1);
  }
`;

const RatingButton = styled.div`
  display: flex;
  gap: 2px;
`;

const MovieCard = ({ movie, onRate }) => {
  const handlePlay = (e) => {
    e.stopPropagation();
    window.open(movie.netflix_url || `https://www.netflix.com/search?q=${movie.title}`, '_blank');
  };

  return (
    <Card onClick={handlePlay}>
      <Poster src={movie.poster} alt={movie.title} />
      
      <ContentOverlay>
        <Title>{movie.title}</Title>
        <Genre>{movie.genre}</Genre>
        
        <ActionRow>
          <PlayButton title="Play Now">▶</PlayButton>
          
          {/* Custom styled stars */}
          <RatingButton>
            {[1,2,3,4,5].map(star => (
               <span 
               key={star} 
               onClick={(e) => { e.stopPropagation(); onRate(movie._id, star); }}
               style={{cursor: 'pointer', color: 'red', fontSize: '18px', padding: '0 2px'}}
             >★</span>
            ))}
          </RatingButton>
        </ActionRow>
      </ContentOverlay>
    </Card>
  );
};

export default MovieCard;