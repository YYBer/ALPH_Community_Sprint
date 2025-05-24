import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SimpleTweetEmbed from '../components/SimpleTweetEmbed';
import {
  PageContainer,
  Title,
  Subtitle,
  UserInfoCard,
  UserStats,
  StatItem,
  StatValue,
  StatLabel,
  PlatformStats,
  PlatformStatItem,
  PlatformIcon,
  PlatformCount,
  PlatformLabel,
  PostsFilter,
  FilterButton,
  PostsList,
  PostCard,
  PostHeader,
  PostPlatform,
  PostLink,
  ScoreBadge,
  PreviewContainer,
  YouTubeEmbed,
  LoadingSpinner,
  ErrorMessage,
  TwitterHandleDisplay,
  NoDataMessage
} from './UserPageStyles';

// API endpoint for Google Sheets
const SHEETS_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets';
const SHEET_ID = process.env.REACT_APP_SHEET_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

const YouTubePreview = ({ url, theme }) => {
  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeId(url);
  
  if (!videoId) {
    return (
      <YouTubeEmbed theme={theme}>
        📺 Invalid YouTube URL
      </YouTubeEmbed>
    );
  }

  return (
    <YouTubeEmbed theme={theme}>
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ borderRadius: '8px' }}
      />
    </YouTubeEmbed>
  );
};

function UserPage({ theme, telegramUser }) {
  const { userId } = useParams();
  const [userPosts, setUserPosts] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [postFilter, setPostFilter] = useState('all');

  const isCurrentUser = telegramUser && telegramUser.id.toString() === userId;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('Fetching user data for userId:', userId);
        
        const response = await axios.get(
          `${SHEETS_API_URL}/${SHEET_ID}/values/Details!A2:I`,
          {
            params: {
              key: API_KEY
            }
          }
        );

        const rows = response.data.values || [];
        console.log('Total rows fetched:', rows.length);
        
        const userRows = rows.filter(row => row[0] === userId);
        console.log('User rows found:', userRows.length);
        
        if (userRows.length > 0) {
          const telegramName = userRows[0][1];
          let twitterHandle = '';
          
          // Find Twitter handle from Twitter submissions
          const twitterRow = userRows.find(row => row[2] === 'twitter' && row[3]);
          if (twitterRow) {
            twitterHandle = twitterRow[3];
          }
          
          // Calculate statistics
          let totalScore = 0;
          let twitterSubmissions = 0;
          let youtubeSubmissions = 0;
          let approvedPosts = 0;
          let pendingPosts = 0;
          let rejectedPosts = 0;
          
          userRows.forEach(row => {
            const status = row[8] || 'Pending';
            const score = parseInt(row[7]) || 0;
            
            if (status === 'Approved') {
              totalScore += score;
              approvedPosts++;
            } else if (status === 'Rejected') {
              rejectedPosts++;
            } else {
              pendingPosts++;
            }
            
            if (row[2] === 'twitter') twitterSubmissions++;
            if (row[2] === 'youtube') youtubeSubmissions++;
          });
          
          setUserInfo({
            userId,
            telegramName,
            twitterHandle,
            totalScore,
            totalPosts: userRows.length,
            twitterSubmissions,
            youtubeSubmissions,
            approvedPosts,
            pendingPosts,
            rejectedPosts
          });
          
          // Format posts data
          const formattedPosts = userRows.map((row, index) => ({
            id: `${userId}-${index}`,
            userId: row[0],
            telegramName: row[1],
            submissionType: row[2],
            twitterHandle: row[3] || '',
            youtubeHandle: row[4] || '',
            postUrl: row[5],
            timestamp: row[6],
            score: parseInt(row[7]) || 0,
            status: row[8] || 'Pending'
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

  const getFilteredPosts = () => {
    switch (postFilter) {
      case 'twitter':
        return userPosts.filter(post => post.submissionType === 'twitter');
      case 'youtube':
        return userPosts.filter(post => post.submissionType === 'youtube');
      case 'approved':
        return userPosts.filter(post => post.status === 'Approved');
      case 'pending':
        return userPosts.filter(post => post.status === 'Pending');
      default:
        return userPosts;
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'twitter':
        return '🐦';
      case 'youtube':
        return '📺';
      default:
        return '📝';
    }
  };

  const getPlatformName = (platform) => {
    switch (platform) {
      case 'twitter':
        return 'Twitter';
      case 'youtube':
        return 'YouTube';
      default:
        return 'Post';
    }
  };

  const togglePreview = (postId) => {
    // 移除预览切换功能 - 直接显示所有预览
  };

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

  const filteredPosts = getFilteredPosts();

  return (
    <PageContainer>
      <Title theme={theme}>
        {isCurrentUser ? 'My Profile' : `${userInfo.telegramName}'s Profile`}
      </Title>
      
      <UserInfoCard theme={theme}>
        <Subtitle theme={theme}>@{userInfo.telegramName}</Subtitle>
        {userInfo.twitterHandle && (
          <TwitterHandleDisplay>
            🐦 @{userInfo.twitterHandle}
          </TwitterHandleDisplay>
        )}
        
        <UserStats>
          <StatItem theme={theme}>
            <StatValue theme={theme}>{userInfo.totalScore}</StatValue>
            <StatLabel theme={theme}>Total Points</StatLabel>
          </StatItem>
          <StatItem theme={theme}>
            <StatValue theme={theme}>{userInfo.totalPosts}</StatValue>
            <StatLabel theme={theme}>Total Submissions</StatLabel>
          </StatItem>
        </UserStats>
        
        <PlatformStats theme={theme}>
          <PlatformStatItem>
            <PlatformIcon>🐦</PlatformIcon>
            <PlatformCount theme={theme}>{userInfo.twitterSubmissions}</PlatformCount>
            <PlatformLabel theme={theme}>Twitter</PlatformLabel>
          </PlatformStatItem>
          <PlatformStatItem>
            <PlatformIcon>📺</PlatformIcon>
            <PlatformCount theme={theme}>{userInfo.youtubeSubmissions}</PlatformCount>
            <PlatformLabel theme={theme}>YouTube</PlatformLabel>
          </PlatformStatItem>
          <PlatformStatItem>
            <PlatformIcon>✅</PlatformIcon>
            <PlatformCount theme={theme}>{userInfo.approvedPosts}</PlatformCount>
            <PlatformLabel theme={theme}>Approved</PlatformLabel>
          </PlatformStatItem>
          <PlatformStatItem>
            <PlatformIcon>⏳</PlatformIcon>
            <PlatformCount theme={theme}>{userInfo.pendingPosts}</PlatformCount>
            <PlatformLabel theme={theme}>Pending</PlatformLabel>
          </PlatformStatItem>
        </PlatformStats>
      </UserInfoCard>
      
      <Title theme={theme} style={{ fontSize: '20px', marginBottom: '15px' }}>
        {isCurrentUser ? 'My Submissions' : 'Submissions'}
      </Title>
      
      <PostsFilter theme={theme}>
        <FilterButton 
          active={postFilter === 'all'}
          theme={theme}
          onClick={() => setPostFilter('all')}
        >
          All ({userInfo.totalPosts})
        </FilterButton>
        <FilterButton 
          active={postFilter === 'twitter'}
          theme={theme}
          onClick={() => setPostFilter('twitter')}
        >
          🐦 Twitter ({userInfo.twitterSubmissions})
        </FilterButton>
        <FilterButton 
          active={postFilter === 'youtube'}
          theme={theme}
          onClick={() => setPostFilter('youtube')}
        >
          📺 YouTube ({userInfo.youtubeSubmissions})
        </FilterButton>
        <FilterButton 
          active={postFilter === 'approved'}
          theme={theme}
          onClick={() => setPostFilter('approved')}
        >
          ✅ Approved ({userInfo.approvedPosts})
        </FilterButton>
        <FilterButton 
          active={postFilter === 'pending'}
          theme={theme}
          onClick={() => setPostFilter('pending')}
        >
          ⏳ Pending ({userInfo.pendingPosts})
        </FilterButton>
      </PostsFilter>
      
      <PostsList>
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard key={post.id} theme={theme} platform={post.submissionType}>
              <PostHeader theme={theme}>
                <PostPlatform platform={post.submissionType}>
                  {getPlatformIcon(post.submissionType)}
                  {getPlatformName(post.submissionType)}
                </PostPlatform>
                <div>{new Date(post.timestamp).toLocaleString()}</div>
                <ScoreBadge theme={theme} status={post.status}>
                  {post.status === 'Approved' ? `+${post.score} points` : 
                   post.status === 'Rejected' ? 'Rejected' : 
                   'Pending Review'}
                </ScoreBadge>
              </PostHeader>
              
              <PostLink 
                href={post.postUrl} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                {post.postUrl}
              </PostLink>
              
              <PreviewContainer theme={theme}>
                {post.submissionType === 'twitter' ? (
                  <SimpleTweetEmbed 
                    tweetUrl={post.postUrl} 
                    theme={theme}
                  />
                ) : post.submissionType === 'youtube' ? (
                  <YouTubePreview 
                    url={post.postUrl}
                    theme={theme}
                  />
                ) : (
                  <NoDataMessage theme={theme}>
                    Preview not available for this content type
                  </NoDataMessage>
                )}
              </PreviewContainer>
            </PostCard>
          ))
        ) : (
          <NoDataMessage theme={theme}>
            {postFilter === 'all' ? 'No submissions yet.' : 
             postFilter === 'approved' ? 'No approved submissions yet.' :
             postFilter === 'pending' ? 'No pending submissions.' :
             `No ${getPlatformName(postFilter)} submissions yet.`}
          </NoDataMessage>
        )}
      </PostsList>
    </PageContainer>
  );
}

export default UserPage;