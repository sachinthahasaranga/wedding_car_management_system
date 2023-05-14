import React, { useState, useEffect } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useSelector, useDispatch } from "react-redux";
import { getAllCars } from "../redux/actions/carsAction";
import {
  Row,
  Col,
  DatePicker,
  Space,
  Select,
  Input,
  Card,
  Pagination,
} from "antd";
import { AudioOutlined } from "@ant-design/icons";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";
import Meta from "antd/es/card/Meta";
import moment from "moment";
const { RangePicker } = DatePicker;

function Home() {
  const { cars } = useSelector((state) => state.carReducer);
  const { loading } = useSelector((state) => state.alertsReducer);
  const [totalCars, setTotalcars] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCars());
  }, []);

  useEffect(() => {
    setTotalcars(cars);
  }, [cars]);

  function setFilter(values) {
    var selectedCars = [];

    selectedCars = cars;

    for (var car of cars) {
      if (car.bookedTimeSlots.length == 0) {
        //check if the car is already in the array
        if (!selectedCars.includes(car)) {
          selectedCars = selectedCars.filter((item) => item !== car);
        }
      } else {
        for (var booking of car.bookedTimeSlots) {
          if (
            moment(values[0].$d, "MMM DD YYYY HH:mm").isBetween(
              booking.from,
              booking.to
            ) ||
            moment(values[1].$d, "MMM DD YYYY HH:mm").isBetween(
              booking.from,
              booking.to
            ) ||
            moment(booking.from).isBetween(
              moment(values[0].$d, "MMM DD YYYY HH:mm"),
              moment(values[1].$d, "MMM DD YYYY HH:mm")
            ) ||
            moment(booking.to).isBetween(
              moment(values[0].$d, "MMM DD YYYY HH:mm"),
              moment(values[1].$d, "MMM DD YYYY HH:mm")
            )
          ) {
            selectedCars = selectedCars.filter((item) => item !== car);
          }
        }
      }
    }
    // console.log("selectedCars", selectedCars);
    setTotalcars(selectedCars);
  }

  //
  const handleChange = (value) => {
    if (value == "All") {
      setTotalcars(cars);
    } else {
      var temp = [];
      for (var car of cars) {
        if (car.category == value) {
          temp.push(car);
        }
      }
      setTotalcars(temp);
    }
  };

  //Get the array length of the cars
  const carsLength = totalCars.length;

  const suffix = (
    <AudioOutlined
      style={{
        fontSize: 16,
        color: "#1890ff",
      }}
    />
  );
  const { Search } = Input;
  const [page, setPage] = useState(1);

  //Pagination
  const handlePaginationChange = (value) => {
    if (value == 1) {
      setPage(1);
    } else {
      setPage(value);
    }
  };

  const onSearch = async (value) => {
    var searchKey = value.target.value;
    setTotalcars(cars);
    filterData(totalCars, searchKey.toLowerCase());
  };

  //Car search function
  const filterData = (totalCars, searchKey) => {
    const result = cars.filter((car) =>
      car.name.toLowerCase().includes(searchKey)
    );
    setTotalcars(result);
  };

  return (
    <DefaultLayout>
      <Row className="mt-5" justify={"center"}>
        <Col
          lg={20}
          sm={20}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "50px",
            alignItems: "center",
          }}
        >
          <Space direction="vertical">
            <Search
              placeholder="input search text"
              onChange={onSearch}
              enterButton
            />
          </Space>
          <Space>
            <Select
              defaultValue="Filter By Category"
              style={{ width: 200 }}
              onChange={handleChange}
              options={[
                { value: "All", label: "All" },
                { value: "Luxury", label: "Luxury" },
                { value: "Semi-Luxury", label: "Semi-Luxury" },
                { value: "Modern", label: "Modern" },
                { value: "Classic", label: "Classic" },
                { value: "Sports", label: "Sports" },
              ]}
            />
          </Space>
          <RangePicker
            showTime={{ format: "HH:mm" }}
            format="MMM DD YYYY HH:mm"
            onChange={setFilter}
          />
        </Col>
      </Row>

      {loading === true && <Spinner />}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
          flexDirection: "row",
          flexWrap: "wrap",
          marginTop: "50px",
        }}
      >
        {totalCars.slice((page - 1) * 4, page * 4).map((car) => {
          return (
            <div>
              <Card
                style={{
                  width: 300,
                  boxShadow:
                    "box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px;",
                }}
                cover={
                  <img
                    alt="example"
                    src={car.image}
                    style={{
                      objectFit: "cover",
                      height: "200px",
                      width: "100%",
                    }}
                  />
                }
                actions={[
                  <button
                    style={{
                      backgroundColor: "#FF0000",
                      width: "50%",
                      color: "white",
                      borderRadius: "10px",
                      padding: "5px",
                      border: "none",
                      marginBottom: "10px",
                    }}
                  >
                    <Link
                      to={`/bookcar/${car._id}`}
                      style={{
                        color: "white",
                      }}
                    >
                      Book Now
                    </Link>
                  </button>,
                ]}
              >
                <Meta
                  title={car.name}
                  description={
                    <div>
                      <p>Per Hour Rent: {car.rentPerHour} LKR </p>

                      <p>Category: {car.category} </p>
                    </div>
                  }
                />
              </Card>
            </div>
          );
        })}
      </div>
      <Pagination
        style={{
          marginTop: "50px",
        }}
        defaultCurrent={1}
        total={carsLength}
        defaultPageSize={4}
        onChange={handlePaginationChange}
      />
    </DefaultLayout>
  );
}

export default Home;
