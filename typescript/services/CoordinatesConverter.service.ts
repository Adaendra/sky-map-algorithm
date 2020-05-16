import {HourCoordinates} from "../models/coordinates/HourCoordinates";
import {EquatorialCoordinates} from "../models/coordinates/EquatorialCoordinates";
import {UtilsService} from "./Utils.service";
import {HorizontalCoordinates} from "../models/coordinates/HorizontalCoordinates";

export class CoordinatesConverterService {

    // STATIC METHODS
    // -- EQUATORIAL COORDINATES -- //
    public static convert_equatorialCoordinates_to_hourCoordinates(
        _equatorialCoordinates: EquatorialCoordinates,
        _observerTimeSidereal: number
    ) {
        return new HourCoordinates(
            (_observerTimeSidereal - _equatorialCoordinates.rightAscension),
            _equatorialCoordinates.declination
        );
    }

    // -- HOUR COORDINATES -- //
    public static convert_hourCoordinates_to_equatorialCoordinates (
        _hourCoordinates : HourCoordinates,
        _observerTimeSidereal : number
    ): EquatorialCoordinates  {
        return new EquatorialCoordinates(
            (_observerTimeSidereal - _hourCoordinates.hourAngle),
            _hourCoordinates.declination
        );
    }

    public static convert_hourCoordinates_to_horizontalCoordinates (
        _hourCoordinates : HourCoordinates,
        _observerLatitude : number
    ): HorizontalCoordinates {
        var declinaisonRad = _hourCoordinates.declination;
        var hourAngleRad = _hourCoordinates.hourAngle; //UtilsService.revolution(UtilsService.convertDecimalHourToDegrees(_hourCoordinates.hourAngle)) * Math.PI / 180;


        // Formula 13.5 -> p.93
        var intD = ((Math.cos(hourAngleRad) * Math.sin(_observerLatitude)) - (Math.tan(declinaisonRad) * Math.cos(_observerLatitude)));

        var azimuth = Math.atan( Math.sin(hourAngleRad) / intD );
        if (intD < 0) {
            azimuth = azimuth + Math.PI;
        }

        // Formula 13.6 -> p.93
        var altitude = Math.asin(
            (Math.sin(_observerLatitude) * Math.sin(declinaisonRad)) + (Math.cos(_observerLatitude) * Math.cos(declinaisonRad) * Math.cos(hourAngleRad))
        );


        return new HorizontalCoordinates(altitude, azimuth);
    }

}
