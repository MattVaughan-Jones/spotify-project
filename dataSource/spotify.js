const fetch = require('cross-fetch');

let accessToken;
let refreshToken;

function setAccessToken(token) {
    accessToken = token;
    console.log('setting access token to: ', token);
}

function setRefreshToken(token) {
    refreshToken = token;
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
}, 30000)

module.exports = {
    setAccessToken,
    getAccessToken,
    setRefreshToken,
    getPlaylist,
    getUser
};