import axios from 'axios'
import { getToken, removeStorageData } from '../utils/storage-helper';
import { navigate } from '../utils/navigateRef'; // <-- import navigate function
import { showToastMessage } from '../utils/helper';

const axiosInstance  = axios.create({
    baseURL: 'https://99b2b4ff54d5.ngrok-free.app',
    headers: {
        'Content-Type': 'application/json'
    }
})


axiosInstance.interceptors.request.use(
    async (config) => {
      try {
        const token = await getToken('user');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.error('Error fetching token from AsyncStorage', err);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async(error) => {
      if (error.response?.status === 401) {
        await removeStorageData('user');

        showToastMessage('error', 'Unauthorized', 'Redirecting ...');
        
        navigate('Welcome'); // ⬅ Redirect
      }
      return Promise.reject(error);
    }
);
export default axiosInstance;