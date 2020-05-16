import {DMSCoordinates} from "./models/coordinates/DMSCoordinates";
import {UtilsService} from "./services/Utils.service";
import {Algorithm} from "./Algorithm";
import {GregorianDateTime} from "./models/time/GregorianDateTime";

export module Main {

    // TODO : Modifier cette méthode pour qu'elle aie lire la liste des étoiles et calcule leur position pour chacune d'entre elles.
    export function hello() {
        var dateTime: GregorianDateTime = new GregorianDateTime(
            1987, 4, 10,
            19, 21, 0,
            0
        );

        var observer_latitude = new DMSCoordinates(38, 55, 17);
        var observer_longitude = new DMSCoordinates(-77, 3, 56);

        var declination = UtilsService.convertDMSToDegrees(-6, 43, 11.61);
        var rightAscension = UtilsService.convertTimeToDecimal(23,9,16.641);
        var result = Algorithm.calculateHorizontalCoordinates(dateTime, observer_latitude, observer_longitude, declination, rightAscension);
        console.log('Azimuth : ' + result.azimuth / Math.PI * 180);
        console.log('Altitude : ' + result.altitude/ Math.PI * 180);
    }
}
