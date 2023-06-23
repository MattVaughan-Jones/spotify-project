const moodAnalyser = require('./moodAnalyserController');

describe('test analyse function', () => {

    const context = [
        {
          danceability: 0.341,
          energy: 0.662,
          key: 9,
          loudness: -5.023,
          mode: 0,
          speechiness: 0.0335,
          acousticness: 0.105,
          instrumentalness: 0,
          liveness: 0.113,
          valence: 0.5,
          tempo: 174.875,
          type: 'audio_features',
          id: '3bwAS8cN7Xtzvv5UurJOOX',
          uri: 'spotify:track:3bwAS8cN7Xtzvv5UurJOOX',
          track_href: 'https://api.spotify.com/v1/tracks/3bwAS8cN7Xtzvv5UurJOOX',
          analysis_url: 'https://api.spotify.com/v1/audio-analysis/3bwAS8cN7Xtzvv5UurJOOX',
          duration_ms: 334907,
          time_signature: 4
        }
    ];

    let psychoanalysis = moodAnalyser.analyse(context);

    it('should return psychoanalysis object with property values of between 0 and 1', () => {
        Object.values(psychoanalysis.bigFive).forEach(value => expect(value >= 0 && value <= 1).toEqual(true));
        Object.values(psychoanalysis.darkTriad).forEach(value => expect(value >= 0 && value <= 1).toEqual(true));
        Object.values(psychoanalysis.likeability).forEach(value => expect(value >= 0 && value <= 1).toEqual(true));
        expect(typeof psychoanalysis.advice === "string").toEqual(true);
    });

    it('should return psychoanalysis object with advice advice property as a string', () => {
        expect(typeof psychoanalysis.advice === "string").toEqual(true);
    })
});
