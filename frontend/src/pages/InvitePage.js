import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Import styled components
import {
  PageContainer,
  Title,
  Card,
  InfoText,
  InviteBox,
  InviteLink,
  RemainingInvites,
  Button,
  ReferralsList,
  ReferralItem,
  LoadingContainer,
  EmptyMessage
} from './InvitePageStyles';

// API endpoint for Google Sheets
const SHEETS_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets';
const SHEET_ID = process.env.REACT_APP_SHEET_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

function InvitePage({ theme, telegramUser }) {
  const [inviteLink, setInviteLink] = useState('');
  const [remainingInvites, setRemainingInvites] = useState(3);
  const [referrals, setReferrals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    // Get the user's ID from the Checkboard sheet in Google Sheets
    const fetchUserData = async () => {
      if (telegramUser) {
        setIsLoading(true);
        try {
          // Get the TelegramName from telegramUser
          const telegramName = telegramUser.username || '';
          
          // Fetch user data from the Checkboard sheet in Google Sheets
          const response = await axios.get(
            `${SHEETS_API_URL}/${SHEET_ID}/values/Checkboard!A2:C`,
            {
              params: {
                key: API_KEY
              }
            }
          );
          
          const rows = response.data.values || [];
          // Find the user by TelegramName (column B, index 1)
          const userRow = rows.find(row => row.length >= 2 && row[1] === telegramName);
          
          if (userRow) {
            // UserID is in column A (index 0)
            const fetchedUserId = userRow[0];
            setUserId(fetchedUserId);
            
            // Generate invite link with the UserID from Checkboard
            const link = `https://t.me/Alph_Rankify_Bot?start=${fetchedUserId}`;
            setInviteLink(link);
            
            // Now fetch referral data
            fetchUserReferralData(fetchedUserId);
          } else {
            // User not found in Checkboard sheet
            console.log('User not found in Checkboard sheet');
            setInviteLink(`https://t.me/Alph_Rankify_Bot?start=default`);
            setIsLoading(false);
          }
        } catch (error) {
          console.error('Error fetching user data from Checkboard:', error);
          setInviteLink(`https://t.me/Alph_Rankify_Bot?start=default`);
          setIsLoading(false);
        }
      } else {
        // Default link for demo purposes
        setInviteLink('https://t.me/Alph_Rankify_Bot?start=default');
        fetchUserReferralData();
      }
    };

    fetchUserData();
  }, [telegramUser]);

  const fetchUserReferralData = async (fetchedUserId) => {
    setIsLoading(true);
    
    try {
      if (fetchedUserId) {
        // In a real implementation, query your Google Sheet for referrals
        const response = await axios.get(
          `${SHEETS_API_URL}/${SHEET_ID}/values/Referrals!A2:C`,
          {
            params: {
              key: API_KEY
            }
          }
        );
        
        const rows = response.data.values || [];
        const userReferrals = rows.filter(row => row[0] === fetchedUserId);
        
        // Format the referrals data
        const formattedReferrals = userReferrals.map(row => {
          return {
            username: row[1] || 'Unknown User',
            points: parseInt(row[2]) || 0
          };
        });
        
        setReferrals(formattedReferrals);
        setRemainingInvites(Math.max(0, 3 - formattedReferrals.length));
      } else {
        // Sample data for users not logged in
        setReferrals([]);
        setRemainingInvites(3);
      }
    } catch (error) {
      console.error('Error fetching referral data:', error);
      setReferrals([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink)
      .then(() => {
        alert('Invite link copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  const handleShareLink = () => {
    // For Telegram Mini Apps, use the Telegram Web App API to share
    if (window.Telegram && window.Telegram.WebApp) {
      try {
        // Use openTelegramLink instead of switchInlineQuery
        const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent('Join our competition using my referral link!')}`;
        window.Telegram.WebApp.openLink(shareUrl);
      } catch (error) {
        console.error('Error sharing link:', error);
        alert('Failed to share link. Please try copying instead.');
      }
    } else {
      // Fallback for non-Telegram environments
      if (navigator.share) {
        navigator.share({
          title: 'Join our competition!',
          text: 'Join our competition using my referral link!',
          url: inviteLink,
        })
        .catch(err => {
          console.error('Share failed:', err);
          alert('Failed to share. Please copy the link instead.');
        });
      } else {
        alert('Sharing not available. Please copy the link instead.');
      }
    }
  };

  return (
    <PageContainer>
      <Title theme={theme}>Invite Friends</Title>
      
      <Card theme={theme}>
        <InfoText theme={theme}>
          Invite your friends to join the competition! When they start posting, you'll receive 10% of all the points they generate.
        </InfoText>
        
        {/* <RemainingInvites theme={theme}>
          You have {remainingInvites} invites remaining
        </RemainingInvites> */}
        
        <InviteBox theme={theme}>
          <InviteLink theme={theme}>{inviteLink}</InviteLink>
          <Button 
            theme={theme} 
            onClick={handleCopyLink}
            disabled={remainingInvites <= 0}
          >
            Copy Invite Link
          </Button>
          <Button 
            theme={theme} 
            onClick={handleShareLink}
            disabled={remainingInvites <= 0}
            style={{ marginTop: '10px' }}
          >
            Share to Telegram
          </Button>
        </InviteBox>
      </Card>
      
      <Card theme={theme}>
        <Title theme={theme} style={{ fontSize: '20px', marginBottom: '15px' }}>
          Your Referrals
        </Title>
        
        {isLoading ? (
          <LoadingContainer theme={theme}>Loading...</LoadingContainer>
        ) : (
          <ReferralsList>
            {referrals.length > 0 ? (
              referrals.map((referral, index) => (
                <ReferralItem key={index} theme={theme}>
                  <div>@{referral.username}</div>
                  <div>+{referral.points} points</div>
                </ReferralItem>
              ))
            ) : (
              <EmptyMessage theme={theme}>
                No referrals yet. Invite friends to earn points!
              </EmptyMessage>
            )}
          </ReferralsList>
        )}
      </Card>
    </PageContainer>
  );
}

export default InvitePage;