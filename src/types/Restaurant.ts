import {OpeningHours} from "./OpeningHours";

export interface RestaurantRequest {
    name: string;
    openingHours: OpeningHours;
}

export interface Restaurant extends RestaurantRequest {
    key: string;
}
