const express = require('express');
const app = express();
 

// import the middleware
const bodyParser = require('body-parser');

// import the morgan
const morgan = require('morgan');

// import the monogoDB
const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

// calling middleware method or api middleware
app.use(bodyParser.json());

// middleware for morgan. morgan is used to return  the logging method we requested.
app.use(morgan('tiny')); // tiny is the default option of morgan

require('dotenv').config();

const port = process.env.PORT;
const api = process.env.API_URL;
const connection_url = process.env.CONNECTION_URL;

// create product schema
const productSchema = mongoose.Schema({
    name: String,
    image: String,
    countInStock: { type: Number, require: true}
});

// create product model
const Product = mongoose.model('Product', productSchema)


// fetch all the data 
app.get(`${api}/products`, async (req, res) => {
    // Product.find() is called the model that created above recently
    const productList = await Product.find();

    // verify the productList, does it has or not?
    if(!productList){
        res.status(500).json({success: false});
    } 


    res.send(productList);



    // const products = [
    //     {
    //         id: 1,
    //         name: 'Gaming table',
    //         image: '123.jpg'
    //     },
    //     {
    //         id: 2,
    //         name: 'Officce table',
    //         image: '123.jpg'
    //     }
    // ]
    // res.send(products);
})

// create the data through the api method POST
app.post(`${api}/products`, (req, res) => {
    // const newProduct = req.body;
    // console.log(newProduct);
    // res.statusCode = 201;
    // res.setHeader("Content-Type", "application/json");
    // res.send(newProduct); 

    const product = new Product({
        name: req.body.name,
        image: req.body.image,
        countInStock: req.body.countInStock
    })

    // save to the database (MongoDB)
    product.save().then((createdProduct => {
        // 201 returns a success, and respond to product to front page
        res.status(201).json(createdProduct)
    })).catch((err)=>{
        // 500 returns a server error (http error)
        res.status(500).json({
            error: err,
            success: false
        });
    });
})

// connection the databases before start the server
mongoose.connect(connection_url,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'eShop'
})
// check the connection, does it connects or not?. if it success, it will return then(). But if it not connect, it will return the catch error
.then(() => {
    console.log('Database Connection is ready');
})
.catch((err) => {
    console.log('Database Connection is not ready');
});



app.listen(3800, () => {
    console.log(`Server is running http://${port}`);
});