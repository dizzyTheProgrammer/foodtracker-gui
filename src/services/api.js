import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getBaseMeals = () => {
    return api.get('/basemeal/list');
};

export const getSavedMealsByDate = (date) => {
    return api.get('/savedmeals/bydate', {
        params: { date },
    });
};

export const addBulkSavedMeals = (meals) => {
    return api.post('/savedmeals/bulk', meals);
};

export const getMealsByMonth = async (year, month) => {
    try {
        return await api.get('/savedmeals/list-per-month', {  // Use `api.get` to use the axios instance
            params: {
                year,
                month,
            },
        });
    } catch (error) {
        console.error('Error fetching meals by month:', error);
        throw error; // You can handle the error in the component when calling this function
    }
};
