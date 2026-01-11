import axios from "axios";

const parkestApi = "http://213.227.137.51:6646/";

export async function Login(username, password) {
  try {
    const res = await axios.post(parkestApi + "login", { username, password });
    if (res.status !== 200) throw new Error("login failed");
    return res.data;
  } catch {
    throw new Error("login failed");
  }
}

export async function Register(username, password) {
  try {
    const res = await axios.post(parkestApi + "register", { username, password });
    if (res.status !== 200) throw new Error("register failed");
    return res.data;
  } catch {
    throw new Error("register failed");
  }
}
