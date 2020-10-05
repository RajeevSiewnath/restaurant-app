import React, {Component, Context} from "react";
import RestaurantStoreContext, {RestaurantStore} from "../../contexts/RestaurantStoreContext";
import RestaurantForm from "../RestaurantForm/RestaurantForm";
import {RestaurantRequest} from "../../types/Restaurant";
import {RouteComponentProps} from "react-router-dom";

interface Props extends RouteComponentProps<{}> {
}

export default class RestaurantCreate extends Component<Props> {

    static contextType: Context<RestaurantStore> = RestaurantStoreContext;
    context: RestaurantStore;

    constructor(props: Props, context: any) {
        super(props, context);
        this.onSave = this.onSave.bind(this);
    }

    render() {
        return <div className="center stretch">
            <h1>Add restaurant</h1>
            <RestaurantForm onSave={this.onSave}/>
        </div>;
    }

    async onSave(request: RestaurantRequest) {
        await this.context.post(request);
        this.props.history.push("/");
    }

}
