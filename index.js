const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());

/* qkfbiKOEFdvI00M0
tourism11
*/

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cfmbo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("tourism11");
    const servicesCollection = database.collection("tours");
    const servicesCollection2 = database.collection("booking");

    // GET API
    app.get("/tours", async (req, res) => {
      const cursor = servicesCollection.find({});
      const tours = await cursor.toArray();
      res.send(tours);
    });

    // GET Single Service
    app.get("/tours/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting specific tour", id);
      const query = { _id: ObjectId(id) };
      const tour = await servicesCollection.findOne(query);
      res.json(tour);
    });

    // POST API
    app.post("/tours", async (req, res) => {
      const tour = req.body;
      console.log("hit the post api", tour);

      const result = await servicesCollection.insertOne(tour);
      console.log(result);
      res.json(result);
    });
    //Add Booking
    app.post("/addBooking", async (req, res) => {
      const result = await servicesCollection2.insertOne(req.body);
      res.send(result);
      console.log(result);
    });

    // Get all Booking
    app.get("/allBooking", async (req, res) => {
      const result = await servicesCollection2.find({}).toArray();
      res.send(result);
    });
    // Get my Booking
    app.get("/myBooking", async (req, res) => {
      const result = await servicesCollection2.find({}).toArray();
      res.send(result);
    });

    // DELETE API
    app.delete("/tours/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection2.deleteOne(query);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(port, () => {
  console.log("Torism website server", port);
});
