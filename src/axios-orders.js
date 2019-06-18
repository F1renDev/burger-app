import axios from 'axios';


/* Making an instance of axios to use the needed url not globally but in the place where it needs to be used */
const instance = axios.create({
    baseURL: 'https://burger-app-35129.firebaseio.com/'
});

export default instance;