# spotify-project
Spotify Project

This is a simple project to help me practice React and node. I ententionally avoided using some common abstractions like express and axios to force myself to use the libraries that these are built on top of, and better understand how they work.

This webapp accesses a Spotify user's playlist data, asks them to select which playlist they feel like listening to right now, and psychoanalyses them based on the properties of the songs in the playlist.

Do next:
- Unit tests
- Error handling. Wrap all spotify requests in try/catch.
- suggestion to select a different playlist if empty
- support multiple users
    - move the authentication thing outside of the spotify/index
    - move the actual getPlaylistData and getPlaylists logic to the spotify file
    - add new dataSource/authentication.js and use it to hold token logic. This is used by spotify.js to do authentication and used to store user data
    - to manage multiple users: let users = {}
        when first log in, check for sessionID cookie FIRST. If don't have a cookie, make cookie and do the login, then associate the token with that cookie.
        In the login flow, you can pass a variable called state, which should be set to the sessionID cookie. Spotify will pass that state back in the callback. Then I assign that sessionID to the token that I receive.
        Then I'll have to pass that accessToken with every request to spotify so it knows which user.
        When loggin a user out, I will have to delete that cookie and token from the users array
        
        Instead of getting the token from getAccessToken, I'll have to get it from auth.getAccessToken(sessionID)

        Will also have to expire the cookie in the users browser at the same time as I delete the cookie after x refresh tokens have been requested