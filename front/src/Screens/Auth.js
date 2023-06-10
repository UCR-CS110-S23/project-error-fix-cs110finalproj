import react from "react";
import Form from "../Components/form.js";
import { Button, Grid } from "@mui/material";
import zIndex from "@mui/material/styles/zIndex.js";

class Auth extends react.Component{
    constructor(props){
        super(props);
        this.state = {
            showForm: false,
            selectedForm: undefined,
            
        }
    }

    closeForm = () => {
        this.setState({showForm: false});
    }

    login = (data) => {

        // TODO: write codes to login
        fetch(this.props.server_url+'/api/auth/login', {
            method: "POST",
            mode: 'cors',
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "accept": "application/json",
            }, 
            body: JSON.stringify(data),

        }).then((res) => {
            res.json().then((data) => {
                if (data.msg == "Logged in"){
                    sessionStorage.setItem("SID", JSON.stringify(data.user));
                    console.log(JSON.parse(sessionStorage.getItem('SID')))
                    sessionStorage.setItem('userRecord', JSON.stringify(data.user))


                    //this.setState({screen: "lobby"});
                    this.props.changeScreen('lobby')
                }
                else{
                    alert(data.msg)
                    this.setState({screen: "auth"});
                }
            });
        });
    }

    register = (data) => {
        // TODO: write codes to register
        fetch(this.props.server_url +'/api/auth/register', {
            method: "POST",
            mode: 'cors',
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "accept": "application/json",
            }, 
            body: JSON.stringify(data),

        }).then((res) => {
            res.json().then((data) => {
           
                if(data.username){
                    alert(data.username+" Has been registered, login using credentials");
                    
                    this.setState({showForm: true, selectedForm: 'login'});
                }
                else
                {
                    alert(data.msg)
                }
            });
        });
    }

    render(){
        let display = null;
        if (this.state.showForm){
            let fields = [];
            if (this.state.selectedForm == "login"){
                fields = ['username', 'password'];
                display = <Form  fields={fields} close={this.closeForm}  type="login" submit={this.login} key={this.state.selectedForm} formId={"form-"+this.state.selectedForm}/>;
            }
            else if (this.state.selectedForm == "register"){
                fields = [ 'username', 'password', 'name', 'email'];
                display = <Form  fields={fields} close={this.closeForm} type="register" submit={this.register} formId={this.state.selectedForm}/>;
            }   
        }
        else{
            display = <div  style={{  position:"absolute" , zIndex:2000, right: "100px"}}>
                <Button onClick={() => this.setState({showForm: true, selectedForm:"login"})} style={{ color: `#000`}}> Login </Button>
                <Button onClick={() => this.setState({showForm: true, selectedForm: "register"})} style={{ color: `#000`}}> Register </Button>
                </div>              ;
        }
        return(
            <div key={'welcome-div'} >
          
                {display}

        
            </div>
        );
    }
}

export default Auth;