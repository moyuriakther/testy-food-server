const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

const port = process.env.PORT || 5055


app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u5uel.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('collection error', err);
    const productsCollection = client.db('freshTestyFood').collection("items");

  app.get('/items', (req, res) => {
    productsCollection.find()
    .toArray((err, items) => {
      res.send(items)
      console.log('from database', items)
    })
  })


    // app.post('/addProducts', (req, res) =>{
    //   const products = req.body;
    //   productsCollection.insertMany(products)
    //   .then(result =>{
    //     console.log(result.insertedCount);
    //     res.send(result.insertedCount > 1)
    //   })
    // })


    app.post('/addProduct', (req, res) =>{
        const newEvent = req.body;
        console.log('add new products', newEvent);
        productsCollection.insertOne(newEvent)
        .then(result =>{
          console.log('inserted count', result.insertedCount)
          res.send(result.insertedCount > 0)
        })
    })

});



app.listen(port , () => {
        console.log(`Example app listening at http://localhost:${port}`)
       })
