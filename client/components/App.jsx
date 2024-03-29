import React, { useState, useEffect } from 'react'
import Playlists from './Playslists';
import Mood from './Mood';
import * as env from 'env';

import { createTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';


const App = () => {

    const [loggedIn, setLoggedIn] = useState(false);
    const [selectedPlaylist, setSelectedPlaylist] = useState('');

    const theme = createTheme({
        palette: {
            primary: {
                main: '#388e3c',
            },
            secondary: {
                main: '#81c784',
            },
            background: {
                paper: '#81c784'
            }
        },
    });

    function selectPlaylist(playlistId) {
        setSelectedPlaylist(playlistId);
    }

    function returnHome() {
        setSelectedPlaylist('');
    }

    async function logout() {
        setLoggedIn(false);

        const url = 'https://accounts.spotify.com/en/logout';
        const spotifyLogoutWindow = window.open(url, 'Spotify Logout', 'width=700,height=500,top=40,left=40');
        setTimeout(() => {
            spotifyLogoutWindow.close();
            window.location.href = `/login`
        }, 1500)

        fetch(`/logout`, {
            method: 'GET',
        });
    }

    useEffect(() => {
        async function isLoggedIn() {
            let spotifyResponse = await fetch(`/check_login`, {
                method: 'GET',
            });
        
            if (spotifyResponse.status === 200) {
                setLoggedIn(true);
            } else {
                // redirect to /login page
                window.location.replace(`/login`);
                setLoggedIn(false);
            }
            
        }

        isLoggedIn();
    }, [])

    function Body(props) {
        const loggedIn = props.loggedIn;
        const selectedPlaylist = props.selectedPlaylist;

        if (loggedIn) {
            if (selectedPlaylist) {
                return(<Mood playlistId={selectedPlaylist}></Mood>)
            } else {
                return(<Playlists callback={selectPlaylist}></Playlists>)
            }
        } else {
            return(<></>)
        }
    }

    return (
        <>
            <Box sx={{ flexGrow: 1, px: 2 }}>
                <AppBar theme={theme} position="static" color="primary">
                    <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={returnHome}
                    >
                        <HomeIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Psychify
                    </Typography>
                    <Button color="inherit" onClick={logout}>Logout</Button>
                    </Toolbar>
                </AppBar>
            </Box>
            <Body loggedIn={loggedIn} selectedPlaylist={selectedPlaylist}></Body>
        </>
    )
}

export default App;
