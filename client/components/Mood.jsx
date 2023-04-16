
import React, { useState } from 'react';
import Chart from "chart.js/auto";
import { Bubble } from "react-chartjs-2";

const Mood = ({ playlistId }) => {
    
    console.log(playlistId)

    const [playlistData, setPlaylistData] = useState([]);

    useEffect(() => {
        async function getPlaylists() {
            let playlistsResponse = await fetch(`http://localhost:8080/playlistData?playlistID=${playlistId}`, {
                method: 'GET',
            });
            let json = await playlistsResponse.json();

            setPlaylists(json.playlists.items);
        }

        getPlaylists();
    }, [])



    const data = {
        datasets: [{
          label: 'First Dataset',
          data: [{
            x: 20,
            y: 30,
            r: 15
          }, {
            x: 40,
            y: 10,
            r: 10
          },
          {
            x: 12,
            y: 12,
            r: 30
          }],
          backgroundColor: 'rgb(255, 99, 132)'
        }]
      };
    
    return (
        <>
            <Bubble data={data} />
        </>
    )
}

export default Mood;
