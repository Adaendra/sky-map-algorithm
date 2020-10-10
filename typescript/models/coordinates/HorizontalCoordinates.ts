export class HorizontalCoordinates {

    // ATTRIBUTES
    public altitude: number;
    public azimuth: number;

    // CONSTRUCTOR
    constructor(altitude: number, azimuth: number) {
        this.altitude = altitude;
        this.azimuth = azimuth;
    }

    // PUBLIC METHODS
    /**
     * Returns the Altitude in degrees.
     * @return number
     */
    public getAltitudeDegrees(): number {
        return this.altitude / Math.PI * 180;
    }

    /**
     * Returns the Altitude in radians.
     * @return number.
     */
    public getAltitudeRadian(): number {
        return this.altitude;
    }

    /**
     * Returns the Azimuth in degrees.
     * @return number
     */
    public getAzimuthDegrees(): number {
        return this.azimuth / Math.PI * 180;
    }

    /**
     * Returns the Azimuth in radians.
     * @return number
     */
    public getAzimuthRadian(): number {
        return this.azimuth;
    }

}
