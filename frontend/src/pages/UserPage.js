import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import SimpleTweetEmbed from './SimpleTweetEmbed';

// API endpoint for Google Sheets
const SHEETS_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets';
const SHEET_ID = process.env.REACT_APP_SHEET_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

// Styled components
const PageContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Subtitle = styled.h2`
  font-size: 20px;
  margin-bottom: 20px;
  color: ${props => props.theme === 'dark' ? '#aaaaaa' : '#666666'};
  text-align: center;
  font-weight: bold;
`;

const UserInfoCard = styled.div`
  background-color: ${props => props.theme === 'dark' ? '#2c2c2c' : '#ffffff'};
  border-radius: 16px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const UserStats = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin: 15px 0;
`;

const StatItem = styled.div`
  text-align: center;
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

const SectionTitle = styled.h2`
  font-size: 22px;
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#333333'};
  margin: 25px 0 15px 0;
  font-weight: bold;
`;

const PostsList = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const PostContainer = styled.div`
  margin-bottom: 20px;
`;

const ScoreBadge = styled.div`
  display: inline-flex;
  background-color: ${props => props.theme === 'dark' ? '#3c3c3c' : '#f0f0f0'};
  padding: 5px 10px;
  border-radius: 15px;
  font-weight: bold;
  color: ${props => 
    props.status === 'Approved' ? '#8364E8' : 
    props.status === 'Rejected' ? '#e74c3c' : 
    props.status === 'Pending' ? '#f39c12' : '#666'
  };
  align-items: center;
  font-size: 14px;
  margin-top: 10px;
`;

const StarIcon = styled.span`
  color: #8364E8;
  margin-right: 4px;
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

function UserPage({ theme = 'light', telegramUser }) {
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
          
          // User info
          setUserInfo({
            userId,
            twitterHandle,
            totalScore,
            totalPosts: userRows.length
          });
          
          // Format posts data
          const formattedPosts = userRows.map(row => {
            return {
              userId: row[0],        // UserID
              telegramName: row[1],  // TelegramName
              twitterHandle: row[2], // TwitterHandle
              postUrl: row[3],       // PostURL
              timestamp: row[4],     // Timestamp
              score: parseInt(row[5]) || 0,  // Score
              status: row[6] || 'Pending'    // ReviewStatus
            };
          });
          
          // Sort by timestamp (newest first)
          formattedPosts.sort((a, b) => {
            return new Date(b.timestamp) - new Date(a.timestamp);
          });
          
          setUserPosts(formattedPosts);
          setLoading(false);
        } else {
          setError('User not found or has no posts.');
          setLoading(false);
        }
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
      
      <SectionTitle theme={theme}>
        Posts from {userInfo.twitterHandle}
      </SectionTitle>
      
      <PostsList>
        {userPosts.length > 0 ? (
          userPosts.map((post, index) => (
            <PostContainer key={index}>
              <SimpleTweetEmbed 
                tweetUrl={post.postUrl}
                theme={theme}
              />
              <ScoreBadge theme={theme} status={post.status}>
                <StarIcon>★</StarIcon> {post.score} {post.status === 'Pending' ? '(Pending)' : ''}
              </ScoreBadge>
            </PostContainer>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '20px', color: theme === 'dark' ? '#aaa' : '#666' }}>
            No posts yet
          </div>
        )}
      </PostsList>
    </PageContainer>
  );
}

export default UserPage;