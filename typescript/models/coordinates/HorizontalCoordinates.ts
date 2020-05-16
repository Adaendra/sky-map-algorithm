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
    public getAltitudeDegrees(): number {
        return this.altitude / Math.PI * 180;
    }

    public getAltitudeRadian(): number {
        return this.altitude;
    }
    public getAzimuthDegrees(): number {
        return this.azimuth / Math.PI * 180;
    }

    public getAzimuthRadian(): number {
        return this.azimuth;
    }

}
