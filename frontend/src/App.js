import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import styled from 'styled-components';

// Import our page components
import LeaderboardPage from './pages/LeaderboardPage';
import InvitePage from './pages/InvitePage';
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
  color: ${props => props.themeMode === 'dark' ? '#fff' : '#000'};
  background-color: ${props => props.themeMode === 'dark' ? '#1c1c1c' : '#f5f5f5'};
`;

const NavBar = styled.nav`
  display: flex;
  justify-content: space-around;
  padding: 15px 0;
  background-color: ${props => props.themeMode === 'dark' ? '#2c2c2c' : '#ffffff'};
  position: fixed;
  bottom: 0;
  width: 100%;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
`;

const NavLink = styled(Link)`
  color: ${props => props.active ? '#0088cc' : (props.themeMode === 'dark' ? '#aaa' : '#666')};
  text-decoration: none;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  padding: 10px 15px;
  border-radius: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${props => props.themeMode === 'dark' ? '#3c3c3c' : '#eaeaea'};
  }
`;

const ContentArea = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  padding-bottom: 80px; // Space for fixed navbar
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
  }, []);

  // Get user info from Telegram
  const telegramUser = telegramWebApp ? telegramWebApp.initDataUnsafe.user : null;

  return (
    <Router>
      <AppContainer themeMode={theme} data-theme={theme}>
        <ContentArea>
          <Routes>
            <Route path="/" element={<LeaderboardPage theme={theme} telegramUser={telegramUser} />} />
            <Route path="/invite" element={<InvitePage theme={theme} telegramUser={telegramUser} />} />
            <Route path="/user/:userId" element={<UserPage theme={theme} telegramUser={telegramUser} />} />
          </Routes>
        </ContentArea>

        <NavBar themeMode={theme} data-theme={theme}>
          <NavLink 
            to="/" 
            active={activePage === 'leaderboard' ? 1 : 0}
            themeMode={theme}
            onClick={() => setActivePage('leaderboard')}
          >
            Leaderboard
          </NavLink>
          <NavLink 
            to="/invite" 
            active={activePage === 'invite' ? 1 : 0}
            themeMode={theme}
            onClick={() => setActivePage('invite')}
          >
            Invite
          </NavLink>
          {telegramUser && (
            <NavLink 
              to={`/user/${telegramUser.id}`} 
              active={activePage === 'profile' ? 1 : 0}
              themeMode={theme}
              onClick={() => setActivePage('profile')}
            >
              My Posts
            </NavLink>
          )}
        </NavBar>
      </AppContainer>
    </Router>
  );
}

export default App;