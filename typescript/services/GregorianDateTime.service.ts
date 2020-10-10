import {GregorianDateTime} from "../models/time/GregorianDateTime";
import {JulianDay} from "../models/time/JulianDay";

/**
 * 'Astronomical Algorithms' by Jean Meeus
 * Chapiter 7 -> p.60-61
 */
export class GregorianDateTimeService {

    // PUBLIC METHODS
    /**
     * Convert a Gregorian Date Time to Julian Day.
     * @param gregorianDateTime : GregorianDateTime
     * @return JulianDay
     */
    public static convertToJulianDay(gregorianDateTime: GregorianDateTime): JulianDay {
        var jd_year = this.define_year(gregorianDateTime.year, gregorianDateTime.month);
        var jd_month = this.define_month(gregorianDateTime.month);
        var jd_day = this.define_decimalDay(gregorianDateTime.day, gregorianDateTime.hours, gregorianDateTime.minutes, gregorianDateTime.seconds);
        var jd_A = this.define_A(jd_year);
        var jd_B = this.define_B(jd_A, true);
        return new JulianDay(this.calculate_JulianDay(jd_year, jd_month, jd_B, jd_day));
    }

    /**
     * Return the current Gregorian Date Time.
     * @return GregorianDateTime
     */
    public static now(): GregorianDateTime {
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
    /**
     * Define year following the formula to calculate the JulianDay.
     * Chapiter 7 -> p.60-61
     * @param year : number
     * @param month : number
     * @return number
     */
    private static define_year(year : number, month : number) {
        if (month === 1 || month === 2) {
            return year - 1;
        } else {
            return year;
        }
    }

    /**
     * Define month following the formula to calculate the JulianDay.
     * Chapiter 7 -> p.60-61
     * @param month : number
     * @return number - The Month parameter to calculate JulianDay.
     */
    private static define_month(month : number) : number {
        if (month === 1 || month === 2) {
            return month + 12;
        } else {
            return month;
        }
    }

    /**
     * Define the A parameter to calculate JulianDay.
     * @param _year : number
     * @return number
     */
    private static define_A(_year : number) : number {
        return Math.floor(_year / 100);
    }

    /**
     * Define the B parameter to calculate JulianDay.
     * @param A : number - The A parameter calculate with the method "define_A"
     * @param isGregorianCalendar : boolean
     * @return number
     */
    private static define_B(A : number, isGregorianCalendar : boolean) : number {
        if (isGregorianCalendar) {
            return 2 - A + Math.floor(A / 4);
        } else {
            return 0;
        }
    }

    /**
     * Calculate the decimal Day to calculate the JulianDay.
     * @param day : number
     * @param hours : number
     * @param minutes : number
     * @param seconds : number
     * @return number - The day value in decimal.
     */
    private static define_decimalDay(day : number, hours : number, minutes : number, seconds : number) : number {
        var minutes_decimal = minutes + (seconds / 60);
        var hoursdecimal = hours + (minutes_decimal / 60);
        return day + (hoursdecimal / 24)
    }

    /**
     * Calculate the JulianDay following the formula.
     * @param year : number
     * @param month : number
     * @param B : number - The B parameter calculate with the method "define_B"
     * @param decimalDay : number
     * @return number - The JulianDay value.
     */
    private static calculate_JulianDay(year : number, month : number, B : number, decimalDay : number) : number {
        return Math.floor(365.25 * (year + 4716))
            + Math.floor(30.6001 * (month + 1))
            + decimalDay + B - 1524.5;
    }
}
