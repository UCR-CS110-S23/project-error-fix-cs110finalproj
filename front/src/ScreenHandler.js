import react from "react";
import Auth from './Screens/Auth.js';
import Lobby from "./Screens/Lobby.js";
import Chatroom from "./Screens/Chatroom.js";
import { Button, Grid } from "@mui/material";
import NavbarMenu from "./Components/Menu.js"
import { io } from 'socket.io-client';

import Profile from "./Screens/Profile.js";
import axios from 'axios';



const server_url = "http://localhost:3001";


class ScreenHandler extends react.Component{

    componentDidUpdate(prevProps, prevState) { 
        if(sessionStorage.getItem('SID'))
        {
           // console.log("here")
            this.socket = io( 'http://localhost:3001', {'transports': ['websocket', 'polling']});
           
            
        }
      }

    constructor(props){
        super(props);
     

        this.state = {
            screen: props.screen,
            user:{},
            selectedFile:'',
            msg:''
         
           
         
        }

        if( sessionStorage.getItem('SID') )
        {
            this.socket = io( 'http://localhost:3001', {'transports': ['websocket', 'polling']});
        }

     
       // this.shouldLoad()



    }



    validateEmail = (email) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      };

    shouldLoad(){

        if( sessionStorage.getItem('SID') )
        {
            
            fetch( server_url+'/api/auth/user/'+JSON.parse(sessionStorage.getItem('SID'))._id, {
                method: "GET",
                mode: 'cors',
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "accept": "application/json",
                },
            }).then((res) => {
        
                    res.json().then((data)=>{
                       console.log("user data",data)

                       sessionStorage.setItem('userRecord', JSON.stringify(data.user))
                       
                       this.setState({user:JSON.parse(sessionStorage.getItem('userRecord'))});
                       



    
                
                    })
            });
        }
       
    }

    async componentDidMount(){
        // checking if the user has active session
        // if yes, then show lobby. if no, then show auth
   
        //this.shouldLoad()

        if(sessionStorage.getItem('SID') )
        {
           // console.log("here")
            this.socket = io( 'http://localhost:3001', {'transports': ['websocket', 'polling']});


            
        }


        //this.shouldLoad();



        if(!sessionStorage.getItem('SID'))
        {
                fetch(this.server_url, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    }

                
                }).then((res) => {
              
                    
                    res.text().then((data) => {
                        //alert(data.message)
                        if (data.message == "Logged in"){
                          
                            this.setState({screen: "lobby"});

                        }
                        else{
                            this.setState({screen: "auth"});
                        }
                    });
                });
        }
        else
        {

           
            if(sessionStorage.getItem("screen"))
            {
               
                this.setState({screen: sessionStorage.getItem("screen")}); 
            }
            else
            {
                this.setState({screen: 'lobby'});
            }
        }

        
    }

    changeScreen = (screen) => {
        sessionStorage.setItem("screen",screen)
        this.setState({screen: screen});
    }
    goBack = ()=>{


        sessionStorage.setItem("screen","lobby")

       // this.setState({screen: "lobby"})
       window.location.href="/"
      
      }


      roomSelect = (room, username,roomID) => {
        
        this.changeScreen("chatroom")
        sessionStorage.setItem("room", JSON.stringify({"roomName":room, "roomId": roomID}));
        sessionStorage.setItem('socketId',this.socket.id)
       this.socket.emit("join", {"room":room, "username":username});
       sessionStorage.setItem("screen", "chatroom");

       
       
      }

      changeValue=(event, value)=>{
        event.target.value = value

      }
    
      updateProfile=(e)=>{
        e.preventDefault()

        
        if(!this.validateEmail(document.getElementById("email").value.trim()))
        {
            alert("Invalid email")
        }
        else
        {


        

        const data = Array.from(document.getElementById("userForm").elements)
        .filter((input) => input.name)
        .reduce(
            (obj, input) => Object.assign(obj, { [input.name]: input.value }),
            {}
        );

        //console.log("my data",data)

        fetch(server_url+'/api/auth/UpdateUser/'+JSON.parse(sessionStorage.getItem('SID'))._id, {
            method: "POST",
            mode: 'cors',
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "accept": "application/json",
            }, 
            body: JSON.stringify(data)

        
        }).then((res) => {
      
            
            res.json().then((data) => {
                //alert(data.message)
                if (data.message === "updated"){
                  
                    sessionStorage.setItem('userRecord', JSON.stringify(data.user))
                    console.log("NEW VAL",JSON.parse(sessionStorage.getItem('userRecord')))

                    this.setState({user: "auth", msg: "Profile updated"});
                    //this.state.user=data.user

                }
                else
                {
                    console.log(data)
                }

            });
        });

    }

      }

      onFileChange = event => {

    
 
  
        
        this.setState({
            selectedFile: event.target.files[0]
        }, () => {

           // console.log()
           document.getElementById("upload").dispatchEvent(new Event("submit"))
            document.getElementById("upload").onsubmit= this.updateProfileImg
            document.getElementById("upload").requestSubmit()


            

        });
 
    };


      updateProfileImg=(e)=>{
       // alert("here")

        e.preventDefault()

               // Create an object of formData
               const formData = new FormData();
 
               // Update the formData object
               formData.append('file', this.state.selectedFile, this.state.selectedFile.name);


        
               // Details of the uploaded file
        
               // Request made to the backend api
               // Send formData object
               axios.post(server_url+'/api/auth/UpdatePhoto/'+JSON.parse(sessionStorage.getItem('SID'))._id, formData,  {headers: {
                'Content-Type': 'multipart/form-data'
              }}).then((response) => {

                
                    console.log(response.data.user)

                    sessionStorage.setItem('userRecord', JSON.stringify(response.data.user))
                    this.setState({user: response.data.user })


              })
              .catch((err) => console.log(err));;

    }

    render(){
     
        if(sessionStorage.getItem('userRecord') &&   this.state.screen=== undefined)
        {
            this.state.screen = 'lobby'
        }
        
        let display = "loading...";
        if (this.state.screen === "auth"){
            display = <Auth server_url = {server_url} changeScreen={this.changeScreen}/>;
        }
        else if (this.state.screen === "lobby"){
            display = <Lobby server_url = {server_url} screen={this.screen} roomSelect={this.roomSelect}  />;
        }
        else if (this.state.screen === "chatroom"){
            display = <Chatroom server_url = {server_url} screen={this.state.screen} socket={this.socket} goBack={this.goBack}    />;
        }

        else if (this.state.screen === "profile"){
            
            display = <Profile server_url = {server_url} updateProfile={this.updateProfile} user={JSON.parse(sessionStorage.getItem('userRecord'))}  socket={this.socket} change={this.changeValue} updateProfileImg={this.updateProfileImg} onFileChange={this.onFileChange} goBack={this.goBack} msg={this.state.msg}  />;
        }
        return(
            <div  key={'screenHandler-comp-div'}>
            <NavbarMenu server_url={server_url} screen={this.state.screen} changeScreen={this.changeScreen} socket={this.socket} />
        
                {display}
         
            </div>
        );
    }
}

export default ScreenHandler;
