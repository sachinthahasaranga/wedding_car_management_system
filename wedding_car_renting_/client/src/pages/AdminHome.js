import React, { useState, useEffect } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useSelector, useDispatch } from "react-redux";
import { deleteCar, getAllCars } from "../redux/actions/carsAction";
import Moment from "react-moment";
import {
  Row,
  Col,
  DatePicker,
  Avatar,
  Card,
  Input,
  Space,
  Popconfirm,
  Pagination,
} from "antd";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";
import {
  DeleteFilled,
  EditOutlined,
  FileExcelOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";

const { Meta } = Card;

const { RangePicker } = DatePicker;

function AdminHome() {
  const { cars } = useSelector((state) => state.carReducer);
  const { loading } = useSelector((state) => state.alertsReducer);
  const [totalCars, setTotalcars] = useState([]);
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getAllCars());
  }, []);

  useEffect(() => {
    setTotalcars(cars);
  }, [cars]);

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const { Search } = Input;

  const onSearch = async (value) => {
    var searchKey = value.target.value;
    setTotalcars(cars);
    filterData(totalCars, searchKey.toLowerCase());
  };

  //Car search function
  const filterData = (totalCars, searchKey) => {
    const result = cars.filter(
      (car) =>
        car.name.toLowerCase().includes(searchKey) ||
        car.category.toLowerCase().includes(searchKey)
    );
    setTotalcars(result);
  };

  //Get the array length of the cars
  const carsLength = totalCars.length;

  //Pagination
  const handlePaginationChange = (value) => {
    if (value == 1) {
      setPage(1);
    } else {
      setPage(value);
    }
  };

  //Generate Excel Report
  const exportToExcel = async () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    var tempCars = totalCars;

    //remove unwanted fields
    tempCars.map((car) => {
      delete car._id;
      delete car.__v;
      delete car.image;
      delete car.bookedTimeSlots;
    });

    const ws = XLSX.utils.json_to_sheet(tempCars);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, "Car Report " + Date.now() + fileExtension);
  };

  return (
    <DefaultLayout
      style={{
        padding: "20px",
      }}
    >
      <Row justify={"center"} gutter={16} className="mt-5">
        <Col lg={20} sm={24}>
          <div
            className="text-end"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                justifyContent: "flex-end",
                cursor: "pointer",
              }}
              onClick={exportToExcel}
            >
              <div>
                <FileExcelOutlined
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
              </div>
              <div>Download Report</div>
            </div>

            <Space
              direction="vertical"
              style={{
                width: "500px",
              }}
            >
              <Search
                placeholder="input search text"
                onChange={onSearch}
                enterButton
              />
            </Space>
            <button
              style={{
                backgroundColor: "#FF0000",
                color: "white",
                borderRadius: "10px",
                padding: "10px",
                border: "none",
                marginBottom: "10px",
                padding: "10px 20px",
              }}
            >
              <Link to="/addcar">
                <div
                  style={{
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <PlusCircleOutlined />
                  Add New Vehicle
                </div>
              </Link>
            </button>
          </div>
        </Col>
      </Row>

      {loading == true && <Spinner />}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
          flexDirection: "row",
          flexWrap: "wrap",
          marginTop: "20px",
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
                  <Link to={`/editcar/${car._id}`}>
                    <EditOutlined
                      key="edit"
                      style={{
                        color: "green",
                      }}
                    />
                  </Link>,

                  <Popconfirm
                    title="Delete the task"
                    description="Are you sure to delete this Vehicle?"
                    onConfirm={() => {
                      dispatch(deleteCar({ carid: car._id }));
                    }}
                    onCancel={() => {}}
                    okText="Yes"
                    cancelText="No"
                  >
                    <DeleteFilled
                      key="delete"
                      style={{
                        color: "red",
                      }}
                    />
                    ,
                  </Popconfirm>,
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

export default AdminHome;
