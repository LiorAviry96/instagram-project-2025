/* eslint-disable no-undef */
import Axios from "axios";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "/api/"
    : "http://localhost:4000/api/"; // Ensure http:// is used explicitly

const axios = Axios.create({ withCredentials: true });

export const httpService = {
  get(endpoint, data) {
    console.log(BASE_URL);
    return ajax(endpoint, "GET", data);
  },
  post(endpoint, data) {
    return ajax(endpoint, "POST", data);
  },
  put(endpoint, data) {
    return ajax(endpoint, "PUT", data);
  },
  delete(endpoint, data) {
    return ajax(endpoint, "DELETE", data);
  },
};

async function ajax(endpoint, method = "GET", data = null) {
  const url = `${BASE_URL}${endpoint}`;
  const params = method === "GET" ? data : null;

  const options = { url, method, data, params };

  try {
    console.log("options", options);
    const res = await axios(options);
    console.log("res", res);
    return res.data;
  } catch (err) {
    console.log(BASE_URL);
    console.log(
      `Had Issues ${method}ing to the backend, endpoint: ${endpoint}, with data: `,
      data
    );
    console.dir(err);
    if (err.response && err.response.status === 401) {
      sessionStorage.clear();
      window.location.assign("/");
    }
    throw err;
  }
}
