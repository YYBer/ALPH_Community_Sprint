import React from 'react';
import styled from 'styled-components';

const TweetContainer = styled.div`
  margin: 15px 0;
  border-radius: 12px;
  overflow: hidden;
`;

const ErrorContainer = styled.div`
  padding: 16px;
  text-align: center;
  color: ${props => props.theme === 'dark' ? '#aaa' : '#666'};
  background-color: ${props => props.theme === 'dark' ? '#2c2c2c' : '#f8f8f8'};
  border: 1px solid ${props => props.theme === 'dark' ? '#444' : '#ddd'};
  border-radius: 12px;
`;

// Function to extract tweet ID from URL
const extractTweetId = (url) => {
  if (!url) return null;
  
  const patterns = [
    /twitter\.com\/\w+\/status\/(\d+)/i,
    /x\.com\/\w+\/status\/(\d+)/i
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
};

const SimpleTweetEmbed = ({ tweetUrl, theme = 'light' }) => {
  const tweetId = extractTweetId(tweetUrl);
  
  if (!tweetId) {
    return (
      <ErrorContainer theme={theme}>
        Cannot display tweet: Invalid URL format
      </ErrorContainer>
    );
  }
  
  // Create the embed URL
  const embedUrl = `https://platform.twitter.com/embed/index.html?dnt=false&embedId=twitter-widget-0&frame=false&hideCard=false&hideThread=false&id=${tweetId}&theme=${theme === 'dark' ? 'dark' : 'light'}&widgetsVersion=ed20a2b%3A1601588405575`;

  return (
    <TweetContainer>
      <iframe
        title={`tweet-${tweetId}`}
        src={embedUrl}
        width="100%"
        height="300"
        frameBorder="0"
        scrolling="no"
        style={{ 
          border: 'none',
          overflow: 'hidden',
          borderRadius: '12px',
          display: 'block'
        }}
      ></iframe>
    </TweetContainer>
  );
};

export default SimpleTweetEmbed;