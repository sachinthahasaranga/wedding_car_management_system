const express = require("express");
const cors = require("cors");
require("dotenv").config();
const dbConnection = require("./utils/database");

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

//import routes
const userRoute = require("./routes/user/user.routes");
const carRoute = require("./routes/vehicles/car.routes");
const bookingRouter = require("./routes/vehicles/booking.routes");

//define routes
app.use("/api/users/", userRoute);
app.use("/api/cars/", carRoute);
app.use("/api/bookings/", bookingRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Car renting system!");
});

app.listen(port, () => {
  console.log(`Node JS Server Started port ${port}`);
  dbConnection.connectDB();
});
