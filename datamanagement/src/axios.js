

import axios from 'axios';


const axiosInstance = axios.create({
	baseURL: 'https://jsonplaceholder.typicode.com/'
});

// axiosInstance.get('/foo-bar');
// https://api.themoviedb.org/3/foo-bar

export default axiosInstance;