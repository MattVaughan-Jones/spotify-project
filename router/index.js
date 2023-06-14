const fs = require('fs');
const spotify = require('../dataSource/spotify');
const moodAnalyser = require('../controllers/moodAnalyserController');
const path = require('path');
const fetch = require('cross-fetch');
const querystring = require('querystring');
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

//home page
router.on('GET', '/', (req, res, params) => {
    file = fs.readFileSync(path.resolve(__dirname, `../client/index.html`), 'utf8');
    res.write(file);
    res.end();
})

//login route
router.on('GET', '/login', (req, res, params) => {
    const query = spotify.loginQuery();

    res.writeHead(301, {
        Location: `https://accounts.spotify.com/authorize?` + query
    }).end();
})

//logout route
router.on('GET', '/logout', (req, res, params) => {
    spotify.logout();

    res.writeHead(200).end();
})

//callback route
router.on('GET', '/callback', async (req, res, params) => {

    const rawQueryString = req.url.split('?')[1];
    const query = querystring.parse(rawQueryString);    
    if (query.error) {
        console.log('[ERROR] authorisation: ' + query.error);
    } else {
        spotify.setTokens(query);

        res.writeHead(301, {
            Location: `${process.env.BASE_URL}/index.html`
        }).end();
    }
})

// check_login route
router.on('GET', '/check_login', (req, res, params) => {

    if(spotify.getAccessToken()) {
        res.writeHead(200).end();
    }

    res.writeHead(401).end();
})

// playlists route
router.on('GET', '/playlists', async (req, res, params) => {

    //fetch list of playlists
    try {

        let playlists = await spotify.getPlaylists();

        res.statuscode = 200;
        res.write(JSON.stringify({playlists: playlists}));
        res.end()

        return;

    } catch(e) {

        res.statuscode = 400;
        res.write(e.message);
        res.end();

        return;

    }
    
})

// playlistTracks route
router.on('GET', '/playlistData/:id', async (req, res, params) => {

    let audioFeatures = await spotify.getAudioFeatures(params);

    if (audioFeatures == 'empty playlist') {
        res.statuscode = 200;
        res.write(JSON.stringify({response: 'empty playlist'}));
        res.end()
        return;
    }

    let playlistPsychoanalysis = moodAnalyser.analyse(audioFeatures.audio_features);

    res.statuscode = 200;
    res.write(JSON.stringify({response: playlistPsychoanalysis}));
    res.end()
    return;
})

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
