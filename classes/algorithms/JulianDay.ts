import {GregorianDateTime} from "./GregorianDateTime";

/**
 * 'Astronomical Algorithms' by Jean Meeus
 * Chapiter 7 -> p.63
 */
export class JulianDay {
    // ATTRIBUTES
    public value: number;

    // CONSTRUCTORS
    constructor(value: number) {
        this.value = value;
    }

    // PUBLIC METHODS
    convertToGregorianDay(): GregorianDateTime {
        var J = this.value + 0.5;
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

        return new GregorianDateTime(year, month, day, hours, minutes, seconds);
    }


    // PRIVATE METHODS
    private define_A(_Z) {
        if (_Z < 2299161) {
            return _Z;
        } else {
            var a = Math.floor((_Z - 1867216.25) / 36534.25);
            return _Z + 1 + a - Math.floor(a / 4);
        }
    }


}
