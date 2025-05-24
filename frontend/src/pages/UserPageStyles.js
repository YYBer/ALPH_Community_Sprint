import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 20px;
`;

export const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 10px;
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
  text-align: center;
`;

export const Subtitle = styled.h2`
  font-size: 18px;
  margin-bottom: 20px;
  color: ${props => props.theme === 'dark' ? '#aaaaaa' : '#666666'};
  text-align: center;
`;

export const UserInfoCard = styled.div`
  background-color: ${props => props.theme === 'dark' ? '#2c2c2c' : '#ffffff'};
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const UserStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  width: 100%;
  margin: 15px 0;
`;

export const StatItem = styled.div`
  text-align: center;
  background-color: ${props => props.theme === 'dark' ? '#3c3c3c' : '#f8f9fa'};
  padding: 15px;
  border-radius: 8px;
`;

export const StatValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
`;

export const StatLabel = styled.div`
  font-size: 14px;
  color: ${props => props.theme === 'dark' ? '#aaaaaa' : '#666666'};
  margin-top: 5px;
`;

export const PlatformStats = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid ${props => props.theme === 'dark' ? '#444' : '#eee'};
`;

export const PlatformStatItem = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const PlatformIcon = styled.div`
  font-size: 20px;
  margin-bottom: 5px;
`;

export const PlatformCount = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
`;

export const PlatformLabel = styled.div`
  font-size: 12px;
  color: ${props => props.theme === 'dark' ? '#aaa' : '#666'};
`;

export const PostsFilter = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  background-color: ${props => props.theme === 'dark' ? '#2c2c2c' : '#ffffff'};
  border-radius: 10px;
  padding: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const FilterButton = styled.button`
  background-color: ${props => props.active ? '#0088cc' : 'transparent'};
  color: ${props => props.active ? '#ffffff' : (props.theme === 'dark' ? '#aaa' : '#666')};
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  font-size: 14px;

  &:hover {
    background-color: ${props => props.active ? '#0088cc' : (props.theme === 'dark' ? '#3c3c3c' : '#f0f0f0')};
  }
`;

export const PostsList = styled.div`
  margin-top: 20px;
`;

export const PostCard = styled.div`
  background-color: ${props => props.theme === 'dark' ? '#2c2c2c' : '#ffffff'};
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => 
    props.platform === 'twitter' ? '#1da1f2' : 
    props.platform === 'youtube' ? '#ff0000' : '#ccc'};
`;

export const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-size: 14px;
  color: ${props => props.theme === 'dark' ? '#aaaaaa' : '#666666'};
`;

export const PostPlatform = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: bold;
  color: ${props => 
    props.platform === 'twitter' ? '#1da1f2' : 
    props.platform === 'youtube' ? '#ff0000' : '#666'};
`;

export const PostLink = styled.a`
  display: block;
  margin: 10px 0;
  color: #0088cc;
  text-decoration: none;
  word-break: break-all;
  font-size: 14px;
  
  &:hover {
    text-decoration: underline;
  }
`;

export const ScoreBadge = styled.div`
  background-color: ${props => props.theme === 'dark' ? '#3c3c3c' : '#f0f0f0'};
  padding: 5px 10px;
  border-radius: 15px;
  font-weight: bold;
  color: ${props => props.status === 'Approved' ? '#27ae60' : 
    props.status === 'Rejected' ? '#e74c3c' : 
    props.status === 'Pending' ? '#f39c12' : '#666'};
`;

export const PreviewContainer = styled.div`
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid ${props => props.theme === 'dark' ? '#444' : '#eee'};
`;

export const YouTubeEmbed = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  background-color: ${props => props.theme === 'dark' ? '#1c1c1c' : '#f8f8f8'};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme === 'dark' ? '#aaa' : '#666'};
  border: 1px solid ${props => props.theme === 'dark' ? '#444' : '#ddd'};
`;

export const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: ${props => props.theme === 'dark' ? '#aaa' : '#666'};
`;

export const ErrorMessage = styled.div`
  color: #e74c3c;
  text-align: center;
  padding: 20px;
`;

export const TwitterHandleDisplay = styled.div`
  color: #1da1f2;
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: 500;
`;

export const NoDataMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: ${props => props.theme === 'dark' ? '#aaa' : '#666'};
  font-style: italic;
`;