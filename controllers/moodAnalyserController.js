function analyse(playlistAudioFeatures) {

    const length = playlistAudioFeatures.length;
    
    let averageAudioFeatures = {
        danceability: 0,
        energy: 0,
        key: 0,
        loudness: 0,
        mode: 0,
        speechiness: 0,
        acousticness: 0,
        instrumentalness: 0,
        liveness: 0,
        valence: 0,
        tempo: 0,
        duration: 0,
        timeSignature: 0
    };

    allAudioFeatures = {
        danceability: [],
        energy: [],
        key: [],
        loudness: [],
        mode: [],
        speechiness: [],
        acousticness: [],
        instrumentalness: [],
        liveness: [],
        valence: [],
        tempo: [],
        duration: [],
        timeSignature: []
    };

    // populate averageAudioFeatures and allAudioFeatures
    playlistAudioFeatures.map((x) => {
        averageAudioFeatures.danceability += x.danceability/length;
        averageAudioFeatures.energy += x.energy/length;
        if (x.key !== -1) {averageAudioFeatures.key += x.key/length};
        averageAudioFeatures.loudness += x.loudness/length;
        averageAudioFeatures.mode += x.mode/length;
        averageAudioFeatures.speechiness += x.speechiness/length;
        averageAudioFeatures.acousticness += x.acousticness/length;
        averageAudioFeatures.instrumentalness += x.instrumentalness/length;
        averageAudioFeatures.liveness += x.liveness/length;
        averageAudioFeatures.valence += x.valence/length;
        averageAudioFeatures.tempo += x.tempo/length;
        averageAudioFeatures.duration += x.duration_ms/length;
        averageAudioFeatures.timeSignature += x.time_signature/length;
        
        allAudioFeatures.danceability.push(x.danceability);
        allAudioFeatures.energy.push(x.energy);
        allAudioFeatures.key.push(x.key);
        allAudioFeatures.loudness.push(x.loudness);
        allAudioFeatures.mode.push(x.mode);
        allAudioFeatures.speechiness.push(x.speechiness);
        allAudioFeatures.acousticness.push(x.acousticness);
        allAudioFeatures.instrumentalness.push(x.instrumentalness);
        allAudioFeatures.liveness.push(x.liveness);
        allAudioFeatures.valence.push(x.valence);
        allAudioFeatures.tempo.push(x.tempo);
        allAudioFeatures.duration.push(x.duration_ms);
        allAudioFeatures.timeSignature.push(x.time_signature);
    })

    // if the key of the song is C#, Eb, F#, G#, B, more than 40% of the time
    // darkTriadTrigger is set to true and negative traits are amplified
    let darkTriadTrigger;
    let darkKeyCounter = 0;
    let darkKeys = {
        1: true, // C#
        3: true, // Eb
        6: true, // F#
        8: true, // G#
        11: true // B
    }

    // count the number of songs in a 'dark' key
    allAudioFeatures.key.map((x) => {
        if (x in darkKeys) {
            darkKeyCounter += 1;
        }
    });

    if (darkKeyCounter/length > 0.4) {
        darkTriadTrigger = true;
    } else {
        darkTriadTrigger = false;
    }

    let psychoanalysis = {};

        psychoanalysis.bigFive = {
            openness: (averageAudioFeatures.danceability + averageAudioFeatures.liveness + averageAudioFeatures.acousticness)/3,
            conscientiousness: (1 - averageAudioFeatures.energy + 1 - (60 + averageAudioFeatures.loudness)/60 + 1 - averageAudioFeatures.danceability + averageAudioFeatures.valence)/4,
            extroversion: (averageAudioFeatures.danceability + averageAudioFeatures.energy + (60 + averageAudioFeatures.loudness)/60)/3,
            agreeableness: (averageAudioFeatures.danceability + averageAudioFeatures.acousticness + averageAudioFeatures.instrumentalness)/3,
            neuroticism: (1 - averageAudioFeatures.danceability + averageAudioFeatures.energy + 1 - averageAudioFeatures.instrumentalness)/3,
        };
        if (darkTriadTrigger) {
            psychoanalysis.darkTriad = {
                Narcicism: 1 - (1 - ((60+averageAudioFeatures.loudness)/60 + averageAudioFeatures.danceability)/2)/2,
                Machiavellianism: 1 - (1 - (averageAudioFeatures.speechiness + 1 - (60+averageAudioFeatures.loudness)/60)/2)/2,
                Psychopaty: 1 - (1 - ((60+averageAudioFeatures.loudness)/60 + averageAudioFeatures.instrumentalness)/2)/2,
            };
        } else {
            psychoanalysis.darkTriad = {
                Narcicism: ((60+averageAudioFeatures.loudness)/60 + averageAudioFeatures.danceability)/2,
                Machiavellianism: (averageAudioFeatures.speechiness + 1 - (60+averageAudioFeatures.loudness)/60)/2,
                Psychopaty: ((60+averageAudioFeatures.loudness)/60 + averageAudioFeatures.instrumentalness)/2,
            }
        };
        psychoanalysis.likeability = {
            subject: (averageAudioFeatures.danceability + averageAudioFeatures.energy + averageAudioFeatures.valence)/3,
            average: 0.6,
        };
        if (darkTriadTrigger) {
            if (averageAudioFeatures.energy > 0.85) {
                psychoanalysis.advice = 'Breathing exercises.';
             } else if (averageAudioFeatures.loudness > -5) {
                psychoanalysis.advice = 'Take a chill pill.';
            } else psychoanalysis.advice = 'Use your darkness to take over the world.';
        } else {
            if ( averageAudioFeatures.energy > 0.9) {
                psychoanalysis.advice = 'Breathing exercises.';
            } else if ( averageAudioFeatures.speechiness > 0.09) {
                psychoanalysis.advice = 'Find a more interesting hobby. People will like you more.';
            } else if (averageAudioFeatures.valence < 0.5) {
                psychoanalysis.advice = 'Smile more. The world is beautiful.';
            } else psychoanalysis.advice = 'You are perfect as you are :)';
        }

    return psychoanalysis;

}

module.exports = {
    analyse
}