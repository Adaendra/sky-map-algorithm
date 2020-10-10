import {UtilsService} from "../../services/Utils.service";

export class DMSCoordinates {

    // ATTRIBUTES
    public degrees: number;
    public minutes: number;
    public seconds: number;

    // CONSTRUCTOR
    constructor(degrees, minutes, seconds) {
        this.degrees = degrees;
        this.minutes = minutes;
        this.seconds = seconds;
    }

    // PUBLIC METHODS
    public degreesValue(): number {
        return UtilsService.convertDMSToDegrees(this.degrees, this.minutes, this.seconds);
    }

    public radianValue(): number {
        return UtilsService.convertDMSToDegrees(this.degrees, this.minutes, this.seconds) * Math.PI / 180;
    }


}
