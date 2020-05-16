import {JulianDay} from "./JulianDay";

/**
 * 'Astronomical Algorithms' by Jean Meeus
 * Chapiter 7 -> p.60-61
 */
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

    // PUBLIC METHODS
    convertToJulianDay(): JulianDay {
        var jd_year = this.define_year(this.year, this.month);
        var jd_month = this.define_month(this.month);
        var jd_day = this.define_decimalDay(this.day, this.hours, this.minutes, this.seconds);
        var jd_A = this.define_A(jd_year);
        var jd_B = this.define_B(jd_A, true);
        return new JulianDay(this.calculate_JulianDay(jd_year, jd_month, jd_B, jd_day));
    }

    static now(): GregorianDateTime {
        var d = new Date();
        return new GregorianDateTime(
            d.getFullYear(),
            d.getMonth(),
            d.getDay(),
            d.getHours(),
            d.getMinutes(),
            d.getSeconds(),
            d.getTimezoneOffset() / 60
        );
    }

    // PRIVATE METHODS
    private define_year(_year, _month) {
        if (_month === 1 || _month === 2) {
            return _year - 1;
        } else {
            return _year;
        }
    }

    private define_month(_month) {
        if (_month === 1 || _month === 2) {
            return _month + 12;
        } else {
            return _month;
        }
    }

    private define_A(_year) {
        return Math.floor(_year / 100);
    }

    private define_B(_A, isGregorianCalendar) {
        if (isGregorianCalendar) {
            return 2 - _A + Math.floor(_A / 4);
        } else {
            return 0;
        }
    }

    private define_decimalDay(_day, _hours, _minutes, _seconds) {
        var minutes_decimal = _minutes + (_seconds / 60);
        var hours_decimal = _hours + (minutes_decimal / 60);
        return _day + (hours_decimal / 24)
    }

    private calculate_JulianDay(_year, _month, _B, _decimalDay) {
        return Math.floor(365.25 * (_year + 4716))
            + Math.floor(30.6001 * (_month + 1))
            + _decimalDay + _B - 1524.5;
    }
}
