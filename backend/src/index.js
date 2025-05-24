require('dotenv').config();
const { Telegraf } = require('telegraf');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const moment = require('moment');

// Initialize bot
const bot = new Telegraf(process.env.BOT_TOKEN);

const connectToSheets = async () => {
  try {
    const serviceAccountAuth = new JWT({
        email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY,
        scopes: [
            'https://www.googleapis.com/auth/spreadsheets',
        ],
    });
    
    const doc = new GoogleSpreadsheet(process.env.SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    console.log(`Connected to sheet: ${doc.title}`);
    return doc;
  } catch (error) {
    console.error('Error connecting to Google Sheets:', error);
    throw error;
  }
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
        ? text.match(/@([a-zA-Z0-9_]+)/)?.[1] || twitterUrl.split('/')[3]
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
    
    // Get or create Details sheet
    let detailsSheet;
    try {
      detailsSheet = doc.sheetsByTitle['Details'];
    } catch (error) {
      console.log('Details sheet not found, available sheets:', Object.keys(doc.sheetsByTitle));
      
      // Try to get the first sheet if Details doesn't exist
      const sheets = doc.sheetsByIndex;
      if (sheets.length > 0) {
        detailsSheet = sheets[0];
        console.log(`Using sheet: ${detailsSheet.title}`);
      } else {
        throw new Error('No sheets found');
      }
    }
    
    // Prepare row data
    const rowData = {
      UserID: userId.toString(),
      TelegramName: userName,
      SubmissionType: submissionType,
      TwitterHandle: submissionType === 'twitter' ? (handle || '') : '',
      YouTubeHandle: submissionType === 'youtube' ? (handle || '') : '',
      PostURL: postUrl,
      Timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
      Score: 0,
      ReviewStatus: 'Pending'
    };
    
    console.log('Adding submission:', rowData);
    
    // Add new row
    const newRow = await detailsSheet.addRow(rowData);
    console.log('Successfully added submission to Google Sheets');
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
    
    let detailsSheet;
    try {
      detailsSheet = doc.sheetsByTitle['Details'];
    } catch (error) {
      // Use first sheet if Details doesn't exist
      detailsSheet = doc.sheetsByIndex[0];
    }
    
    if (!detailsSheet) {
      console.error('No sheet found for stats');
      return null;
    }
    
    // Load all rows
    const rows = await detailsSheet.getRows();
    
    // Filter rows for this user
    const userSubmissions = rows.filter(row => {
      return row.get('UserID') === userId.toString();
    });
    
    if (userSubmissions.length === 0) {
      return {
        totalSubmissions: 0,
        totalScore: 0,
        twitterSubmissions: 0,
        youtubeSubmissions: 0,
        lastSubmission: 'None'
      };
    }
    
    let totalScore = 0;
    let twitterCount = 0;
    let youtubeCount = 0;
    
    userSubmissions.forEach(row => {
      // Only count approved scores
      if (row.get('ReviewStatus') === 'Approved') {
        totalScore += parseInt(row.get('Score')) || 0;
      }
      
      const submissionType = row.get('SubmissionType');
      if (submissionType === 'twitter') twitterCount++;
      if (submissionType === 'youtube') youtubeCount++;
    });
    
    return {
      totalSubmissions: userSubmissions.length,
      totalScore,
      twitterSubmissions: twitterCount,
      youtubeSubmissions: youtubeCount,
      lastSubmission: userSubmissions[userSubmissions.length - 1]?.get('Timestamp') || 'None'
    };
    
  } catch (error) {
    console.error('Error fetching stats:', error);
    return null;
  }
};

// Check for duplicate submissions
const isDuplicateSubmission = async (userId, postUrl) => {
  try {
    const doc = await connectToSheets();
    
    let detailsSheet;
    try {
      detailsSheet = doc.sheetsByTitle['Details'];
    } catch (error) {
      detailsSheet = doc.sheetsByIndex[0];
    }
    
    if (!detailsSheet) return false;
    
    const rows = await detailsSheet.getRows();
    
    // Check if this user has already submitted this URL
    const duplicate = rows.find(row => {
      return row.get('UserID') === userId.toString() && 
             row.get('PostURL') === postUrl;
    });
    
    return !!duplicate;
    
  } catch (error) {
    console.error('Error checking for duplicates:', error);
    return false; // If we can't check, allow submission
  }
};

// Bot commands
bot.start((ctx) => {
  ctx.reply(
    'Welcome to the ALPH Community Sprint! 🎉\n\n' +
    'Share your Twitter or YouTube posts with me to participate.\n\n' +
    'Supported platforms:\n' +
    '• Twitter/X posts\n' +
    '• YouTube videos\n\n' +
    'Just send me the URL directly!'
  );
});

bot.help((ctx) => {
  ctx.reply(
    'Competition Bot Commands:\n\n' +
    '/mystats - View your statistics\n' +
    '/help - Show this help message\n\n' +
    'You can also send URLs directly without using commands!'
  );
});

// Handle my stats command
bot.command('mystats', async (ctx) => {
  const userId = ctx.from.id;
  
  try {
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
  } catch (error) {
    console.error('Error in mystats command:', error);
    ctx.reply('❌ Sorry, there was an issue fetching your stats. Please try again later.');
  }
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
    
    // Send processing message
    const processingMsg = await ctx.reply('⏳ Processing your submission...');
    
    try {
      // Check for duplicates
      const isDuplicate = await isDuplicateSubmission(userId, urlInfo.url);
      
      if (isDuplicate) {
        return ctx.reply('⚠️ You have already submitted this URL. Each URL can only be submitted once per user.');
      }
      
      const success = await addSubmission(userId, userName, urlInfo.type, urlInfo.handle, urlInfo.url);
      
      if (success) {
        const platform = urlInfo.type === 'twitter' ? 'Twitter' : 'YouTube';
        const emoji = urlInfo.type === 'twitter' ? '🐦' : '📺';
        ctx.reply(`${emoji} Your ${platform} submission has been recorded! Our team will review it soon.`);
      } else {
        ctx.reply('❌ Sorry, there was an issue recording your submission. Please try again later.');
      }
    } catch (error) {
      console.error('Error processing submission:', error);
      ctx.reply('❌ Sorry, there was an issue processing your submission. Please try again later.');
    }
  } else {
    // If no URL detected, provide helpful message
    ctx.reply(
      '🤔 I didn\'t detect a valid URL. Please send:\n\n' +
      '• Twitter/X links: https://twitter.com/username/status/...\n' +
      '• YouTube links: https://youtube.com/watch?v=...\n\n' +
      'Or use /help for more information.'
    );
  }
});

// Global error handling
bot.catch((err, ctx) => {
  console.error('Bot error:', err);
  if (ctx) {
    try {
      ctx.reply('❌ An error occurred. Please try again later.');
    } catch (replyError) {
      console.error('Error sending error message:', replyError);
    }
  }
});

// Launch bot
bot.launch().then(() => {
  console.log('Bot is running with Twitter and YouTube support...');
  console.log('Using Google Spreadsheet library with JWT authentication');
}).catch((error) => {
  console.error('Failed to launch bot:', error);
  process.exit(1);
});

// Enable graceful stop
process.once('SIGINT', () => {
  console.log('Shutting down bot...');
  bot.stop('SIGINT');
});

process.once('SIGTERM', () => {
  console.log('Shutting down bot...');
  bot.stop('SIGTERM');
});

// Test connection on startup
(async () => {
  try {
    await connectToSheets();
    console.log('✅ Google Sheets connection test successful');
  } catch (error) {
    console.error('❌ Google Sheets connection test failed:', error);
  }
})();