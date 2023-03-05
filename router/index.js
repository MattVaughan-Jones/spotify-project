const fs = require('fs');
const spotify = require('../dataSource/spotify');
const path = require('path');
const fetch = require('cross-fetch');
const querystring = require('node:querystring');
const router = require('find-my-way')({
    defaultRoute: (req, res) => {
        res.statusCode = 404
        res.end('Not here')
    },
    onBadUrl: (path, req, res) => {
        res.statusCode = 400
        res.end(`Bad path: ${path}`)
    }
  })

// login route
router.on('GET', '/login', (req, res, params) => {
    const scopes = 'user-read-recently-played user-read-private playlist-read-private';

    const query = querystring.stringify({
      response_type: 'code',
      client_id: process.env.CLIENT_ID,
      scope: scopes,
      redirect_uri: 'http://localhost:8080/callback',
    });

    res.writeHead(301, {
        Location: 'https://accounts.spotify.com/authorize?' + query
    }).end();
})

//callback route
router.on('GET', '/callback', async (req, res, params) => {
    const rawQueryString = req.url.split('?')[1];
    const query = querystring.parse(rawQueryString);
    const code = query.code;
    const authorization = process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET

    let spotifyResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            Authorization: 'Basic ' + Buffer.from(authorization).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: 'http://localhost:8080/callback'
        })
    });

    let responseData = await spotifyResponse.json()
    spotify.setAccessToken(responseData.access_token);

    res.writeHead(301, {
        Location: 'http://localhost:8080/index.html'
    }).end();
})

spotify.accessToken

// serving files
router.on('GET', '/*', (req, res, params) => {
    const url = req.url.substring(1);
    let file;
    try {
        file = fs.readFileSync(path.resolve(__dirname, `../client/${url}`), 'utf8');
    } catch (err) {
        res.statusCode = 404;
        res.write('file not found');
        res.end();
        return;
    }

    res.write(file);
    res.end();
})

module.exports = router;