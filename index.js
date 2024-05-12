const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config()



app.use(express.json())
require('./bot/bot')




async function server() {
    try {
        mongoose.connect(process.env.MONGO_URL, { dbName: process.env.DB_NAME })
            .then(() => console.log('Connected to MongoDB'))
            .catch((error) => console.error('Error connecting to MongoDB:', error));
        app.listen(process.env.PORT, () => {
            console.log(`Server started on port: ${process.env.PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
}

server()