"use strict";

var PI = Math.PI;

// ---------------------- Orbit functions ---------------------

/**
 * Compute the mean longitude of the sun in radians : page 55
 */
function computeSunMeanLongitude(julianTime) {

    return reduceAmplitude(toRadians(279.69668 + 36000.76892 * julianTime + 0.0003025 * julianTime * julianTime));
}

/**
 * Compute the mean anomaly of the sun in radians : page 55
 */
function computeSunMeanAnomaly(julianTime) {

    return reduceAmplitude(toRadians(358.47583 + 35999.04975 * julianTime - 0.000150 * julianTime * julianTime
        - 0.0000033 * julianTime * julianTime * julianTime));
}

/**
 * Compute the excentricity of the Earth's orbit : page 55
 */
function computeEarthOrbitExcentricity(julianTime) {

    return 0.01675104 - 0.0000418 * julianTime - 0.000000126 * julianTime * julianTime;
}

/**
 * Compute the equation of the centre of the sun in radians : page 55
 */
function computeSunCentreEquation(julianTime, sunMeanAnomaly) {

    return toRadians(sin(sunMeanAnomaly) * (1.919460 - 0.004789 * julianTime - 0.000014 * julianTime * julianTime)
        + (0.020094 - 0.000100 * julianTime) * sin(2.0 * sunMeanAnomaly) + 0.000293 * sin(3.0 * sunMeanAnomaly));
}

/**
 * Compute the true longitude of the sun in radians : page 56
 */
function computeSunTrueLongitude(julianTime) {

    var sunMeanAnomaly = computeSunMeanAnomaly(julianTime);

    var sunCentreEquation = computeSunCentreEquation(julianTime, sunMeanAnomaly);

    return computeSunMeanLongitude(julianTime) + sunCentreEquation;
}

/**
 * Compute the true longitude of the sun : page 56
 */
function computeSunDistanceFromAnomaly(earthOrbitExcentricity, sunTrueAnomaly) {

    return 1.0000002 * (1.0 - earthOrbitExcentricity * earthOrbitExcentricity)
        / (1.0 + earthOrbitExcentricity * cos(sunTrueAnomaly));
}

/**
 * Compute the distance of the sun : page 56
 */
function computeSunDistance(julianTime) {

    var sunMeanAnomaly = computeSunMeanAnomaly(julianTime);

    var sunCentreEquation = computeSunCentreEquation(julianTime, sunMeanAnomaly);

    var sunTrueAnomaly = sunMeanAnomaly + sunCentreEquation;

    var earthOrbitExcentricity = computeEarthOrbitExcentricity(julianTime);

    return computeSunDistanceFromAnomaly(earthOrbitExcentricity, sunTrueAnomaly);
}

/**
 * Compute the apparent true longitude of the sun in radians : page 56
 */
function computeSunApparentLongitude(sunTrueLongitude, julianTime) {

    var paramOmega = reduceAmplitude(toRadians(259.18 - 1934.142 * julianTime));

    return sunTrueLongitude - toRadians(0.00569 + 0.00479 * sin(paramOmega));
}

/**
 * Compute the mean obliquity of the ecliptic : page 56
 */
function computeMeanEclipticObliquity(julianTime) {

    return toRadians(23.452294 - 0.0130125 * julianTime - 0.00000164 * julianTime * julianTime + 0.000000503
        * julianTime * julianTime * julianTime);
}

/**
 * Compute the obliquity of the ecliptic for sun apparent position : page 56
 */
function computeEclipticObliquityForSunApparentPosition(julianTime) {

    return computeMeanEclipticObliquity(julianTime)
        + toRadians(0.00256 * cos(toRadians(259.18 - 1934.142 * julianTime)));
}

/**
 * Equatorial position of the Sun : page 55-56
 */
function computeSunEquatorialPosition(julianTime, eclipticObliquityForSunApparentPosition) {

    var sunTrueLongitude = computeSunTrueLongitude(julianTime);

    var apparentSunTrueLongitude = computeSunApparentLongitude(sunTrueLongitude, julianTime);

    var sunRA = eclipticToRightAscension(apparentSunTrueLongitude, 0.0, eclipticObliquityForSunApparentPosition);

    var sunDeclination = eclipticToDeclination(apparentSunTrueLongitude, 0.0, eclipticObliquityForSunApparentPosition);

    return new EquatorialPosition(sunRA, sunDeclination, 0);
}

// ---------------------- Date and time functions ---------------------

/*
 * Compute julian day at UT Zero
 */
function computeJulianDayZero(day, month, year) {

    var paramA;
    var paramB;
    var paramY;
    var M;
    if (month > 2) {
        paramY = year;
        M = month;
    } else {
        paramY = year - 1;
        M = month + 12;
    }
    paramA = floor(paramY * 1.0 / 100.0);
    paramB = 2 - paramA + floor(paramA * 1.0 / 4.0);
    return floor(365.25 * paramY) + floor(30.60001 * (M + 1)) + 1.0 * day + 1720994.5 + 1.0 * paramB;
}

/*
 * Compute julien day
 */
function computeJulianDay(hours, minutes, seconds, timeDiff, julianDayZero) {

    return julianDayZero + 1.0 / 24.0 * ((hours - timeDiff) + minutes / 60.0 + seconds / 3600.0);
}

/*
 * Compute sidereal time (in radians) : page 27
 */
function computeSiderealTime(julianDayZero, hours, minutes, seconds, timeDiff) {

    // Work out the sidereal time at 0 h UT at Greenwich

    var siderealTime = (julianDayZero - 2415020.0) / 36525.0;
    siderealTime = 0.276919398 + 100.0021359 * siderealTime + 0.000001075 * siderealTime * siderealTime;
    siderealTime = 24.0 * (siderealTime - floor(siderealTime));

    // We have to take into account the time of the day

    var paramS = hours - timeDiff + minutes / 60.0 + seconds / 3600.0;
    siderealTime = siderealTime + 1.002737908 * paramS;
    siderealTime = siderealTime / 12.0 * PI;

    return siderealTime;
}

/**
 * Compute julian time (julian centuries from 0.5 January 1900) : page 55
 */
function computeJulianTime(julianDay) {

    return (julianDay - 2415020.0) / 36525.0;
}

// --------------------- Coordinate functions ---------------------

/**
 * Compute the geocentric ecliptic coordinates of the moon : page 105
 */
function computeMoonGeocentricEclipticCoordinates(julianTime) {

    var LP = reduceAmplitude(toRadians(270.434164 + 481267.8831 * julianTime - 0.001133 * julianTime * julianTime
        + 0.0000019 * julianTime * julianTime * julianTime));

    var M = reduceAmplitude(toRadians(358.475833 + 35999.0498 * julianTime - 0.000150 * julianTime * julianTime
        - 0.0000033 * julianTime * julianTime * julianTime));

    var MP = reduceAmplitude(toRadians(296.104608 + 477198.8491 * julianTime + 0.009192 * julianTime * julianTime
        + 0.0000144 * julianTime * julianTime * julianTime));

    var D = reduceAmplitude(toRadians(350.737486 + 445267.1142 * julianTime - 0.001436 * julianTime * julianTime
        + 0.0000019 * julianTime * julianTime * julianTime));

    var F = reduceAmplitude(toRadians(11.250889 + 483202.0251 * julianTime - 0.003211 * julianTime * julianTime
        - 0.0000003 * julianTime * julianTime * julianTime));

    var OM = reduceAmplitude(toRadians(259.183275 - 1934.1420 * julianTime + 0.002078 * julianTime * julianTime
        + 0.0000022 * julianTime * julianTime * julianTime));

    // Additive terms

    LP += toRadians(0.000233 * sin(toRadians(51.2 + 20.2 * julianTime)));
    M -= toRadians(0.001778 * sin(toRadians(51.2 + 20.2 * julianTime)));
    MP += toRadians(0.000817 * sin(toRadians(51.2 + 20.2 * julianTime)));
    D += toRadians(0.002011 * sin(toRadians(51.2 + 20.2 * julianTime)));

    LP += toRadians(0.003964 * sin(toRadians(346.560 + 132.870 * julianTime - 0.0091731 * julianTime * julianTime)));
    MP += toRadians(0.003964 * sin(toRadians(346.560 + 132.870 * julianTime - 0.0091731 * julianTime * julianTime)));
    D += toRadians(0.003964 * sin(toRadians(346.560 + 132.870 * julianTime - 0.0091731 * julianTime * julianTime)));
    F += toRadians(0.003964 * sin(toRadians(346.560 + 132.870 * julianTime - 0.0091731 * julianTime * julianTime)));

    LP += toRadians(0.001964 * sin(OM));
    MP += toRadians(0.002541 * sin(OM));
    LP += toRadians(0.001964 * sin(OM));
    F -= toRadians(0.024691 * sin(OM));
    F -= toRadians(0.004328 * sin(OM + toRadians(275.05 - 2.30 * julianTime)));

    // And finally

    var e = 1.0 - 0.002495 * julianTime - 0.00000752 * julianTime * julianTime;

    var moonGeocentricLongitude = LP
        + toRadians(6.288750 * sin(MP) + 1.274018 * sin(2.0 * D - MP) + 0.658309 * sin(2.0 * D) + 0.213616
            * sin(2.0 * MP) - 0.185596 * sin(M) * e - 0.114336 * sin(2.0 * F) + 0.058793
            * sin(2.0 * D - 2.0 * MP) + 0.057212 * sin(2.0 * D - M - MP) * e + 0.053320 * sin(2.0 * D + MP)
            + 0.045874 * sin(2.0 * D - M) * e + 0.041024 * sin(MP - M) * e - 0.034718 * sin(D) - 0.030465
            * sin(M + MP) * e + 0.015326 * sin(2.0 * D - 2.0 * F) - 0.012528 * sin(2.0 * F + MP) - 0.010980
            * sin(2.0 * F - MP) + 0.010674 * sin(4.0 * D - MP) + 0.010034 * sin(3.0 * MP) + 0.008548
            * sin(4.0 * D - 2.0 * MP) - 0.007910 * sin(M - MP + 2.0 * D) * e - 0.006783 * sin(2.0 * D + M) * e
            + 0.005162 * sin(MP - D) + 0.005000 * sin(M + D) * e + 0.004049 * sin(MP - M + 2.0 * D) * e
            + 0.003996 * sin(2.0 * MP + 2.0 * D) + 0.003862 * sin(4.0 * D) + 0.003665 * sin(2.0 * D - 3.0 * MP)
            + 0.002695 * sin(2.0 * MP - M) * e + 0.002602 * sin(MP - 2.0 * F - 2.0 * D) + 0.002396
            * sin(2.0 * D - M - 2.0 * MP) * e - 0.002349 * sin(MP + D) + 0.002249 * sin(2.0 * D - 2.0 * M) * e
            * e - 0.002125 * sin(2.0 * MP + 2.0 * M) * e - 0.002079 * sin(2.0 * M) * e * e + 0.002059
            * sin(2.0 * D - MP - 2.0 * M) * e * e - 0.001773 * sin(MP + 2.0 * D - 2.0 * F) - 0.001595
            * sin(2.0 * F + 2.0 * D) + 0.001220 * sin(4.0 * D - M - MP) * e - 0.001110
            * sin(2.0 * MP + 2.0 * F) + 0.000892 * sin(MP - 3.0 * D) - 0.000811 * sin(M + MP + 2.0 * D) * e
            + 0.000761 * sin(4.0 * D - M - 2.0 * MP) * e + 0.000717 * sin(MP - 2.0 * M) * e * e + 0.000704
            * sin(MP - 2.0 * M - 2.0 * D) * e * e + 0.000693 * sin(M - 2.0 * MP + 2.0 * D) * e + 0.000598
            * sin(2.0 * D - M - 2.0 * F) * e + 0.000550 * sin(MP + 4.0 * D) + 0.000538 * sin(4.0 * MP)
            + 0.000521 * sin(4.0 * D - M) * e + 0.000486 * sin(2.0 * MP - D));

    var B = toRadians(5.128189 * sin(F) + 0.280606 * sin(MP + F) + 0.277693 * sin(MP - F) + 0.173238 * sin(2.0 * D - F)
        + 0.055413 * sin(2.0 * D + F - MP) + 0.046272 * sin(2.0 * D - F - MP) + 0.032573 * sin(2.0 * D + F)
        + 0.017198 * sin(2.0 * MP + F) + 0.009267 * sin(2.0 * D + MP - F) + 0.008823 * sin(2.0 * MP - F) + 0.008247
        * sin(2.0 * D - M - F) * e + 0.004323 * sin(2.0 * D - F - 2.0 * MP) + 0.004200 * sin(2.0 * D + F + MP)
        + 0.003372 * sin(F - M - 2.0 * D) * e + 0.002472 * sin(2.0 * D + F - M - MP) * e + 0.002222
        * sin(2.0 * D + F - M) * e + 0.002072 * sin(2.0 * D - F - M - MP) * e + 0.001877 * sin(F - M + MP) * e
        + 0.001828 * sin(4.0 * D - F - MP) - 0.001803 * sin(F + M) * e - 0.001750 * sin(3.0 * F) + 0.001570
        * sin(MP - M - F) * e - 0.001487 * sin(F + D) - 0.001481 * sin(F + M + MP) * e + 0.001417 * sin(F - M - MP)
        * e + 0.001350 * sin(F - M) * e + 0.001330 * sin(F - D) + 0.001106 * sin(F + 3.0 * MP) + 0.001020
        * sin(4.0 * D - F) + 0.000833 * sin(F + 4.0 * D - MP) + 0.000781 * sin(MP - 3.0 * F) + 0.000670
        * sin(F + 4.0 * D - 2.0 * MP) + 0.000606 * sin(2.0 * D - 3.0 * F) + 0.000597 * sin(2.0 * D + 2.0 * MP - F)
        + 0.000492 * sin(2.0 * D + MP - M - F) * e + 0.000450 * sin(2.0 * MP - F - 2.0 * D) + 0.000439
        * sin(3.0 * MP - F) + 0.000423 * sin(F + 2.0 * D + 2.0 * MP) + 0.000422 * sin(2.0 * D - F - 3.0 * MP)
        - 0.000367 * sin(M + F + 2.0 * D - MP) * e - 0.000353 * sin(M + F + 2.0 * D) * e + 0.000331
        * sin(F + 4.0 * D) + 0.000317 * sin(2.0 * D + F - M + MP) * e + 0.000306 * sin(2.0 * D - 2.0 * M - F) * e
        * e - 0.000283 * sin(MP + 3.0 * F));

    var om1 = 0.0004664 * cos(OM);
    var om2 = 0.0000754 * cos(OM + toRadians(275.05 - 2.30 * julianTime));

    var moonGeocentricLatitude = B * (1 - om1 - om2);

    var moonParallax = toRadians(0.950724 + 0.051818 * cos(MP) + 0.009531 * cos(2.0 * D - MP) + 0.007843 * cos(2.0 * D)
        + 0.002824 * cos(2.0 * MP) + 0.000857 * cos(2.0 * D + MP) + 0.000533 * cos(2.0 * D - M) * e + 0.000401
        * cos(2.0 * D - M - MP) * e + 0.000320 * cos(MP - M) * e - 0.000271 * cos(D) - 0.000264 * cos(M + MP) * e
        - 0.000198 * cos(2.0 * F - MP) + 0.000173 * cos(3.0 * MP) + 0.000167 * cos(4.0 * D - MP) - 0.000111
        * cos(M) * e + 0.000103 * cos(3.0 * D - 2.0 * MP) - 0.000084 * cos(2.0 * MP - 2.0 * D) - 0.000083
        * cos(2.0 * D + M) * e + 0.000079 * cos(2.0 * D + 2.0 * MP) + 0.000072 * cos(4.0 * D) + 0.000064
        * cos(2.0 * D - M + MP) * e - 0.000063 * cos(2.0 * D + M - MP) * e + 0.000041 * cos(M + D) * e + 0.000035
        * cos(2.0 * MP - M) * e - 0.000033 * cos(3.0 * MP - 2.0 * D) - 0.000030 * cos(MP + D) - 0.000029
        * cos(2.0 * F - 2.0 * D) - 0.000029 * cos(2.0 * MP + M) * e + 0.000026 * cos(2.0 * D - 2.0 * M) * e * e
        - 0.000023 * cos(2.0 * F - 2.0 * D + MP) + 0.000019 * cos(4.0 * D - M - MP) * e);

    return [ moonGeocentricLongitude, moonGeocentricLatitude, moonParallax ];
}

/**
 * Compute the topocentric coordinates : page 97
 */
function computeTopocentricCoordinates(geocentricRightAscension, geocentricDeclination, parallax, longitude, latitude,
                                       height, siderealTime) {

    var geocentricCoordinates = computeGeocentricCoordinates(latitude, height);

    var rhoCosPhiPrime = geocentricCoordinates[0];
    var rhoSinPhiPrime = geocentricCoordinates[1];

    var localHourAngle = computeLocalHourAngle(geocentricRightAscension, longitude, siderealTime);

    var deltaRA = atan(-rhoCosPhiPrime * sin(parallax) * sin(localHourAngle)
        / (cos(geocentricDeclination) - rhoCosPhiPrime * sin(parallax) * cos(localHourAngle)));

    var topocentricRightAscension = geocentricRightAscension + deltaRA;

    var topocentricDeclination = atan(cos(deltaRA) * (sin(geocentricDeclination) - rhoSinPhiPrime * sin(parallax))
        / (cos(geocentricDeclination) - rhoCosPhiPrime * sin(parallax) * cos(localHourAngle)));

    return [ topocentricRightAscension, topocentricDeclination ];
}

/**
 * Compute the geocentric coordinates of an observer : page 25
 */
function computeGeocentricCoordinates(latitude, height) {

    var paramU = atan(0.99664719 * tan(latitude));
    var rhoSinPhiPrime = 0.99664719 * sin(paramU) + height / 6378140. * sin(latitude);
    var rhoCosPhiPrime = cos(paramU) + height / 6378140. * cos(latitude);

    return [ rhoCosPhiPrime, rhoSinPhiPrime ];
}

/**
 * Compute the local hour angle
 */
function computeLocalHourAngle(geocentricRightAscension, longitude, siderealTime) {

    return siderealTime - longitude - geocentricRightAscension;
}

/**
 * Compute the geocentric ecliptic coordinates of the planets : page 71-67-78
 */
function computePlanetsEclipticCoordinates(julianTime, sunTrueLongitude, sunDistance, elements) {

    var positions = new Array();

    for (var i = 0; i < 5; i++) {

        var planetsEclipticCoordinates = computeOnePlanetEclipticCoordinates(julianTime, sunTrueLongitude, sunDistance,
            elements[i]);
        positions[i] = [ planetsEclipticCoordinates[0], planetsEclipticCoordinates[1] ];
    }

    return positions;

}

/**
 * Compute the geocentric ecliptic coordinates of one planets : page 71-67-78
 */
function computeOnePlanetEclipticCoordinates(julianTime, sunTrueLongitude, sunDistance, elements) {

    // Work out planetary elements : page 71

    var planetaryLongitude = reduceAmplitude(elements.longitude[0] + elements.longitude[1] * julianTime
        + elements.longitude[2] * julianTime * julianTime + elements.longitude[3] * julianTime * julianTime
        * julianTime);

    var excentricity = elements.excentricity[0] + elements.excentricity[1] * julianTime + elements.excentricity[2]
        * julianTime * julianTime + elements.excentricity[3] * julianTime * julianTime * julianTime;

    var inclination = elements.inclination[0] + elements.inclination[1] * julianTime + elements.inclination[2] * julianTime
        * julianTime + elements.inclination[3] * julianTime * julianTime * julianTime;

    // perihelion = elements.perihelion[0] + elements.perihelion[1] *
    // julianTime
    // + elements.perihelion[2] * julianTime * julianTime +
    // elements.perihelion[3] * julianTime * julianTime * julianTime;

    var node = elements.node[0] + elements.node[1] * julianTime + elements.node[2] * julianTime * julianTime
        + elements.node[3] * julianTime * julianTime * julianTime;

    var orbitAxis = elements.orbitAxis;

    var meanAnomaly = reduceAmplitude(elements.meanAnomaly[0] + elements.meanAnomaly[1] * julianTime
        + elements.meanAnomaly[2] * julianTime * julianTime);

    // Loop to solve Kepler's equation E = M + e sin E : page 67

    var excentricAnomaly = meanAnomaly;

    for (var j = 0; j < 10; j++) {
        excentricAnomaly = meanAnomaly + excentricity * sin(excentricAnomaly);
    }

    // Heliocentric coordinates : page 78

    var trueAnomaly = 2. * atan(sqrt((1. + excentricity) / (1. - excentricity)) * tan(excentricAnomaly / 2.));

    var planetSunDistance = orbitAxis * (1. - excentricity * cos(excentricAnomaly));

    var latitudeArgument = planetaryLongitude + trueAnomaly - meanAnomaly - node;

    var douDiff = atan(cos(inclination) * tan(latitudeArgument));

    if (cos(latitudeArgument) < 0) {
        douDiff = douDiff + PI;
    }

    var heliocentricLongitude = douDiff + node;

    var heliocentricLatitude = asin(sin(latitudeArgument) * sin(inclination));

    // Geocentric coordinates : page 78

    var N = planetSunDistance * cos(heliocentricLatitude) * sin(heliocentricLongitude - sunTrueLongitude);

    var D = planetSunDistance * cos(heliocentricLatitude) * cos(heliocentricLongitude - sunTrueLongitude) + sunDistance;

    var douDiff = atan(N / D);

    if (D < 0.) {
        douDiff = douDiff + PI;
    }

    var geocentricLongitude = douDiff + sunTrueLongitude;

    var planetEarthDistance = sqrt(N * N + D * D + planetSunDistance * planetSunDistance * sin(heliocentricLatitude)
        * sin(heliocentricLatitude));

    var geocentricLatitude = asin(planetSunDistance * sin(heliocentricLatitude) / planetEarthDistance);

    return [ geocentricLongitude, geocentricLatitude ];
}

// --------------------- Conversion functions ---------------------

/**
 * Convert decimal degrees to degrees, minutes, seconds
 */
function toDMS(decimalDegrees) {

    decimal = decimalDegrees;

    degrees = floor(decimal);
    decimal -= degrees;
    decimal *= 60.;

    minutes = floor(decimal);
    decimal -= minutes;
    decimal *= 60.;

    seconds = round(decimal);

    return degrees + "d " + minutes + "m " + seconds + "s";
}

/**
 * Convert decimal degrees to hours, minutes, seconds
 */
function toHMS(decimalDegrees) {

    decimal = decimalDegrees / 15.;

    hours = floor(decimal);
    decimal -= hours;
    decimal *= 60.;

    minutes = floor(decimal);
    decimal -= minutes;
    decimal *= 60.;

    seconds = round(decimal);

    return hours + "h " + minutes + "m " + seconds + "s";
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees) {

    return degrees * PI / 180.0;
}

function hoursToRadians(hours, minutes, seconds) {

    return (hours * 60 * 60 + minutes * 60 + seconds) / 60 / 60 * PI / 12;
}

function degreesToRadians(degrees, minutes, seconds) {

    return (degrees * 60 * 60 + minutes * 60 + seconds) / 60 / 60 * PI / 180;
}

/**
 * Turn ecliptic coordinates into a right ascension in radians : page 32
 */
function eclipticToRightAscension(eclipticLongitude, eclipticLatitude, eclipticObliquity) {

    var rightAscension = atan((sin(eclipticLongitude) * cos(eclipticObliquity) - tan(eclipticLatitude)
        * sin(eclipticObliquity))
        / cos(eclipticLongitude));

    if (cos(eclipticLongitude) < 0.) {
        rightAscension = rightAscension + PI;
    }

    return rightAscension;
}

/**
 * Turn ecliptic coordinates into a declination in radians : page 32
 */
function eclipticToDeclination(eclipticLongitude, eclipticLatitude, eclipticObliquity) {

    return asin(sin(eclipticLatitude) * cos(eclipticObliquity) + cos(eclipticLatitude) * sin(eclipticObliquity)
        * sin(eclipticLongitude));
}

/**
 * Reduce the amplitude of any angle
 */
function reduceAmplitude(input) {

    var integerPart = floor(input / 2. / PI);
    return input - 2. * PI * integerPart;
}

/**
 * Convert to decimal degrees
 */
function convertToDecimal(degrees, minutes) {

    var deg = parseInt(degrees, 10);
    var min = parseInt(minutes, 10);

    return (deg < 0) ? (deg - min / HOURS_TO_MINUTES) : (deg + min / HOURS_TO_MINUTES);
}

/**
 * Convert to (DM) degrees
 */
function convertToDegrees(decimalDegrees) {

    var decimal = parseFloat(decimalDegrees);

    var absoluteFloored = Math.floor(Math.abs(decimal));

    return (decimal < 0) ? -absoluteFloored : absoluteFloored;
}

/**
 * Convert to (DM) minutes
 */
function convertToMinutes(decimalDegrees) {

    var decimal = parseFloat(decimalDegrees);

    var absoluteFloored = Math.floor(Math.abs(decimal));

    return (decimal < 0) ? -Math.round((decimal + absoluteFloored) * HOURS_TO_MINUTES) : Math
        .round((decimal - absoluteFloored) * HOURS_TO_MINUTES);
}

/**
 * Convert to radians
 */
function toRadians(degrees) {

    return DEG_TO_RAD * degrees;
}

/**
 * Time zone offset in hours
 */
function getStandardTimeZoneOffset() {

    var now = new Date();
    var utc = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
    var temp = utc.toUTCString();
    var local = new Date(temp.substring(0, temp.lastIndexOf(" ")-1));
    var std_time_offset = (utc - local) / (1000 * 60 * 60);
    return std_time_offset;
}

/**
 * Is user using DST ?
 */
function isDaylightSavingTime(today) {

    var jan = new Date(today.getFullYear(), 0); // 1st January
    var jul = new Date(today.getFullYear(), 6); // 1st July

    // Northern hemisphere test

    if (jan.getTimezoneOffset() > jul.getTimezoneOffset() && today.getTimezoneOffset() != jan.getTimezoneOffset()) {
        return true;
    }

    // Southern hemisphere test
    if (jan.getTimezoneOffset() < jul.getTimezoneOffset() && today.getTimezoneOffset() != jul.getTimezoneOffset()) {
        return true;
    }

    // If we reach this point, DST is not in effect on the client computer.
    return false;
}

function cos(arg) {

    return Math.cos(arg);
}

function sin(arg) {

    return Math.sin(arg);
}

function asin(arg) {

    return Math.asin(arg);
}

function tan(arg) {

    return Math.tan(arg);
}

function atan(arg) {

    return Math.atan(arg);
}

function floor(arg) {

    return Math.floor(arg);
}

function round(arg) {

    return Math.round(arg);
}

function sqrt(arg) {

    return Math.sqrt(arg);
}
