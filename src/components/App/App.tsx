import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {Restaurants} from "../Restaurants/Restaurants";
import RestaurantCreate from "../RestaurantCreate/RestaurantCreate";
import {RestaurantUpdate} from "../RestaurantUpdate/RestaurantUpdate";
import {Restaurant} from "../Restaurant/Restaurant";

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={Restaurants}/>
                <Route path="/:key/edit" component={RestaurantUpdate}/>
                <Route path="/:key" component={Restaurant}/>
                <Route path="/add" exact component={RestaurantCreate}/>
            </Switch>
        </Router>
    );
}

export default App;
