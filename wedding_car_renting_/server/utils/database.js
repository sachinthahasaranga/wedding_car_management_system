const mongoose = require("mongoose");
function connectDB() {
  mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
    useUnifiedTopology: true,
    useNewUrlparser: true,
  });

  const connection = mongoose.connection;

  connection.on("connected", () => {
    console.log("MongoDB connection Successful");
  });

  connection.on("error", () => {
    console.log("MongoDB Connection Error");
  });
}

module.exports = { connectDB };
