import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import {
  PageContainer,
  Title,
  LeaderboardTable,
  TableHeader,
  TableRow,
  Rank,
  UserInfo,
  TwitterHandle,
  Score,
  LoadingSpinner,
  ErrorMessage
} from './LeaderboardStyles';


// API endpoint for Google Sheets
const SHEETS_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets';
// Make sure these are properly set in your .env file
const SHEET_ID = process.env.REACT_APP_SHEET_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

// Styled components remain the same...
// [All your styled components here]

function LeaderboardPage({ telegramUser }) {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Inside your LeaderboardPage component:

// Modified fetch function for LeaderboardPage.js with enhanced debugging

useEffect(() => {
  // Function to fetch leaderboard data from Google Sheets
  // This is the part of the fetchLeaderboardData function that needs to be updated:

  const fetchLeaderboardData = async () => {
    try {
      // For MVP, we're using public Google Sheets API
      // In production, you should use a backend API for this
      const response = await axios.get(
        `${SHEETS_API_URL}/${SHEET_ID}/values/Leaderboard!A2:D`, // Updated to include column D for score
        {
          params: {
            key: API_KEY
          }
        }
      );

      // Process the data
      const rows = response.data.values || [];
      const formattedData = rows
        .filter(row => row.length >= 4 && row[2] && row[2] !== "#N/A") // Make sure row has enough elements and valid Twitter handle
        .map((row, index) => ({
          rank: index + 1,
          userId: row[0],
          twitterHandle: row[2], // Twitter handle is at index 2
          score: parseInt(row[3]) || 0 // Score is at index 3
        }));

      // Sort by score in descending order
      formattedData.sort((a, b) => b.score - a.score);
      
      // Update ranks after sorting
      formattedData.forEach((item, index) => {
        item.rank = index + 1;
      });

      // Remove this line that sets sample data
      // setLeaderboardData(sampleData);
      
      // Use the actual data from Google Sheets
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

  // Rest of the component remains the same...
  // [Return and render logic here]

  return (
    <PageContainer>
      <Title>Competition Leaderboard</Title>
      
      <LeaderboardTable>
        <TableHeader>
          <div>Rank</div>
          <div>Twitter</div>
          <div>Score</div>
        </TableHeader>
        
        {leaderboardData.map((item) => (
          <TableRow 
            key={item.userId} 
            onClick={() => handleRowClick(item.userId)}
          >
            <Rank>{item.rank}</Rank>
            <UserInfo>
              <TwitterHandle>@{item.twitterHandle}</TwitterHandle>
            </UserInfo>
            <Score>{item.score}</Score>
          </TableRow>
        ))}
        
        {leaderboardData.length === 0 && (
          <TableRow>
            <div colSpan="3" style={{ textAlign: 'center', gridColumn: '1 / span 3' }}>
              No data available yet.
            </div>
          </TableRow>
        )}
      </LeaderboardTable>
    </PageContainer>
  );
}

export default LeaderboardPage;