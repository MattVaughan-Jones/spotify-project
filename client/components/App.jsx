import React, { useState, useEffect } from 'react'
import CheckingLogin from './checkingLogin';

const App = () => {

    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        async function isLoggedIn () {
            let spotifyResponse = await fetch('http://localhost:8080/check_login', {
                method: 'GET',
            });
        
            if (spotifyResponse.status === 200) {
                setLoggedIn(true);
            }
        
            // redirect to /login page
            window.location.replace("http://localhost:8080/login");
            setLoggedIn(false);
            
        }

        isLoggedIn();
    }, [])

    

    return (
        <>
            {loggedIn ? <h1>Actual App Component</h1> : <CheckingLogin></CheckingLogin> }
        </>
    )
}

export default App;