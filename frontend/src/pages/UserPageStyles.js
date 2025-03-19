import styled from 'styled-components';

// Styled components for UserPage
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
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin: 15px 0;
`;

export const StatItem = styled.div`
  text-align: center;
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

export const PostsList = styled.div`
  margin-top: 20px;
`;

export const PostCard = styled.div`
  background-color: ${props => props.theme === 'dark' ? '#2c2c2c' : '#ffffff'};
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
  color: ${props => props.theme === 'dark' ? '#aaaaaa' : '#666666'};
`;

export const PostLink = styled.a`
  display: block;
  margin-top: 10px;
  color: #0088cc;
  text-decoration: none;
  word-break: break-all;
  
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