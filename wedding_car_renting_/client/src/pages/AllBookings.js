import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { Space, Table, Tag, Input, message } from "antd";
import axios from "axios";
import {
  CheckOutlined,
  CloseOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";
import moment from "moment";

const AllBookings = () => {
  //Pagination
  const [page, setPage] = useState(1);
  const [bookingLength, setBookingLength] = useState(0);
  const [totalBokings, setTotalBokings] = useState([]);
  const [tempData, setTempData] = useState([]); //table data [array

  //Pagination
  const handlePaginationChange = (value) => {
    if (value == 1) {
      setPage(1);
    } else {
      setPage(value);
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img
          src={image}
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      ),
    },
    {
      title: "Vehicle Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },

    {
      title: "Purchased User",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Rental Time",
      key: "tags",
      dataIndex: "tags",
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color =
              tag.length > 5
                ? "geekblue"
                : tag.length == 5
                ? "green"
                : tag.length == 3
                ? "volcano"
                : "purple";

            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Total Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Status",
      dataIndex: "bookingStatus",
      key: "bookingStatus",
      render: (bookingStatus, key) => (
        <>
          {bookingStatus == "Pending" ? (
            // approve & decline buttons
            <div className="d-flex">
              <button
                onClick={() => {
                  axios
                    .patch(`/api/bookings/confirmBooking/${key.key}`)
                    .then((res) => {
                      message.success("Booking Confirmed");
                      window.location.reload();
                    });
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  border: "1px solid green",
                  color: "green",
                  backgroundColor: "white",
                }}
              >
                <CheckOutlined />
              </button>
              <button
                onClick={() => {
                  axios
                    .patch(`/api/bookings/declineBooking/${key.key}`)
                    .then((res) => {
                      message.success("Booking Declined");
                      window.location.reload();
                    });
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  border: "1px solid red",
                  color: "red",
                  marginLeft: "10px",
                  backgroundColor: "white",
                }}
              >
                <CloseOutlined />
              </button>
            </div>
          ) : bookingStatus == "Confirmed" ? (
            <Tag color="green">{bookingStatus.toUpperCase()}</Tag>
          ) : (
            <Tag color="volcano">{bookingStatus.toUpperCase()}</Tag>
          )}
        </>
      ),
    },
  ];
  const [data, setData] = React.useState([]); //table data [array
  //Get all bookings
  const getAllBookings = () => {
    axios.get(`/api/bookings/getallbookings`).then((res) => {
      setTotalBokings(res.data.bookings);
      var temp = [];
      //Push data to data array using for loop
      for (let i = 0; i < res.data.bookings.length; i++) {
        temp.push({
          key: res.data.bookings[i]._id,
          name: res.data.bookings[i].car.name,
          category: res.data.bookings[i].car.category,
          username: res.data.bookings[i].user.username,
          bookingStatus: res.data.bookings[i].bookingStatus,
          tags: [
            "FROM:",
            moment(res.data.bookings[i].bookedTimeSlots.from).format(
              "DD-MM-YYYY hh:mm A"
            ),
            "TO:",
            moment(res.data.bookings[i].bookedTimeSlots.to).format(
              "DD-MM-YYYY hh:mm A"
            ),
          ],
          image: res.data.bookings[i].car.image,
          amount: res.data.bookings[i].totalAmount + " LKR",
        });
      }
      setData(temp);
      setTempData(temp);
      setBookingLength(res.data.bookings.length);
    });
  };

  useEffect(() => {
    getAllBookings();
  }, []);

  //Car search function
  const { Search } = Input;
  const onSearch = async (value) => {
    var searchKey = value.target.value;

    filterData(tempData, searchKey.toLowerCase());
  };

  const filterData = (bookings, searchKey) => {
    const result = bookings.filter((booking) =>
      booking.name.toLowerCase().includes(searchKey)
    );
    setData(result);
    setBookingLength(result.length);
  };

  console.log("data", data);

  //Generate Excel Report
  const exportToExcel = async () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    totalBokings.map((booking) => {
      booking["User"] = booking.user.username;
      booking["Vehicle Name"] = booking.car.name;
      booking["Vehicle Category"] = booking.car.category;
      booking["From"] = booking.bookedTimeSlots.from;
      booking["To"] = booking.bookedTimeSlots.to;
      booking["Total Amount"] = booking.totalAmount;
      booking["Total hours"] = booking.totalHours;
      booking["Drive Status"] = booking.driverRequired ? "Yes" : "No";
      booking["Created At"] = booking.createdAt;

      delete booking._id;
      delete booking.__v;
      delete booking.bookedTimeSlots;
      delete booking.user;
      delete booking.car;
      delete booking.createdAt;
      delete booking.updatedAt;
      delete booking.driverRequired;
      delete booking.totalAmount;
      delete booking.totalHours;
      delete booking.transactionId;
    });
    const ws = XLSX.utils.json_to_sheet(totalBokings);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, "Booking Report" + Date.now() + fileExtension);
  };

  return (
    <DefaultLayout>
      <div
        style={{
          padding: "50px",
        }}
      >
        <span
          className="text-center"
          style={{
            fontSize: "30px",
            fontWeight: "bold",
            color: "darkslategray",
          }}
        >
          All Bookings
        </span>

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
        </div>
        <Table
          columns={columns}
          dataSource={data.slice((page - 1) * 4, page * 4)}
          style={{
            marginTop: "20px",
          }}
          pagination={{
            onChange: handlePaginationChange,
            defaultPageSize: 4,
            showSizeChanger: false,
            total: bookingLength,
            defaultCurrent: 1,

            position: ["bottomCenter"],
          }}
        />
      </div>
    </DefaultLayout>
  );
};

export default AllBookings;
