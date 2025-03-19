import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 20px;
`;

export const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
  color: ${props => props.theme.isDark ? '#ffffff' : '#000000'};
  text-align: center;
`;

export const LeaderboardTable = styled.div`
  background-color: ${props => props.theme.isDark ? '#2c2c2c' : '#ffffff'};
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 2fr 1fr;
  padding: 15px;
  background-color: ${props => props.theme.isDark ? '#3c3c3c' : '#f0f0f0'};
  font-weight: bold;
  border-bottom: 1px solid ${props => props.theme.isDark ? '#444' : '#ddd'};
`;

export const TableRow = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 2fr 1fr;
  padding: 15px;
  border-bottom: 1px solid ${props => props.theme.isDark ? '#444' : '#ddd'};
  transition: background-color 0.2s;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.isDark ? '#3c3c3c' : '#f5f5f5'};
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const Rank = styled.div`
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TwitterHandle = styled.div`
  font-weight: bold;
  color: ${props => props.theme.isDark ? '#1da1f2' : '#1da1f2'};
`;

export const Score = styled.div`
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: ${props => props.theme.isDark ? '#aaa' : '#666'};
`;

export const ErrorMessage = styled.div`
  color: #e74c3c;
  text-align: center;
  padding: 20px;
`;