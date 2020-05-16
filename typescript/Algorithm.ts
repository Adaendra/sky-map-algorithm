import {GregorianDateTime} from "./formulas/GregorianDateTime";
import {DMSCoordinates} from "./models/DMSCoordinates";
import {Utils} from "./formulas/Utils";
import {EquatorialCoordinates} from "./models/EquatorialCoordinates";
import {SiderealTime} from "./formulas/SiderealTime";
import {CoordinatesConverterService} from "./services/ConvertCoordinates.service";

export module Algorithm {

    /**
     * Convert DMS value to decimal degree value.
     * @param _d: number - Degrees.
     * @param _m: number - Minutes.
     * @param _s: number - Seconds.
     * @return number - Decimal degree value.
     */
    export function convertDMSToDegrees(_d, _m, _s): number {
        return Utils.convertDMSToDegrees(_d, _m, _s);
    }

    /**
     * Convert time to decimal time.
     * @param _h: number - Hours.
     * @param _m: number - Minutes.
     * @param _s: number - Seconds.
     * @return number - Decimal time.
     */
    export function convertTimeToDecimal(_h, _m, _s): number {
        return Utils.convertTimeToDecimal(_h, _m, _s);
    }

    /**
     * Calculate Horizontal Coordinates.
     * @param dateTime : GregorianDateTime - Time
     * @param observer_latitude
     * @param observer_longitude
     * @param declination
     * @param rightAscension
     */
    export function calculateHorizontalCoordinates(
        dateTime : GregorianDateTime,
        observer_latitude: DMSCoordinates,
        observer_longitude : DMSCoordinates,
        declination: number,
        rightAscension: number
    ) {
        var equatorialCoordinates = new EquatorialCoordinates(rightAscension, declination);

        var siderealTimeGreenwich = Utils.revolution(
            SiderealTime.define_apparentSiderealTime_Greenwich(dateTime.convertToJulianDay().value)
        );
        var observerSiderealTime = Utils.convertDegreesToDecimalHour(siderealTimeGreenwich)
            + Utils.convertDegreesToDecimalHour(observer_longitude.degreesValue());

        var hourCoordinates = CoordinatesConverterService.convert_equatorialCoordinates_to_hourCoordinates(equatorialCoordinates, observerSiderealTime);
        return CoordinatesConverterService.convert_hourCoordinates_to_horizontalCoordinates(hourCoordinates, observer_latitude.degreesValue());
    }
}
