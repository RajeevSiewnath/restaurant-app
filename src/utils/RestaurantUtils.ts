import {
    DayOfWeek,
    DaysOfWeek,
    OpenCloseTimeSlot,
    OpeningHourEntry,
    RestaurantRequest,
    TimeType
} from "../types/Restaurant";
import moment from "moment";

export class RestaurantUtils {

    static sortOpeningHours(restaurant: RestaurantRequest): void {
        for (const day of DaysOfWeek) {
            restaurant.openingHours[day] = restaurant.openingHours[day]
                .sort((a: OpeningHourEntry, b: OpeningHourEntry) => a.value - b.value);
        }
    }

    static isValid(restaurant: RestaurantRequest): boolean {
        this.sortOpeningHours(restaurant);
        let openedOvernight = restaurant.openingHours[DayOfWeek.Sunday].length > 0 && restaurant.openingHours[DayOfWeek.Sunday][restaurant.openingHours[DayOfWeek.Sunday].length - 1].type === TimeType.Open;
        for (const day of DaysOfWeek) {
            // opening and closing have to alternate
            let currentType: TimeType | null = null;
            // if opened overnight make sure that it is closed on the day
            if (openedOvernight && (restaurant.openingHours[day].length === 0 || restaurant.openingHours[day][0].type !== TimeType.Close)) {
                return false;
            }
            const valid = restaurant.openingHours[day].reduce((acc: boolean, entry: OpeningHourEntry) => {
                if (!acc) {
                    return false;
                } else {
                    if (currentType === null || currentType !== entry.type) {
                        currentType = entry.type;
                        return true;
                    } else {
                        return false;
                    }
                }
            }, true);
            if (!valid) {
                return false;
            }
            openedOvernight = restaurant.openingHours[day].length > 0 && restaurant.openingHours[day][restaurant.openingHours[day].length - 1].type === TimeType.Open;
        }
        return true;
    }

    static isOpenOnDay(restaurant: RestaurantRequest, day: DayOfWeek): boolean {
        return restaurant.openingHours[day].length > 0 &&
            (restaurant.openingHours[day].length !== 1 || restaurant.openingHours[day][0].type !== TimeType.Close);
    }

    static isClosedOnDay(restaurant: RestaurantRequest, day: DayOfWeek): boolean {
        return restaurant.openingHours[day].length === 0 ||
            (restaurant.openingHours[day].length === 1 && restaurant.openingHours[day][0].type === TimeType.Close);
    }

    static getSlotsOfDay(restaurant: RestaurantRequest, day: DayOfWeek): Array<OpenCloseTimeSlot> {
        const entries = restaurant.openingHours[day];
        if (entries.length > 0 && entries[0].type === TimeType.Close) {
            entries.splice(0, 1);
        }
        if (entries.length > 0 && entries[entries.length - 1].type === TimeType.Open) {
            const dayIndex = DaysOfWeek.findIndex(d => d === day);
            let nextDay = dayIndex === DaysOfWeek.length - 1 ? DaysOfWeek[0] : DaysOfWeek[dayIndex + 1];
            entries.push(restaurant.openingHours[nextDay][restaurant.openingHours[nextDay].length - 1]);
        }
        const slots: Array<OpenCloseTimeSlot> = [];
        for (let i = 0; i < entries.length; i += 2) {
            slots.push({
                open: entries[i].value,
                close: entries[i + 1].value,
            })
        }
        return slots;
    }

    static getSlotsOfDays(restaurant: RestaurantRequest): Record<DayOfWeek, Array<OpenCloseTimeSlot>> {
        return {
            [DayOfWeek.Monday]: this.getSlotsOfDay(restaurant, DayOfWeek.Monday),
            [DayOfWeek.Tuesday]: this.getSlotsOfDay(restaurant, DayOfWeek.Tuesday),
            [DayOfWeek.Wednesday]: this.getSlotsOfDay(restaurant, DayOfWeek.Wednesday),
            [DayOfWeek.Thursday]: this.getSlotsOfDay(restaurant, DayOfWeek.Thursday),
            [DayOfWeek.Friday]: this.getSlotsOfDay(restaurant, DayOfWeek.Friday),
            [DayOfWeek.Saturday]: this.getSlotsOfDay(restaurant, DayOfWeek.Saturday),
            [DayOfWeek.Sunday]: this.getSlotsOfDay(restaurant, DayOfWeek.Sunday),
        };
    }

    static fromTimeString(time: string): number {
        return moment.duration(time).asSeconds();
    }

    static toTimeString(value: number, altFormat = false): string {
        return moment.utc(value * 1000).format(altFormat ? 'h A' : 'HH:mm');
    }

}
