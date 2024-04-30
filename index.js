const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// mmiddleware
const corsConfig = {
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  }
  app.use(cors(corsConfig))
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0pky6me.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const spotCollection = client.db('serendipiaDB').collection('spots');
    const countriesCollection = client.db('serendipiaDB').collection('countries');

    // tourist spots in home
    app.get('/', async(req, res)=>{
        const cursor = spotCollection.find().limit(6);
        const result = await cursor.toArray();
        console.log(result);
        res.send(result);
    })


    // load countries data
    app.get('/countries', async(req, res)=>{
      const cursor = countriesCollection.find();
      const result = await cursor.toArray();
      console.log(result);
      res.send(result);
    })

   

    app.get('/all-spots', async(req, res)=>{
        const cursor = spotCollection.find();
        const result = await cursor.toArray();
        console.log(result);
        res.send(result);
    })

    
    
    // sorted
    app.get('/all-spots/sorted', async(req, res)=>{
        const cursor = spotCollection.find().sort( { "cost": 1 } );
        const result = await cursor.toArray();
        console.log(result);
        res.send(result);
    })


  // for view details
  app.get('/all-spots/:id', async(req, res)=>{
    const id = req.params.id;
    console.log('id found in server:',req.params.id);
    const query = {_id: new ObjectId(id)}
    const result = await spotCollection.findOne(query);
  res.send(result);
    })

    // country details
    app.get('/all-spots/:country', async(req, res)=>{
      const result = await spotCollection.find({country:req.params.country}).toArray();
      res.send(result);
  })


    // load spots for a specific user using email
    app.get('/my-spots/:email', async(req, res)=>{
      const userEmail = req.params.email;
      // console.log(req.params.email);
      // console.log(userEmail);
      const result = await spotCollection.find({email:userEmail}).toArray();
      res.send(result);

  })

  app.get('/add-spot', async(req, res)=>{
    const spots = spotCollection.find();
    const result = await spots.toArray();
    res.send(result);
  })



  app.get('/updateSpot', async(req, res)=>{
    const spots = spotCollection.find();
    const result = await spots.toArray();
    res.send(result);
  })

app.get('/add-spot/:id', async(req, res)=>{
    const id = req.params.id;
    console.log(id);
    const query = {_id: new ObjectId(id)}
    const result = await spotCollection.findOne(query);
  res.send(result);
  })
  
  // update from mylist
  app.get('/updateSpot/:id', async(req, res)=>{
    console.log(req.params.id);
    const id = req.params.id;
    console.log('printing from server', id);
    const query = {_id: new ObjectId(id)}
    const result = await spotCollection.findOne(query);
    res.send(result);
  })

  app.put('/updateSpot/:id', async (req, res) => {
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)};
    const options = {upsert:true};
    const updatedSpot = req.body
    console.log(updatedSpot);
    const spot = {
        $set:{
            name: updatedSpot.name, 
            photo: updatedSpot.photo,
            location: updatedSpot.location, 
            country: updatedSpot.country,
            description: updatedSpot.description, 
            duration: updatedSpot.duration,
            visitors: updatedSpot.visitors,
            cost: updatedSpot.cost,
            season: updatedSpot.season
        }
    }

    const result = await spotCollection.updateOne(filter, spot, options)
    res.send(result);
})

  
  // add post from add post page
  app.post('/add-spot', async(req, res)=>{
        const newSpot = req.body;
        console.log(newSpot);

        const result = await spotCollection.insertOne(newSpot);
        res.send(result);
    })

    
    // delete spot from mylist
    app.delete('/add-spot/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id:new ObjectId(id)}
      const result = await spotCollection.deleteOne(query);
      res.send(result);
    })
    




    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res)=>{
    res.send("Serendipia server is running")
})

app.listen(port, ()=>{
    console.log(`Serendipia server is running on port: ${port}`)
})