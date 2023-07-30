import axios from 'axios';
import {useState,useEffect} from 'react';
import { useLocation} from "react-router-dom"

function App() {

  const location = useLocation()
  const code = location.state.id;

  const [userdata, setUserdata] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [items,setitems] = useState([
    {id:1,item:""}
  ,{id:2,item:""}
  ,{id:3,item:""}
  ,{id:4,item:""}
  ,{id:5,item:""}])

  const [task,settask] = useState("");

  const handleChange = (event) => {
    settask(event.target.value);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("https://colorful-pink-girdle.cyclic.app/get", {
          params: {
            code, // Passcode as a query parameter
          },
        });

        if (response.data === "notexist") {
          alert("Cannot get user data");
        } else {
          const tempjson = response.data
          setUserdata(tempjson);
          setitems(tempjson.items)
        }
      } catch (error) {
        alert("Cannot get");
        console.log(error);
      }finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [code]);

  function addtask() {

    let added = false; 
    const tempItems = items.map((x) => {
      if (!added && x.item.length < 1) {
        added = true; 
        return { ...x, item: task }; 
      }
      return x; 
    });
    setitems(tempItems)
    settask("")
  }

  async function savetask(){
    try{

        await axios.post("https://colorful-pink-girdle.cyclic.app/savetask",{
            items,code
        })
        .then(res=>{
            if(res.data==="fail"){
                alert("Cannot save to database")
            }
            else if(res.data==="success"){
              alert("Saved to DATABASE")
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

  function deletefun(id){
      console.log(id)
      const tempdel = items.map((x)=>(x.id === id) ?{...x,item:""} :x)
      setitems(tempdel)
  }

  if (loading) {
    return <div><h1>Loading...</h1></div>;
  }

  return (
    <div className="App">
      <header>
      <h1>TO DO List By {userdata.Name}</h1>
      </header>
      <main>
        <input type='text'id="input" value={task} onChange={handleChange} required></input>
        <br></br>
        <button onClick={addtask}>ADD TASK</button>
        <br></br>
        <button onClick={savetask}>SAVE TASK TO DATABASE</button>
        <br></br>
        <br></br>
        <ul>
          {items.filter((x)=>(x.item.length>1)).map((x)=>(
            <li key={x.id}>
              <label>{x.item}</label>
              <button onClick={()=>deletefun(x.id)}>del</button>
            </li>
          ))}
        </ul>
      </main>
      <footer>
        <h2>COPYRIGHT &copy; 2023</h2>
      </footer>
      
    </div>
  );
}

export default App;
