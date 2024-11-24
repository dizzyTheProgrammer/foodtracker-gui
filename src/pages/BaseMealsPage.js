import React, { useEffect, useState } from 'react';
import { getBaseMeals } from '../services/api';

const BaseMealsPage = () => {
    const [baseMeals, setBaseMeals] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBaseMeals = async () => {
            try {
                const response = await getBaseMeals();
                setBaseMeals(response.data);
            } catch (err) {
                setError('Error fetching base meals.');
            }
        };

        fetchBaseMeals();
    }, []);

    return (
        <div className="container">
            <h1>Base Meals</h1>
            {error && <p>{error}</p>}
            <ul>
                {baseMeals.map((meal) => (
                    <li key={meal.id}>
                        <strong>{meal.name}</strong> - {meal.calories} kcal
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BaseMealsPage;
