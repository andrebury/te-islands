import axios from 'axios';

const api = axios.create({
	//baseURL: 'https://acompanhamento-projeto.herokuapp.com'
	baseURL: 'https://api.turnip.exchange'//process.env.REACT_APP_API_URL
});

export default api;
