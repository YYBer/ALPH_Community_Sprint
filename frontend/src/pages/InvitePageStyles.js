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

export const Card = styled.div`
  background-color: ${props => props.theme === 'dark' ? '#2c2c2c' : '#ffffff'};
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export const InfoText = styled.p`
  margin-bottom: 20px;
  line-height: 1.5;
  color: ${props => props.theme === 'dark' ? '#cccccc' : '#333333'};
`;

export const InviteBox = styled.div`
  border: 1px dashed ${props => props.theme === 'dark' ? '#444' : '#ccc'};
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const InviteLink = styled.div`
  background-color: ${props => props.theme === 'dark' ? '#3c3c3c' : '#f5f5f5'};
  border-radius: 5px;
  padding: 12px;
  margin: 10px 0;
  width: 100%;
  text-align: center;
  font-family: monospace;
  word-break: break-all;
`;

export const RemainingInvites = styled.div`
  text-align: center;
  margin-bottom: 20px;
  font-weight: bold;
  color: ${props => props.theme === 'dark' ? '#aaa' : '#666'};
`;

export const Button = styled.button`
  background-color: #0088cc;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 12px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
  margin-top: 10px;

  &:hover {
    background-color: #006699;
  }

  &:disabled {
    background-color: ${props => props.theme === 'dark' ? '#444' : '#ccc'};
    cursor: not-allowed;
  }
`;

export const ReferralsList = styled.div`
  margin-top: 20px;
`;

export const ReferralItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid ${props => props.theme === 'dark' ? '#444' : '#eee'};
  
  &:last-child {
    border-bottom: none;
  }
`;

export const LoadingContainer = styled.div`
  text-align: center;
  padding: 20px;
  color: ${props => props.theme === 'dark' ? '#aaa' : '#666'};
`;

export const EmptyMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: ${props => props.theme === 'dark' ? '#aaa' : '#666'};
`;