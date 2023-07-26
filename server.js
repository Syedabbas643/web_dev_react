const express = require("express")
//const collection = require("./mongo")
const fs = require("fs");
const cors = require("cors")
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

const USERS_FILE_PATH = "./users.json";
function readUsersFile() {
    try {
      const data = fs.readFileSync(USERS_FILE_PATH, "utf8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }
  
  function writeUsersFile(users) {
    fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2), "utf8");
  }


app.get("/",cors(),(req,res)=>{
    res.send("Use Main URL")

})

app.post("/login", (req, res) => {
    const { tel, code } = req.body;
    const users = readUsersFile();
    const user = users.find((user) => user.Passcode === code);
  
    if (!user) {
      res.json("notexist");
      return;
    }
  
    if (user.Passcode === code) {
      res.json("success");
    } else {
      res.json("fail");
    }
  });

app.post("/signup", (req, res) => {
    const { tel, code } = req.body;
    const users = readUsersFile();
    const user = users.find((user) => user.Passcode === code);
  
    if (user) {
      res.json("exist");
      return;
    }
  
    users.push({ Number:tel,Passcode:code });
    writeUsersFile(users);
  
    res.json("success");
  });

app.listen(8000,()=>{
    console.log("port connected");
})