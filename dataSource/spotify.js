const fetch = require('cross-fetch');

let accessToken = '';

function setAccessToken(token) {
    accessToken = token;
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

module.exports = {
    setAccessToken,
    getPlaylist,
    getUser
};