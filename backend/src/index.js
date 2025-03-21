require('dotenv').config();
const { Telegraf } = require('telegraf');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const moment = require('moment');

// Initialize bot
const bot = new Telegraf(process.env.BOT_TOKEN);

// Connect to Google Sheets with updated authentication
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
    return doc;
  } catch (error) {
    console.error('Error connecting to Google Sheets:', error);
    throw error; // Re-throw to handle in calling function
  }
};

// Extract Twitter URL from message
const extractTwitterUrl = (text) => {
  const urlRegex = /(https?:\/\/twitter\.com\/[^\s]+)|(https?:\/\/x\.com\/[^\s]+)/i;
  const match = text.match(urlRegex);
  return match ? match[0] : null;
};

// Check if user exists in Checkboard and get their info
const getUserFromCheckboard = async (telegramName) => {
  try {
    const doc = await connectToSheets();
    const checkboardSheet = doc.sheetsByTitle['Checkboard'];
    
    const rows = await checkboardSheet.getRows();
    
    // Find user by TelegramName
    const user = rows.find(row => row.TelegramName === telegramName);
    return user || null;
  } catch (error) {
    console.error('Error checking user:', error);
    return null;
  }
};

// Add user to Checkboard
const addUserToCheckboard = async (userId, telegramName, twitterHandle) => {
  try {
    const doc = await connectToSheets();
    const checkboardSheet = doc.sheetsByTitle['Checkboard'];
    
    // Add new row
    await checkboardSheet.addRow({
      UserID: userId,
      TelegramName: telegramName,
      TwitterHandle: twitterHandle
    });
    
    return true;
  } catch (error) {
    console.error('Error adding user to Checkboard:', error);
    return false;
  }
};

// Add submission to Google Sheets
const addSubmission = async (userId, telegramName, twitterHandle, postUrl) => {
  try {
    const doc = await connectToSheets();
    const detailsSheet = doc.sheetsByTitle['Details'];
    
    // Add new row
    await detailsSheet.addRow({
      UserID: userId,
      TelegramName: telegramName,
      TwitterHandle: twitterHandle,
      PostURL: postUrl,
      Timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
      Score: 0, // Initial score, will be updated by admin
      ReviewStatus: 'Pending'
    });
    
    return true;
  } catch (error) {
    console.error('Error adding submission:', error);
    return false;
  }
};

// Process submission
const processSubmission = async (ctx, twitterUrl) => {
  try {
    const telegramName = ctx.from.username || `${ctx.from.first_name} ${ctx.from.last_name || ''}`.trim();
    
    // Extract Twitter handle from URL
    const twitterHandle = twitterUrl.split('/')[3]; // Simple extraction for MVP
    
    // Check if user exists in Checkboard by TelegramName
    let user = await getUserFromCheckboard(telegramName);
    let userId;
    
    if (user) {
      // User exists, use their UserID from Checkboard
      userId = user.UserID;
      
      // Update TwitterHandle if it's different (optional)
      if (user.TwitterHandle !== twitterHandle) {
        // This would require an additional function to update the Checkboard row
        // For simplicity in this example, we'll skip this step
      }
    } else {
      // User doesn't exist, add them to Checkboard with a new UserID
      userId = ctx.from.id.toString();
      await addUserToCheckboard(userId, telegramName, twitterHandle);
    }
    
    // Add submission to Details sheet
    const success = await addSubmission(userId, telegramName, twitterHandle, twitterUrl);
    
    if (success) {
      ctx.reply('Your submission has been recorded! Our team will review it soon.');
    } else {
      ctx.reply('Sorry, there was an issue recording your submission. Please try again later.');
    }
  } catch (error) {
    console.error('Error in processSubmission:', error);
    ctx.reply('Sorry, an error occurred while processing your submission. Please try again later.');
  }
};

// Bot commands
// Updated welcome message
bot.start((ctx) => {
  ctx.reply('Alephium ambassadors, welcome! \nYou can share your tweet post URL with me, or click t.me/Alph_Rankify_Bot/Ra01 to see the current rankings and points.');
});

bot.help((ctx) => {
  ctx.reply(
    'Competition Bot Commands:\n' +
    '/submit [twitter_url] - Submit a new post\n' +
    '/mystats - View your statistics\n' +
    '/help - Show this help message'
  );
});

// Handle submission command
bot.command('submit', async (ctx) => {
  const text = ctx.message.text.replace('/submit', '').trim();
  const twitterUrl = extractTwitterUrl(text);
  
  if (!twitterUrl) {
    return ctx.reply('Please provide a valid Twitter/X URL with your submission.');
  }
  
  await processSubmission(ctx, twitterUrl);
});

// Handle my stats command
bot.command('mystats', async (ctx) => {
  const telegramName = ctx.from.username || `${ctx.from.first_name} ${ctx.from.last_name || ''}`.trim();
  
  try {
    // First, get the user from Checkboard
    const user = await getUserFromCheckboard(telegramName);
    if (!user) {
      return ctx.reply('You have not submitted any posts yet.');
    }
    
    const userId = user.UserID;
    const doc = await connectToSheets();
    const detailsSheet = doc.sheetsByTitle['Details'];
    
    // Load all rows
    const rows = await detailsSheet.getRows();
    
    // Filter rows for this user
    const userSubmissions = rows.filter(row => row.UserID === userId.toString());
    const totalScore = userSubmissions.reduce((sum, row) => sum + (parseInt(row.Score) || 0), 0);
    
    ctx.reply(
      `Your Stats:\n` +
      `Total Submissions: ${userSubmissions.length}\n` +
      `Total Score: ${totalScore}\n` +
      `Last Submission: ${userSubmissions.length > 0 ? userSubmissions[userSubmissions.length - 1].Timestamp : 'None'}`
    );
  } catch (error) {
    console.error('Error fetching stats:', error);
    ctx.reply('Sorry, there was an issue fetching your stats. Please try again later.');
  }
});

// Handle direct message with Twitter URL
bot.on('text', async (ctx) => {
  const text = ctx.message.text;
  const twitterUrl = extractTwitterUrl(text);
  
  if (twitterUrl) {
    await processSubmission(ctx, twitterUrl);
  }
});

// Launch bot
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

console.log('Bot is running...');