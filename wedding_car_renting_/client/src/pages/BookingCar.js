import React, { useState, useEffect } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useSelector, useDispatch } from "react-redux";
import { getAllCars } from "../redux/actions/carsAction";
import { Link, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import {
  Row,
  Col,
  Divider,
  DatePicker,
  Checkbox,
  Button,
  Modal,
  message,
} from "antd";
import moment from "moment";
import { bookCar } from "../redux/actions/bookingActions";
import dayjs from "dayjs";
import "aos/dist/aos.css";
import axios from "axios";

const { RangePicker } = DatePicker;
function BookingCar({ match }) {
  const { carid } = useParams();
  const { cars } = useSelector((state) => state.carReducer);
  const { loading } = useSelector((state) => state.alertsReducer);
  const [car, setcar] = useState({});
  const dispatch = useDispatch();
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [totalHours, setTotalHours] = useState(0);
  const [driver, setdriver] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [dateRange, setDateRange] = useState([]);

  useEffect(() => {
    if (cars.length == 0) {
      dispatch(getAllCars());
    } else {
      setcar(cars.find((o) => o._id == carid));
    }
  }, [cars]);

  useEffect(() => {
    setTotalAmount(totalHours * car.rentPerHour);
    if (driver) {
      setTotalAmount(totalAmount + totalHours * 500);
    }
  }, [driver, totalHours]);

  function selectTimeSlots(values) {
    setFrom(dayjs(values[0]).format("MMM DD YYYY HH:mm"));
    setTo(dayjs(values[1]).format("MMM DD YYYY HH:mm"));
    setTotalHours(values[1].diff(values[0], "hours"));
  }

  function bookNow() {
    const reqObj = {
      user: JSON.parse(localStorage.getItem("user"))._id,
      car: car._id,
      totalHours,
      totalAmount,
      driverRequired: driver,
      bookedTimeSlots: {
        from,
        to,
      },
    };
    dispatch(bookCar(reqObj));
  }

  //Popup Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [timeSlots, setTimeSlots] = useState([]);

  //Get time slots
  const getTimeSlots = () => {
    axios.get(`/api/bookings/getcarbookings/${carid}`).then((res) => {
      setTimeSlots(res.data.bookings);
    });
  };

  useEffect(() => {
    getTimeSlots();
  }, []);

  return (
    <DefaultLayout>
      {loading && <Spinner />}
      <Row
        justify="center"
        className="d-flex align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <Col lg={10} sm={24} xs={24}>
          <img
            src={car.image}
            className="carimg2 bs1 w-100"
            data-aos="flip-left"
            data-aos-duration="1500"
          />
        </Col>

        <Col lg={10} sm={24} xs={24} className="text-right">
          <div
            style={{
              width: "60%",
              margin: "auto",
            }}
          >
            <Divider
              type="horizontal"
              dashed
              style={{
                letterSpacing: "2px",
              }}
            >
              Vehicle Details
            </Divider>
            <hr
              style={{
                border: "1px solid #FF0000",
                width: "100%",
                margin: "auto",
              }}
            />
            <div
              style={{
                textAlign: "left",
                marginTop: "20px",
                width: "100%",
              }}
            >
              <p>
                <strong>Vehicle Name: </strong>
                {car.name}
              </p>
              <p>
                <strong>Vehicle Category: </strong>
                {car.category}
              </p>
              <p>
                <strong>Vehicle Rent Per Hour: </strong>
                {car.rentPerHour} LKR
              </p>
              <p>
                <strong>Fuel Type: </strong>
                {car.fuelType}
              </p>
              <p>
                <strong>Maximum Capacity: </strong>
                {car.capacity} Persons
              </p>
            </div>

            <Divider type="horizontal" dashed>
              Time Slots
            </Divider>
            <RangePicker
              showTime={{ format: "HH:mm" }}
              format="MMM DD YYYY HH:mm"
              onChange={selectTimeSlots}
            />
            <br />

            <button
              onClick={showModal}
              className="btn1 mt-3"
              style={{
                backgroundColor: "#FF0000",
                color: "white",
                borderRadius: "10px",
                padding: "10px",
                border: "none",
                marginBottom: "10px",
              }}
            >
              See Booked Slots
            </button>
            <Modal
              title="Time Slots"
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <h4>Booked Times</h4>

              {timeSlots.length <= 0 ? (
                <div>No Booked Slots</div>
              ) : (
                <div>
                  {timeSlots.map((slot) => {
                    return (
                      <div className="mt-4">
                        <p>
                          <strong>From: </strong>
                          {moment(slot.from).format("MMM DD YYYY HH:mm A")}
                        </p>
                        <p>
                          <strong>To: </strong>
                          {moment(slot.to).format("MMM DD YYYY HH:mm A")}
                        </p>
                        <hr />
                      </div>
                    );
                  })}
                </div>
              )}
            </Modal>

            {from && to && (
              <div>
                <p>
                  Total Hours : <b>{totalHours}</b>
                </p>
                <p>
                  Rent Per Hour : <b>{car.rentPerHour} LKR</b>
                </p>
                <Checkbox
                  style={{ marginBottom: "20px" }}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setdriver(true);
                    } else {
                      setdriver(false);
                    }
                  }}
                >
                  Driver Required
                </Checkbox>

                <p
                  style={{
                    marginTop: "10px",
                    textAlign: "left",
                    fontStyle: "italic",
                    fontSize: "20px",
                  }}
                >
                  <strong>Total Amount : </strong>
                  {totalAmount} LKR
                </p>

                <button
                  onClick={bookNow}
                  style={{
                    backgroundColor: "#FF0000",
                    color: "white",
                    borderRadius: "10px",
                    padding: "7px 40px",
                    border: "none",
                    marginTop: "20px",
                  }}
                >
                  Book Now
                </button>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </DefaultLayout>
  );
}

export default BookingCar;
