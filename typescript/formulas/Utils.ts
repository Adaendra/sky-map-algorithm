import {DMSCoordinates} from "../objects/DMSCoordinates";

export class Utils {

    // PUBLIC METHODS
    /**
     * If _angle is not between 0 and 360°, add or substract 360 util value is include between.
     * @param _angle: number.
     * @return number - Converted angle.
     */
    public static revolution(_angle) {
        if (_angle < 0) {
            _angle = _angle + 360;
        } else if (_angle >= 360) {
            _angle = _angle - 360;
        }

        if(_angle < 0 || _angle >= 360) {
            return this.revolution(_angle);
        } else {
            return _angle;
        }
    }

    // ----- Time <-> Decimal -----
    /**
     * Convert time to decimal hour.
     * @param _h : number - Hours.
     * @param _m : number - Minutes.
     * @param _s : number - Seconds.
     */
    public static convertTimeToDecimal(_h, _m, _s) {
        return _h + _m / 60 + _s / 3600;
    }

    // ----- DMS <-> Radians
    public static convertDMSToDegrees(_d, _m, _s) {
        if (_d < 0) {
            return _d - _m / 60 - _s / 3600;
        } else {
            return _d + _m / 60 + _s / 3600;
        }
    }

    public static convertDegreesToDMS(_r): DMSCoordinates {
        var d_decimal = _r;
        var d = Math.floor(d_decimal);

        var m_decimal = (d_decimal - d) * 60;
        var m = Math.floor(m_decimal);

        var s = (m_decimal - m) * 60;

        return new DMSCoordinates(d, m, s);
    }

    // ----- Degrees <-> Decimal Hour -----
    /**
     * 1 h <=> 15°
     * @param _d : number - Number of degrees.
     * @return number - Decimal hour.
     */
    public static convertDegreesToDecimalHour(_d): number {
        return _d / 15;
    }

    /**
     * 1h <=> 15°
     * @param _h : number - Number of hours.
     * @return number - Degrees.
     */
    public static convertDecimalHourToDegrees(_h) {
        return _h * 15;
    }

    // ----- Hour angle -----
    // public static define_hourAngle(_localSiderealTime: number, _rightAscension: number) {
    //     return Utils.convertDegreesToDecimalHour(_localSiderealTime) - Utils.convertDegreesToDecimalHour(_rightAscension);
    // }

    public static define_hourAngle(_greenwichSiderealTime: number, _observerLongitude: number, _rightAscension: number) {
        return Utils.convertDegreesToDecimalHour(_greenwichSiderealTime)
            + Utils.convertDegreesToDecimalHour(_observerLongitude)
            - _rightAscension;
    }

    // ----- Right Ascension -----
    // public static define_rightAscension(_localSiderealTime: number, _hourAngle: number) {
    //     return _localSiderealTime - _hourAngle;
    // }

    public static define_rightAscension(_greenwichSiderealTime: number, _observerLongitude: number, _hourAngle: number) {
        return _greenwichSiderealTime + _observerLongitude - _hourAngle;
    }

}
