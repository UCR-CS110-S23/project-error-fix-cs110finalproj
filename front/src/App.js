

import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import './App.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getDesignTokens } from './themes/theme';
import { IconButton,AppBar,Toolbar, Box , Typography, GlobalStyles} from '@mui/material';



import BedtimeIcon from '@mui/icons-material/Bedtime';
import LightModeIcon from '@mui/icons-material/LightMode';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { io } from 'socket.io-client';


import ScreenHandler from './ScreenHandler';

import Cookies from "js-cookie";

let reached = false;
let adjusting = 0;
let obj = undefined;
let screen=undefined;
//const socket = io( 'http://localhost:3001', {'transports': ['websocket', 'polling']});
//const socket = io(`http://${window.location.hostname}:3001`, {'transports': ['websocket', 'polling']});
let server_url = 'http://localhost:3001'
function App() {


                
        


  //var socket = io("http://localhost:3001");
  
  const [selectedScreen, setSelectedScreen] = React.useState(0);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = React.useState('light');

  React.useEffect( () => {
    let str = Cookies.get("session_token")
      
    
  
          if(str && str.indexOf("username")!==-1 && !sessionStorage.getItem('refreshed'))
          {
            screen='lobby'
             console.log("-----1")
             sessionStorage.setItem('refreshed',1)
                 
                  let obj= JSON.parse(str.substring(str.indexOf('{'), str.lastIndexOf('}') + 1))
                  sessionStorage.setItem('userRecord', JSON.stringify(obj))
                  sessionStorage.setItem("SID", JSON.stringify(obj));

                  console.log("id_user",JSON.parse(sessionStorage.getItem('userRecord'))._id)
                    fetch(server_url+'/api/auth/cookie', {
                      method: "POST",
                      mode: 'cors',
                      credentials: "include",
                      headers: {
                          "Content-Type": "application/json",
                          "accept": "application/json",
                      }, 
                      body: JSON.stringify(obj),
          
                  }).then((res) => {
                    window.location.href="/"

                      });
                 
  
          }
    if (localStorage.getItem('mode') !== null)
      setMode(localStorage.getItem('mode'));
    else
      setMode(prefersDarkMode ? 'dark' : 'light');
  }, [prefersDarkMode]);

  React.useEffect(() => {
    localStorage.setItem('mode', mode)
  }, [mode]);

  const colorMode = React.useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggleColorMode: () => {
        setMode((prevMode) =>
          prevMode === 'light' ? 'dark' : 'light',
        );
        // localStorage.setItem('mode', mode)
      },
    }),
    [],
  );

  // Update the theme only if the mode changes
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
  const ColorModeContext = React.createContext({
    toggleColorMode: () => {
      // This is intentional
    }
  });



  return (

    <ColorModeContext.Provider value={colorMode} key={'ColorModeContext.Provider-comp'}  >
      <ThemeProvider theme={theme} key={'ThemeProvider-comp'}>
       <AppBar  color='primary' style={{ zIndex: 5,  position: "absolute"}} >
       <Toolbar>
       <Box
           component="img"
           sx={{
           height: 75,
           }}
           alt="Chatting App"
           src={"logo.png"}
       />

   </Toolbar>
   
      </AppBar>
        <CssBaseline key={'CssBaseline-comp'}  />
        <ScreenHandler key={'screenHandler-comp'}  screen={screen} />
        <IconButton style={{ zIndex: 5, color: "black", position: "absolute", top: 10, right: 10 }} onClick={colorMode.toggleColorMode} aria-label="delete"  key={'IconButton -comp'}>
          {mode === 'light' ? <BedtimeIcon key={'BedtimeIcon-comp'} /> : <LightModeIcon  key={'LightModeIcon-comp'} />}
        </IconButton>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;




// import react from 'react';
// import { io } from 'socket.io-client';
// import logo from './logo.svg';
// import './App.css';

// import Init from './initialScreen.js';
// import Chat from './Chat.js';

// class App extends react.Component {
//   constructor(props){
//     super(props);
    
//     this.socket = io('http://localhost:3000');
//     this.state = {
//       username: '',
//       room: '',
//       screen: "init",
//     }
//   }

//   click = (room, message) => {
//     console.log(room);
//     this.socket.emit('join', {room: room, username: message});
//     this.setState({room: room, username: message, screen: "chat"});
//   }
  

//   render(){
//   return (
//     <div className="App">
//       {this.state.screen === "init" ? <Init click={this.click}></Init> : <Chat socket={this.socket}></Chat>}
//     </div>
//   );
//   }
// }

// export default App;