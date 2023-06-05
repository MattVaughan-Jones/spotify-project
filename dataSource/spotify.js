const fetch = require('cross-fetch');
const querystring = require('querystring');

let accessToken;
let refreshToken;

async function setTokens(query) {
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
            redirect_uri: `${process.env.BASE_URL}/callback`
        })
    });

    let responseData = await spotifyResponse.json()
    accessToken = responseData.access_token;
    refreshToken = responseData.refresh_token;
}

function logout() {
    accessToken = null;
    refreshToken = null;
}

function getAccessToken() {
    return accessToken;
}

// get user information like ID
async function getUser() {

    if (!accessToken) {
        return null;
    }

    let spotifyResponse = await fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + accessToken,
            'Content-Type': 'application/json',
        },
    });

    return await spotifyResponse.json();
}

// get list of playlists
async function getPlaylist(userID) {

    if (!accessToken) {
        return null;
    }

    let spotifyResponse = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + accessToken,
            'Content-Type': 'application/json',
        },
    });

    return await spotifyResponse.json();
}

function loginQuery() {
    const scopes = 'user-read-recently-played user-read-private playlist-read-private';

    const query = querystring.stringify({
        response_type: 'code',
        client_id: process.env.CLIENT_ID,
        scope: scopes,
        redirect_uri: `${process.env.BASE_URL}/callback`,
    });

    return query;
}

setInterval(async () => {
    if (refreshToken) {
        const authorization = process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET
        let spotifyResponse = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                Authorization: 'Basic ' + Buffer.from(authorization).toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken
            })
        });
        let accessToken = await spotifyResponse.json()

        setAccessToken(accessToken.access_token);

    }
}, 2400000)

module.exports = {
    getAccessToken,
    getPlaylist,
    getUser,
    loginQuery,
    setTokens,
    logout
};