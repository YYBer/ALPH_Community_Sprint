import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

export const BannerSection = styled.div`
  background: linear-gradient(135deg, #9370DB, #8A2BE2);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

export const MainTitle = styled.h1`
  font-size: 32px;
  color: white;
  margin: 10px 0;
  text-align: center;
  font-weight: bold;
`;

export const SubTitle = styled.p`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  text-align: center;
  max-width: 600px;
`;

export const SectionTitle = styled.h2`
  font-size: 28px;
  color: #333;
  margin-bottom: 20px;
  font-weight: bold;
`;

export const LeaderboardList = styled.div`
  background-color: ${props => props.theme === 'dark' ? '#2c2c2c' : '#ffffff'};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
`;

export const LeaderItem = styled.div`
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

export const RankCircle = styled.div`
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

export const CreatorInfo = styled.div`
  flex: 1;
`;

export const CreatorName = styled.div`
  font-weight: bold;
  font-size: 18px;
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#333'};
  margin-bottom: 4px;
`;

export const ScoreContainer = styled.div`
  display: flex;
  align-items: center;
  color: #888;
  font-size: 16px;
`;

export const StarIcon = styled.span`
  color: #FFD700;
  margin-right: 4px;
`;

export const ChevronIcon = styled.span`
  margin-left: 16px;
  color: #ccc;
  font-size: 20px;
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

// Commented out styles kept for future reference
/*
export const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  background-color: #4169E1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
`;

export const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const ViewCount = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 2px 8px;
  border-radius: 8px 0 0 0;
  font-size: 12px;
  display: flex;
  align-items: center;
`;

export const EyeIcon = styled.span`
  margin-right: 4px;
`;

export const CreatorAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #ddd;
  margin-right: 16px;
  overflow: hidden;
  flex-shrink: 0;
`;

export const CreatorImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
*/