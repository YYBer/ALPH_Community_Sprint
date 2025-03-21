import styled from 'styled-components';

// Styled components
export const PageContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

export const Subtitle = styled.h2`
  font-size: 20px;
  margin-bottom: 20px;
  color: ${props => props.theme === 'dark' ? '#aaaaaa' : '#666666'};
  text-align: center;
  font-weight: bold;
`;

export const UserInfoCard = styled.div`
  background-color: ${props => props.theme === 'dark' ? '#2c2c2c' : '#ffffff'};
  border-radius: 16px;
  padding: 25px;
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

export const SectionTitle = styled.h2`
  font-size: 22px;
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#333333'};
  margin: 25px 0 15px 0;
  font-weight: bold;
`;

export const PostsList = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const PostContainer = styled.div`
  margin-bottom: 20px;
`;

export const ScoreBadge = styled.div`
  display: inline-flex;
  background-color: ${props => props.theme === 'dark' ? '#3c3c3c' : '#f0f0f0'};
  padding: 5px 10px;
  border-radius: 15px;
  font-weight: bold;
  color: ${props => 
    props.status === 'Approved' ? '#8364E8' : 
    props.status === 'Rejected' ? '#e74c3c' : 
    props.status === 'Pending' ? '#f39c12' : '#666'
  };
  align-items: center;
  font-size: 14px;
  margin-top: 10px;
`;

export const StarIcon = styled.span`
  color: #8364E8;
  margin-right: 4px;
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