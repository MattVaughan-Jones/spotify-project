
import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

const Playlist = ({ playlist, callback}) => {
    let coverArt;

    try {
        if (playlist.images[0]){
            coverArt = playlist.images[0].url;
        } else {
            coverArt = "https://i.pinimg.com/originals/59/cd/19/59cd19a18d121fbb96a016a0044e9b48.jpg"
        }
    } catch (error) {
        //
    }

    function selectPlaylist() {
        //TODO - if playlist has content {callback(playlist.id)} else {display message "empty playlist"}
        callback(playlist.id);
    }
    
    return (
        <>
            <a href='#' onClick={selectPlaylist} >
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        '& > :not(style)': {
                        width: 200,
                        height: 200,
                        m: 1
                        },
                    }}
                >
                    <Paper elevation={3}>
                        <img src={coverArt} width="200" height="200"></img>
                    </Paper>
                    
                </Box>
            </a>
            <Typography variant="subtitle1" align="center"> {playlist.name} </Typography>
        </>
    )
}

export default Playlist;
