const express = require("express")
const fs = require("fs");
const cors = require("cors")
const path = require("path")
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://dbgamer:6379203969@cluster0.ymxu8f9.mongodb.net/?retryWrites=true&w=majority";

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(express.static(path.join(__dirname,"build")))

async function run() {
  try {
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    await client.connect();

    app.get("/", async (req,res) =>{
      res.sendFile(path.join(__dirname,"build","index.html"))
    })

    app.get("/get123", async (req, res) => {
      // MongoDB operations inside the route handler
      const { code } = req.query;
      const usersCollection = client.db("dbgamer").collection("users");
      const user = await usersCollection.findOne({ Passcode: code });

      if (!user) {
        res.json("notexist");
        return;
      }
      res.json(user);
    });

    app.post("/login123", async (req, res) => {
      // MongoDB operations inside the route handler
      const { code } = req.body;
      const usersCollection = client.db("dbgamer").collection("users");
      const user = await usersCollection.findOne({ Passcode: code });

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

    app.post("/savetask123", async (req, res) => {
      // MongoDB operations inside the route handler
      const { items , code } = req.body;
      const usersCollection = client.db("dbgamer").collection("users");
      
      const result = await usersCollection.updateOne(
        { Passcode: code }, // Filter the document based on its ID
        { $set: { items: items } } // Update the "name" field with the new value
      );
      if (result.matchedCount === 1) {
        res.json("success");
      } else {
        res.status(404).json("fail");
      }
    });

    app.post("/savedateOT", async (req, res) => {
      // MongoDB operations inside the route handler
      const { date,inputValue,code } = req.body;
      const usersCollection = client.db("dbgamer").collection("users");

      const existingUser = await usersCollection.findOne({
        Passcode: code,
        "dates.date": date,
      });

      if (inputValue > 0){


        if (existingUser) {
          // If the date exists, update only the hours property
          const result = await usersCollection.updateOne(
            { Passcode: code, "dates.date": date },
            { $set: { "dates.$.Hours": inputValue } }
          );
      
          if (result.matchedCount === 1) {
            res.json("success");
          } else {
            res.status(404).json("fail");
          }
        }else{
          const result = await usersCollection.updateOne(
            { Passcode: code }, // Filter the document based on its ID
            { $push: { dates: {date: date,Hours:inputValue} } } // Update the "name" field with the new value
          );
          if (result.matchedCount === 1) {
            res.json("success");
          } else {
            res.status(404).json("fail");
          }
        }


      }else if (inputValue === 0 ){

        if (existingUser) {
          const result = await usersCollection.updateOne(
            { Passcode: code},
            { $pull: { dates :{date: date }} }
          );
      
          if (result.matchedCount === 1) {  
            res.json("success");
          } else {
            res.status(404).json("fail");
          }
        }

      }

    });
  

    // FOR LEAVE DATES

    app.post("/savedateLeave", async (req, res) => {
      
      const { date,inputValue,code } = req.body;
      const usersCollection = client.db("dbgamer").collection("users");

      const existingUser = await usersCollection.findOne({
        Passcode: code,
        "leave.date": date,
      });

      if (inputValue > 0){


        if (existingUser) {
          // If the date exists, update only the hours property
          const result = await usersCollection.updateOne(
            { Passcode: code, "leave.date": date },
            { $set: { "leave.$.Hours": inputValue } }
          );
      
          if (result.matchedCount === 1) {
            res.json("success");
          } else {
            res.status(404).json("fail");
          }
        }else{
          const result = await usersCollection.updateOne(
            { Passcode: code }, // Filter the document based on its ID
            { $push: { leave: {date: date,Hours:inputValue} } } // Update the "name" field with the new value
          );
          if (result.matchedCount === 1) {
            res.json("success");
          } else {
            res.status(404).json("fail");
          }
        }


      }else if (inputValue === 0 ){


        if (existingUser) {
          const result = await usersCollection.updateOne(
            { Passcode: code},
            { $pull: { leave :{date: date }} }
          );
      
          if (result.matchedCount === 1) {  
            res.json("success");
          } else {
            res.status(404).json("fail");
          }
        }

      }

      
    });

    app.post("/signup123", async (req, res) => {
      // MongoDB operations inside the route handler
      const { tel, code, name, salary } = req.body;
      const usersCollection = client.db("dbgamer").collection("users");
      const user = await usersCollection.findOne({ Passcode: code });

      if (user) {
        res.json("exist");
        return;
      }

      await usersCollection.insertOne({ Name:name, Number: tel, Passcode: code, salary:salary ,dates :[],leave:[],permissions:[] ,items:[
        {id:1,item:""}
      ,{id:2,item:""}
      ,{id:3,item:""}
      ,{id:4,item:""}
      ,{id:5,item:""}] });

      res.json("success");
    });

    app.listen(8000, () => {
      console.log("Server is running on port 8000");
    });

    console.log("Connected to MongoDB and started the server.");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

run().catch(console.dir);