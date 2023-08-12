import React, { useState } from "react"
import axios from "axios"
import { useNavigate} from "react-router-dom"
import Signup from './Signup';

const Login = () => {
    const history=useNavigate();
    const [code,setcode]=useState('')

    async function submit(e){
        e.preventDefault();
        if (code.trim() === '') {
            alert('Please fill in all the required fields.');
            return;
          }

        try{

            await axios.post("/login123",{
                code
            })
            .then(res=>{
                if(res.data==="success"){
                    history("/Calender",{state:{id:code}})
                }
                else if(res.data==="fail"){
                    alert("Passcode is WRONG")
                }
                else if(res.data==="notexist"){
                    alert("User have not sign up")
                }
            })
            .catch(e=>{
                alert("wrong details")
                console.log(e);
            })

        }
        catch(e){
            console.log(e);

        }

    }


    return (
        <div className="login">

            <h1>Login</h1>

            <form action="POST">
                <input type="tel" onChange={(e) => { setcode(e.target.value) }} onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                      }
                  }} placeholder="Enter Your Code here"  />
                <input type="submit" onClick={submit} />

            </form>

            <br />
            <p>OR</p>
            <br />
            <Signup />
        </div>
        
    )
}

export default Login