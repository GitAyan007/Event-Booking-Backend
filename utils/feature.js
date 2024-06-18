const mongoose = require('mongoose');

const connectDB = (uri) => {
    mongoose
        .connect(uri,
            {
                dbName: "EventBooking",
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        )
        .then(() => console.log("Database Connected Succesfully"))
        .catch((error) => {
            console.log("Facing issues while connecting to db");
            console.log(error);
            process.exit(1);
        });
};

module.exports = {connectDB};