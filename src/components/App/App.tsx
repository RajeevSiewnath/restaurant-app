import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {Restaurants} from "../Restaurants/Restaurants";
import RestaurantCreate from "../RestaurantCreate/RestaurantCreate";
import {RestaurantUpdate} from "../RestaurantUpdate/RestaurantUpdate";
import {RestaurantView} from "../RestaurantView/RestaurantView";

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={Restaurants}/>
                <Route path="/add" exact component={RestaurantCreate}/>
                <Route path="/:key/edit" component={RestaurantUpdate}/>
                <Route path="/:key" component={RestaurantView}/>
            </Switch>
        </Router>
    );
}

export default App;
