export class GregorianDateTime {

    // ATTRIBUTES
    public year: number;
    public month: number;
    public day: number;

    public hours: number;
    public minutes: number;
    public seconds: number;

    // CONSTRUCTOR
    /**
     * @param year : number
     * @param month : number
     * @param day : number
     * @param hours : number
     * @param minutes : number
     * @param seconds : number
     * @param timeZone: number
     */
    constructor(
        year: number, month: number, day: number, hours: number, minutes: number, seconds: number, timeZone: number
    ) {
        this.year = year;
        this.month = month;
        this.day = day;
        this.hours = hours - Math.floor(timeZone);
        this.minutes = minutes - (timeZone % 1);
        this.seconds = seconds;
    }

}
