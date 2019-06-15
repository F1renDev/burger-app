import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://burger-app-35129.firebaseio.com/'
});

export default instance;