import axios from "axios";

// Making an instance of axios and setting a URL where all requests will be forwarded to
// when this instance is used
const instance = axios.create({
  baseURL: "https://burger-app-35129.firebaseio.com/"
});

export default instance;
