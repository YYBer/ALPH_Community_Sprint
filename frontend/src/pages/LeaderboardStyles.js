import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 20px;
`;

export const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
  text-align: center;
`;

export const LeaderboardTable = styled.div`
  background-color: ${props => props.theme === 'dark' ? '#2c2c2c' : '#ffffff'};
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 2fr 1fr;
  padding: 15px;
  background-color: ${props => props.theme === 'dark' ? '#3c3c3c' : '#f0f0f0'};
  font-weight: bold;
  border-bottom: 1px solid ${props => props.theme === 'dark' ? '#444' : '#ddd'};
`;

export const TableRow = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 2fr 1fr;
  padding: 15px;
  border-bottom: 1px solid ${props => props.theme === 'dark' ? '#444' : '#ddd'};
  transition: background-color 0.2s;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme === 'dark' ? '#3c3c3c' : '#f5f5f5'};
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const ExpandedRow = styled.div`
  grid-column: 1 / -1;
  padding: 20px;
  background-color: ${props => props.theme === 'dark' ? '#1c1c1c' : '#fafafa'};
  border-top: 1px solid ${props => props.theme === 'dark' ? '#444' : '#eee'};
`;

export const Rank = styled.div`
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const UserName = styled.div`
  font-weight: bold;
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
  margin-bottom: 5px;
`;

export const UserHandles = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

export const Handle = styled.div`
  font-size: 12px;
  color: ${props => props.platform === 'twitter' ? '#1da1f2' : 
    props.platform === 'youtube' ? '#ff0000' : '#666'};
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const PlatformIcon = styled.span`
  font-size: 14px;
`;

export const SubmissionCounts = styled.div`
  font-size: 11px;
  color: ${props => props.theme === 'dark' ? '#aaa' : '#666'};
  margin-top: 5px;
`;

export const Score = styled.div`
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
`;

export const ScoreValue = styled.div`
  font-size: 20px;
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
`;

export const ScoreLabel = styled.div`
  font-size: 12px;
  color: ${props => props.theme === 'dark' ? '#aaa' : '#666'};
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

export const FilterTabs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  background-color: ${props => props.theme === 'dark' ? '#2c2c2c' : '#ffffff'};
  border-radius: 10px;
  padding: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const FilterTab = styled.button`
  background-color: ${props => props.active ? '#0088cc' : 'transparent'};
  color: ${props => props.active ? '#ffffff' : (props.theme === 'dark' ? '#aaa' : '#666')};
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: ${props => props.active ? 'bold' : 'normal'};

  &:hover {
    background-color: ${props => props.active ? '#0088cc' : (props.theme === 'dark' ? '#3c3c3c' : '#f0f0f0')};
  }
`;