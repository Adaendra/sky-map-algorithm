import {HourCoordinates} from "./HourCoordinates";

export class EquatorialCoordinates {
    // ATTRIBUTES
    public rightAscension: number;
    public declination: number;

    // CONSTRUCTOR
    constructor(rightAscension: number, declination: number) {
        this.rightAscension = rightAscension;
        this.declination = declination;
    }

    // PUBLIC METHODS
    public convert_to_hourCoordinates(_observerTimeSidereal) {
        var hourAngle = _observerTimeSidereal - this.rightAscension;

        return new HourCoordinates(hourAngle, this.declination);
    }

}
