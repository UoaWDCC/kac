import axios from "axios";

const baseUrl = "/api";

const getTest = () => {
  const request = axios.get(`${baseUrl}/test`);
  return request.then((response) => response.data);
};

const postTest = () => {
  const request = axios.post(`${baseUrl}/test`);
  return request.then((response) => response.data);
};

export default {
  getTest,
  postTest,
};
