/* eslint-disable */
import axios from "axios";
export default axios.create({
  // baseURL: "http://127.0.0.1:8000/api",
  baseURL: "https://murmuring-shelf-78528.herokuapp.com/api",
  headers: {
    "Content-type": "application/json",
  },
});
