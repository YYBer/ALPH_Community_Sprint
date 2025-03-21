import React from 'react';
import styled from 'styled-components';

const TweetCard = styled.div`
  border: 1px solid ${props => props.theme === 'dark' ? '#444' : '#e1e8ed'};
  border-radius: 12px;
  padding: 16px;
  background-color: ${props => props.theme === 'dark' ? '#2c2c2c' : '#fff'};
  margin: 15px 0;
  display: flex;
  flex-direction: column;
`;

const TweetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const UserName = styled.div`
  font-weight: bold;
  color: ${props => props.theme === 'dark' ? '#fff' : '#000'};
`;

const TwitterLogo = styled.div`
  color: #1DA1F2;
  font-size: 20px;
`;

const TweetDate = styled.div`
  color: ${props => props.theme === 'dark' ? '#aaa' : '#666'};
  font-size: 14px;
  margin-top: 4px;
`;

const TweetContent = styled.div`
  color: ${props => props.theme === 'dark' ? '#ddd' : '#333'};
  margin: 12px 0;
  line-height: 1.4;
`;

const TweetLink = styled.a`
  color: ${props => props.theme === 'dark' ? '#1DA1F2' : '#1DA1F2'};
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 20px;
  background-color: ${props => props.theme === 'dark' ? '#333' : '#f5f8fa'};
  text-align: center;
  margin-top: 10px;
  
  &:hover {
    background-color: ${props => props.theme === 'dark' ? '#444' : '#e1e8f3'};
  }
`;

const extractUsername = (url) => {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    
    // Twitter URL format: twitter.com/username/status/id
    if (pathParts.length > 1) {
      return pathParts[1];
    }
  } catch (error) {
    console.error('Error parsing tweet URL:', error);
  }
  
  return 'Twitter User';
};

const SimpleTweetPreview = ({ tweetUrl, content, username, date, theme = 'light' }) => {
  if (!tweetUrl) {
    return null;
  }
  
  const displayUsername = username || extractUsername(tweetUrl);
  const displayDate = date || 'Recently';
  const displayContent = content || `Tweet from @${displayUsername}`;
  
  return (
    <TweetCard theme={theme}>
      <TweetHeader>
        <div>
          <UserName theme={theme}>@{displayUsername}</UserName>
          <TweetDate theme={theme}>{displayDate}</TweetDate>
        </div>
        <TwitterLogo>𝕏</TwitterLogo>
      </TweetHeader>
      
      <TweetContent theme={theme}>
        {displayContent}
      </TweetContent>
      
      <TweetLink 
        href={tweetUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        theme={theme}
      >
        View on Twitter
      </TweetLink>
    </TweetCard>
  );
};

export default SimpleTweetPreview;