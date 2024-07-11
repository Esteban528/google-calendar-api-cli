import fs from 'fs';
import { Actions } from './ListEvents.js';
import { google } from 'googleapis';
import http from 'http';
import url from 'url';
import open from 'open';

const credentials = JSON.parse(fs.readFileSync('./credentials.json', 'utf8'));
const actions = new Actions();
const { client_secret, client_id, redirect_uris } = credentials.installed;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

const TOKEN_PATH = 'token.json';
fs.readFile(TOKEN_PATH, 'utf8', (err, token) => {
  if (err) return getAccessToken(oAuth2Client);
  oAuth2Client.setCredentials(JSON.parse(token));
  actions.listEvents(oAuth2Client);
});

function getAccessToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar.readonly'],
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  open(authUrl);
  const server = http.createServer((req, res) => {
    const query = new url.URL(req.url, 'http://localhost:8000').searchParams;
    const code = query.get('code');
    res.end('Authentication successful! You can close this window.');
    server.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      actions.listEvents(oAuth2Client);
    });
  }).listen(8000, () => {
    console.log('Listening on port 8000');
  });
}


