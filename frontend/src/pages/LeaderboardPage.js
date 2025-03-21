import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  PageContainer,
  BannerSection,
  MainTitle,
  SubTitle,
  SectionTitle,
  LeaderboardList,
  LeaderItem,
  RankCircle,
  CreatorInfo,
  CreatorName,
  ScoreContainer,
  StarIcon,
  ChevronIcon,
  LoadingSpinner,
  ErrorMessage
} from './LeaderboardStyles';

// API endpoint for Google Sheets
const SHEETS_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets';
const SHEET_ID = process.env.REACT_APP_SHEET_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

// Helper function to format large numbers with commas
const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

function LeaderboardPage({ theme, telegramUser }) {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Function to fetch leaderboard data from Google Sheets
    const fetchLeaderboardData = async () => {
      try {
        // For MVP, we're using public Google Sheets API
        // In production, you should use a backend API for this
        const response = await axios.get(
          `${SHEETS_API_URL}/${SHEET_ID}/values/Leaderboard!A2:D`,
          {
            params: {
              key: API_KEY
            }
          }
        );

        // Process the data
        const rows = response.data.values || [];
        const formattedData = rows
          .filter(row => row.length >= 4 && row[2] && row[2] !== "#N/A")
          .map((row, index) => ({
            rank: index + 1,
            userId: row[0],
            twitterHandle: row[2],
            score: parseInt(row[3]) || 0
          }));

        // Sort by score in descending order
        formattedData.sort((a, b) => b.score - a.score);
        
        // Update ranks after sorting
        formattedData.forEach((item, index) => {
          item.rank = index + 1;
        });

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

  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner theme={theme}>Loading leaderboard data...</LoadingSpinner>
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

  return (
    <PageContainer>
      <BannerSection>
        <MainTitle>Rankify: Post, Compete, Fun!</MainTitle>
        <SubTitle>
          Check out the most active and popular Ambassadors in Alephium on this leaderboard!
        </SubTitle>
      </BannerSection>

      <SectionTitle>Top Creators</SectionTitle>
      
      <LeaderboardList theme={theme}>
        {leaderboardData.map((item) => (
          <LeaderItem 
            key={item.userId} 
            theme={theme}
            onClick={() => handleRowClick(item.userId)}
          >
            <RankCircle rank={item.rank}>{item.rank}</RankCircle>
            <CreatorInfo>
              <CreatorName theme={theme}>{item.twitterHandle}</CreatorName>
              <ScoreContainer>
                <StarIcon>★</StarIcon> {formatNumber(item.score)}
              </ScoreContainer>
            </CreatorInfo>
            <ChevronIcon>›</ChevronIcon>
          </LeaderItem>
        ))}
        
        {leaderboardData.length === 0 && (
          <LeaderItem theme={theme}>
            <div style={{ textAlign: 'center', width: '100%' }}>
              No data available yet.
            </div>
          </LeaderItem>
        )}
      </LeaderboardList>
    </PageContainer>
  );
}

export default LeaderboardPage;