import React, {Component, Context} from "react";
import RestaurantStoreContext, {RestaurantStore} from "../../contexts/RestaurantStoreContext";
import {RouteComponentProps} from "react-router-dom";
import {RestaurantResponse as RestaurantType} from "../../types/Restaurant";
import {Restaurant} from "../Restaurant/Restaurant";

interface Props extends RouteComponentProps<{ key: string }> {
}

interface State {
    restaurant: RestaurantType;
}

export class RestaurantView extends Component<Props, State> {

    static contextType: Context<RestaurantStore> = RestaurantStoreContext;
    context: RestaurantStore;

    componentDidMount(): void {
        (async () => {
            const restaurant = await this.context.get(this.props.match.params.key);
            this.setState({restaurant});
        })();
    }

    render() {
        return this.state && this.state.restaurant ? <Restaurant restaurant={this.state.restaurant}/> : null;
    }

}
