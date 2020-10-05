import React, {Component, Context} from "react";
import RestaurantStoreContext, {RestaurantStore} from "../../contexts/RestaurantStoreContext";
import {Link, RouteComponentProps} from "react-router-dom";
import {Restaurant} from "../../types/Restaurant";

interface Props extends RouteComponentProps {
}

interface State {
    restaurants: Array<Restaurant>;
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
