import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SimpleTweetEmbed from '../components/SimpleTweetEmbed';
import {
  PageContainer,
  Title,
  LeaderboardTable,
  TableHeader,
  TableRow,
  Rank,
  UserInfo,
  UserName,
  UserHandles,
  Handle,
  PlatformIcon,
  SubmissionCounts,
  Score,
  ScoreValue,
  ScoreLabel,
  LoadingSpinner,
  ErrorMessage,
  FilterTabs,
  FilterTab
} from './LeaderboardStyles';

// API endpoint for Google Sheets
const SHEETS_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets';
const SHEET_ID = process.env.REACT_APP_SHEET_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

function LeaderboardPage({ theme, telegramUser }) {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        console.log('Fetching leaderboard data from Google Sheets...');
        
        const response = await axios.get(
          `${SHEETS_API_URL}/${SHEET_ID}/values/Details!A2:I`,
          {
            params: {
              key: API_KEY
            }
          }
        );

        const rows = response.data.values || [];
        console.log('Raw data rows:', rows.length);
        
        if (rows.length === 0) {
          setLeaderboardData([]);
          setLoading(false);
          return;
        }
        
        // Group by user ID and aggregate data
        const userMap = new Map();
        
        rows.forEach(row => {
          const [userId, telegramName, submissionType, twitterHandle, youtubeHandle, postUrl, timestamp, score, reviewStatus] = row;
          
          if (!userId || !telegramName) return; // Skip invalid rows
          
          if (!userMap.has(userId)) {
            userMap.set(userId, {
              userId,
              telegramName,
              twitterHandle: '',
              score: 0,
              twitterSubmissions: 0,
              youtubeSubmissions: 0,
              recentPost: null,
              posts: []
            });
          }
          
          const user = userMap.get(userId);
          
          // Only count approved scores
          if (reviewStatus === 'Approved') {
            user.score += parseInt(score) || 0;
          }
          
          if (submissionType === 'twitter') {
            user.twitterSubmissions++;
            if (twitterHandle && !user.twitterHandle) {
              user.twitterHandle = twitterHandle;
            }
          } else if (submissionType === 'youtube') {
            user.youtubeSubmissions++;
          }
          
          // Store all posts for recent post detection
          user.posts.push({
            type: submissionType,
            url: postUrl,
            timestamp: timestamp,
            score: parseInt(score) || 0,
            status: reviewStatus
          });
        });

        // Find most recent post for each user
        userMap.forEach(user => {
          if (user.posts.length > 0) {
            // Sort by timestamp and get the most recent
            user.posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            user.recentPost = user.posts[0];
          }
        });

        // Convert to array and sort by score
        const formattedData = Array.from(userMap.values())
          .filter(user => user.twitterSubmissions > 0 || user.youtubeSubmissions > 0) // Show users with submissions
          .sort((a, b) => b.score - a.score)
          .map((user, index) => ({
            ...user,
            rank: index + 1
          }));

        console.log('Processed leaderboard data:', formattedData.length, 'users');
        setLeaderboardData(formattedData);
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
      <Title theme={theme}>Leaderboard</Title>
      
      <FilterTabs theme={theme}>
        <FilterTab 
          active={activeFilter === 'all'}
          theme={theme}
          onClick={() => setActiveFilter('all')}
        >
          All ({leaderboardData.length})
        </FilterTab>
        <FilterTab 
          active={activeFilter === 'twitter'}
          theme={theme}
          onClick={() => setActiveFilter('twitter')}
        >
          🐦 Twitter ({leaderboardData.filter(u => u.twitterSubmissions > 0).length})
        </FilterTab>
        <FilterTab 
          active={activeFilter === 'youtube'}
          theme={theme}
          onClick={() => setActiveFilter('youtube')}
        >
          📺 YouTube ({leaderboardData.filter(u => u.youtubeSubmissions > 0).length})
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
              {leaderboardData.length === 0 ? 
                'No submissions found. Be the first to submit!' :
                'No data available for this filter.'
              }
            </div>
          </TableRow>
        )}
      </LeaderboardTable>
    </PageContainer>
  );
}

export default LeaderboardPage;