import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

// For direct Google Sheets access (only for MVP)
const SHEETS_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets';
const SHEET_ID = process.env.REACT_APP_SHEET_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

const apiService = {
  // Fetch leaderboard data
  getLeaderboard: async () => {
    try {
      // For MVP, we're using public Google Sheets API
      // In production, you would use your backend API
      const response = await axios.get(
        `${SHEETS_API_URL}/${SHEET_ID}/values/Leaderboard!A2:C`,
        {
          params: {
            key: API_KEY
          }
        }
      );

      // Process the data
      const rows = response.data.values || [];
      return rows.map((row, index) => ({
        rank: index + 1,
        userId: row[0],
        twitterHandle: row[1],
        score: parseInt(row[2]) || 0
      }));
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  },

  // Fetch user posts
  getUserPosts: async (userId) => {
    try {
      // For MVP, we're using public Google Sheets API
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
      
      return userRows.map(row => ({
        userId: row[0],
        telegramName: row[1],
        twitterHandle: row[2],
        postUrl: row[3],
        timestamp: row[4],
        score: parseInt(row[5]) || 0,
        status: row[6] || 'Pending'
      }));
    } catch (error) {
      console.error('Error fetching user posts:', error);
      throw error;
    }
  },

  // Get user referrals
  getUserReferrals: async (userId) => {
    try {
      // In production, this would be an API call to your backend
      // For MVP, we'll simulate the response
      
      // Simulated API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      return {
        remainingInvites: 1,
        referrals: [
          { username: 'user1', points: 25 },
          { username: 'user2', points: 10 }
        ]
      };
    } catch (error) {
      console.error('Error fetching referrals:', error);
      throw error;
    }
  }
};

export default apiService;