import {HourCoordinates} from "../models/coordinates/HourCoordinates";
import {EquatorialCoordinates} from "../models/coordinates/EquatorialCoordinates";
import {HorizontalCoordinates} from "../models/coordinates/HorizontalCoordinates";

export class CoordinatesConverterService {

    // STATIC METHODS
    // -- EQUATORIAL COORDINATES -- //
    /**
     * Method to convert Equatorial Coordinates to Hour Coordinates.
     * @param equatorialCoordinates : EquatorialCoordinates
     * @param observerTimeSidereal : number
     * @return HourCoordinates
     */
    public static convert_equatorialCoordinates_to_hourCoordinates(
        equatorialCoordinates: EquatorialCoordinates,
        observerTimeSidereal: number
    ) {
        return new HourCoordinates(
            (observerTimeSidereal - equatorialCoordinates.rightAscension),
            equatorialCoordinates.declination
        );
    }

    // -- HOUR COORDINATES -- //
    /**
     * Convert Hour Coordinates to Equatorial Coordinates
     * @param hourCoordinates : HourCoordinates
     * @param observerTimeSidereal : number
     * @return EquatorialCoordinates
     */
    public static convert_hourCoordinates_to_equatorialCoordinates (
        hourCoordinates : HourCoordinates,
        observerTimeSidereal : number
    ): EquatorialCoordinates  {
        return new EquatorialCoordinates(
            (observerTimeSidereal - hourCoordinates.hourAngle),
            hourCoordinates.declination
        );
    }

    /**
     * Convert Hout Coordinates to Horizontal Coordinates.
     * @param hourCoordinates : HourCoordinates
     * @param observerLatitude : number
     * @return HorizontalCoordinates
     */
    public static convert_hourCoordinates_to_horizontalCoordinates (
        hourCoordinates : HourCoordinates,
        observerLatitude : number
    ): HorizontalCoordinates {
        var declinaisonRad = hourCoordinates.declination;
        var hourAngleRad = hourCoordinates.hourAngle;


        // Formula 13.5 -> p.93
        var intD = ((Math.cos(hourAngleRad) * Math.sin(observerLatitude)) - (Math.tan(declinaisonRad) * Math.cos(observerLatitude)));

        var azimuth = Math.atan( Math.sin(hourAngleRad) / intD );
        if (intD < 0) {
            azimuth = azimuth + Math.PI;
        }

        // Formula 13.6 -> p.93
        var altitude = Math.asin(
            (Math.sin(observerLatitude) * Math.sin(declinaisonRad)) + (Math.cos(observerLatitude) * Math.cos(declinaisonRad) * Math.cos(hourAngleRad))
        );


        return new HorizontalCoordinates(altitude, azimuth);
    }

}
