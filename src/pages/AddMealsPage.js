import React, { useState, useEffect } from 'react';
import { getBaseMeals } from '../services/api'; // API call to fetch available BaseMeals
import { addBulkSavedMeals } from '../services/api'; // API call to save meals

const AddMealPage = () => {
    const [meals, setMeals] = useState([]);
    const [selectedMeal, setSelectedMeal] = useState(null); // Changed to hold the entire meal object
    const [quantity, setQuantity] = useState('');
    const [macros, setMacros] = useState({
        calories: 0,
        carbs: 0,
        protein: 0,
        fats: 0
    });
    const [mealType, setMealType] = useState('BREAKFAST'); // New state for meal type
    const [message, setMessage] = useState('');

    // Fetch available BaseMeals on component mount
    useEffect(() => {
        const fetchMeals = async () => {
            try {
                const response = await getBaseMeals();
                setMeals(response.data); // Store BaseMeals
            } catch (error) {
                console.error('Error fetching BaseMeals:', error);
            }
        };
        fetchMeals();
    }, []);

    // Handle selection of a BaseMeal and calculation of macros
    const handleMealSelect = (event) => {
        const mealId = event.target.value;
        const meal = meals.find((meal) => meal.id.toString() === mealId.toString());
        setSelectedMeal(meal);  // Store the entire meal object
        calculateMacros(meal, quantity); // Pass the meal object to the calculation function
    };

    // Handle quantity input and calculate macros accordingly
    const handleQuantityChange = (event) => {
        const value = event.target.value;
        setQuantity(value);
        if (selectedMeal) {
            calculateMacros(selectedMeal, value); // Pass the meal object to the calculation function
        }
    };

    // Function to calculate macros based on selected meal and quantity
    const calculateMacros = (meal, quantity) => {
        if (!meal || !quantity) return;
        const multiplier = parseInt(quantity) / 100; // Calculating per 100g ratio
        setMacros({
            calories: (meal.calories * multiplier).toFixed(2),
            carbs: (meal.carbs * multiplier).toFixed(2),
            protein: (meal.protein * multiplier).toFixed(2),
            fats: (meal.fats * multiplier).toFixed(2),
        });
    };

    // Handle meal type change
    const handleMealTypeChange = (event) => {
        setMealType(event.target.value);
    };

    const handleSaveMeal = async () => {
        if (!selectedMeal || !quantity) {
            setMessage('Please select a meal and quantity.');
            return;
        }

        const savedMeal = {
            quantity: quantity,
            calories: macros.calories,
            carbs: macros.carbs,
            protein: macros.protein,
            fats: macros.fats,
            name: selectedMeal.name,
            date: new Date().toISOString().split('T')[0],
            type: mealType
        };

        try {
            await addBulkSavedMeals([savedMeal]);
            setMessage('Meal saved successfully!');
        } catch (error) {
            setMessage('Error saving meal.');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Food Tracker - Add Meal</h2>
            <div>
                <h3>Meal</h3>
                <div>
                    <label>Select Meal: </label>
                    <select value={selectedMeal?.id || ''} onChange={handleMealSelect}>
                        <option value="">--Select Meal--</option>
                        {meals.map((meal) => (
                            <option key={meal.id} value={meal.id}>
                                {meal.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Quantity (in grams): </label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={handleQuantityChange}
                        min="1"
                    />
                </div>

                {/* Dropdown for Meal Type */}
                <div>
                    <label>Meal Type: </label>
                    <select value={mealType} onChange={handleMealTypeChange}>
                        <option value="BREAKFAST">Breakfast</option>
                        <option value="LUNCH">Lunch</option>
                        <option value="DINNER">Dinner</option>
                    </select>
                </div>

                <div style={{ color: 'red', fontSize: '14px' }}>
                    {message && <p>{message}</p>}
                </div>
                <div>
                    <h4>Summary</h4>
                    <p>Calories: {macros.calories} kcal</p>
                    <p>Carbs: {macros.carbs} g</p>
                    <p>Protein: {macros.protein} g</p>
                    <p>Fats: {macros.fats} g</p>
                </div>
                <button onClick={handleSaveMeal}>Save Meal</button>
            </div>
        </div>
    );
};

export default AddMealPage;
