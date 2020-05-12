import {EquatorialCoordinates} from "./EquatorialCoordinates";
import {HorizontalCoordinates} from "./HorizontalCoordinates";
import {Utils} from "../formulas/Utils";

export class HourCoordinates {
    // ATTRIBUTES
    public hourAngle: number;
    public declination: number;

    // CONSTRUCTOR
    constructor(hourAngle: number, declination: number) {
        this.hourAngle = hourAngle;
        this.declination = declination;
    }

    // PUBLIC METHODS
    public convert_to_equatorialCoordinates(_observerTimeSidereal) {
        return new EquatorialCoordinates(
            (_observerTimeSidereal - this.hourAngle),
            this.declination
        );
    }

    public convert_to_horizontalCoordinates(_observerLatitude) {
        _observerLatitude = _observerLatitude * Math.PI / 180;
        var declinaisonRad = this.declination * Math.PI / 180;
        var hourAngleRad = Utils.revolution(Utils.convertDecimalHourToDegrees(this.hourAngle)) * Math.PI / 180;


        // Formula 13.5 -> p.93
        var azimuth = Math.atan(
            Math.sin(hourAngleRad) /
            ((Math.cos(hourAngleRad) * Math.sin(_observerLatitude)) - (Math.tan(declinaisonRad) * Math.cos(_observerLatitude)))
        );

        // Formula 13.6 -> p.93
        var altitude = Math.asin(
            (Math.sin(_observerLatitude) * Math.sin(declinaisonRad)) + (Math.cos(_observerLatitude) * Math.cos(declinaisonRad) * Math.cos(hourAngleRad))
        );

        return new HorizontalCoordinates(altitude, azimuth);
    }

}
