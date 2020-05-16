import {Utils} from "../../services/Utils";

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
        return Utils.convertDMSToDegrees(this.degrees, this.minutes, this.seconds);
    }


}
