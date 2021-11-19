const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//Middleware

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5mc0d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();

        const database = client.db("tourismDB");
        const dealCollection = database.collection("deal");
        const bookedDealsCollection = database.collection("bookedDeals");

        //Post API on Offers

        app.post('/deal', async (req, res) => {
            const newOffer = req.body;
            const result = await dealCollection.insertOne(newOffer);
            res.json(result);
        })
        // Post API on bookedDeals

        app.post('/bookedDeals', async (req, res) => {
            const bookedPackage = req.body;
            const result = await bookedDealsCollection.insertOne(bookedPackage);
            res.json(result);
        })

        //Get myBooking

        app.post('/bookedDeals/byEmail', async (req, res) => {
            const email = req.body.email
            const query = { email: email };
            const cursor = await bookedDealsCollection.find(query);
            const result = await cursor.toArray();
            res.json(result);
        })

        //DELETE API
        app.delete('/bookedDeals/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookedDealsCollection.deleteOne(query);
            res.json(result);
        })


        //Get all Booked Package
        app.get('/bookedDeals', async (req, res) => {
            const cursor = bookedDealsCollection.find({})
            const bookedPackage = await cursor.toArray();
            res.json(bookedPackage);
        })
        // Get all Offers
        app.get('/deal', async (req, res) => {
            const cursor = dealCollection.find({});
            const offers = await cursor.toArray();
            res.json(offers);
        })

        // Get single Offer
        app.get('/deal/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const offer = await dealCollection.findOne(query);
            res.json(offer);
        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);




app.get('/', (req, res) => {
    res.send("Welcome to Tourism");
});

app.listen(port, () => {
    console.log("Listening to port", port);
});