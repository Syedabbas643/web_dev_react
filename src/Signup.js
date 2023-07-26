import React, { useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"

const Signup = () => {
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

            await axios.post("http://localhost:8000/signup",{
                tel,code
            })
            .then(res=>{
                if(res.data==="exist"){
                    alert("User already exists")
                }
                else if(res.data==="success"){
                    history("/web_dev_react/app",{state:{id:tel}})
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
    <div className="signup">

          <h1>Signup</h1>

          <form action="POST">
                <input
                    type="tel"
                    pattern="[0-9]*"
                    onChange={(e) => { settel(e.target.value) }}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                      }
                  }}
                    placeholder="Enter Your Phone number"
                    required
                />
                <input
                    type="tel"
                    pattern="[0-9]*"
                    onChange={(e) => { setcode(e.target.value) }}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                      }
                  }}
                    placeholder="Enter Your Code here"
                    required
                />
                <input type="submit" onClick={submit} />
          </form>

            <br />
            <p>OR</p>
            <br />

            <Link to="/web_dev_react/">Login Page</Link>

        </div>
  )
}

export default Signup