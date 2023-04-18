import React, { useState, useEffect } from 'react'
import CheckingLogin from './CheckingLogin';
import Playlists from './Playslists';
import Mood from './Mood';

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

    useEffect(() => {
        async function isLoggedIn() {
            let spotifyResponse = await fetch('http://localhost:8080/check_login', {
                method: 'GET',
            });
        
            if (spotifyResponse.status === 200) {
                setLoggedIn(true);
            } else {
            // redirect to /login page
            window.location.replace("http://localhost:8080/login");
            setLoggedIn(false);
            }
            
        }

        isLoggedIn();
    }, [])

    //{loggedIn ? <h1>Actual App Component</h1> : <CheckingLogin></CheckingLogin> }

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
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
                        Moodalizer
                    </Typography>
                    <Button color="inherit">Logout</Button>
                    </Toolbar>
                </AppBar>
            </Box>
            {selectedPlaylist ? <Mood playlistId={selectedPlaylist}></Mood> : <Playlists callback={selectPlaylist}></Playlists>}
        </>
    )
}

export default App;