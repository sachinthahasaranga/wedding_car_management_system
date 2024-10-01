import { message } from "antd";
import axios from "axios";

export const userLogin = (reqObj) => async (dispatch) => {
  dispatch({ type: "LOADING", payload: true });

  // const user = localStorage.getItem("user");
  // const username = user.username;

  try {
    const response = await axios.post("/api/users/login", reqObj);
    localStorage.setItem("user", JSON.stringify(response.data));
    message.success("Login Successfull");
    setTimeout(() => {
      window.location.href = "/";
    }, 500);
    dispatch({ type: "LOADING", payload: false });
  } catch (error) {
    console.log(error);
    error.response.data.message && message.error(error.response.data.message);
    dispatch({ type: "LOADING", payload: false });
  }
};

export const userRegister = (reqObj) => async (dispatch) => {
  dispatch({ type: "LOADING", payload: true });

  try {
    //const response = await axios.post("/api/users/register", reqObj);
    message.success("Registeration Successfull");
    setTimeout(() => {
      window.location.href = "/login";
    }, 500);

    dispatch({ type: "LOADING", payload: false });
  } catch (error) {
    console.log(error);
    error.response.data.message && message.error(error.response.data.message);
    dispatch({ type: "LOADING", payload: false });
  }
};
