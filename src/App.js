import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUtensils, faPlus, faChartBar } from '@fortawesome/free-solid-svg-icons';
import HomePage from './pages/HomePage';
import SavedMealsByDatePage from './pages/SavedMealsByDatePage';
import AddMealsPage from './pages/AddMealsPage';
import CalorieBarChartPage from './pages/CalorieBarChartPage';
import './App.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

// Component for navigation and transitions
const AppContent = () => {
    const location = useLocation();

    return (
        <>
            <nav className="navbar">
                <div className="logo">
                    <img src="/logo.png" alt="Logo" />
                    <span>FOOD TRACKER</span>
                </div>
                <div className="nav-links">
                    <NavLink
                        to="/"
                        className={({ isActive }) => (isActive ? 'nav-link active-link' : 'nav-link')}
                    >
                        <FontAwesomeIcon icon={faHome} /> Home
                    </NavLink>
                    <NavLink
                        to="/saved-meals"
                        className={({ isActive }) => (isActive ? 'nav-link active-link' : 'nav-link')}
                    >
                        <FontAwesomeIcon icon={faUtensils} /> Saved Meals
                    </NavLink>
                    <NavLink
                        to="/add-meals"
                        className={({ isActive }) => (isActive ? 'nav-link active-link' : 'nav-link')}
                    >
                        <FontAwesomeIcon icon={faPlus} /> Add Meals
                    </NavLink>
                    <NavLink
                        to="/calories"
                        className={({ isActive }) => (isActive ? 'nav-link active-link' : 'nav-link')}
                    >
                        <FontAwesomeIcon icon={faChartBar} /> Calorie Chart
                    </NavLink>
                </div>
            </nav>

            <TransitionGroup>
                <CSSTransition key={location.key} classNames="fade" timeout={300}>
                    <Routes location={location}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/saved-meals" element={<SavedMealsByDatePage />} />
                        <Route path="/add-meals" element={<AddMealsPage />} />
                        <Route path="/calories" element={<CalorieBarChartPage />} />
                    </Routes>
                </CSSTransition>
            </TransitionGroup>
        </>
    );
};

// Main app component with Router
const App = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
};

export default App;
