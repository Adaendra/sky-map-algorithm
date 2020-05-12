// --------------------------------------- //
// ----- Gregorian Day -> Julian Day ----- //
// --------------------------------------- //
// -- Chapitre 7 -> p.60-61
function define_year(_year, _month) {
    if (_month === 1 || _month === 2) {
        return _year - 1;
    } else {
        return _year;
    }
}

function define_month(_month) {
    if (_month === 1 || _month === 2) {
        return _month + 12;
    } else {
        return _month;
    }
}

function define_A(_year) {
    return Math.floor(_year / 100);
}

function define_B(_A, isGregorianCalendar) {
    if (isGregorianCalendar) {
        return 2 - _A + Math.floor(_A / 4);
    } else {
        return 0;
    }
}

function define_decimalDay(_day, _hours, _minutes, _seconds) {
    var minutes_decimal = _minutes + (_seconds / 60);
    var hours_decimal = _hours + (minutes_decimal / 60);
    return _day + (hours_decimal / 24);
}

function define_JulianDay(_year, _month, _day, _hour, _minute, _second, _isGregorianCalendar) {
    var year = define_year(_year, _month);
    var month = define_month(_month);
    var decimalDay = define_decimalDay(_day, _hour, _minute, _second);
    var A = define_A(year);
    var B = define_B(A, _isGregorianCalendar);

    return (Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + decimalDay + B - 1524.5);
}


// ----------------------------------- //
// ----- Greenwich Sidereal Time ----- //
// ----------------------------------- //
/**
 * Formula 12.1 p87
 * Only valid for 0h UT.
 * @param _julianDay
 * @returns {number}
 */
function define_T(_julianDay) {
    return (_julianDay - 2451545) / 36525;
}

/**
 * Formula 12.3 p87
 * @param _T
 * @returns {number}
 */
function define_siderealTime_Greenwich_0(_T) {
    return 100.46061837 + (36000.770053608 * _T) + (0.000387933 * _T * _T)
        - (_T * _T * _T / 38710000);
}

/**
 * Definition p87. Exemple 12.a p88
 * @param _ST_G0 : number - Sideral Time Greenwich 0h.
 * @param _timeDecimal : number - Time in decimal. (12h45 = 12.75)
 */
function define_meanSiderealTime_Greenwich(_ST_G0, _timeDecimal) {
    var result = _ST_G0 + (_timeDecimal * 1.00273790935);

    if (result >= 24) {
        result = result - 24;
    }

    return result;
}

/**
 * Formula 12.4 p88
 * @param _JD : number - Julian Day.
 * @param _T : number - Result of formula 12.1 .
 * @returns {number}
 */
function define_apparentSiderealTime_Greenwich(_JD, _T) {
    return 280.46061837 + 360.98564736629 * (_JD - 2451545) + 0.000387933 * _T * _T
        - _T * _T * _T / 38710000;
}

// ----------------- //
// ----- UTILS ----- //
// ----------------- //
/**
 * If _angle is not between 0 and 360°, add or substract 360 util value is include between.
 * @param _angle: number.
 * @return number - Converted angle.
 */
function revolution(_angle) {
    if (_angle < 0) {
        _angle = _angle + 360;
    } else if (_angle >= 360) {
        _angle = _angle - 360;
    }

    if (_angle < 0 || _angle >= 360) {
        return revolution(_angle);
    } else {
        return _angle;
    }
}


// ----- Time <-> Decimal -----
function convertTimeToDecimal(_h, _m, _s) {
    return _h + _m / 60 + _s / 3600;
}

// ----- DMS <-> Radians
function convertDMSToDegrees(_d, _m, _s) {
    if (_d < 0) {
        return _d - _m / 60 - _s / 3600;
    } else {
        return _d + _m / 60 + _s / 3600;
    }
}

function convertDegreesToDMS(_coordinateDegrees) {
    var d_decimal = _coordinateDegrees;
    var d = Math.floor(d_decimal);

    var m_decimal = (d_decimal - d) * 60;
    var m = Math.floor(m_decimal);

    var s = (m_decimal - m) * 60;

    return {d : d, m : m, s : s};
}

// ----- Degrees <-> Decimal Hour -----
function convertDegreesToDecimalHour(_d) {
    return _d / 15; // We devide by 15 because 1h = 15°
}

function convertDecimalHourToDegrees(_d) {
    return _d * 15; // We multiply by 15 because 1h = 15°
}


// ----------------------- //
// ----- COORDINATES ----- //
// ----------------------- //

// ----- Hour angle ----- //
function define_hourAngle(_localSiderealTime, _rightAscension) {
    return _localSiderealTime - _rightAscension;
}

function define_hourAngle(_greenwichSiderealTime, _observerLongitude, _rightAscension) {
    return _greenwichSiderealTime + _observerLongitude - _rightAscension;
}


// ----- Right Ascension ----- //

function define_rightAscension(_localSiderealTime, _hourAngle) {
    return _localSiderealTime - _hourAngle;
}

function define_rightAscension(_greenwichSiderealTime, _observerLongitude, _hourAngle) {
    return _greenwichSiderealTime + _observerLongitude - _hourAngle;
}


// ----- Equatorial Coordinates <-> Hour Coordinates ----- //

function convert_equatorialCoordinates_to_hourCoordinates(_declination, _observerSiderealTime, _rightAscension) {
    return {
        declination : _declination,
        hourAngle : define_hourAngle(_observerSiderealTime, _rightAscension)
    }
}

function convert_hourCoordinates_to_equatorialCoordinates(_declination, _observerSiderealTime, _hourAngle) {
    return {
        declination: _declination,
        rightAscension: define_rightAscension(_observerSiderealTime, _hourAngle)
    }
}

// ----- Equatorial coordinates <-> Horizontal coordinates ----- //
function convert_equatorialCoordinates_to_horizontalCoordinates(_observerLatitude, _declination, _hourAngle) {
    // Formula 13.5 -> p 93
    var azimuth = Math.atan(
        Math.sin(_hourAngle) /
        ((Math.cos(_hourAngle) * Math.sin(_observerLatitude)) - (Math.tan(_declination) * Math.cos(_observerLatitude)))
    );
    // azimuth is in radian

    // Formula 13.6 -> p 93
    var altitude = Math.asin(
        (Math.sin(_observerLatitude) * Math.sin(_declination)) + (Math.cos(_observerLatitude) * Math.cos(_declination) * Math.cos(_hourAngle))
    );
    // altitude is in radian

    return {
        azimuth: (azimuth / Math.PI * 180),
        altitude: (altitude / Math.PI * 180)
    }; // altitude and azimuth are returned in degrees.
}


// --------------------- //
// ----- ALGORITHM ----- //
// --------------------- //
/**
 * Algorithm to calculate a celestial object's location for an observer at a moment.
 * @param year : number
 * @param month : number
 * @param day : number
 * @param hour : number
 * @param minutes : number
 * @param seconds : number
 * @param observer_latitude : number - Latitude in degrees. ex: 46.204391
 * @param observer_longitude : number - Longitude in degrees. ex: 6.143158
 * @param celestialObject_declination : number - Declination in degrees. ex: 6.143158
 * @param celestialObject_rightAscension : number - Right ascension in decimal. ex: 4.28
 * @return {{altitude: number, azimuth: number}} - Horizontal coordinate of celestial object.
 */
function starLocationAlgorithm(year, month, day, hour, minutes, seconds,
                               observer_latitude, observer_longitude,
                               celestialObject_declination, celestialObject_rightAscension) {
    var julianDay = define_JulianDay(year, month, day, hour, minutes, seconds, true);
    var apparentGreenwichSiderealTime = revolution(
        define_apparentSiderealTime_Greenwich(julianDay, define_T(julianDay))
    );

    var hourAngle = define_hourAngle(
        convertDegreesToDecimalHour(apparentGreenwichSiderealTime),
        convertDegreesToDecimalHour(observer_longitude),
        celestialObject_rightAscension
    );

    return convert_equatorialCoordinates_to_horizontalCoordinates(
        observer_latitude * Math.PI / 180,
        celestialObject_declination * Math.PI / 180,
        revolution(convertDecimalHourToDegrees(hourAngle)) * Math.PI / 180
    );
}

// -- TEST
var result = this.starLocationAlgorithm(1987, 4, 10, 19, 21, 0,
    convertDMSToDegrees(38, 55, 17), convertDMSToDegrees(-77, 3, 56),
    convertDMSToDegrees(-6, 43, 11.61), convertTimeToDecimal(23, 9, 16.641)
);

console.log(result);
