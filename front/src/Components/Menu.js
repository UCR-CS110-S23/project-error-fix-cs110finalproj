import react from "react";
import { Menu, Button ,Grid, Typography} from "@mui/material";
import Cookies from "js-cookie";

class  NavbarMenu extends react.Component{

    constructor(props){
        super(props);



    

        this.socket = props.socket
    }


logout=(event,data)=> {

    event.preventDefault();
    sessionStorage.removeItem('SID')
    sessionStorage.removeItem('userRecord')


    if(this.props.socket!== undefined)
    {
    this.props.socket.disconnect()
    }

     

             // TODO: write codes to login
             fetch(this.props.server_url+'/api/auth/logout', {
                 method: "POST",
                 mode: 'cors',   
                 headers: {
                     "Content-Type": "application/json",
                     "accept": "application/json",
                 }, 
                 body: JSON.stringify(data),
     
             }).then((res) => {
                Cookies.remove("session_token");
                window.location.reload();
 
             });
         }



    render(){
    

    return (
        
         (this.props.screen==="lobby" )  && (<form onSubmit={this.logout} ><div style={{ zIndex: 'tooltip',  right: "100px", color: `#000`, position: 'absolute' , mt:-10}} >Welcome, <Button variant="text" onClick={()=>this.props.changeScreen('profile')}>{JSON.parse(sessionStorage.getItem('SID')).username}</Button><Button variant="text" type="submit"   >Logout</Button></div></form>)
         
          
    )
    }

 
}

export default NavbarMenu;

