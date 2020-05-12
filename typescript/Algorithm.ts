import {GregorianDateTime} from "./formulas/GregorianDateTime";
import {DMSCoordinates} from "./models/DMSCoordinates";
import {Utils} from "./formulas/Utils";
import {EquatorialCoordinates} from "./models/EquatorialCoordinates";
import {SiderealTime} from "./formulas/SiderealTime";

export module Algorithm {

    export function execute(dateTime : GregorianDateTime, observer_latitude: DMSCoordinates, observer_longitude : DMSCoordinates,
                            declination: number, rightAscension: number) {
        var equatorialCoordinates = new EquatorialCoordinates(rightAscension, declination);

        var siderealTimeGreenwich = Utils.revolution(
            SiderealTime.define_apparentSiderealTime_Greenwich(dateTime.convertToJulianDay().value)
        );
        var observerSiderealTime = Utils.convertDegreesToDecimalHour(siderealTimeGreenwich)
            + Utils.convertDegreesToDecimalHour(observer_longitude.degreesValue());

        return equatorialCoordinates.convert_to_hourCoordinates(observerSiderealTime)
            .convert_to_horizontalCoordinates(observer_latitude.degreesValue());
    }
}
