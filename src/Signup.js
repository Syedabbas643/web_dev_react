import React, { useState } from "react"
import axios from "axios"
import { useNavigate} from "react-router-dom"

const Signup = () => {
  const history=useNavigate();

    const [tel,settel]=useState('')
    const [code,setcode]=useState('')
    const [name,setname]=useState('')
    const [salary,setsalary] = useState(0);

    async function submit(e){
        e.preventDefault();
        if (tel.trim() === '' || code.trim() === ''|| name.trim() === '') {
          alert('Please fill in all the required fields.');
          return;
        }

        try{

            await axios.post("/signup123",{
                tel,code,name,salary
            })
            .then(res=>{
                if(res.data==="exist"){
                    alert("User already exists")
                }
                else if(res.data==="success"){
                  history("/Calender",{state:{id:code}})
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
                    onChange={(e) => { setcode(e.target.value) }}
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
                <input type="submit" onClick={submit} />
          </form>
        </div>
  )
}

export default Signup