import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

// API endpoint for Google Sheets
const SHEETS_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets';
const SHEET_ID = process.env.REACT_APP_SHEET_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

// Sample data for development
const sampleData = [
  { 
    rank: 1, 
    userId: "123", 
    telegramName: "user1", 
    twitterHandle: "user1_twitter", 
    score: 100,
    twitterSubmissions: 3,
    youtubeSubmissions: 2
  },
  { 
    rank: 2, 
    userId: "456", 
    telegramName: "user2", 
    twitterHandle: "user2_twitter", 
    score: 75,
    twitterSubmissions: 2,
    youtubeSubmissions: 1
  },
  { 
    rank: 3, 
    userId: "789", 
    telegramName: "user3", 
    twitterHandle: "", 
    score: 50,
    twitterSubmissions: 0,
    youtubeSubmissions: 3
  }
];

// Styled components
const PageContainer = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
  text-align: center;
`;

const LeaderboardTable = styled.div`
  background-color: ${props => props.theme === 'dark' ? '#2c2c2c' : '#ffffff'};
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 2fr 1fr;
  padding: 15px;
  background-color: ${props => props.theme === 'dark' ? '#3c3c3c' : '#f0f0f0'};
  font-weight: bold;
  border-bottom: 1px solid ${props => props.theme === 'dark' ? '#444' : '#ddd'};
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 2fr 1fr;
  padding: 15px;
  border-bottom: 1px solid ${props => props.theme === 'dark' ? '#444' : '#ddd'};
  transition: background-color 0.2s;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme === 'dark' ? '#3c3c3c' : '#f5f5f5'};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const Rank = styled.div`
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.div`
  font-weight: bold;
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
  margin-bottom: 5px;
`;

const UserHandles = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const Handle = styled.div`
  font-size: 12px;
  color: ${props => props.platform === 'twitter' ? '#1da1f2' : 
    props.platform === 'youtube' ? '#ff0000' : '#666'};
  display: flex;
  align-items: center;
  gap: 5px;
`;

const PlatformIcon = styled.span`
  font-size: 14px;
`;

const SubmissionCounts = styled.div`
  font-size: 11px;
  color: ${props => props.theme === 'dark' ? '#aaa' : '#666'};
  margin-top: 5px;
`;

const Score = styled.div`
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
`;

const ScoreValue = styled.div`
  font-size: 20px;
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
`;

const ScoreLabel = styled.div`
  font-size: 12px;
  color: ${props => props.theme === 'dark' ? '#aaa' : '#666'};
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

const FilterTabs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  background-color: ${props => props.theme === 'dark' ? '#2c2c2c' : '#ffffff'};
  border-radius: 10px;
  padding: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FilterTab = styled.button`
  background-color: ${props => props.active ? '#0088cc' : 'transparent'};
  color: ${props => props.active ? '#ffffff' : (props.theme === 'dark' ? '#aaa' : '#666')};
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: ${props => props.active ? 'bold' : 'normal'};

  &:hover {
    background-color: ${props => props.active ? '#0088cc' : (props.theme === 'dark' ? '#3c3c3c' : '#f0f0f0')};
  }
`;

function LeaderboardPage({ theme, telegramUser }) {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboardData = async () => {
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
        
        // Group by user ID and aggregate data
        const userMap = new Map();
        
        rows.forEach(row => {
          const [userId, telegramName, submissionType, twitterHandle, youtubeHandle, postUrl, timestamp, score, reviewStatus] = row;
          
          if (!userMap.has(userId)) {
            userMap.set(userId, {
              userId,
              telegramName,
              twitterHandle: '',
              score: 0,
              twitterSubmissions: 0,
              youtubeSubmissions: 0
            });
          }
          
          const user = userMap.get(userId);
          user.score += parseInt(score) || 0;
          
          if (submissionType === 'twitter') {
            user.twitterSubmissions++;
            if (twitterHandle && !user.twitterHandle) {
              user.twitterHandle = twitterHandle;
            }
          } else if (submissionType === 'youtube') {
            user.youtubeSubmissions++;
          }
        });

        // Convert to array and sort by score
        const formattedData = Array.from(userMap.values())
          .sort((a, b) => b.score - a.score)
          .map((user, index) => ({
            ...user,
            rank: index + 1
          }));

        // Use sample data for development
        setLeaderboardData(sampleData);
        // setLeaderboardData(formattedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching leaderboard data:', err);
        setError('Failed to load leaderboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  const handleRowClick = (userId) => {
    navigate(`/user/${userId}`);
  };

  const getFilteredData = () => {
    switch (activeFilter) {
      case 'twitter':
        return leaderboardData.filter(user => user.twitterSubmissions > 0);
      case 'youtube':
        return leaderboardData.filter(user => user.youtubeSubmissions > 0);
      default:
        return leaderboardData;
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Title theme={theme}>Leaderboard</Title>
        <LoadingSpinner theme={theme}>Loading leaderboard data...</LoadingSpinner>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <Title theme={theme}>Leaderboard</Title>
        <ErrorMessage>{error}</ErrorMessage>
      </PageContainer>
    );
  }

  const filteredData = getFilteredData();

  return (
    <PageContainer>
      <Title theme={theme}>Competition Leaderboard</Title>
      
      <FilterTabs theme={theme}>
        <FilterTab 
          active={activeFilter === 'all'}
          theme={theme}
          onClick={() => setActiveFilter('all')}
        >
          All
        </FilterTab>
        <FilterTab 
          active={activeFilter === 'twitter'}
          theme={theme}
          onClick={() => setActiveFilter('twitter')}
        >
          🐦 Twitter
        </FilterTab>
        <FilterTab 
          active={activeFilter === 'youtube'}
          theme={theme}
          onClick={() => setActiveFilter('youtube')}
        >
          📺 YouTube
        </FilterTab>
      </FilterTabs>
      
      <LeaderboardTable theme={theme}>
        <TableHeader theme={theme}>
          <div>Rank</div>
          <div>User</div>
          <div>Score</div>
        </TableHeader>
        
        {filteredData.map((item) => (
          <TableRow 
            key={item.userId} 
            theme={theme}
            onClick={() => handleRowClick(item.userId)}
          >
            <Rank>{item.rank}</Rank>
            <UserInfo>
              <UserName theme={theme}>@{item.telegramName}</UserName>
              <UserHandles>
                {item.twitterHandle && (
                  <Handle platform="twitter">
                    <PlatformIcon>🐦</PlatformIcon>
                    @{item.twitterHandle}
                  </Handle>
                )}
                {item.youtubeSubmissions > 0 && (
                  <Handle platform="youtube">
                    <PlatformIcon>📺</PlatformIcon>
                    YouTube Creator
                  </Handle>
                )}
              </UserHandles>
              <SubmissionCounts theme={theme}>
                {item.twitterSubmissions > 0 && `${item.twitterSubmissions} Twitter`}
                {item.twitterSubmissions > 0 && item.youtubeSubmissions > 0 && ' • '}
                {item.youtubeSubmissions > 0 && `${item.youtubeSubmissions} YouTube`}
              </SubmissionCounts>
            </UserInfo>
            <Score>
              <ScoreValue theme={theme}>{item.score}</ScoreValue>
              <ScoreLabel theme={theme}>points</ScoreLabel>
            </Score>
          </TableRow>
        ))}
        
        {filteredData.length === 0 && (
          <TableRow theme={theme}>
            <div style={{ textAlign: 'center', gridColumn: '1 / span 3', padding: '20px' }}>
              No data available for this filter.
            </div>
          </TableRow>
        )}
      </LeaderboardTable>
    </PageContainer>
  );
}

export default LeaderboardPage;