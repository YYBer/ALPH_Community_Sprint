import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import styled from 'styled-components';

// Import our page components
import LeaderboardPage from './pages/LeaderboardPage';
import UserPage from './pages/UserPage';

// Initialize Telegram WebApp
const initTelegramWebApp = () => {
  if (window.Telegram && window.Telegram.WebApp) {
    const webApp = window.Telegram.WebApp;
    webApp.ready();
    webApp.expand();
    return webApp;
  }
  return null;
};

// Styled components
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  color: ${props => props.tgTheme === 'dark' ? '#fff' : '#000'};
  background-color: ${props => props.tgTheme === 'dark' ? '#1c1c1c' : '#f5f5f5'};
`;

const NavBar = styled.nav`
  display: flex;
  justify-content: space-around;
  padding: 15px 0;
  background-color: ${props => props.tgTheme === 'dark' ? '#2c2c2c' : '#ffffff'};
  position: fixed;
  bottom: 0;
  width: 100%;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
`;

const NavLink = styled(Link)`
  color: ${props => props.active ? '#0088cc' : (props.tgTheme === 'dark' ? '#aaa' : '#666')};
  text-decoration: none;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  padding: 10px 15px;
  border-radius: 5px;
  transition: background-color 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 12px;

  &:hover {
    background-color: ${props => props.tgTheme === 'dark' ? '#3c3c3c' : '#eaeaea'};
  }
`;

const NavIcon = styled.span`
  font-size: 18px;
`;

const ContentArea = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  padding-bottom: 80px; // Space for fixed navbar
`;

const Header = styled.header`
  background-color: ${props => props.tgTheme === 'dark' ? '#2c2c2c' : '#ffffff'};
  padding: 15px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 0;
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 20px;
  text-align: center;
  color: ${props => props.tgTheme === 'dark' ? '#ffffff' : '#000000'};
`;

const HeaderSubtitle = styled.p`
  margin: 5px 0 0 0;
  font-size: 14px;
  text-align: center;
  color: ${props => props.tgTheme === 'dark' ? '#aaa' : '#666'};
`;

function App() {
  const [telegramWebApp, setTelegramWebApp] = useState(null);
  const [theme, setTheme] = useState('light');
  const [activePage, setActivePage] = useState('leaderboard');
  
  useEffect(() => {
    // Initialize Telegram WebApp
    const webApp = initTelegramWebApp();
    setTelegramWebApp(webApp);

    if (webApp) {
      // Set theme based on Telegram color scheme
      setTheme(webApp.colorScheme || 'light');
    }

    // Detect current page from URL
    const path = window.location.pathname;
    if (path.includes('/user/')) {
      setActivePage('profile');
    } else {
      setActivePage('leaderboard');
    }
  }, []);

  // Get user info from Telegram
  const telegramUser = telegramWebApp ? telegramWebApp.initDataUnsafe.user : null;

  return (
    <Router>
      <AppContainer tgTheme={theme}>
        <Header tgTheme={theme}>
          <HeaderTitle tgTheme={theme}>ALPH Community Sprint</HeaderTitle>
          <HeaderSubtitle tgTheme={theme}>Share your content and compete!</HeaderSubtitle>
        </Header>

        <ContentArea>
          <Routes>
            <Route path="/" element={<LeaderboardPage theme={theme} telegramUser={telegramUser} />} />
            <Route path="/user/:userId" element={<UserPage theme={theme} telegramUser={telegramUser} />} />
          </Routes>
        </ContentArea>

        <NavBar tgTheme={theme}>
          <NavLink 
            to="/" 
            active={activePage === 'leaderboard' ? 1 : 0}
            tgTheme={theme}
            onClick={() => setActivePage('leaderboard')}
          >
            <NavIcon>🏆</NavIcon>
            Leaderboard
          </NavLink>
          
          {telegramUser && (
            <NavLink 
              to={`/user/${telegramUser.id}`} 
              active={activePage === 'profile' ? 1 : 0}
              tgTheme={theme}
              onClick={() => setActivePage('profile')}
            >
              <NavIcon>👤</NavIcon>
              My Profile
            </NavLink>
          )}
        </NavBar>
      </AppContainer>
    </Router>
  );
}

export default App;