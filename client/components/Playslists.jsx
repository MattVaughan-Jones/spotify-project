import React, { useState, useEffect } from 'react';
import Playlist from './Playlist';
import Grid from '@mui/material/Unstable_Grid2';

const Playlists = ({callback}) => {

    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        async function getPlaylists() {
            let playlistsResponse = await fetch('http://localhost:8080/playlists', {
                method: 'GET',
            });
            let json = await playlistsResponse.json();

            setPlaylists(json.playlists.items);
        }

        getPlaylists();
    }, [])

    function selectPlaylist(playlistId) {
        callback(playlistId)
    }
    
    return (
        <>
            <Grid sx={{alignItems: "flex-start", mt: 4}} container spacing={2}>
                {playlists.map((playlist) => {
                    return (
                        <Grid key={playlist.id} xs={3} display="flex" justifyContent="center" alignItems="center" flexDirection="column" >
                            <Playlist playlist={playlist} callback={selectPlaylist}></Playlist>
                        </Grid>
                    )
                })}
            </Grid>
        </>
    )
}

export default Playlists;
