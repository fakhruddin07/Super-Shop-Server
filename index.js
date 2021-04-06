const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send("Hello Big Bazar db, it's working....!")
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9cclq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productCollection = client.db("bigBazar").collection("products");
    const orderCollection = client.db("bigBazar").collection("orders");

    app.get('/products', (req, res) => {
        productCollection.find()
            .toArray((err, items) => {
                res.send(items);
                console.log('from database', items)
            })
    })

    app.post('/addProduct', (req, res) => {
        const newProduct = req.body;
        console.log('adding new product: ', newProduct);
        productCollection.insertOne(newProduct)
            .then(result => {
                console.log('inserted count', result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })

    app.post('/addOrder', (req, res) => {
        const newOrder = req.body;
        console.log('adding new product: ', newOrder);
        orderCollection.insertOne(newOrder)
            .then(result => {
                console.log('inserted count', result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/orders', (req, res) => {
        orderCollection.find({ email: req.query.email })
            .toArray((err, items) => {
                res.send(items);
            })
    })

    app.delete('/deleteProduct/:id', (req, res) => {
        productCollection.findOneAndDelete({ _id: ObjectId(req.params.id) })
            .then( (result) => {
                res.send(result.deleteCount > 0);
            })
            window.location.reload();
    })
});


app.listen(port)