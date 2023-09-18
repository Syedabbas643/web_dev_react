import React, { useState } from "react"
import axios from "axios"
import { useNavigate} from "react-router-dom"
import './login.css';

const Login = () => {
    const history=useNavigate();
    const [code,setcode]=useState('')
    const [tel,settel]=useState('')
    const [codel,setcodel]=useState('')
    const [name,setname]=useState('')
    const [salary,setsalary] = useState(0);
    const [pfchecked, setpfchecked] = useState(1);
    

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

    async function submitl(e){
        e.preventDefault();
        if (tel.trim() === '' || codel.trim() === ''|| name.trim() === '') {
          alert('Please fill in all the required fields.');
          return;
        }

        try{

            await axios.post("/signup123",{
                tel,codel,name,salary,pfchecked
            })
            .then(res=>{
                if(res.data==="exist"){
                    alert("User already exists")
                }
                else if(res.data==="success"){
                  history("/Calender",{state:{id:codel}})
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
    const handleOptionChange = (option) => {
        setpfchecked(option);
      };


    return (
        <div className="rooter">

        <header className="header">
            <div className="header-content">
          <h1>&lt; GaMeR /&gt;</h1>
            </div>
        </header>

        <main className="login-container">
            <div className="login">
            <h1>Login</h1>
            <form action="POST">
                <input type="tel" onChange={(e) => { setcode(e.target.value) }} onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                      }
                  }} placeholder="Enter Your Code here"  />
                <input value="Login" type="submit" onClick={submit} />

            </form>
            </div>

            <p>Don't have an account, Sign up below</p>
            
            <div className="signup">
            <h1>Signup</h1>
            <form action="POST">
                <input
                    type="text"
                    onChange={(e) => { setname(e.target.value) }}
                    placeholder="Enter Your Name"
                    required
                />
                <br></br>
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
                <br></br>
                <input
                    type="tel"
                    pattern="[0-9]*"
                    onChange={(e) => { setcodel(e.target.value) }}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                      }
                  }}
                    placeholder="Enter Your Code here"
                    required
                />
                <br></br>
                <input
                    type="tel"
                    pattern="[0-9]*"
                    onChange={(e) => { setsalary(e.target.value) }}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                      }
                  }}
                    placeholder="Enter your salary (OPTIONAL)"
                    required
                />
                <br></br>
                <div className="checkboxes">
                    <label>Is PF is applicable :&gt;</label>
                    <label>
                        <input
                        type="checkbox"
                        checked={pfchecked === 1}
                        onChange={() => handleOptionChange(1)}
                        />
                        Yes
                    </label>
                    <label>
                        <input
                        type="checkbox"
                        checked={pfchecked === 0}
                        onChange={() => handleOptionChange(0)}
                        />
                        No
                    </label>
                </div>
                <input value="Sign up" type="submit" onClick={submitl} />
            </form>
            </div>
        </main>
        </div>  
        
    )
}

export default Login