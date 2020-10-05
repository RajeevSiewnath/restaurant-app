import React, {Component, Context} from "react";
import RestaurantStoreContext, {RestaurantStore} from "../../contexts/RestaurantStoreContext";
import {Link, RouteComponentProps} from "react-router-dom";
import {RestaurantResponse} from "../../types/Restaurant";

interface Props extends RouteComponentProps {
}

interface State {
    restaurants: Array<RestaurantResponse>;
}

export class Restaurants extends Component<Props, State> {

    static contextType: Context<RestaurantStore> = RestaurantStoreContext;
    context: RestaurantStore;
    state: State = {
        restaurants: [],
    };

    componentDidMount(): void {
        (async () => {
            const restaurants = await this.context.list();
            this.setState({restaurants});
        })();
    }

    render() {
        return <div className="center stretch">
            <h1>Restaurants</h1>
            {this.state.restaurants.length ?
                <ul>
                    {this.state.restaurants.map(restaurant =>
                        <li key={restaurant.key}>
                            <Link to={`/${restaurant.key}`}>{restaurant.name}</Link>
                            &nbsp;
                            <Link to={`/${restaurant.key}/edit`}>[edit]</Link>
                            &nbsp;
                            <a href="#" onClick={e => {
                                e.preventDefault();
                                if (window.confirm("Are you sure you want to delete this entry?")) {
                                    this.context.delete(restaurant.key).then(() => this.setState({restaurants: this.context.restaurants}));
                                }
                            }}>[delete]</a>
                        </li>
                    )}
                </ul> :
                <strong>No restaurants have been registered.</strong>
            }
            <div>
                <Link to="/add">Add restaurant</Link>
            </div>
        </div>
    }
}
