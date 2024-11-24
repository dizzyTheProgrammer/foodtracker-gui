import React, { useState } from 'react';
import { getSavedMealsByDate } from '../services/api';

const SavedMealsByDatePage = () => {
    const [date, setDate] = useState('');
    const [savedMeals, setSavedMeals] = useState([]);
    const [error, setError] = useState(null);

    const fetchSavedMeals = async () => {
        try {
            const response = await getSavedMealsByDate(date);

            // Ensure that response.data is always an array
            if (Array.isArray(response.data)) {
                if (response.data.length > 0) {
                    setSavedMeals(response.data);
                    setError(null);  // Reset error state if meals are found
                } else {
                    setSavedMeals([]);
                    setError('No meals found for the selected date.');
                }
            } else {
                setSavedMeals([]);
                setError('Invalid response format.');
            }
        } catch (err) {
            // Handle different error cases
            if (err.response) {
                if (err.response.status === 204) {
                    // If server returns 204, we already handle it above
                    setSavedMeals([]);
                    setError('No meals found for the selected date.');
                } else {
                    setError('Error fetching saved meals.');
                }
            } else {
                // In case there's a network or other error
                setError('An unexpected error occurred.');
            }
        }
    };

    return (
        <div className="container">
            <h1>Saved Meals by Date</h1>
            <div>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                <button onClick={fetchSavedMeals}>Fetch Meals</button>
            </div>
            {error && <p>{error}</p>}
            <ul>
                {Array.isArray(savedMeals) && savedMeals.length > 0 ? (
                    savedMeals.map((meal) => (
                        <li key={meal.id}>
                            <strong>{meal.name}</strong> - {meal.calories} kcal
                        </li>
                    ))
                ) : (
                    <p>No meals available for the selected date.</p>
                )}
            </ul>
        </div>
    );
};

export default SavedMealsByDatePage;
