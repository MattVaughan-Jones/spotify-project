
import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

const Playlist = ({ playlist, callback}) => {
    let coverArt;

    try {
        coverArt = playlist.images[0].url;
    } catch (error) {
        //
    }

    function selectPlaylist() {
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
