const express = require("express");
const router = express.Router();
const Car = require("../../models/vehicles/car.model");

//Get all cars
router.get("/getallcars", async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: true,
      cars,
    });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
});

// Add car
router.post("/addcar", async (req, res) => {
  try {
    const newcar = new Car(req.body);
    await newcar.save();
    res.status(200).json({
      status: true,
      message: "Car added successfully",
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});

//Edit car
router.patch("/editcar", async (req, res) => {
  try {
    const car = await Car.findOne({ _id: req.body._id });
    car.name = req.body.name;
    car.image = req.body.image;
    car.fuelType = req.body.fuelType;
    car.rentPerHour = req.body.rentPerHour;
    car.category = req.body.category;
    car.capacity = req.body.capacity;

    await car.save();

    res.status(200).json({
      status: true,
      message: "Car details updated successfully",
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});

//Delete car
//path parameter
router.delete("/deletecar/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const car = await Car.findOne({ _id: id });

    if (car) {
      await Car.findOneAndDelete({ _id: id });
      res.status(200).json({
        status: true,
        message: "Car detail deleted Successfully",
      });
    } else {
      res.status(400).json({
        status: false,
        message: "Car detail not found",
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: false,
      error,
    });
  }
});

//Get one car by car id
router.get("/getonecar/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const car = await Car.findOne({ _id: id });
    if (car) {
      res.status(200).json({
        status: true,
        car,
      });
    } else {
      res.status(400).json({
        status: false,
        message: "Car not found",
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: false,
      error,
    });
  }
});

module.exports = router;
