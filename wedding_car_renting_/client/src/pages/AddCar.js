import React, { useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { Col, Row, Form, Input, Select, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addCar } from "../redux/actions/carsAction";
import Spinner from "../components/Spinner";

function AddCar() {
  const [image, setImage] = useState();
  const [category, setCategory] = useState();
  const [imageFile, setImageFile] = useState();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alertsReducer);

  // const preset_key = "jxd093tt";
  // const cloud_name = "dx1pvvqg7";
  // const uploadURL = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;

  const preset_key = "jkwkiav1";
  const cloud_name = "dljyf8xev";
  const uploadURL = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;

  async function onFinish(values) {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", preset_key);
    formData.append("folder", "car_images");

    await fetch(uploadURL, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        values.image = res.secure_url;
        values.category = category;
        values.bookedTimeSlots = [];

        dispatch(addCar(values));
      })
      .catch((err) => {
        console.log(err);
      });

    console.log(values);
  }

  const handleChange = (value) => {
    setCategory(value);
  };

  console.log(image);
  return (
    <DefaultLayout>
      {loading && <Spinner />}
      <Row justify="center" className="mt-5">
        <Col lg={16} sm={24}>
          <Form
            className="bs1 p-2"
            layout="vertical"
            onFinish={onFinish}
            style={{
              display: "flex",
              borderRadius: "20px",
            }}
          >
            <div
              style={{
                flex: 1,
                padding: "35px",
              }}
            >
              <h3>Add New Vehicle</h3>
              <Form.Item
                name="name"
                label="Vehicle Name"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="image"
                label="Vehicle Image"
                rules={[{ required: true }]}
              >
                <Input
                  type="file"
                  onChange={(e) => {
                    setImageFile(e.target.files[0]);
                  }}
                />
              </Form.Item>

              <Form.Item
                name="rentPerHour"
                label="Rent Per Hour (LKR)"
                rules={[{ required: true }]}
              >
                <Input type="number" />
              </Form.Item>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Form.Item
                  name="capacity"
                  label="Capacity"
                  rules={[{ required: true }]}
                >
                  <Input type="number" />
                </Form.Item>

                <Form.Item
                  name="fuelType"
                  label="Fuel Type"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </div>
              {/* Dropdown */}
              <Form.Item name="Category" label="Category">
                <Space>
                  <Select
                    defaultValue="--Select--"
                    style={{ width: 480 }}
                    onChange={handleChange}
                    options={[
                      { value: "Luxury", label: "Luxury" },
                      { value: "Semi-Luxury", label: "Semi-Luxury" },
                      { value: "Modern", label: "Modern" },
                      { value: "Classic", label: "Classic" },
                      { value: "Sports", label: "Sports" },
                    ]}
                  />
                </Space>
              </Form.Item>

              <div>
                <button
                  className="btn1"
                  style={{
                    borderRadius: "10px",
                    width: "50%",
                    height: "40px",
                  }}
                >
                  Add New Car
                </button>
              </div>
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src="https://res.cloudinary.com/desnqqj6a/image/upload/v1683887766/Car_rental-bro_oimwzz.png"
                style={{ width: "400px", height: "400px" }}
              />
            </div>
          </Form>
        </Col>
      </Row>
    </DefaultLayout>
  );
}

export default AddCar;
