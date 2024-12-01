import React, {useState} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import react-datepicker styles
import {getSavedMealsByDate} from '../services/api';
import '../styles/SavedMealsByDatePage.css'; // Import your custom styles
import { FaCalendarAlt } from "react-icons/fa";

const SavedMealsByDatePage = () => {
    const [date, setDate] = useState(new Date()); // Use `new Date()` as the default
    const [savedMeals, setSavedMeals] = useState([]);
    const [error, setError] = useState(null);

    const fetchSavedMeals = async () => {
        try {
            // Format the date to "YYYY-MM-DD" before sending to the API
            const formattedDate = date.toISOString().split('T')[0];
            const response = await getSavedMealsByDate(formattedDate);

            if (Array.isArray(response.data)) {
                if (response.data.length > 0) {
                    setSavedMeals(response.data);
                    setError(null);
                } else {
                    setSavedMeals([]);
                    setError('No meals found for the selected date.');
                }
            } else {
                setSavedMeals([]);
                setError('Invalid response format.');
            }
        } catch (err) {
            if (err.response) {
                if (err.response.status === 204) {
                    setSavedMeals([]);
                    setError('No meals found for the selected date.');
                } else {
                    setError('Error fetching saved meals.');
                }
            } else {
                setError('An unexpected error occurred.');
            }
        }
    };

    const summary = savedMeals.reduce(
        (totals, meal) => {
            totals.calories += meal.calories || 0;
            totals.protein += meal.protein || 0;
            totals.carbs += meal.carbs || 0;
            totals.fats += meal.fats || 0;
            return totals;
        },
        {calories: 0, protein: 0, carbs: 0, fats: 0}
    );

    const formatToTwoDecimalPlaces = (value) => {
        return parseFloat(value).toFixed(2);
    };

    function calculateMacronutrientPercentages(meal) {
        const totalCalories = (meal.protein * 4) + (meal.carbs * 4) + (meal.fats * 9);

        const proteinPercentage = (meal.protein * 4 / totalCalories) * 100;
        const carbsPercentage = (meal.carbs * 4 / totalCalories) * 100;
        const fatsPercentage = (meal.fats * 9 / totalCalories) * 100;

        return {
            proteinPercentage: proteinPercentage.toFixed(2), // Round to 2 decimals
            carbsPercentage: carbsPercentage.toFixed(2),
            fatsPercentage: fatsPercentage.toFixed(2),
        };
    }

    return (
        <div className="container">
            <h1>Check Your Meals History</h1>
            <div className="date-picker-container">
                <div className="custom-datepicker-wrapper">
                    <DatePicker
                        selected={date}
                        onChange={(selectedDate) => setDate(selectedDate)}
                        dateFormat="yyyy-MM-dd"
                        className="custom-datepicker"
                        placeholderText="Select a date"
                    />
                    <FaCalendarAlt className="calendar-icon"/>
                </div>
                <button onClick={fetchSavedMeals} className="fetch-button">
                    Fetch Meals
                </button>
            </div>
            {error && <p className="error-message">{error}</p>}
            {savedMeals.length > 0 ? (
                <>
                    <ul>
                        {savedMeals.map((meal) => (
                            <li key={meal.id}>
                                <strong>{meal.name}</strong> - {meal.calories} kcal
                                <div className="meal-info">
                                    <p className="meal-info-item">Quantity: {meal.quantity}g</p>
                                    <p className="meal-info-item">Protein: {meal.protein} g</p>
                                    <p className="meal-info-item">Carbs: {meal.carbs} g</p>
                                    <p className="meal-info-item">Fats: {meal.fats} g</p>
                                </div>
                                <div className="progress-bar-container">
                                    {(() => {
                                        const {
                                            proteinPercentage,
                                            carbsPercentage,
                                            fatsPercentage,
                                        } = calculateMacronutrientPercentages(meal);

                                        return (
                                            <>
                                                <div className="progress-bar-item">
                                                    <span
                                                        className="progress-bar-label">{proteinPercentage}% Protein</span>
                                                    <div className="progress-bar protein-bar">
                        <span
                            data-value={`${proteinPercentage}%`}
                            style={{
                                width: `${proteinPercentage}%`,
                                backgroundColor: '#28a745',
                            }}
                        ></span>
                                                    </div>
                                                </div>
                                                <div className="progress-bar-item">
                                                    <span className="progress-bar-label">{carbsPercentage}% Carbs</span>
                                                    <div className="progress-bar carbs-bar">
                        <span
                            data-value={`${carbsPercentage}%`}
                            style={{
                                width: `${carbsPercentage}%`,
                                backgroundColor: '#ffc107',
                            }}
                        ></span>
                                                    </div>
                                                </div>
                                                <div className="progress-bar-item">
                                                    <span className="progress-bar-label">{fatsPercentage}% Fats</span>
                                                    <div className="progress-bar fats-bar">
                        <span
                            data-value={`${fatsPercentage}%`}
                            style={{
                                width: `${fatsPercentage}%`,
                                backgroundColor: '#dc3545',
                            }}
                        ></span>
                                                    </div>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>

                            </li>
                        ))}
                    </ul>
                    <h3>Summary</h3>
                    <div className="summary">
                        <p>Total Calories: {formatToTwoDecimalPlaces(summary.calories)} kcal</p>
                        <p>Total Protein: {formatToTwoDecimalPlaces(summary.protein)} g</p>
                        <p>Total Carbs: {formatToTwoDecimalPlaces(summary.carbs)} g</p>
                        <p>Total Fats: {formatToTwoDecimalPlaces(summary.fats)} g</p>
                    </div>

                </>
            ) : (
                <p>No meals available for the selected date.</p>
            )}
        </div>
    );
};

export default SavedMealsByDatePage;
