import axios from 'axios'
import { URL } from './Urls'; './Urls'
const instance = axios.create({
  baseURL: URL,
});

export default instance;