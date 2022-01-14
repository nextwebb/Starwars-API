import axios from 'axios';

const swapiService = async (path: any) =>
  axios.get(`https://swapi.py4e.com/api/${path}/`);

export default swapiService;
