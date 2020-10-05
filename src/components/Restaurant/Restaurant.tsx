import React, {Component, Context} from "react";
import RestaurantStoreContext, {RestaurantStore} from "../../contexts/RestaurantStoreContext";
import {RouteComponentProps} from "react-router-dom";
import {Restaurant as RestaurantType} from "../../types/Restaurant";

interface Props extends RouteComponentProps<{ key: string }> {
}

interface State {
    restaurant: RestaurantType;
}

export class Restaurant extends Component<Props, State> {

    static contextType: Context<RestaurantStore> = RestaurantStoreContext;
    context: RestaurantStore;

    componentDidMount(): void {
        (async () => {
            const restaurant = await this.context.get(this.props.match.params.key);
            this.setState({restaurant});
        })();
    }

    render() {
        return <div className="center stretch">
            {this.state && this.state.restaurant &&
			<h1>{this.state.restaurant.name}</h1>
            }
        </div>
    }
}
