import react from "react";
import { Button, FormControl, FormLabel, Input, InputLabel,FormHelperText , Typography, Grid, Table, TableHead, TableCell, TableRow, TableBody , Autocomplete, TextField } from "@mui/material";


class Lobby extends react.Component{
    constructor(props){
        super(props);
        this.state = {
            screen: undefined,
            rooms:[],
            userRooms:[],
            allRooms:[], 
            searchSelected:{name:"", id:""}
            
        }
    
    }


    deleteRoom=(e)=>{
        e.preventDefault();
        const data = Array.from(document.getElementById("deleteRoomForm").elements)
        .filter((input) => input.name)
        .reduce(
            (obj, input) => Object.assign(obj, { [input.name]: input.value }),
            {}
        );

        

      
        fetch( this.props.server_url+'/api/rooms/leave', {
            method: "POST",
            mode: 'cors',
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "accept": "application/json",
            },
            body: JSON.stringify(data)
        }).then((res) => {
            if(res.status===200)
            {
                alert("room deleted successfully")
                window.location.href="/";
            }
            else
            {
                alert("error: couldn't delete room")
            }
           
        });

    }





    createRoom=(e)=>{
       e.preventDefault();
       if(document.getElementById("chatRoomName").value.trim()==="")
       {
            alert("Enter room name!")
       }
       else
       {

            const data = Array.from(document.getElementById("createRoomForm").elements)
            .filter((input) => input.name)
            .reduce(
                (obj, input) => Object.assign(obj, { [input.name]: input.value }),
                {}
            );


            fetch( this.props.server_url+'/api/rooms/create', {
                method: "POST",
                mode: 'cors',
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "accept": "application/json",
                }, 
                body: JSON.stringify(data),

            }).then((res) => {

                let roomTemp = this.state.rooms;

                    res.json().then((data)=>{

                        // this just use the the array of rooms
                        if(data.msg ==="success")
                        {
                            document.getElementById("chatRoomName").value=""
                            if(data.roomName)
                            {
                                alert(data.roomName+" has been added")
                            }
                            this.getUserRooms()
                            this.setState({rooms:data.rooms})
                        }
                        else
                        {
                            alert(data.msg)
                        // this.setState({rooms:roomTemp})
                        }

                
                    })
            });
       }

    }

    getAllRooms=async()=>{
        let url = this.props.server_url+'/api/rooms/getAll'
        
            fetch( url, {
                method: "GET",
                mode: 'cors',
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "accept": "application/json",
                },
            }).then((res) => {
        
                    res.json().then((data)=>{

                        console.log("all rooms", data.rooms)

                        this.setState({allRooms:data.rooms})

    
                
                    })
           

        })
    }

    getUserRooms=async()=>{
        console.log("session_id" ,sessionStorage.getItem('SID'))
        let url = this.props.server_url+'/api/rooms/all/'+JSON.parse(sessionStorage.getItem('SID'))._id
        
            fetch( url, {
                method: "GET",
                mode: 'cors',
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "accept": "application/json",
                },
            }).then((res) => {
        
                    res.json().then((data)=>{
      
                        // this just use the the array of rooms

                        console.log("activerooms", data.rooms, "all rooms", data.allRooms)
                        this.setState({rooms:data.rooms, allRooms: data.allRooms, userRooms: data.userRooms.rooms})

    
                
                    })
           

        })
    }

    getRoom=(e)=>{

        e.preventDefault();
        if(document.getElementById("search").value.trim()==="")
        {
             alert("Enter room name!")
        }
        else
        {
 
            //  const data = Array.from(document.getElementById("searchF").elements)
            //  .filter((input) => input.name)
            //  .reduce(
            //      (obj, input) => Object.assign(obj, { [input.name]: input.value }),
            //      {}
            //  );
 
 
             fetch( this.props.server_url+'/api/rooms/searchForm', {
                 method: "POST",
                 mode: 'cors',
                 credentials: "include",
                 headers: {
                     "Content-Type": "application/json",
                     "accept": "application/json",
                 }, 
                 body: JSON.stringify({search: document.getElementById('search').value}),


             }).then((res) => {
 
 
                     res.json().then((data)=>{
                        console.log( "kkkkkkk",data.roomE)

                        this.setState({searchSelected: data.roomE})

                     })

        })


    }

}

    async componentDidMount(){
        // TODO: write codes to fetch all rooms from server

     
     this.getUserRooms()


    }
         
    


    render(){
        //let fields = ['name'];
        let create = <form id="createRoomForm" onSubmit={this.createRoom} method="post" >
                    <input type="hidden" name="userID" id="userID" value={JSON.parse(sessionStorage.getItem('SID'))._id}/>
                        <InputLabel htmlFor="my-input" >Room Name</InputLabel>
                        <Input name="chatRoomName" id="chatRoomName" aria-describedby="my-helper-text"  />
                        <FormHelperText id="my-helper-text">Chat room name Must be unique</FormHelperText>
                        <Button variant="contained" type="submit"  >Create Room</Button>
                    </form>
        return(
            <div style={{margin: '100px'}}>
                <h1 style={{color: "#525252" }}>Lobby</h1>
               

                {/* write codes to join a new room using room id*/}
                <Grid
                justify="space-between" // Add it here :)
                container 
                spacing={20}
              >
                <Grid item xs={4}>
                  <Typography variant="h6" color="inherit">
                   Create Chat Room
                  </Typography>
                  {create}
                </Grid>
          
                <Grid item item xs={4}>
                <Typography variant="h6" color="inherit">
               Your active rooms
                </Typography>
             


                <Table >
                    <TableBody>
              {this.state.rooms.length>0 ? this.state.rooms.map((room) => {
                return (
                    <TableRow key={"TblR"+room.name}>
                        <TableCell key={"TblC"+room.name} style={{ color: "black" }}>{room.name}</TableCell>
                        <TableCell key={"TblCb"+room.name} >
                            <Button  key={"roomKeyTBL"+room.name} onClick={()=>this.props.roomSelect(room.name, JSON.parse(sessionStorage.getItem('SID')).username, room._id )} variant="outlined" >Join</Button></TableCell>
                            <TableCell key={"TblCbdel"+room.name} >
                            {this.state.userRooms.indexOf(room._id)!==-1&&<form method="post" id="deleteRoomForm" onSubmit={this.deleteRoom}><input type="hidden" name="roomID" value={room._id} /><input type="hidden" name="userID" value={JSON.parse(sessionStorage.getItem('SID'))._id} /><Button variant="outlined" type="submit" color="error" >Delete</Button></form>}
                            
                        </TableCell>
                    </TableRow>)}) : (<TableRow key={"TblR"}><TableCell>{'loading...'}</TableCell></TableRow>) }
                    </TableBody>
              </Table>
              </Grid>

              <Grid item item xs={4}>
              <Typography variant="h6" color="inherit">
              Search rooms
               </Typography>


            
            <form method="post" id="searchF" onSubmit={this.getRoom}>

               <Autocomplete  
               id="search" name="search" defaultValue={this.state.searchSelected.name} 
               freeSolo
               options={this.state.allRooms.map((option)=>option.name)} 
               getOptionDisabled={(option) =>{ this.state.allRooms.map((option)=>option.name).some((selectedOption) => selectedOption === option)}}    renderInput={(params) => <TextField {...params} label="Lookup Rooms"  />}/>    
             
             <Button variant={"outlined"}  type="submit" style={{marginTop:"5px"}} >Search</Button></form>

            {this.state.searchSelected.name!==""&& this.state.searchSelected.name!=="Not found"  && <Table >
            <TableBody>

            <TableRow key={"TblRS"+this.state.searchSelected.name}>
                <TableCell key={"TblCS"+this.state.searchSelected.name} style={{ color: "black" }}>{this.state.searchSelected.name}</TableCell>
                <TableCell key={"TblCbS"+this.state.searchSelected.name} >
                    <Button  key={"roomKeyTBLS"+this.state.searchSelected.name} onClick={()=>this.props.roomSelect(this.state.searchSelected.name, JSON.parse(sessionStorage.getItem('SID')).username, this.state.searchSelected._id )} variant="outlined" >Join</Button></TableCell>
                    <TableCell key={"TblCbdelS"+this.state.searchSelected.name} >
                    {this.state.userRooms.indexOf(this.state.searchSelected._id)!==-1&&<form method="post" id="deleteRoomForm" onSubmit={this.deleteRoom}><input type="hidden" name="roomID" value={this.state.searchSelected._id} /><input type="hidden" name="userID" value={JSON.parse(sessionStorage.getItem('SID'))._id} /><Button variant="outlined" type="submit" color="error" >Delete</Button></form>}
                    
                </TableCell>
            </TableRow>
            </TableBody>
      </Table> }

            {this.state.searchSelected.name==="Not found" && <Table >
            <TableBody>

            <TableRow><TableCell></TableCell><TableCell style={{color:"#ff0000"}}>Room not found</TableCell></TableRow></TableBody></Table>}


              </Grid>




              </Grid>


                
            </div>
        );
    }
}

export default Lobby;

//onChange={(_, value) => {this.setState({searchSelected:value}) }}