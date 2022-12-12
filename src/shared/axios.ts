import axios from "axios";
import { API_URL } from "./constants";

const instance = axios.create({
  baseURL: API_URL,
  params: {
    api_key: "1af566f85ecb6a3b7bd189b25a385be8",
    // api_key: process.env.REACT_APP_API_KEY,
  },
});

export default instance;
