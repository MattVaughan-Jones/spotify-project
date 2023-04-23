
import React, { useState } from 'react';
import Chart from "chart.js/auto";
import { Radar, Bar } from "react-chartjs-2";
import Grid from '@mui/material/Unstable_Grid2';

const Mood = ({ playlistId }) => {

  const radarInitialState = {
    labels: [],
    datasets: [{
      label: '',
      data: [],
      fill: true,
    }]
  }

  const [bigFiveData, setBigFiveData] = useState(radarInitialState);
  const [darkTriadData, setdarkTriadData] = useState(radarInitialState);
  const [advice, setAdvice] = useState('');
  const [likeabilityData, setLikeabilityData] = useState({
    labels: ['average', 'You'],
    datasets: [{
      label: 'Likeability',
      data: [],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
      ],
      borderWidth: 1
    }]
  });


  let psychoanalysis;

  async function getPsycholanalysis() {
    let playlistsResponse = await fetch(`http://localhost:8080/playlistData/${playlistId}`, {
        method: 'GET',
    });
    json = await playlistsResponse.json();
    
    psychoanalysis = json.response;

    setBigFiveData({
      labels: Object.keys(psychoanalysis.bigFive),
      datasets: [{
        label: 'Big Five Personality Traits',
        data: Object.values(psychoanalysis.bigFive),
        fill: true,
        backgroundColor: 'rgb(75, 192, 192, 0.2)',
        borderColor: 'rgb(75, 192, 192)',
        pointBackgroundColor: 'rgb(75, 192, 192)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(75, 192, 192)'
      }]
    });

    setdarkTriadData({
      labels: Object.keys(psychoanalysis.darkTriad),
      datasets: [{
        label: 'Dark Triad',
        data: Object.values(psychoanalysis.darkTriad),
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 99, 132)'
      }]
    });

    setLikeabilityData({
      labels: ['average', 'You'],
      datasets: [{
        label: 'Likeability',
        data: Object.values(psychoanalysis.likeability),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
        ],
        borderWidth: 1
      }]
    });

    setAdvice(psychoanalysis.advice);
  }

  getPsycholanalysis();
  
  return (
    <>
      <Grid container spacing={15} p={10}>

        <Grid key='bigFive' xs={6} display="flex" justifyContent="center" alignItems="center" flexDirection="column" >
          <Radar data={bigFiveData} />
        </Grid>

        <Grid key='darkTriad' xs={6} display="flex" justifyContent="center" alignItems="center" flexDirection="column" >
          <Radar data={darkTriadData} />
        </Grid>

        <Grid key='likeability' xs={6} display="flex" justifyContent="center" alignItems="center" flexDirection="column" >
          <Bar data={likeabilityData} />
        </Grid>

        <Grid key='advice' xs={6} display="flex" justifyContent="center" alignItems="center" flexDirection="column" >
          <div>Some handy live advice...</div>
          <div>{advice}</div>
        </Grid>

      </Grid>
    </>
  )
}

export default Mood;
