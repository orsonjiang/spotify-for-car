const mongoose = require("mongoose");

mongoose.set('strictQuery', false);
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true })
    .catch((e) => {
        console.error("Database connection error: ", e.message);
    });

const db = mongoose.connection;

module.exports = db;