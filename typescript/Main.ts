import {GregorianDateTime} from "./formulas/GregorianDateTime";
import {DMSCoordinates} from "./objects/DMSCoordinates";
import {Utils} from "./formulas/Utils";
import {EquatorialCoordinates} from "./objects/EquatorialCoordinates";
import {SiderealTime} from "./formulas/SiderealTime";

export module Main {

    var dateTime: GregorianDateTime = new GregorianDateTime(
        1987, 4, 10,
        19, 21, 0
    );

    var observer_latitude = new DMSCoordinates(38, 55, 17);
    var observer_longitude = new DMSCoordinates(-77, 3, 56);

    var declination = Utils.convertDMSToDegrees(-6, 43, 11.61);
    var rightAscension = Utils.convertTimeToDecimal(23,9,16.641);
    var equatorialCoordinates = new EquatorialCoordinates(rightAscension, declination);

    var siderealTimeGreenwich = Utils.revolution(
        SiderealTime.define_apparentSiderealTime_Greenwich(dateTime.convertToJulianDay().value)
    );
    var observerSiderealTime = Utils.convertDegreesToDecimalHour(siderealTimeGreenwich)
        + Utils.convertDegreesToDecimalHour(observer_longitude.degreesValue());


    var result = equatorialCoordinates.convert_to_hourCoordinates(observerSiderealTime)
        .convert_to_horizontalCoordinates(observer_latitude.degreesValue());

    export function hello() {
        console.log('apparent siderealTimeGreenwich : ' + siderealTimeGreenwich);
        console.log('observerSiderealTime : ' + observerSiderealTime);
        console.log(' ');
        console.log('declination : ' + declination);
        console.log('rightAscension : ' + rightAscension);
        console.log(' ');
        console.log('lat :  ' + (observer_latitude.degreesValue() * Math.PI / 180));
        console.log('hourCoordinates : ', equatorialCoordinates.convert_to_hourCoordinates(observerSiderealTime));
        console.log(' ');
        console.log("---------");
        console.log('Azimuth : ' + result.azimuth / Math.PI * 180);
        console.log('Altitude : ' + result.altitude/ Math.PI * 180);
    }
}
