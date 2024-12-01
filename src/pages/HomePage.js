import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';
import { getSavedMealsByDate } from '../services/api';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const HomePage = () => {
    const [meals, setMeals] = useState([]);  // Initialize as empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchMeals = async () => {
            try {
                const response = await getSavedMealsByDate(today);
                // Ensure response data is always an array
                setMeals(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                setError('Failed to fetch meals');
            } finally {
                setLoading(false);
            }
        };

        fetchMeals();
    }, [today]);

    // Calculate daily summary
    const calculateSummary = () => {
        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFats = 0;

        meals.forEach(meal => {
            totalCalories += meal.calories || 0;
            totalProtein += meal.protein || 0;
            totalCarbs += meal.carbs || 0;
            totalFats += meal.fats || 0;
        });

        return {
            totalCalories,
            totalProtein,
            totalCarbs,
            totalFats,
        };
    };

    const formatToTwoDecimalPlaces = (value) => {
        return parseFloat(value).toFixed(2);
    };

    const summary = calculateSummary();

    if (loading) return <div className="loader">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="homepage-container">
            <header className="homepage-header">
                <h1>Food Tracker</h1>
                <p>Track your meals, calories, and macros effortlessly.</p>
            </header>

            <section className="overview-section">
                <h2>Today's Overview</h2>
                <div className="summary-container">
                    <table className="summary-table">
                        <tbody>
                        <tr>
                            <th>Total Calories</th>
                            <td>{formatToTwoDecimalPlaces(summary.totalCalories)} kcal</td>
                        </tr>
                        <tr>
                            <th>Total Protein</th>
                            <td>{formatToTwoDecimalPlaces(summary.totalProtein)} g</td>
                        </tr>
                        <tr>
                            <th>Total Carbs</th>
                            <td>{formatToTwoDecimalPlaces(summary.totalCarbs)} g</td>
                        </tr>
                        <tr>
                            <th>Total Fats</th>
                            <td>{formatToTwoDecimalPlaces(summary.totalFats)} g</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="meals-section">
                <h2>Meal Details</h2>
                <table className="meals-table">
                    <thead>
                    <tr>
                        <th>Meal Name</th>
                        <th>Calories</th>
                        <th>Protein (g)</th>
                        <th>Carbs (g)</th>
                        <th>Fats (g)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {meals.length > 0 ? (
                        meals.map((meal, index) => (
                            <tr key={index}>
                                <td>{meal.name}</td>
                                <td>{meal.calories || 0}</td>
                                <td>{meal.protein || 0}</td>
                                <td>{meal.carbs || 0}</td>
                                <td>{meal.fats || 0}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No meals logged for today</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default HomePage;
