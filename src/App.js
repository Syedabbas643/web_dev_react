import {useState} from 'react';

function App() {

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

  function deletefun(id){
      console.log(id)
      const tempdel = items.map((x)=>(x.id === id) ?{...x,item:""} :x)
      setitems(tempdel)
  }

  return (
    <div className="App">
      <header>
      <h1>TO DO List By GaMeR</h1>
      </header>
      <main>
        <input type='text'id="input" value={task} onChange={handleChange} required></input>
        <button onClick={addtask}>ADD TASK</button>
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
