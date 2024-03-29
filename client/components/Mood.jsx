
import React, { useState, useEffect } from 'react';
import Chart from "chart.js/auto";
import { Radar, Bar } from "react-chartjs-2";
import Grid from '@mui/material/Unstable_Grid2';
import { Card, CardContent, Typography } from '@mui/material';
import * as env from 'env';

const Mood = ({ playlistId }) => {

  const radarInitialState = {
    labels: [],
    datasets: [{
      label: '',
      data: [],
      fill: true,
    }]
  }

  const [emptyPlaylist, setEmptyPlaylist] = useState(null);
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

  useEffect(() => {
    async function getPsycholanalysis() {
      let playlistsResponse = await fetch(`/playlistData/${playlistId}`, {
          method: 'GET',
      });
      json = await playlistsResponse.json();
      
      psychoanalysis = json.response;

      if (psychoanalysis == 'empty playlist'){
        setEmptyPlaylist(true);
      } else {
        setEmptyPlaylist(false);

        setBigFiveData({
          labels: Object.keys(psychoanalysis.bigFive),
          datasets: [{
            label: 'Big Five Personality Traits',
            data: Object.values(psychoanalysis.bigFive),
            fill: true,
            backgroundColor: 'rgb(82, 176, 41, 0.2)',
            borderColor: 'rgb(82, 176, 41)',
            pointBackgroundColor: 'rgb(82, 176, 41)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(82, 176, 41)'
          }]
        });

        setdarkTriadData({
          labels: Object.keys(psychoanalysis.darkTriad),
          datasets: [{
            label: 'Dark Triad',
            data: Object.values(psychoanalysis.darkTriad),
            fill: true,
            backgroundColor: 'rgb(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            pointBackgroundColor: 'rgb(54, 162, 235)',
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
            borderWidth: 2
          }]
        });

        setAdvice(psychoanalysis.advice);
      }
    }

    getPsycholanalysis();
  }, [])

  const bigFiveOptions = {
    elements: {
      line: {
        borderWidth: 2
      }
    },
    scales: {
      r: {
        min: 0,
        max: 1,
        ticks: {
          font: {
            size: 14
          },
          maxTicksLimit: 6
        },
        pointLabels: {
          font: {
            size: 12
          }
        }
      },
    },
    plugins: {
      legend: {
        labels: {
          font: {
            size: 20,
            weight: 'bold'
          }
        }
      }
    }
  };

  const darkTriadOptions = {
    elements: {
      line: {
        borderWidth: 2
      },
    },
    scales: {
      r: {
        min: 0,
        max: 1,
        ticks: {
          font: {
            size: 14
          },
          maxTicksLimit: 6
        },
        pointLabels: {
          font: {
            size: 12
          }
        }
      },
    },
    plugins: {
      legend: {
        labels: {
          font: {
            size: 20,
            weight: 'bold'
          }
        }
      }
    }
  };

  const likeabilityOptions = {
    aspectRatio: 1,
    elements: {
      bar: {
        backgroundColor: '#282C34'
      }
    },
    scales: {
      y: {
        min: 0,
        max: 1,
        ticks: {
          font: {
            size: 14
          }
        }
      },
      x: {
        ticks: {
          font: {
            size: 14
          }
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          font: {
            size: 20,
            weight: 'bold'
          },
          display: false
        }
      }
    }
  };
  
  if (emptyPlaylist == true) {
    return (
      <>
        <Grid container spacing={5} py={5} px={2}>
          <Grid key='advice' xs={12} display="flex" justifyContent="center" alignItems="center" flexDirection="column" >
            <Card sx={{ minWidth: "100%" }} style={{backgroundColor: "rgb(56, 142, 60)"}}>
              <CardContent>
                <Typography variant="h4" color="white" display="flex" alignItems="center" flexDirection="column">
                  <p>Like you, this playlist is empty. Please select another.</p>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </>
    )
  } else if (emptyPlaylist == false) {
    return (
      <>
        <Grid container spacing={5} py={5} px={2}>

          <Grid key='bigFive' xs={4} display="flex" justifyContent="center" alignItems="center" flexDirection="column" >
            <Radar data={bigFiveData} options={bigFiveOptions} />
          </Grid>

          <Grid key='darkTriad' xs={4} display="flex" justifyContent="center" alignItems="center" flexDirection="column" >
            <Radar data={darkTriadData} options={darkTriadOptions} />
          </Grid>

          <Grid key='likeability' xs={4} display="flex" justifyContent="center" alignItems="center" flexDirection="column" >
            <Bar data={likeabilityData} options={likeabilityOptions} />
          </Grid>

          <Grid key='advice' xs={12} display="flex" justifyContent="center" alignItems="center" flexDirection="column" >
            <Card sx={{ minWidth: "100%" }} style={{backgroundColor: "rgb(56, 142, 60)"}}>
              <CardContent>
                <Typography variant="h4" color="white" display="flex" alignItems="center" flexDirection="column">
                  {advice}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </>
    );
  }
}

export default Mood;
