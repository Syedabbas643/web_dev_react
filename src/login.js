import React, { useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"

const Login = ({ setIsLoggedIn }) => {
    const history=useNavigate();

    const [tel,settel]=useState('')
    const [code,setcode]=useState('')

    async function submit(e){
        e.preventDefault();
        if (tel.trim() === '' || code.trim() === '') {
            alert('Please fill in all the required fields.');
            return;
          }

        try{

            await axios.post("http://localhost:8000/login",{
                tel,code
            })
            .then(res=>{
                if(res.data==="success"){
                    setIsLoggedIn(true);
                    history("/web_dev_react/app",{state:{id:tel}})
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
                <input type="tel" onChange={(e) => { settel(e.target.value) }} placeholder="Enter Your Phone number"  />
                <input type="tel" onChange={(e) => { setcode(e.target.value) }} placeholder="Enter Your Code here"  />
                <input type="submit" onClick={submit} />

            </form>

            <br />
            <p>OR</p>
            <br />

            <Link to="/web_dev_react/signup">Signup Page</Link>

        </div>
    )
}

export default Login