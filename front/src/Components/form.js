import react from "react";
import { Button, TextField,  capitalize, FormControl,InputLabel, Input , Grid, Typography} from "@mui/material";

class Form extends react.Component{
    constructor(props){
        super(props);
        // for each item in props.fields, create an item in this.state.fields
        let fields = [];
        for (let i = 0; i < props.fields.length; i++) {
            fields.push(["", props.fields[i]]);
        }
        this.state = {
            fields: fields,
        }
    }

    handleChange = (event, index) => {
        let fields = this.state.fields;
        fields[index][0] = event.target.value;
        this.setState({fields: fields});
    }

    validateEmail = (email) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      };

      isNumeric(str) {
        if (typeof str != "string") return false // we only process strings!  
        return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
               !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
      }

    handleSubmit = (el) =>(event)=> {
        
        let flag=true;
        
        event.preventDefault();
        let elements =el.props.fields;
        for (let i = 0; i <  elements.length; i++) {

            if(document.getElementById(elements[i]).value.trim() ==="")
            {
                alert("Enter your information")
                flag = false
                break
            }
            if(flag &&elements[i].indexOf("username")!==-1 && (document.getElementById(elements[i]).value.length<5 || this.isNumeric(document.getElementById(elements[i]).value.trim())) )
            {
                alert("username must be at least five Char and can't be a number")
                flag = false 
                break
            }

            if(flag &&elements[i].indexOf("email")!==-1 && !this.validateEmail(document.getElementById(elements[i]).value.trim()))
            {
                alert("Invalid email")
                flag = false 
                break
            }
            
            

        }
        
        if(flag)
        {
            let fields = this.state.fields;
            let data = {};
            for (let i = 0; i < fields.length; i++) {
            
                data[fields[i][1]] = fields[i][0];
            }
            this.props.submit(data);
        }


    }

    render(){
        return (
            
            <div key={this.props.formId+"div"} style={{width:"100%"}}>

            <Grid container spacing={0} direction="column" alignItems="center" justifyContent="center" sx={{ minHeight: '100vh' }} >
                <div>
                    <Button onClick={this.props.close}> x </Button>
                    <Typography variant="h4" > {capitalize(this.props.type)} </Typography>
                </div>

                

                <form onSubmit={this.handleSubmit(this)} key={this.props.formId+"div-form"}>
                    {this.state.fields.map((field, index) => {
                        return(
                            <div  key={"div-auth"+field[1]}>
                                <TextField margin='dense'
                                fullWidth
                                required
                                id="filled-required"                           
                                variant="outlined"
                         
                                    key={"auth"+field[1]} 
                                    label={field[1]} 
                                    onChange={(event) => this.handleChange(event, index)} 
                                    id={field[1]}
                                    type={field[1].indexOf('password')!==-1? 'password': ""}
                                />
                            </div>
                        );
                    })}
                    <Button type="submit" variant="outlined" margin='dense' >Submit</Button>
                </form>
            </Grid>
        </div>
        );
    }
}



export default Form;