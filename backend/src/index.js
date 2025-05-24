require('dotenv').config();
const { Telegraf } = require('telegraf');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const moment = require('moment');

// Initialize bot
const bot = new Telegraf(process.env.BOT_TOKEN);

// Connect to Google Sheets
const connectToSheets = async () => {
  const doc = new GoogleSpreadsheet(process.env.SHEET_ID);
  
  // Authenticate
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  });
  
  await doc.loadInfo(); // Load document properties
  return doc;
};

// Extract Twitter URL from message
const extractTwitterUrl = (text) => {
  const urlRegex = /(https?:\/\/twitter\.com\/[^\s]+)|(https?:\/\/x\.com\/[^\s]+)/i;
  const match = text.match(urlRegex);
  return match ? match[0] : null;
};

// Extract YouTube URL from message
const extractYouTubeUrl = (text) => {
  const urlRegex = /(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)[^\s&]+/i;
  const match = text.match(urlRegex);
  return match ? match[0] : null;
};

// Determine URL type and extract relevant info
const analyzeUrl = (text) => {
  const twitterUrl = extractTwitterUrl(text);
  const youtubeUrl = extractYouTubeUrl(text);
  
  if (twitterUrl) {
    return {
      type: 'twitter',
      url: twitterUrl,
      handle: text.includes('@') 
        ? text.match(/@([a-zA-Z0-9_]+)/)[1] 
        : twitterUrl.split('/')[3]
    };
  } else if (youtubeUrl) {
    return {
      type: 'youtube',
      url: youtubeUrl,
      handle: null
    };
  }
  
  return null;
};

// Add submission to Google Sheets
const addSubmission = async (userId, userName, submissionType, handle, postUrl) => {
  try {
    const doc = await connectToSheets();
    const detailsSheet = doc.sheetsByTitle['Details'];
    
    // Prepare row data based on submission type
    const rowData = {
      UserID: userId,
      TelegramName: userName,
      SubmissionType: submissionType, // 'twitter' or 'youtube'
      TwitterHandle: submissionType === 'twitter' ? handle : '',
      YouTubeHandle: submissionType === 'youtube' ? handle || '' : '',
      PostURL: postUrl,
      Timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
      Score: 0, // Initial score, will be updated by admin
      ReviewStatus: 'Pending'
    };
    
    // Add new row
    await detailsSheet.addRow(rowData);
    
    return true;
  } catch (error) {
    console.error('Error adding submission:', error);
    return false;
  }
};

// Get user statistics
const getUserStats = async (userId) => {
  try {
    const doc = await connectToSheets();
    const detailsSheet = doc.sheetsByTitle['Details'];
    
    // Load all rows
    const rows = await detailsSheet.getRows();
    
    // Filter rows for this user
    const userSubmissions = rows.filter(row => row.UserID === userId.toString());
    const totalScore = userSubmissions.reduce((sum, row) => sum + (parseInt(row.Score) || 0), 0);
    
    // Count by type
    const twitterCount = userSubmissions.filter(row => row.SubmissionType === 'twitter').length;
    const youtubeCount = userSubmissions.filter(row => row.SubmissionType === 'youtube').length;
    
    return {
      totalSubmissions: userSubmissions.length,
      totalScore,
      twitterSubmissions: twitterCount,
      youtubeSubmissions: youtubeCount,
      lastSubmission: userSubmissions.length > 0 ? userSubmissions[userSubmissions.length - 1].Timestamp : 'None'
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return null;
  }
};

// Bot commands
bot.start((ctx) => {
  ctx.reply(
    'Welcome to the Competition Recorder! 🎉\n\n' +
    'Share your Twitter or YouTube posts with me to participate.\n\n' +
    'Supported platforms:\n' +
    '• Twitter/X posts\n' +
    '• YouTube videos\n\n' +
    'Just send me the URL directly or use /submit command!'
  );
});

bot.help((ctx) => {
  ctx.reply(
    'Competition Bot Commands:\n\n' +
    '/submit [url] - Submit a Twitter or YouTube post\n' +
    '/mystats - View your statistics\n' +
    '/help - Show this help message\n\n' +
    'You can also send URLs directly without using commands!'
  );
});

// Handle submission command
bot.command('submit', async (ctx) => {
  const text = ctx.message.text.replace('/submit', '').trim();
  const urlInfo = analyzeUrl(text);
  
  if (!urlInfo) {
    return ctx.reply(
      'Please provide a valid URL:\n' +
      '• Twitter/X: https://twitter.com/username/status/...\n' +
      '• YouTube: https://youtube.com/watch?v=...'
    );
  }
  
  const userId = ctx.from.id;
  const userName = ctx.from.username || `${ctx.from.first_name} ${ctx.from.last_name || ''}`.trim();
  
  const success = await addSubmission(userId, userName, urlInfo.type, urlInfo.handle, urlInfo.url);
  
  if (success) {
    const platform = urlInfo.type === 'twitter' ? 'Twitter' : 'YouTube';
    ctx.reply(`✅ Your ${platform} submission has been recorded! Our team will review it soon.`);
  } else {
    ctx.reply('❌ Sorry, there was an issue recording your submission. Please try again later.');
  }
});

// Handle my stats command
bot.command('mystats', async (ctx) => {
  const userId = ctx.from.id;
  const stats = await getUserStats(userId);
  
  if (!stats) {
    return ctx.reply('❌ Sorry, there was an issue fetching your stats. Please try again later.');
  }
  
  ctx.reply(
    `📊 Your Stats:\n\n` +
    `🎯 Total Score: ${stats.totalScore}\n` +
    `📝 Total Submissions: ${stats.totalSubmissions}\n` +
    `🐦 Twitter Posts: ${stats.twitterSubmissions}\n` +
    `📺 YouTube Videos: ${stats.youtubeSubmissions}\n` +
    `⏰ Last Submission: ${stats.lastSubmission}`
  );
});

// Handle direct message with URLs
bot.on('text', async (ctx) => {
  const text = ctx.message.text;
  
  // Skip if it's a command
  if (text.startsWith('/')) {
    return;
  }
  
  const urlInfo = analyzeUrl(text);
  
  if (urlInfo) {
    const userId = ctx.from.id;
    const userName = ctx.from.username || `${ctx.from.first_name} ${ctx.from.last_name || ''}`.trim();
    
    const success = await addSubmission(userId, userName, urlInfo.type, urlInfo.handle, urlInfo.url);
    
    if (success) {
      const platform = urlInfo.type === 'twitter' ? 'Twitter' : 'YouTube';
      const emoji = urlInfo.type === 'twitter' ? '🐦' : '📺';
      ctx.reply(`${emoji} Your ${platform} submission has been recorded! Our team will review it soon.`);
    } else {
      ctx.reply('❌ Sorry, there was an issue recording your submission. Please try again later.');
    }
  }
});

// Launch bot
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

console.log('Bot is running with Twitter and YouTube support...');