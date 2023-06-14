const fetch = require('cross-fetch');
const querystring = require('querystring');

let accessToken;
let refreshToken;

async function setTokens(query) {
    
    const code = query.code;
    const authorization = process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET
    
    try {
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
    } catch(e)  {
        console.log('Error: ' + e);
    }
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

    try{
        let spotifyResponse = await fetch('https://api.spotify.com/v1/me', {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + accessToken,
                'Content-Type': 'application/json',
            },
        });

        return await spotifyResponse.json();
    } catch(e)  {
        console.log('Error: ' + e);
    }
}

// get list of playlists
async function getPlaylists() {
    try{
        spotifyResponse = await fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + accessToken,
            }
        });

        let playlists = await spotifyResponse.json()

        return playlists;
    } catch(e)  {
        console.log('Error: ' + e);
    }
}

function loginQuery() {
    const scopes = 'user-read-recently-played user-read-private playlist-read-private';
    
    try{
        const query = querystring.stringify({
            response_type: 'code',
            client_id: process.env.CLIENT_ID,
            scope: scopes,
            redirect_uri: `${process.env.BASE_URL}/callback`,
        });

        return query;
    } catch(e)  {
        console.log('Error: ' + e);
    }
}

async function getAudioFeatures(params) {
    const playlistId = params.id;
    
    try{
        // fetch list of tracks in playlist
        let spotifyTracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=50`, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + accessToken,
            }
        });

        let trackIds = await spotifyTracksResponse.json()

        var trackIdsString = trackIds.items.map((item) => {
            return item.track.id;
        }).toString()

        if (trackIds.total <= 0) {
            return 'empty playlist';
        }
    } catch(e) {
        console.log('Error: ' + e);
    }

    try {
        // fetch list tracks' audio features
        let spotifyAudioFeaturesResponse = await fetch(`https://api.spotify.com/v1/audio-features?ids=${trackIdsString}`, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + accessToken,
            }
        });

        return await spotifyAudioFeaturesResponse.json();
    } catch(e)  {
        console.log('Error: ' + e);
    }
}

setInterval(async () => {
    if (refreshToken) {
        const authorization = process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET
        
        try {
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
        } catch(e)  {
            console.log('Error: ' + e);
        }

    }
}, 2400000)

module.exports = {
    getAccessToken,
    getUser,
    getPlaylists,
    loginQuery,
    setTokens,
    logout,
    getAudioFeatures
};