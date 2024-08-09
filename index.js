const express = require('express');
const app = express();
const bodyParser =require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');


require('dotenv/config');

app.use(cors());
app.options('*',cors());
//middleware
app.use(bodyParser.json());
app.use(express.json());

//routes
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');


app.use('/api/category',categoryRoutes);
app.use('/api/product',productRoutes);

//database
mongoose.connect(process.env.CONNECTION_STRING,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>{
    console.log('Database Connection is ready...');

    //server
    app.listen(process.env.Port,()=>{
        console.log(`server is running http://localhost:${process.env.Port}`);    
    })        
})
.catch((err)=>{
    console.log(err);
})

