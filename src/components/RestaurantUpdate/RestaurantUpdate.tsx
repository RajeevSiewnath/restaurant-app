import React, {Component, Context} from "react";
import RestaurantStoreContext, {RestaurantStore} from "../../contexts/RestaurantStoreContext";
import RestaurantForm from "../RestaurantForm/RestaurantForm";
import {Restaurant, RestaurantRequest} from "../../types/Restaurant";
import {RouteComponentProps} from "react-router-dom";

interface Props extends RouteComponentProps<{ key: string }> {
}

interface State {
    restaurant: Restaurant;
}

export class RestaurantUpdate extends Component<Props, State> {

    static contextType: Context<RestaurantStore> = RestaurantStoreContext;
    context: RestaurantStore;
    state: State = {
        restaurant: {
            key: '',
            name: '',
            openingHours: {},
        }
    };

    constructor(props: Props, context: any) {
        super(props, context);
        this.onSave = this.onSave.bind(this);
    }

    componentDidMount(): void {
        (async () => {
            const restaurant = await this.context.get(this.props.match.params.key);
            this.setState({restaurant});
        })();
    }

    render() {
        return <div className="center stretch">
            <h1>Edit restaurant {this.state.restaurant.name}</h1>
            {this.state.restaurant.key && <RestaurantForm initialValues={this.state.restaurant} onSave={this.onSave}/>}
        </div>;
    }

    async onSave(request: RestaurantRequest) {
        await this.context.put(this.props.match.params.key, request);
        this.props.history.push("/");
    }

}
