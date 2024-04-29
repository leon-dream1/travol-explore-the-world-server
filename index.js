const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const port = process.env.PORT || 5000;

const app = express();

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l574mko.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

//   app.get('/', (req, res) => {
//     res.send('Hello World!')
//   })

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    //   await client.db("admin").command({ ping: 1 });

    app.get("/", (req, res) => {
      res.send("Hello From MongoDB!");
    });

    const touristSpotCollection = client
      .db("tourManageMentDb")
      .collection("touristSpot");

    app.get("/allTouristSpot", async (req, res) => {
      const cursor = touristSpotCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/touristSpot", async (req, res) => {
      const cursor = touristSpotCollection.find({});
      const result = await cursor.toArray();
      res.send(result.slice(0, 6));
    });

    app.get("/touristSpot/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await touristSpotCollection.findOne(query);
      res.send(result);
    });

    app.get("/myTouristSpot/:email", async (req, res) => {
      const email = req.params.email;
      console.log(email);
      const query = { email: email };
      const cursor = touristSpotCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/touristSpot", async (req, res) => {
      const spot = req.body;
      const result = await touristSpotCollection.insertOne(spot);
      res.send(result);
    });

    app.put("/touristSpot/:id", async (req, res) => {
      const {
        spotName,
        country,
        spotLocation,
        spotImage,
        season,
        travelTime,
        cost,
        totalVisitor,
        description,
      } = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDocument = {
        $set: {
          spotName: spotName,
          country: country,
          spotLocation: spotLocation,
          spotImage: spotImage,
          season: season,
          travelTime: travelTime,
          cost: cost,
          totalVisitor: totalVisitor,
          description: description,
        },
      };
      const options = { upsert: true };
      const result = await touristSpotCollection.updateOne(
        filter,
        updateDocument,
        options
      );
      res.send(result);
    });

    app.delete("/touristSpot/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristSpotCollection.deleteOne(query);
      res.send(result);
    });

    //Country data
    const countriesCollection = client
      .db("tourManageMentDb")
      .collection("countries");

    app.get("/countries", async (req, res) => {
      const cursor = countriesCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    const countriesSpotCollection = client
      .db("tourManageMentDb")
      .collection("allCountriesSpot");

    app.get("/countryAllSpot/:countryName", async (req, res) => {
      const countryName = req.params.countryName;
      console.log(countryName);
      const query = { country: countryName };
      const cursor = countriesSpotCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/countrySpot/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await countriesSpotCollection.findOne(query);
      console.log(result);
      res.send(result);
    });


    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //   await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
