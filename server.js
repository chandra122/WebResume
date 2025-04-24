const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from both root and assets directory
app.use(express.static(__dirname));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Serve resume.html at the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'resume.html'));
});

// LinkedIn OAuth endpoints
const LINKEDIN_CLIENT_ID = 'YOUR_LINKEDIN_CLIENT_ID';
const LINKEDIN_CLIENT_SECRET = 'YOUR_LINKEDIN_CLIENT_SECRET';
const REDIRECT_URI = 'http://localhost:3000/auth/linkedin/callback';

// LinkedIn authentication endpoint
app.get('/auth/linkedin', (req, res) => {
  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=r_liteprofile%20r_emailaddress%20w_member_social`;
  res.redirect(authUrl);
});

// LinkedIn callback endpoint
app.get('/auth/linkedin/callback', async (req, res) => {
  const { code } = req.query;
  
  try {
    // Exchange code for access token
    const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
      params: {
        grant_type: 'authorization_code',
        code,
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI
      }
    });

    const accessToken = tokenResponse.data.access_token;

    // Fetch LinkedIn profile data
    const profileResponse = await axios.get('https://api.linkedin.com/v2/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    // Fetch LinkedIn profile summary
    const summaryResponse = await axios.get('https://api.linkedin.com/v2/me?projection=(summary)', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    // Return profile data
    res.json({
      profile: profileResponse.data,
      summary: summaryResponse.data.summary
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch LinkedIn data' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 