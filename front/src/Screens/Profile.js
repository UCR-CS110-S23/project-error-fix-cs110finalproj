import react from "react";
import { Button, FormControl, FormLabel, Input, InputLabel,FormHelperText , Typography, Grid, Table, TableHead, TableCell, TableRow, TableBody, TextField , Avatar, Box } from "@mui/material";




class Profile extends react.Component{



    constructor(props){
        super(props);
        this.state = {
            user: sessionStorage.getItem('userRecord'),
            selectedFile: '',
            value: '',
        }

      console.log("hey",props.user)
    
    }


    


    componentDidMount(){
        // TODO: write codes to fetch all rooms from server
    
    }


    triggerFile=()=>{
        document.getElementById("file").click()

    }





    render(){
        //let fields = ['name'];


  
        return(
            <div style={{margin: '100px'}}>
                <h1 style={{color: "#000" }}>Profile</h1>
                {this.props.msg!=="" && <Grid xs={12} item sx={{textAlign:"center"}}><Box style={{color:"#ff0000"}}>Information Saved</Box></Grid>}

                {/* write codes to join a new room using room id*/}
              
                <Grid
                justify="space-between" // Add it here :)
                container 
                direction="row" spacing={5}
              >

                <Grid xs={4} item sx={{textAlign:"center"}}>
                <Avatar alt="profile image" id="avtar"  src={(sessionStorage.getItem("userRecord") && JSON.parse(sessionStorage.getItem("userRecord")).photo !=="" ? this.props.server_url+"/files/"+JSON.parse(sessionStorage.getItem("userRecord")).photo : "user.png")} sx={{ width: 130, height: "auto" , margin:"auto" }}
                        />
                        <form method="post" id="upload" onSubmit={this.updateProfile}>
                        <input type="file" name="file" id="file" onChange={this.props.onFileChange}   style={{visibility: "hidden"}}/> </form>  
                      
                      <Button variant="outlined" type="button" onClick={this.triggerFile} >Update profile picture</Button>
                </Grid>
                <Grid xs={4}  item sx={{fontCColor:"#000"}}>
                    <form method="post" id="userForm" onSubmit={this.props.updateProfile} >
                 
                  <input type="hidden" name="userID" id="userID" value={JSON.parse(sessionStorage.getItem('SID'))._id}/>
                  
                  <InputLabel htmlFor="my-input" sx={{marginTop:1}} >Username: {JSON.parse(sessionStorage.getItem('SID')).username}</InputLabel>
                  
                  <InputLabel htmlFor="my-input" sx={{marginTop:1}} >Name</InputLabel>
                  <TextField  sx={{marginTop:1}}
                  required
                  id="filled-required"
                  label="Required"
               
                  variant="filled"

                  fullWidth

                  InputLabelProps={{
                    shrink: true,
                  }}

                  name="name" defaultValue={this.props.user.name}    onChange={this.props.changeValue}
                />

                <InputLabel htmlFor="my-input" sx={{marginTop:1}} >Change Password</InputLabel>
                <TextField sx={{marginTop:1}}

                type="password"
                variant="filled"
                name="password"

                fullWidth
              />

              <InputLabel htmlFor="my-input" sx={{marginTop:1}} >Email </InputLabel>
              <TextField sx={{marginTop:1}}
              required
              id="email"
              label="Required"
        
              variant="filled"

              name="email"
          

              fullWidth

              InputLabelProps={{
                shrink: true,
              }}


              defaultValue={this.props.user.email}    onChange={this.props.changeValue}
            />
              

                      <Button variant="outlined" type="submit" sx={{marginTop:1}} >Update</Button>

                      <Button variant="outlined"  onClick={this.props.goBack} sx={{marginTop:1, marginLeft:1}} >Back</Button>
                      </form>
              
                </Grid>
                 <Grid xs={4} item></Grid>
               
              </Grid>
              

                
            </div>
        );
    }
}

export default Profile;