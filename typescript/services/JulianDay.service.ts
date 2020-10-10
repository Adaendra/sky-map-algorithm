import {JulianDay} from "../models/time/JulianDay";
import {GregorianDateTime} from "../models/time/GregorianDateTime";

/**
 * 'Astronomical Algorithms' by Jean Meeus
 * Chapiter 7 -> p.63
 */
export class JulianDayService {

    // PUBLIC METHODS
    /**
     * Convert a JulianDay to GregorianDateTime.
     * @param julianDay : JulianDay
     * @return GregorianDateTime
     */
    public static convertToGregorianDay(julianDay: JulianDay): GregorianDateTime {
        var J = julianDay.value + 0.5;
        var Z = Math.floor(J);
        var F = J - Math.floor(J);

        var A = this.define_A(Z);
        var B = A + 1524;
        var C = Math.floor((B - 122.1) / 365.25);
        var D = Math.floor(365.25 * C);
        var E = Math.floor((B - D) / 30.6001);


        var day_decimal = B - D - Math.floor(30.6001 * E) + F;
        var day = Math.floor(day_decimal);
        var month = E < 13.5 ? (E - 1) : (E - 13);
        var year = month > 2.5 ? (C - 4716) : (C - 4715);

        var hours_decimal = (day_decimal - day) * 24;
        var hours = Math.floor(hours_decimal);

        var minutes_decimal = (hours_decimal - hours) * 60;
        var minutes = Math.floor(minutes_decimal);

        var seconds = Math.floor((minutes_decimal - minutes) * 60);

        return new GregorianDateTime(year, month, day, hours, minutes, seconds, 0);
    }


    // PRIVATE METHODS
    /**
     * Calculate the A parameter to convert JulianDate to GregorianDateTime.
     * @param Z : number
     * @return number
     */
    private static define_A(Z : number) {
        if (Z < 2299161) {
            return Z;
        } else {
            var a = Math.floor((Z - 1867216.25) / 36534.25);
            return Z + 1 + a - Math.floor(a / 4);
        }
    }


}
