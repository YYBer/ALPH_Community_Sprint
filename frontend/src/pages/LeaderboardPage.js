import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

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

const BannerSection = styled.div`
  background: linear-gradient(135deg, #9370DB, #8A2BE2);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

// const Avatar = styled.div`
//   width: 80px;
//   height: 80px;
//   border-radius: 12px;
//   background-color: #4169E1;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   margin-bottom: 20px;
//   position: relative;
//   overflow: hidden;
// `;

// const AvatarImage = styled.img`
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
// `;

// const ViewCount = styled.div`
//   position: absolute;
//   bottom: 0;
//   right: 0;
//   background-color: rgba(0, 0, 0, 0.6);
//   color: white;
//   padding: 2px 8px;
//   border-radius: 8px 0 0 0;
//   font-size: 12px;
//   display: flex;
//   align-items: center;
// `;

// const EyeIcon = styled.span`
//   margin-right: 4px;
// `;

const MainTitle = styled.h1`
  font-size: 32px;
  color: white;
  margin: 10px 0;
  text-align: center;
  font-weight: bold;
`;

const SubTitle = styled.p`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  text-align: center;
  max-width: 600px;
`;

const SectionTitle = styled.h2`
  font-size: 28px;
  color: #333;
  margin-bottom: 20px;
  font-weight: bold;
`;

const LeaderboardList = styled.div`
  background-color: ${props => props.theme === 'dark' ? '#2c2c2c' : '#ffffff'};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
`;

const LeaderItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid ${props => props.theme === 'dark' ? '#444' : '#eee'};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.theme === 'dark' ? '#3c3c3c' : '#f9f9f9'};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const RankCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => {
    if (props.rank === 1) return '#FFD700';
    if (props.rank === 2) return '#C0C0C0';
    if (props.rank === 3) return '#CD7F32';
    return '#E0E0E0';
  }};
  color: ${props => {
    if (props.rank <= 3) return '#333';
    return '#666';
  }};
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  margin-right: 16px;
  flex-shrink: 0;
`;

// const CreatorAvatar = styled.div`
//   width: 50px;
//   height: 50px;
//   border-radius: 50%;
//   background-color: #ddd;
//   margin-right: 16px;
//   overflow: hidden;
//   flex-shrink: 0;
// `;

// const CreatorImage = styled.img`
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
// `;

const CreatorInfo = styled.div`
  flex: 1;
`;

const CreatorName = styled.div`
  font-weight: bold;
  font-size: 18px;
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#333'};
  margin-bottom: 4px;
`;

const ScoreContainer = styled.div`
  display: flex;
  align-items: center;
  color: #888;
  font-size: 16px;
`;

const StarIcon = styled.span`
  color: #FFD700;
  margin-right: 4px;
`;

const ChevronIcon = styled.span`
  margin-left: 16px;
  color: #ccc;
  font-size: 20px;
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

        // Sample data for demonstration (remove in production)
        // const sampleData = [
        //   { rank: 1, userId: "123", twitterHandle: "MoonKing", score: 7302540, avatar: "https://via.placeholder.com/50" },
        //   { rank: 2, userId: "456", twitterHandle: "DeFi Oracle", score: 5365909, avatar: "https://via.placeholder.com/50" },
        //   { rank: 3, userId: "789", twitterHandle: "Crypto Solutions ■", score: 4648425, avatar: "https://via.placeholder.com/50" },
        //   { rank: 4, userId: "101", twitterHandle: "Tola Fadugbagbe", score: 4063132, avatar: "https://via.placeholder.com/50" },
        //   { rank: 5, userId: "102", twitterHandle: "Devmustee | TON Society", score: 3888311, avatar: "https://via.placeholder.com/50" }
        // ];

        // Use sample data for demonstration
        // setLeaderboardData(sampleData);
        // Uncomment below line to use real data
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
        <MainTitle>Post, Compete, Fun!</MainTitle>
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
            {/* <CreatorAvatar>
              <CreatorImage src={item.avatar || `/api/placeholder/50/50`} alt={item.twitterHandle} />
            </CreatorAvatar> */}
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