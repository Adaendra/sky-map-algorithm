/**
 * 'Astronomical Algorithms' by Jean Meeus
 */
export class SiderealTime {

    // PUBLIC METHODS
    /**
     * Formula 12.3 -> p87
     * @param _JD : number - Julian Day.
     * @returns {number}
     */
    public static define_siderealTime_Greenwich_0(_JD) {
        var T = this.define_T(_JD);
        return 100.46061837 + (36000.770053608 * T) + (0.000387933 * T * T)
            - (T * T * T / 38710000);
    }

    /**
     * Definition p87. Exemple 12.a p88
     * @param _ST_G0 : number - Sideral Time Greenwich 0h.
     * @param _timeDecimal : number - Time in decimal. (12h45 = 12.75)
     */
    public static define_meanSiderealTime_Greenwich(_ST_G0, _timeDecimal) {
        var result = _ST_G0 + (_timeDecimal * 1.00273790935);

        if (result >= 24) {
            result = result - 24;
        }

        return result;
    }

    /**
     * Formula 12.4 -> p88
     * @param _JD : number - Julian Day.
     * @returns {number}
     */
    public static define_apparentSiderealTime_Greenwich(_JD): number {
        var T = this.define_T(_JD);
        return 280.46061837
            + 360.98564736629 * (_JD - 2451545)
            + 0.000387933 * T * T
            - T * T * T / 38710000;
    }

    // PRIVATE METHODS
    /**
     * Formula 12.1 -> p87
     * @param _JD : number - Julian Day.
     * @returns {number}
     */
    private static define_T(_JD) : number {
        return (_JD - 2451545) / 36525;
    }

}
