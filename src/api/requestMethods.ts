import axios from "axios";

const BASE_URL = import.meta.env.BASE_URL;
const data = localStorage.getItem("persist:root");
const user = data ? JSON.parse(data)?.user : null;
const currentUser = JSON.parse(user)?.currentUser;
const TOKEN = currentUser?.token;
export const publicRequest = axios.create({
  baseURL: import.meta.env.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json", token: `Bearer ${TOKEN}` },
});
