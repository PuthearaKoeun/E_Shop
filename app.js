const express = require('express');
const app = express();
require('dotenv').config(); 

// import the middleware
const bodyParser = require('body-parser');

// import the morgan
const morgan = require('morgan');

// import the monogoDB
const mongoose = require('mongoose');

// import the protection function
const authJwt = require('./helpers/jwt');

// import the eror handler
const errorHandler = require('./helpers/error-handler')

// import the product router from products.js file in router folder 
const productsRouter = require('./routers/products');

// import the categories router from categories.js file in router folder
const categoriesRouter = require('./routers/categories');

// import the users router from users.js file in router folder
const usersRouter = require('./routers/users');

// import the order router form orders.file in router folder
const orderRouter = require('./routers/orders');

// calling middleware method or api middleware
app.use(bodyParser.json());

// middleware for morgan. morgan is used to return  the logging method we requested.
app.use(morgan('tiny')); // tiny is the default option of morgan

// calling a authJWT middleware from jsonWebToken file in helpers folder
app.use(authJwt());

// calling the uploads folder in public folder to show the product image
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));

// calling a error handler when the is the api is not authorized
app.use(errorHandler)

const port = process.env.PORT;
const api = process.env.API_URL;
const connection_url = process.env.CONNECTION_URL;


// implement the routers of products.js  or implement it as middleware
app.use(`${api}/products`, productsRouter);

// implement the routers of categories.js  or implement it as middleware
app.use(`${api}/categories`, categoriesRouter);

// implement the routers of users.js or implement it as middleware
app.use(`${api}/users`, usersRouter);

// implement the routers of orders.js or implement it as a middleware
app.use(`${api}/orders`, orderRouter);

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