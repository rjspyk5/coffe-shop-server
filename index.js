const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());

// connect database

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.omgilvs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    const coffeCollection = client
      .db("CoffeShop")
      .collection("coffeCollection");
    const userCollection = client
      .db("coffeUserDb")
      .collection("userCollection");
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    // put data on userCollection
    app.post("/users", async (req, res) => {
      const data = req.body;
      const result = await userCollection.insertOne(data);
      res.send(result);
    });
    // get data on userCollection
    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // get all coffe data from database
    app.get("/coffes", async (req, res) => {
      const cursor = coffeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // find single data from database
    app.get("/coffe/:id", async (req, res) => {
      let id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeCollection.findOne(query);
      res.send(result);
    });
    // update a single coffe
    app.patch("/coffe/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          coffeName: data.coffeName,
          photo: data.photo,
        },
      };
      const result = await coffeCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
    // send coffe data to database
    app.post("/coffes", async (req, res) => {
      const data = req.body;
      const result = await coffeCollection.insertOne(data);
      res.send(result);
    });
    // Delete data from database
    app.delete("/coffe/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("server is running");
});
