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

  useEffect(() => {
    // Generate invite link based on user
    if (telegramUser) {
      // In a real app, this would come from your backend
      // For MVP, we'll create one locally
      const link = `https://t.me/Alph_Rankify_Bot?start=ref_${telegramUser.id || '123456'}`;
      setInviteLink(link);

      // Fetch remaining invites and referrals
      fetchUserReferralData(telegramUser.id);
    } else {
      // Default link for demo purposes
      setInviteLink('https://t.me/Alph_Rankify_Bot?start=ref_123456');
      fetchUserReferralData();
    }
  }, [telegramUser]);

  const fetchUserReferralData = async (userId) => {
    setIsLoading(true);
    
    try {
      // For a real app, we would fetch from the Referral sheet
      // For now, we'll use sample data but structure it as if from the API
      if (userId) {
        // In a real implementation, you would query your Google Sheet for referrals
        const response = await axios.get(
          `${SHEETS_API_URL}/${SHEET_ID}/values/Referrals!A2:C`,
          {
            params: {
              key: API_KEY
            }
          }
        );
        
        const rows = response.data.values || [];
        const userReferrals = rows.filter(row => row[0] === userId);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data - in a real app this would come from the API response
        const mockReferrals = [
          { username: 'user1', points: 25 },
          { username: 'user2', points: 10 }
        ];
        
        setReferrals(mockReferrals);
        setRemainingInvites(3 - mockReferrals.length);
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
      window.Telegram.WebApp.switchInlineQuery(
        `Join our competition using my referral link: ${inviteLink}`,
        ['users']
      );
    } else {
      alert('Telegram WebApp is not available in this context. In a real app, this would share to Telegram.');
    }
  };

  return (
    <PageContainer>
      <Title theme={theme}>Invite Friends</Title>
      
      <Card theme={theme}>
        <InfoText theme={theme}>
          Invite your friends to join the competition! When they start posting, you'll receive 10% of all the points they generate.
        </InfoText>
        
        <RemainingInvites theme={theme}>
          You have {remainingInvites} invites remaining
        </RemainingInvites>
        
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