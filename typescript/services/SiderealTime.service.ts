/**
 * 'Astronomical Algorithms' by Jean Meeus
 */
export class SiderealTimeService {

    // PUBLIC METHODS
    /**
     * Formula 12.3 -> p87
     * @param JD : number - Julian Day.
     * @returns {number}
     */
    public static define_siderealTime_Greenwich_0(JD : number) {
        var T = this.define_T(JD);
        return 100.46061837 + (36000.770053608 * T) + (0.000387933 * T * T)
            - (T * T * T / 38710000);
    }

    /**
     * Definition p87. Exemple 12.a p88
     * @param ST_G0 : number - Sideral Time Greenwich 0h.
     * @param timeDecimal : number - Time in decimal. (12h45 = 12.75)
     * @return number
     */
    public static define_meanSiderealTime_Greenwich(ST_G0 : number, timeDecimal : number) {
        var result = ST_G0 + (timeDecimal * 1.00273790935);

        if (result >= 24) {
            result = result - 24;
        }

        return result;
    }

    /**
     * Formula 12.4 -> p88
     * @param JD : number - Julian Day.
     * @returns number
     */
    public static define_apparentSiderealTime_Greenwich(JD : number): number {
        var T = this.define_T(JD);
        return 280.46061837
            + 360.98564736629 * (JD - 2451545)
            + 0.000387933 * T * T
            - T * T * T / 38710000;
    }

    // PRIVATE METHODS
    /**
     * Formula 12.1 -> p87
     * @param JD : number - Julian Day.
     * @returns number
     */
    private static define_T(JD : number) : number {
        return (JD - 2451545) / 36525;
    }

}
