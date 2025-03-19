import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Import styled components
import {
  PageContainer,
  Title,
  Subtitle,
  UserInfoCard,
  UserStats,
  StatItem,
  StatValue,
  StatLabel,
  PostsList,
  PostCard,
  PostHeader,
  PostLink,
  ScoreBadge,
  LoadingSpinner,
  ErrorMessage
} from './UserPageStyles';

// API endpoint for Google Sheets
const SHEETS_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets';
const SHEET_ID = process.env.REACT_APP_SHEET_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

function UserPage({ theme, telegramUser }) {
  const { userId } = useParams();
  const [userPosts, setUserPosts] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Determine if viewing own profile
  const isCurrentUser = telegramUser && telegramUser.id && telegramUser.id.toString() === userId;

  useEffect(() => {
    // Function to fetch user data from Google Sheets
    const fetchUserData = async () => {
      try {
        // Fetch data from Details sheet
        const response = await axios.get(
          `${SHEETS_API_URL}/${SHEET_ID}/values/Details!A2:G`,
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
          // Extract Twitter handle from first post (index 2)
          const twitterHandle = userRows[0][2];
          
          // Calculate total score
          const totalScore = userRows.reduce((sum, row) => {
            return sum + (parseInt(row[5]) || 0);  // Score is at index 5
          }, 0);
          
          setUserInfo({
            userId,
            twitterHandle,
            totalScore,
            totalPosts: userRows.length
          });
          
          // Format posts data
          const formattedPosts = userRows.map(row => ({
            userId: row[0],        // UserID
            telegramName: row[1],  // TelegramName
            twitterHandle: row[2], // TwitterHandle
            postUrl: row[3],       // PostURL
            timestamp: row[4],     // Timestamp
            score: parseInt(row[5]) || 0,  // Score
            status: row[6] || 'Pending'    // ReviewStatus
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

  return (
    <PageContainer>
      <Title theme={theme}>
        {isCurrentUser ? 'My Profile' : `@${userInfo.twitterHandle}'s Profile`}
      </Title>
      
      <UserInfoCard theme={theme}>
        <Subtitle theme={theme}>@{userInfo.twitterHandle}</Subtitle>
        
        <UserStats>
          <StatItem>
            <StatValue theme={theme}>{userInfo.totalScore}</StatValue>
            <StatLabel theme={theme}>Total Points</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue theme={theme}>{userInfo.totalPosts}</StatValue>
            <StatLabel theme={theme}>Submissions</StatLabel>
          </StatItem>
        </UserStats>
      </UserInfoCard>
      
      <Title theme={theme} style={{ fontSize: '20px' }}>
        {isCurrentUser ? 'My Submissions' : 'Submissions'}
      </Title>
      
      <PostsList>
        {userPosts.length > 0 ? (
          userPosts.map((post, index) => (
            <PostCard key={index} theme={theme}>
              <PostHeader theme={theme}>
                <div>{new Date(post.timestamp).toLocaleString()}</div>
                <ScoreBadge theme={theme} status={post.status}>
                  {post.status === 'Rejected' ? 'Rejected' : 
                   `+${post.score} points${post.status === 'Pending' ? ' (Pending)' : ''}`}
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
            No submissions yet.
          </div>
        )}
      </PostsList>
    </PageContainer>
  );
}

export default UserPage;