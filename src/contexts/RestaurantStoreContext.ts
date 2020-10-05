import {action, observable} from "mobx";
import {Restaurant, RestaurantRequest} from "../types/Restaurant";
import {v4} from "uuid";
import {createContext} from "react";

const LOCAL_STORAGE_KEY = "RestaurantStoreContext";
export const ERROR_NOT_FOUND = "Restaurant not found";

export class RestaurantStore {

    @observable restaurants: Array<Restaurant>;

    constructor() {
        const storageEntry = localStorage.getItem(LOCAL_STORAGE_KEY);
        this.restaurants = storageEntry ? JSON.parse(storageEntry) : [];
    }

    private updateToStorage() {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.restaurants));
    }

    async list(): Promise<Array<Restaurant>> {
        return this.restaurants;
    }

    async get(key: string): Promise<Restaurant> {
        const restaurant = this.restaurants.find(r => r.key === key);
        if (restaurant) {
            return restaurant;
        } else {
            throw new Error(ERROR_NOT_FOUND);
        }
    }

    @action
    async post(restaurant: RestaurantRequest): Promise<Restaurant> {
        const r = {...restaurant, key: v4()};
        this.restaurants.push(r);
        this.updateToStorage();
        return r;
    }

    @action
    async put(key: string, restaurant: RestaurantRequest): Promise<Restaurant> {
        const idx = this.restaurants.findIndex(r => r.key === key);
        if (idx >= 0) {
            this.restaurants[idx] = {...this.restaurants[idx], ...restaurant};
            this.updateToStorage();
            return this.restaurants[idx];
        } else {
            throw new Error(ERROR_NOT_FOUND);
        }
    }

    @action
    async delete(key: string): Promise<void> {
        const idx = this.restaurants.findIndex(r => r.key === key);
        if (idx >= 0) {
            this.restaurants.splice(idx, 1);
            this.updateToStorage();
        } else {
            throw new Error(ERROR_NOT_FOUND);
        }
    }

}

const RestaurantStoreContext = createContext(new RestaurantStore());
export default RestaurantStoreContext;
