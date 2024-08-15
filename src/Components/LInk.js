import axios from "axios";

export const instance = axios.create({
  baseURL: "http://192.168.23.191:8008",
})