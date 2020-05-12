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
        return new HourCoordinates(
            (_observerTimeSidereal - this.rightAscension),
            this.declination
        );
    }

}
