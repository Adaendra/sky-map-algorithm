import {JulianDay} from "./JulianDay";
import {GregorianDateTime} from "../models/time/GregorianDateTime";

/**
 * 'Astronomical Algorithms' by Jean Meeus
 * Chapiter 7 -> p.60-61
 */
export class GregorianDateTimeService {

    // PUBLIC METHODS
    public static convertToJulianDay(gregorianDateTime: GregorianDateTime): JulianDay {
        var jd_year = this.define_year(gregorianDateTime.year, gregorianDateTime.month);
        var jd_month = this.define_month(gregorianDateTime.month);
        var jd_day = this.define_decimalDay(gregorianDateTime.day, gregorianDateTime.hours, gregorianDateTime.minutes, gregorianDateTime.seconds);
        var jd_A = this.define_A(jd_year);
        var jd_B = this.define_B(jd_A, true);
        return new JulianDay(this.calculate_JulianDay(jd_year, jd_month, jd_B, jd_day));
    }

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
    private static define_year(_year, _month) {
        if (_month === 1 || _month === 2) {
            return _year - 1;
        } else {
            return _year;
        }
    }

    private static define_month(_month) {
        if (_month === 1 || _month === 2) {
            return _month + 12;
        } else {
            return _month;
        }
    }

    private static define_A(_year) {
        return Math.floor(_year / 100);
    }

    private static define_B(_A, isGregorianCalendar) {
        if (isGregorianCalendar) {
            return 2 - _A + Math.floor(_A / 4);
        } else {
            return 0;
        }
    }

    private static define_decimalDay(_day, _hours, _minutes, _seconds) {
        var minutes_decimal = _minutes + (_seconds / 60);
        var hours_decimal = _hours + (minutes_decimal / 60);
        return _day + (hours_decimal / 24)
    }

    private static calculate_JulianDay(_year, _month, _B, _decimalDay) {
        return Math.floor(365.25 * (_year + 4716))
            + Math.floor(30.6001 * (_month + 1))
            + _decimalDay + _B - 1524.5;
    }
}
