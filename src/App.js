import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUtensils, faSave, faPlus, faChartBar } from '@fortawesome/free-solid-svg-icons';
import HomePage from './pages/HomePage';
import BaseMealsPage from './pages/BaseMealsPage';
import SavedMealsByDatePage from './pages/SavedMealsByDatePage';
import AddMealsPage from './pages/AddMealsPage';
import CalorieBarChartPage from './pages/CalorieBarChartPage'; // Import the CalorieBarChartPage
import './App.css'; // Import custom styles

const App = () => {
    return (
        <Router>
            <nav className="navbar">
                <NavLink to="/" className="nav-link" activeClassName="active-link">
                    <FontAwesomeIcon icon={faHome} /> Home
                </NavLink>
                <NavLink to="/base-meals" className="nav-link" activeClassName="active-link">
                    <FontAwesomeIcon icon={faUtensils} /> Base Meals
                </NavLink>
                <NavLink to="/saved-meals" className="nav-link" activeClassName="active-link">
                    <FontAwesomeIcon icon={faSave} /> Saved Meals
                </NavLink>
                <NavLink to="/add-meals" className="nav-link" activeClassName="active-link">
                    <FontAwesomeIcon icon={faPlus} /> Add Meals
                </NavLink>
                <NavLink to="/calories" className="nav-link" activeClassName="active-link">
                    <FontAwesomeIcon icon={faChartBar} /> Calorie Chart
                </NavLink>
            </nav>

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/base-meals" element={<BaseMealsPage />} />
                <Route path="/saved-meals" element={<SavedMealsByDatePage />} />
                <Route path="/add-meals" element={<AddMealsPage />} />
                <Route path="/calories" element={<CalorieBarChartPage />} />
            </Routes>
        </Router>
    );
};

export default App;
