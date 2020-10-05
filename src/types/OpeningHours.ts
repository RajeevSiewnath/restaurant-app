export enum DayOfWeek {
    Monday = "monday",
    Tuesday = "tuesday",
    Wednesday = "wednesday",
    Thursday = "thursday",
    Friday = "friday",
    Saturday = "saturday",
    Sunday = "sunday",
}

export const DaysOfWeek = [
    DayOfWeek.Monday,
    DayOfWeek.Tuesday,
    DayOfWeek.Wednesday,
    DayOfWeek.Thursday,
    DayOfWeek.Friday,
    DayOfWeek.Saturday,
    DayOfWeek.Sunday,
];

export enum TimeType {
    Open = "open",
    Close = "close",
}

export interface OpeningHourEntry {
    type: TimeType;
    value: number;
}

export type OpeningHoursRequest = Partial<Record<DayOfWeek, Array<OpeningHourEntry>>>;
export type OpeningHours = OpeningHoursRequest;
