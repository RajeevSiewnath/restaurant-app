import React, {Component} from "react";
import {DayOfWeek, DaysOfWeek, OpenCloseTimeSlot, RestaurantResponse as RestaurantType} from "../../types/Restaurant";
import moment from "moment";
import "./Restaurant.css";
import {RestaurantUtils} from "../../utils/RestaurantUtils";

interface Props {
    restaurant: RestaurantType
}

const dayMomentMap = new Map<number, DayOfWeek>([
    [0, DayOfWeek.Sunday],
    [1, DayOfWeek.Monday],
    [2, DayOfWeek.Tuesday],
    [3, DayOfWeek.Wednesday],
    [4, DayOfWeek.Thursday],
    [5, DayOfWeek.Friday],
    [6, DayOfWeek.Saturday],
]);

export class Restaurant extends Component<Props> {

    render() {
        return <div className="center stretch frame">
            <h1>Opening hours for {this.props.restaurant.name}</h1>
            <hr/>
            {DaysOfWeek.map(day => this.renderDay(day))}
        </div>
    }

    renderDay(day: DayOfWeek) {
        const today = moment().day();
        return <React.Fragment key={day}>
            <div className="day-slot">
                <div>
                    <strong>{this.dayName(day)}</strong>
                    {dayMomentMap.get(today) === day &&
					<React.Fragment>&nbsp;<span className="highlight">today</span></React.Fragment>}
                </div>
                <div>
                    {RestaurantUtils.isClosedOnDay(this.props.restaurant, day) ?
                        <span className="dark-grey">Closed</span> : <span>
                            {RestaurantUtils.getSlotsOfDay(this.props.restaurant, day).map((value: OpenCloseTimeSlot) => `${RestaurantUtils.toTimeString(value.open, true)} - ${RestaurantUtils.toTimeString(value.close, true)}`).join(', ')}
                        </span>}
                </div>
            </div>
            <hr className="medium-grey"/>
        </React.Fragment>
    }

    dayName(day: DayOfWeek) {
        return day.charAt(0).toUpperCase() + day.slice(1);
    }

}
