const express = require("express");
const router = express.Router();
const Booking = require("../../models/vehicles/booking.model");
const Car = require("../../models/vehicles/car.model");

//Book car
router.post("/bookcar", async (req, res) => {
  try {
    const newbooking = new Booking(req.body);
    await newbooking.save();

    res.status(200).json({
      status: true,
      message: "Car booked successfully",
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});

//get all bookings for admin
router.get("/getallbookings", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate(["car", "user"])
      .sort({ createdAt: -1 });
    res.status(200).json({
      status: true,
      bookings,
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});

//get all bookings for user by user id
router.get("/getallbookings/:id", async (req, res) => {
  try {
    const userID = req.params.id;
    const bookings = await Booking.find({ user: userID })
      .populate("car")
      .sort({ createdAt: -1 });

    if (bookings.length == 0) {
      return res.status(400).json({
        status: false,
        message: "No bookings found",
      });
    } else {
      res.status(200).json({
        status: true,
        bookings,
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});

//cancle booking
router.delete("/deletebooking/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(400).json({
        status: false,
        message: "Booking not found",
      });
    } else {
      const car = await Car.findById(booking.car);
      car.bookedTimeSlots.pull(booking.bookedTimeSlots);
      await car.save();
      await Booking.findByIdAndDelete(id);
    }

    res.status(200).json({
      status: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});

//get all bookings for car by booking id
router.get("/getcarbookings/:id", async (req, res) => {
  try {
    const carID = req.params.id;
    const bookings = await Booking.find({ car: carID });
    var temp = [];
    for (var booking of bookings) {
      if (booking.bookingStatus == "Confirmed") {
        temp.push(booking.bookedTimeSlots);
      }
    }
    if (bookings.length == 0) {
      return res.status(400).json({
        status: false,
        bookings: temp,
        message: "No bookings found",
      });
    } else {
      res.status(200).json({
        status: true,
        bookings: temp,
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});

//change booking status to confirmed
router.patch("/confirmBooking/:id", async (req, res) => {
  try {
    const bookongID = req.params.id;

    const booking = await Booking.findById(bookongID);

    if (booking) {
      booking.bookingStatus = "Confirmed";
      await booking.save();

      //save booking time slots to car
      const car = await Car.findById(booking.car);
      car.bookedTimeSlots.push(booking.bookedTimeSlots);
      await car.save();
      return res.status(200).json({
        status: true,
        message: "Booking confirmed",
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Booking not found",
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});

//change booking status to declined
router.patch("/declineBooking/:id", async (req, res) => {
  try {
    const bookongID = req.params.id;

    const booking = await Booking.findById(bookongID);

    if (booking) {
      booking.bookingStatus = "Declined";
      await booking.save();
      return res.status(200).json({
        status: true,
        message: "Booking declined",
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Booking not found",
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});
module.exports = router;
