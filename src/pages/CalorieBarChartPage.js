import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { getMealsByMonth } from '../services/api'; // Import the API function

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CalorieBarChartPage = () => {
    const [chartData, setChartData] = useState({
        labels: [], // Days of the month
        datasets: [{
            label: 'Calories per Day',
            data: [], // Total calories for each day
            backgroundColor: '#C1BAA1', // Bar color
            borderColor: '#494236',
            borderWidth: 1,
        }],
    });

    const [currentMonth, setCurrentMonth] = useState('');

    useEffect(() => {
        const fetchCaloriesData = async () => {
            try {
                const year = new Date().getFullYear(); // Get current year
                const month = new Date().getMonth() + 1; // Get current month (1-based index)

                // Set current month display
                const monthNames = [
                    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
                ];
                setCurrentMonth(`${monthNames[month - 1]} ${year}`);

                // Call the API function instead of axios directly
                const response = await getMealsByMonth(year, month);

                const meals = response.data;

                // Process meals to calculate total calories per day
                const dailyCalories = Array(31).fill(0); // Array to store daily calories (31 days max)

                meals.forEach((meal) => {
                    const day = meal.date.split('-')[2]; // Extract day from the date (format: YYYY-MM-DD)
                    const dayIndex = parseInt(day, 10) - 1; // Convert day to 0-based index
                    dailyCalories[dayIndex] += meal.calories; // Add calories to the corresponding day
                });

                // Prepare chart data
                const daysOfMonth = Array.from({ length: 31 }, (_, index) => index + 1); // Days 1-31
                setChartData({
                    labels: daysOfMonth,
                    datasets: [{
                        label: 'Calories per Day',
                        data: dailyCalories,
                        backgroundColor: '#A59D84',
                        borderColor: '#494236',
                        borderWidth: 1,
                    }],
                });
            } catch (error) {
                console.error('Error fetching calories data:', error);
            }
        };

        fetchCaloriesData();
    }, []);

    const styles = {
        container: {
            textAlign: 'center',
            backgroundColor: '#F8F5E9',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            margin: '40px auto',
            maxWidth: '900px',
        },
        header: {
            color: '#333',
            fontWeight: '600',
            margin: '10px 0',
            fontSize: '28px',
        },
        subHeader: {
            color: '#555',
            fontSize: '18px',
            marginBottom: '20px',
        },
        chartContainer: {
            height: '400px',
            width: '80%',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '10px',
            backgroundColor: '#F8F5E9',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Monthly Calorie Intake</h2>
            <h4 style={styles.subHeader}>{currentMonth}</h4> {/* Display current month */}
            <div style={styles.chartContainer}>
                <Bar data={chartData} options={{
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Total Calories per Day',
                            font: {
                                size: 16,
                                family: 'Arial',
                                weight: 'bold',
                            },
                            color: '#444',
                        },
                        tooltip: {
                            callbacks: {
                                label: (tooltipItem) => {
                                    return `${tooltipItem.raw} kcal`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Day of the Month',
                                color: '#555',
                                font: {
                                    size: 14,
                                },
                            },
                            ticks: {
                                color: '#333',
                                font: {
                                    size: 12,
                                },
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Calories',
                                color: '#555',
                                font: {
                                    size: 14,
                                },
                            },
                            ticks: {
                                color: '#333',
                                font: {
                                    size: 12,
                                },
                            },
                            min: 0,
                        },
                    },
                }} />
            </div>
        </div>
    );
};

export default CalorieBarChartPage;
