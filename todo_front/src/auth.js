import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/';
axios.defaults.baseURL = API_URL;

const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (csrfToken) {
    axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
}

axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
});

const handleError = (error) => {
    console.error("Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || 'An error occurred. Please try again.');
};

export const register = async (username, email, password) => {
    try {
        return (await axios.post('register/', { username, email, password })).data;
    } catch (error) {
        handleError(error);
    }
};

export const login = async (username, password) => {
    try {
        const response = await axios.post('login/', { username, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const logout = () => localStorage.removeItem('token');

export const fetchTasks = async () => {
    try {
        return (await axios.get('tasks/')).data;
    } catch (error) {
        handleError(error);
    }
};

export const addTask = async (title, description) => {
    try {
        return (await axios.post('add/', { title, description })).data;
    } catch (error) {
        handleError(error);
    }
};

export const editTask = async (id, title, description) => {
    try {
        return (await axios.put(`/tasks/${id}/edit/`, { title, description })).data;
    } catch (error) {
        handleError(error);
    }
};

export const completeTask = async (id) => {
    try {
        return (await axios.patch(`/tasks/${id}/complete/`, { is_completed: true })).data;
    } catch (error) {
        handleError(error);
    }
};

export const deleteTask = async (id) => {
    try {
        await axios.delete(`tasks/${id}/`);
    } catch (error) {
        handleError(error);
    }
};
