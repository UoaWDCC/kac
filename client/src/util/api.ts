import axios from "axios";

const baseUrl = "/api";

const getTest = () => {
  const request = axios.get(`${baseUrl}`);
  return request.then((response) => response.data);
};

export default {
  getTest
};
