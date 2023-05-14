import React, { useState, useEffect } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { Col, Row, Form, Input, message, Select, Space } from "antd";
import Spinner from "../components/Spinner";
import { useParams } from "react-router-dom";
import axios from "axios";

function EditCar({ match }) {
  const { carid } = useParams();

  //Get existing car details
  const [name, setName] = useState("");
  const [rentPerHour, setRentPerHour] = useState("");
  const [capacity, setCapacity] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [image, setImage] = useState("");
  const [car, setCar] = useState({});
  const [category, setCategory] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getCar();
  }, []);

  function getCar() {
    setIsLoading(true);
    let mounted = true;
    axios
      .get(`/api/cars/getonecar/${carid}`)
      .then((res) => {
        if (mounted) {
          setName(res.data.car.name);
          setRentPerHour(res.data.car.rentPerHour);
          setCapacity(res.data.car.capacity);
          setFuelType(res.data.car.fuelType);
          setImage(res.data.car.image);
          setCategory(res.data.car.category);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
    return () => (mounted = false);
  }

  const handleChange = (value) => {
    setCategory(value);
  };

  const onUpdate = async () => {
    //Submit handler
    setIsLoading(true);
    console.log(imageFile);
    const data = {
      _id: carid,
      name,
      rentPerHour,
      capacity,
      fuelType,
      category,
      image,
    };
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "jkwkiav1");
      formData.append("folder", "car_images");

      await fetch("https://api.cloudinary.com/v1_1/dljyf8xev/image/upload", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((res) => {
          data.image = res.secure_url;
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      data.image = image;
    }

    await axios
      .patch(`/api/cars/editcar`, data)
      .then((res) => {
        //success message
        message.success("Car details Updated Succesfully");
        setTimeout(() => {
          window.location.href = "/admin";
        }, 500);
      })
      .catch((err) => {
        console.log(err);
        isLoading(false);
      });
  };

  return (
    <DefaultLayout>
      {isLoading && <Spinner />}
      <Row justify="center" className="mt-5">
        <Col lg={16} sm={24}>
          <Form
            onFinish={onUpdate}
            style={{
              display: "flex",
              borderRadius: "20px",
            }}
            initialValues={car}
            className="bs1 p-2"
            layout="vertical"
          >
            <div
              style={{
                flex: 1,
                padding: "35px",
              }}
            >
              <h3>Edit Vehicle</h3>

              <Form.Item label="Car name" rules={[{ required: true }]}>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </Form.Item>
              <Form.Item label="Vehicle Image">
                <Input
                  type="file"
                  onChange={(e) => {
                    setImageFile(e.target.files[0]);
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Rent Per Hour (LKR)"
                type="number"
                rules={[{ required: true }]}
              >
                <Input
                  value={rentPerHour}
                  onChange={(e) => setRentPerHour(e.target.value)}
                />
              </Form.Item>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Form.Item
                  label="Capacity"
                  type="number"
                  rules={[{ required: true }]}
                >
                  <Input
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Fuel Type" rules={[{ required: true }]}>
                  <Input
                    value={fuelType}
                    onChange={(e) => {
                      setFuelType(e.target.value);
                    }}
                  />
                </Form.Item>
              </div>

              <Form.Item name="Category" label="Category">
                <Space>
                  <Select
                    defaultValue="--Select--"
                    style={{ width: 480 }}
                    onChange={handleChange}
                    value={category}
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
                  Edit Car
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

export default EditCar;
