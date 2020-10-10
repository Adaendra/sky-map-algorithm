export class UtilsService {

    // PUBLIC METHODS
    /**
     * If _angle is not between 0 and 360°, add or substract 360 util value is include between.
     * @param angle: number.
     * @return number - Converted angle.
     */
    public static revolution(angle : number) : number {
        if (angle < 0) {
            angle = angle + 360;
        } else if (angle >= 360) {
            angle = angle - 360;
        }

        if(angle < 0 || angle >= 360) {
            return this.revolution(angle);
        } else {
            return angle;
        }
    }

    // ----- Time <-> Decimal -----
    /**
     * Convert time to decimal hour.
     * @param h : number - Hours.
     * @param m : number - Minutes.
     * @param s : number - Seconds.
     * @return number - Decimal Hour.
     */
    public static convertTimeToDecimal(h : number, m : number, s : number) : number {
        return h + m / 60 + s / 3600;
    }

    // ----- DMS <-> Radians
    /**
     * Convert DMS to Decimal Degrees.
     * @param d : number - Degrees
     * @param m : number - Minutes
     * @param s : number - Second
     * @return number - Decimal Degrees
     */
    public static convertDMSToDegrees(d: number, m: number, s: number) : number {
        if (d < 0) {
            return d - m / 60 - s / 3600;
        } else {
            return d + m / 60 + s / 3600;
        }
    }

    // ----- Degrees <-> Decimal Hour -----
    /**
     * 1 h <=> 15°
     * @param d : number - Number of degrees.
     * @return number - Decimal hour.
     */
    public static convertDegreesToDecimalHour(d : number): number {
        return d / 15;
    }

    /**
     * 1h <=> 15°
     * @param h : number - Number of hours.
     * @return number - Degrees.
     */
    public static convertDecimalHourToDegrees(h : number) : number {
        return h * 15;
    }

    // ----- Hour angle -----
    /**
     * Calculate Hour Angle from :
     * @param greenwichSiderealTime : number - Greenwich Sidereal Time.
     * @param observerLongitude : number - Observer Longitude
     * @param rightAscension : number - Right Ascension.
     * @return number - Hour Angle
     */
    public static define_hourAngle(greenwichSiderealTime: number, observerLongitude: number, rightAscension: number) : number {
        return UtilsService.convertDegreesToDecimalHour(greenwichSiderealTime)
            + UtilsService.convertDegreesToDecimalHour(observerLongitude)
            - rightAscension;
    }

    // ----- Right Ascension -----
    /**
     * Calculate Right Ascension from :
     * @param greenwichSiderealTime : number - Greenwich Sidereal Time
     * @param observerLongitude : number - Observer Longitude
     * @param hourAngle : number - Hour Angle
     * @return number - Right Ascension.
     */
    public static define_rightAscension(greenwichSiderealTime: number, observerLongitude: number, hourAngle: number) : number {
        return greenwichSiderealTime + observerLongitude - hourAngle;
    }

}
