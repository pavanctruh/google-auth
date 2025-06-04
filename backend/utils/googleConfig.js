const { OAuth2Client } = require("google-auth-library");

const oauth2client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: "postmessage",  // This is crucial for React auth-code flow
});

module.exports = { oauth2client };
