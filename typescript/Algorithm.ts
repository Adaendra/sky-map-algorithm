import {GregorianDateTimeService} from "./services/GregorianDateTime.service";
import {DMSCoordinates} from "./models/coordinates/DMSCoordinates";
import {UtilsService} from "./services/Utils.service";
import {EquatorialCoordinates} from "./models/coordinates/EquatorialCoordinates";
import {SiderealTimeService} from "./services/SiderealTime.service";
import {CoordinatesConverterService} from "./services/CoordinatesConverter.service";
import {GregorianDateTime} from "./models/time/GregorianDateTime";
import {HorizontalCoordinates} from "./models/coordinates/HorizontalCoordinates";

export module Algorithm {

    /**
     * Convert DMS value to decimal degree value.
     * @param d: number - Degrees.
     * @param m: number - Minutes.
     * @param s: number - Seconds.
     * @return number - Decimal degree value.
     */
    export function convertDMSToDegrees(d, m, s): number {
        return UtilsService.convertDMSToDegrees(d, m, s);
    }

    /**
     * Convert time to decimal time.
     * @param h: number - Hours.
     * @param m: number - Minutes.
     * @param s: number - Seconds.
     * @return number - Decimal time.
     */
    export function convertTimeToDecimal(h : number, m : number, s : number): number {
        return UtilsService.convertTimeToDecimal(h, m, s);
    }

    /**
     * Calculate Horizontal Coordinates from GregorianDateTime.
     * @param dateTime : GregorianDateTimeService - Time
     * @param observer_latitude : DMSCoordinates
     * @param observer_longitude : DMSCoordinates
     * @param declination : number
     * @param rightAscension : number
     * @return HorizontalCoordinates
     */
    export function calculateHorizontalCoordinates(
        dateTime : GregorianDateTime,
        observer_latitude: DMSCoordinates,
        observer_longitude : DMSCoordinates,
        declination: number,
        rightAscension: number
    ) : HorizontalCoordinates {
        var equatorialCoordinates = new EquatorialCoordinates(rightAscension, declination);

        var siderealTimeGreenwich = UtilsService.revolution(
            SiderealTimeService.define_apparentSiderealTime_Greenwich(GregorianDateTimeService.convertToJulianDay(dateTime).value)
        );

        var observerSiderealTime = UtilsService.convertDegreesToDecimalHour(siderealTimeGreenwich)
             + observer_longitude.radianValue();

        var hourCoordinates = CoordinatesConverterService.convert_equatorialCoordinates_to_hourCoordinates(equatorialCoordinates, observerSiderealTime);

        return CoordinatesConverterService.convert_hourCoordinates_to_horizontalCoordinates(hourCoordinates, observer_latitude.radianValue());
    }

}
