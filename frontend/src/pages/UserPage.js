import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

// API endpoint for Google Sheets
const SHEETS_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets';
const SHEET_ID = process.env.REACT_APP_SHEET_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

// Styled components
const PageContainer = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 10px;
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
  text-align: center;
`;

const Subtitle = styled.h2`
  font-size: 18px;
  margin-bottom: 20px;
  color: ${props => props.theme === 'dark' ? '#aaaaaa' : '#666666'};
  text-align: center;
`;

const UserInfoCard = styled.div`
  background-color: ${props => props.theme === 'dark' ? '#2c2c2c' : '#ffffff'};
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const UserStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  width: 100%;
  margin: 15px 0;
`;

const StatItem = styled.div`
  text-align: center;
  background-color: ${props => props.theme === 'dark' ? '#3c3c3c' : '#f8f9fa'};
  padding: 15px;
  border-radius: 8px;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: ${props => props.theme === 'dark' ? '#aaaaaa' : '#666666'};
  margin-top: 5px;
`;

const PlatformStats = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid ${props => props.theme === 'dark' ? '#444' : '#eee'};
`;

const PlatformStatItem = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PlatformIcon = styled.div`
  font-size: 20px;
  margin-bottom: 5px;
`;

const PlatformCount = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
`;

const PlatformLabel = styled.div`
  font-size: 12px;
  color: ${props => props.theme === 'dark' ? '#aaa' : '#666'};
`;

const PostsFilter = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  background-color: ${props => props.theme === 'dark' ? '#2c2c2c' : '#ffffff'};
  border-radius: 10px;
  padding: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FilterButton = styled.button`
  background-color: ${props => props.active ? '#0088cc' : 'transparent'};
  color: ${props => props.active ? '#ffffff' : (props.theme === 'dark' ? '#aaa' : '#666')};
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  font-size: 14px;

  &:hover {
    background-color: ${props => props.active ? '#0088cc' : (props.theme === 'dark' ? '#3c3c3c' : '#f0f0f0')};
  }
`;

const PostsList = styled.div`
  margin-top: 20px;
`;

const PostCard = styled.div`
  background-color: ${props => props.theme === 'dark' ? '#2c2c2c' : '#ffffff'};
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => 
    props.platform === 'twitter' ? '#1da1f2' : 
    props.platform === 'youtube' ? '#ff0000' : '#ccc'};
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
  color: ${props => props.theme === 'dark' ? '#aaaaaa' : '#666666'};
`;

const PostPlatform = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: bold;
  color: ${props => 
    props.platform === 'twitter' ? '#1da1f2' : 
    props.platform === 'youtube' ? '#ff0000' : '#666'};
`;

const PostLink = styled.a`
  display: block;
  margin-top: 10px;
  color: #0088cc;
  text-decoration: none;
  word-break: break-all;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ScoreBadge = styled.div`
  background-color: ${props => props.theme === 'dark' ? '#3c3c3c' : '#f0f0f0'};
  padding: 5px 10px;
  border-radius: 15px;
  font-weight: bold;
  color: ${props => props.status === 'Approved' ? '#27ae60' : 
    props.status === 'Rejected' ? '#e74c3c' : 
    props.status === 'Pending' ? '#f39c12' : '#666'};
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: ${props => props.theme === 'dark' ? '#aaa' : '#666'};
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  text-align: center;
  padding: 20px;
`;

function UserPage({ theme, telegramUser }) {
  const { userId } = useParams();
  const [userPosts, setUserPosts] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [postFilter, setPostFilter] = useState('all');
  const isCurrentUser = telegramUser && telegramUser.id.toString() === userId;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // For MVP, we're using public Google Sheets API
        const response = await axios.get(
          `${SHEETS_API_URL}/${SHEET_ID}/values/Details!A2:I`,
          {
            params: {
              key: API_KEY
            }
          }
        );

        // Process the data
        const rows = response.data.values || [];
        const userRows = rows.filter(row => row[0] === userId);
        
        if (userRows.length > 0) {
          // Extract user info from first post
          const telegramName = userRows[0][1];
          let twitterHandle = '';
          
          // Find Twitter handle from Twitter submissions
          const twitterRow = userRows.find(row => row[2] === 'twitter' && row[3]);
          if (twitterRow) {
            twitterHandle = twitterRow[3];
          }
          
          // Calculate statistics
          let totalScore = 0;
          let twitterSubmissions = 0;
          let youtubeSubmissions = 0;
          
          userRows.forEach(row => {
            totalScore += parseInt(row[7]) || 0;
            if (row[2] === 'twitter') twitterSubmissions++;
            if (row[2] === 'youtube') youtubeSubmissions++;
          });
          
          setUserInfo({
            userId,
            telegramName,
            twitterHandle,
            totalScore,
            totalPosts: userRows.length,
            twitterSubmissions,
            youtubeSubmissions
          });
          
          // Format posts data
          const formattedPosts = userRows.map(row => ({
            userId: row[0],
            telegramName: row[1],
            submissionType: row[2],
            twitterHandle: row[3] || '',
            youtubeHandle: row[4] || '',
            postUrl: row[5],
            timestamp: row[6],
            score: parseInt(row[7]) || 0,
            status: row[8] || 'Pending'
          }));
          
          // Sort by timestamp (newest first)
          formattedPosts.sort((a, b) => {
            return new Date(b.timestamp) - new Date(a.timestamp);
          });
          
          setUserPosts(formattedPosts);
        } else {
          setError('User not found or has no posts.');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data. Please try again later.');
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const getFilteredPosts = () => {
    switch (postFilter) {
      case 'twitter':
        return userPosts.filter(post => post.submissionType === 'twitter');
      case 'youtube':
        return userPosts.filter(post => post.submissionType === 'youtube');
      default:
        return userPosts;
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'twitter':
        return '🐦';
      case 'youtube':
        return '📺';
      default:
        return '📝';
    }
  };

  const getPlatformName = (platform) => {
    switch (platform) {
      case 'twitter':
        return 'Twitter';
      case 'youtube':
        return 'YouTube';
      default:
        return 'Post';
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner theme={theme}>Loading user data...</LoadingSpinner>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorMessage>{error}</ErrorMessage>
      </PageContainer>
    );
  }

  if (!userInfo) {
    return (
      <PageContainer>
        <ErrorMessage>User not found</ErrorMessage>
      </PageContainer>
    );
  }

  const filteredPosts = getFilteredPosts();

  return (
    <PageContainer>
      <Title theme={theme}>
        {isCurrentUser ? 'My Profile' : `${userInfo.telegramName}'s Profile`}
      </Title>
      
      <UserInfoCard theme={theme}>
        <Subtitle theme={theme}>@{userInfo.telegramName}</Subtitle>
        {userInfo.twitterHandle && (
          <div style={{ color: '#1da1f2', marginBottom: '15px' }}>
            🐦 @{userInfo.twitterHandle}
          </div>
        )}
        
        <UserStats>
          <StatItem theme={theme}>
            <StatValue theme={theme}>{userInfo.totalScore}</StatValue>
            <StatLabel theme={theme}>Total Points</StatLabel>
          </StatItem>
          <StatItem theme={theme}>
            <StatValue theme={theme}>{userInfo.totalPosts}</StatValue>
            <StatLabel theme={theme}>Total Submissions</StatLabel>
          </StatItem>
        </UserStats>
        
        <PlatformStats theme={theme}>
          <PlatformStatItem>
            <PlatformIcon>🐦</PlatformIcon>
            <PlatformCount theme={theme}>{userInfo.twitterSubmissions}</PlatformCount>
            <PlatformLabel theme={theme}>Twitter</PlatformLabel>
          </PlatformStatItem>
          <PlatformStatItem>
            <PlatformIcon>📺</PlatformIcon>
            <PlatformCount theme={theme}>{userInfo.youtubeSubmissions}</PlatformCount>
            <PlatformLabel theme={theme}>YouTube</PlatformLabel>
          </PlatformStatItem>
        </PlatformStats>
      </UserInfoCard>
      
      <Title theme={theme} style={{ fontSize: '20px', marginBottom: '15px' }}>
        {isCurrentUser ? 'My Submissions' : 'Submissions'}
      </Title>
      
      <PostsFilter theme={theme}>
        <FilterButton 
          active={postFilter === 'all'}
          theme={theme}
          onClick={() => setPostFilter('all')}
        >
          All ({userInfo.totalPosts})
        </FilterButton>
        <FilterButton 
          active={postFilter === 'twitter'}
          theme={theme}
          onClick={() => setPostFilter('twitter')}
        >
          🐦 Twitter ({userInfo.twitterSubmissions})
        </FilterButton>
        <FilterButton 
          active={postFilter === 'youtube'}
          theme={theme}
          onClick={() => setPostFilter('youtube')}
        >
          📺 YouTube ({userInfo.youtubeSubmissions})
        </FilterButton>
      </PostsFilter>
      
      <PostsList>
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, index) => (
            <PostCard key={index} theme={theme} platform={post.submissionType}>
              <PostHeader theme={theme}>
                <PostPlatform platform={post.submissionType}>
                  {getPlatformIcon(post.submissionType)}
                  {getPlatformName(post.submissionType)}
                </PostPlatform>
                <div>{new Date(post.timestamp).toLocaleString()}</div>
                <ScoreBadge theme={theme} status={post.status}>
                  {post.status === 'Approved' ? `+${post.score} points` : 
                   post.status === 'Rejected' ? 'Rejected' : 
                   'Pending Review'}
                </ScoreBadge>
              </PostHeader>
              <PostLink 
                href={post.postUrl} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                {post.postUrl}
              </PostLink>
            </PostCard>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '20px', color: theme === 'dark' ? '#aaa' : '#666' }}>
            {postFilter === 'all' ? 'No submissions yet.' : 
             `No ${getPlatformName(postFilter)} submissions yet.`}
          </div>
        )}
      </PostsList>
    </PageContainer>
  );
}

export default UserPage;