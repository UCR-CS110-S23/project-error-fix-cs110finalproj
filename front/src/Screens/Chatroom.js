import react from "react";
import { useState } from "react"
import { Button,  TextField,Input ,IconButton, Typography, Grid, List, ListItemAvatar,Box, ListItem, Paper, ListItemButton, Avatar, ListItemText} from "@mui/material";

import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import EditNoteIcon from '@mui/icons-material/EditNote';

// import { makeStyles} from "@material-ui/core"
import { io } from 'socket.io-client';

class Chatroom extends react.Component{


    constructor(props){
        super(props);

        this.state = {
            screen: this.props.screen,
            messages: [],
        }

        this.room = JSON.parse(sessionStorage.getItem('room')).roomName
        this.roomId = JSON.parse(sessionStorage.getItem('room')).roomId
        this.username = JSON.parse(sessionStorage.getItem('SID')).username
        this.socket= props.socket


        
    }


     emitGlobal=async()=>{
        await this.socket.emit("send_message", {msgId:-10, msg:"updateStates", room:this.room});
       

    }

    
 
   async componentDidMount() {

       

       this.socket.on('receiver', async(data)=> {
        console.log(data)
           if( data.msgId===-10)
           {
            this.history()
           }
           else
           {
            this.setState({messages: [...this.state.messages, data]})
           }
          
        
      })


      this.history()

    }

    history=async()=>{
        fetch( this.props.server_url+`/api/rooms/messages/${this.roomId}`, {
            method: "GET",
            mode: 'cors',
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "accept": "application/json",
            },
        }).then((res) => {
    
                res.json().then((data)=>{
                    //console.log(data)
                    let obj =[]
                    data.map((message)=>{
                        //console.log(message.message.text, message.username, this.getCurTime(new Date(message.updatedAt)))
    
                        obj.push({msg:message.message.text, msgId:message.message._id , username: message.username, photo:message.photo , msgTime:this.getCurTime(new Date(message.createdAt)) , msgId:message._id, likes: message.likes, dislikes: message.dislikes, likesSenders:message.likesSenders  , dislikeSenders: message.dislikeSenders , sender: message.sender })
                    
                    })

                    console.log("obj",obj)
                    this.setState({messages: obj})
            
                })
        });
    }



     reaction=(messageId, action, idBtn)=>{
        document.getElementById(idBtn).disabled = true

        console.log(this.props.server_url+`/api/rooms/`+action+`/messages`)

        fetch( this.props.server_url+`/api/rooms/`+action+`/messages`, {
        method: "POST",
        mode: 'cors',
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
        },
        body:JSON.stringify({'messageId':messageId, 'userId': JSON.parse(sessionStorage.getItem('userRecord'))._id })
    }).then((res) => {

            res.json().then((data)=>{
                console.log("reaction status code", data.msg)
                if(data.msg===200)
                {
                   
                    this.emitGlobal()
                }
        
            })
    });

    }

    editMsg=(e)=>{
        e.preventDefault();

        document.getElementById("edit"+e.target.editmsgId.value).style.display='none'

        if(e.target.newTxt.value.trim()!=="")
        {
            const data = Array.from(document.getElementById("editmsgForm_"+ e.target.editmsgId.value).elements)
            .filter((input) => input.name)
            .reduce(
                (obj, input) => Object.assign(obj, { [input.name]: input.value }),
                {}
            );


            fetch( this.props.server_url+`/api/rooms/edit/messages`, {
            method: "POST",
            mode: 'cors',
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "accept": "application/json",
            }, 
            body: JSON.stringify(data),
        }).then((res) => {
    
                res.json().then((data)=>{
                    if(data.msg===200)
                    {
                       
                        this.emitGlobal()
                    }
            
                })
        });

        }

    }

    sendMessage=async (e)=>{
        e.preventDefault();
        let message = e.target.elements.chatMsg.value.trim()

        if(message!=='')
        {
            await this.socket.emit("send_message", { username: this.username, userId: JSON.parse(sessionStorage.getItem('SID'))._id, photo:   JSON.parse(sessionStorage.getItem('userRecord')).photo, msg: document.getElementById('chatMsg').value , room: this.room, roomId:this.roomId  , msgTime: this.getCurTime(new Date()) , msgId:-1 , likes: 0, dislikes:0});


            e.target.elements.chatMsg.value=''

        }

    }

    toggleThis=(msgId)=>{
      
            if(document.getElementById("edit"+msgId).style.display==='none')
            {
                document.getElementById("edit"+msgId).style.display='inline'
            }
            else
            {
                document.getElementById("edit"+msgId).style.display='none'
            }
        

    }


getCurTime=(date)=>{

  
     return date.getHours()+ ':' + date.getMinutes()
      
}

    render(){

        let photo = `user.png`

   
        return(
            <div   >
                <Grid container sx={{backgroundColor: "#fff"}}  >
                <Grid item xs={3} ></Grid>
                <Grid item xs={6}  sx={{ backgroundColor:'#f5f5f5', marginTop:"65px" , height:593 }}>
     
                    <Paper sx={{maxHeight: 590, overflow: 'auto', boxShadow: "none", }}>
                    <List  sx={{ width: '100%',  backgroundColor: "none"  }}>
                    
                   
                        {/* show chats */}
                    
                        {this.state.messages.map((message,index)=> 
                            <span key={"id_"+message.msgId} ><ListItem  key={index} disablePadding     > 
                            <ListItemButton xs={{fontSize:"9px"}} ><ListItemAvatar ><Avatar alt={`Avatar ${message.username}`} src={message.photo===""? photo: this.props.server_url+"/files/"+message.photo
                        } 
                          /></ListItemAvatar><ListItemText disableTypography  primary={<Typography variant="body2" component={'span'}><Box fontWeight='fontWeightMedium' >{message.username} </Box><Box sx={{fontSize:10}} >{message.msgTime}</Box><Box>{message.msg}</Box></Typography>}   />

                          {(message.sender===JSON.parse(sessionStorage.getItem('userRecord'))._id || message.userId === JSON.parse(sessionStorage.getItem('userRecord'))._id) && <IconButton onClick={()=>{this.toggleThis(message.msgId)}}><EditNoteIcon /></IconButton>}


                          <Box sx={{fontSize:10}} >{message.likes!==0 ? message.likes : ""}</Box>

                          <IconButton id={message._id+"likes"} edge="end" sx={{fontSize:10, marginRight:1}} disabled={message.likesSenders.length>0 && message.likesSenders.map((sender)=>{ return sender===JSON.parse(sessionStorage.getItem('userRecord'))._id})} aria-label="" onClick={()=>{  this.reaction(message.msgId, "up", message._id+"likes")
                        }}><ThumbUpIcon /></IconButton>


                          <IconButton  id={message._id+"dislikes"} edge="end" aria-label="" onClick={()=>{this.reaction(message.msgId, "down", message._id+"dislikes")}}  disabled={message.dislikeSenders.length>0 && message.dislikeSenders.map((sender)=>{ return sender===JSON.parse(sessionStorage.getItem('userRecord'))._id})} ><ThumbDownIcon /></IconButton>
                          
                          
                          <Box sx={{fontSize:10, marginLeft:1}} >{message.dislikes!==0 ? message.dislikes : ""}</Box></ListItemButton></ListItem> <ListItem  id={"edit"+message.msgId} style={{display:"none"}} ><form method="post" onSubmit={this.editMsg} id={"editmsgForm_"+message.msgId} ><input type="hidden" name="editmsgId" value={message.msgId} /><TextField  defaultValue={message.msg} name="newTxt"  style= {{width: "570px", marginLeft:7}}/><Button variant="contained" style= {{height:"54px",marginLeft:"7px"}} type="submit">Update </Button></form></ListItem></span>)}
                        
                        </List>
                        </Paper>
                  
                </Grid>
                <Grid item xs={3} ></Grid>
                </Grid>
               

                {/* show chat input box*/}

                
                <div style={{ width: '100%', position: 'fixed', bottom: 0 , 'textAlign': 'center'}}>
                <form onSubmit={this.sendMessage} method="post" id="senMsgForm">  
                <Grid container>

                    <Grid item xs={3} ></Grid>
                    <Grid item xs={4} >
                        <input type="hidden" name="room" value={this.room}/>
                        <input type="hidden" name="userID" id="userID" value={JSON.parse(sessionStorage.getItem('SID'))._id}/>
                        <TextField   name="chatMsg" id="chatMsg" variant="outlined" fullWidth/>
                    </Grid>
                    <Grid item xs={1} >
                        <Button variant="outlined" type="submit" fullWidth style={{height:'57px'}} >Send</Button>
                    </Grid>
                    <Grid item xs={1} ><Button onClick={()=>this.props.goBack()} fullWidth variant="outlined"  style={{height:'57px'}} > Back to rooms </Button></Grid>
                    <Grid item xs={3} ></Grid>
                  

                </Grid>
               
               </form>
               </div>
            </div>
        );
    }
}

export default Chatroom;