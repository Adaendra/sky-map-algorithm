console.log('-----------------------------');
console.log('----- Sky Map Algorithm -----');
console.log('-----------------------------');
console.log(' ');


// ----- Jour Grégorien -> Jour Julien ----- //
// -- Chapitre 7 -> Pages 60-61
function define_year(_annee, _mois) {
    if (_mois === 1 || _mois === 2) {
        return _annee - 1;
    } else {
        return _annee;
    }
}

function define_month(_mois) {
    if (_mois === 1 || _mois === 2) {
        return _mois + 12;
    } else {
        return _mois;
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

function define_JulianDay(_year, _month, _B, _decimalDay) {
    return (Math.floor(365.25 * (_year + 4716)) + Math.floor(30.6001 * (_month + 1)) + _decimalDay + _B - 1524.5);
}

function define_decimalDay(_jour, _heures, _minutes, _secondes) {
    var minutes_decimal = _minutes + (_secondes / 60);
    var heures_decimal = _heures + (minutes_decimal / 60);
    return _jour + (heures_decimal / 24);
}


var t_year = define_year(1987, 4);
var t_month = define_month(4);
var t_day = define_decimalDay(10, 19, 21,0);
var t_A = define_A(t_year);
var t_B = define_B(t_A, true);
var t_JD = define_JulianDay(t_year, t_month, t_B, t_day);

console.log('--------------------');
console.log(' ');
console.log('Year :: ' + t_year);
console.log('Month :: ' + t_month);
console.log('Day :: ' + t_day);
console.log('A :: ' + t_A);
console.log('B :: ' + t_B);
console.log('JD :: ' + t_JD);
console.log(' ');
console.log('--------------------');


// ----- Jour Julien -> Jour Grégorien ----- //
// var J = jourJulien + 0.5;
// var Z = Math.floor(J);
// var F = J - Math.floor(J);
//
// var A = define_A(Z);
// var B = A + 1524;
// var C = Math.floor((B - 122.1) / 365.25);
// var D = Math.floor(365.25 * C);
// var E = Math.floor((B - D) / 30.6001);
//
//
// var jourG_decimal = B - D - Math.floor(30.6001 * E) + F;
// var jourG = Math.floor(jourG_decimal);
// var moisG = E < 13.5 ? (E - 1) : (E - 13);
// var anneeG = moisG > 2.5 ? (C - 4716) : (C - 4715);
//
// var heuresG_decimal = (jourG_decimal - jourG) * 24;
// var heuresG = Math.floor(heuresG_decimal);
//
// var minutesG_decimal = (heuresG_decimal - heuresG) * 60;
// var minutesG = Math.floor(minutesG_decimal);
//
// var secondesG = Math.floor((minutesG_decimal - minutesG) * 60);
//
// console.log(anneeG + "-" + moisG + "-" + jourG + " " + heuresG + ":" + minutesG + ":" + secondesG);
//
// function define_A(_Z) {
//     if (_Z < 2299161) {
//         return _Z;
//     } else {
//         var a = Math.floor((_Z - 1867216.25) / 36534.25);
//         return _Z + 1 + a - Math.floor(a / 4);
//     }
// }


// ----- Temps sidéral de Greenwich ----- //
// TODO : Chapitre 12 - 95

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

// var t_T = define_T(t_JD);
// var t_G0 = define_siderealTime_Greenwich_0(t_T);
// var t_G = define_meanSiderealTime_Greenwich(t_G0, convertTimeToDecimal(19, 21, 0));
//
// console.log('T : ' + t_T);
// console.log('time sidereal Greenwich 0h : ' + t_G0);
// console.log('time sidereal Greenwich : ' + t_G);
// console.log(' --> ' + _360deg(t_G));
// console.log(' ----> ' + convertDegreesToDecimalHour(_360deg(t_G)));
//
//
// var _12_4 = define_apparentSiderealTime_Greenwich(t_JD, t_T);
// console.log('12.4 :: ' + _12_4);
// console.log(' --> ' + _360deg(_12_4));
// console.log(' ----> ' + convertDegreesToDecimalHour(_360deg(_12_4)));

function _360deg(_angle) {
    if (_angle < 0) {
        _angle = _angle + 360;
    } else if (_angle >= 360) {
        _angle = _angle - 360;
    }

    if (_angle < 0 || _angle >= 360) {
        return _360deg(_angle);
    } else {
        return _angle;
    }
}


// ----- Time <-> Decimal -----
function convertTimeToDecimal(_h, _m, _s) {
    return _h + _m / 60 + _s / 3600;
}

// TODO : Fonction conversion objet temps à décimal
// TODO : Fonction conversion decimal à temps (et retourner un objet temps)

// ----- DMS <-> Radians
function convertDMSToDegrees(_d, _m, _s) {
    if (_d < 0) {
        return _d - _m / 60 - _s / 3600;
    } else {
        return _d + _m / 60 + _s / 3600;
    }
}

function convertDegreesToDMS(_r) {
    var d_decimal = _r;
    var d = Math.floor(d_decimal);

    var m_decimal = (d_decimal - d) * 60;
    var m = Math.floor(m_decimal);

    var s = (m_decimal - m) * 60;

    console.log(_r + "° :: " + d + "° " + m + "' " + s + "\"");
    // TODO : return value
}

// ----- Degrees <-> Decimal Hour -----
function convertDegreesToDecimalHour(_d) {
    return _d / 15;// on divise par 15 car 1h = 15 degrés
}

function convertDecimalHourToDegrees(_d) {
    return _d * 15; // on multiplie par 15 car 1h = 15 degrés
}

// console.log(' ');
// console.log('----- DMS <-> Degrees -----');
// convertDegreesToDMS(6.15);
// var deg = convertDMSToDegrees(6,9,0);
// console.log(convertDegreesToDecimalHour(deg));
// console.log(convertDecimalHourToDegrees(0.41000000000000003));
// console.log(convertTimeToDecimal(0,24,36));
// define_heureSiderale(jj, 17, 7, 24, convertDMSToDegrees(6,9,0));


// ------------------------------------------------------------------------ //
// ----- Angle horaire -----
function define_angleHoraire(_localSiderealTime, _rightAscension) {
    return _localSiderealTime - _rightAscension;
}

function define_angleHoraire(_greenwichSiderealTime, _observerLongitude, _rightAscension) {
    //
    return _greenwichSiderealTime + _observerLongitude - _rightAscension;
}

// ----- Right Ascension -----
function define_rightAscension(_localSiderealTime, _hourAngle) {
    return _localSiderealTime - _hourAngle;
}

function define_rightAscension(_greenwichSiderealTime, _observerLongitude, _hourAngle) {
    return _greenwichSiderealTime + _observerLongitude - _hourAngle;
}


// ----- Coordonnées Équatoriales <-> Coordonnées Horaires -----
// TODO : Faire des objets par type de coordonnées

function convert_coordonneesEquatoriales_to_coordonneesHoraires(_declinaison, _tempsSideralObservateur, _ascensionDroite) {
    var declinaison = _declinaison;
    var angleHoraire = _tempsSideralObservateur - _ascensionDroite;

    console.log('----- Coordonnées horaires -----');
    console.log('- déclinaison : ' + declinaison);
    console.log('- angle horaire : ' + angleHoraire);
    // TODO  return
}

function convert_coordonneesHoraires_to_coordonneesEquatoriales(_declinaison, _tempsSideralObservateur, _angleHoraire) {
    var declinaison = _declinaison;
    var ascensionDroite = _tempsSideralObservateur - _angleHoraire;


    console.log('----- Coordonnées équatoriales -----');
    console.log('- déclinaison : ' + declinaison);
    console.log('- ascension droite : ' + ascensionDroite);
    // TODO  return
}

// ----- Coordonnées Équatoriales <-> Coordonnées Horizontales -----
function convert_coordonneesEquatoriales_to_coordoonneesHorizontales(_observerLatitude, _declination, _angleHoraire) {
    // Formule 13.5 du livre p 93
    var A_ = Math.atan(
        Math.sin(_angleHoraire) /
        ((Math.cos(_angleHoraire) * Math.sin(_observerLatitude)) - (Math.tan(_declination) * Math.cos(_observerLatitude)))
    );

    // Formule 13.6 du livre p 93
    var h_ = Math.asin(
        (Math.sin(_observerLatitude) * Math.sin(_declination)) + (Math.cos(_observerLatitude) * Math.cos(_declination) * Math.cos(_angleHoraire))
    );

    console.log(' ');
    console.log('--  LIVRE  --');
    console.log(' ');
    console.log('> A : ' + A_ / Math.PI * 180);
    console.log('> h : ' + h_ / Math.PI * 180);
    console.log('------------');
    console.log(' ');
}

// -- Moment de l'observation
var test_annee = 1987;
var test_mois = 4;
var test_jour = 10;

var test_heures = 19;
var test_minutes = 21;
var test_secondes = 0;

var test_a = define_year(test_annee, test_mois);
var test_m = define_month(test_mois);
var test_A = define_A(test_annee);
var test_B = define_B(test_A, true);
var test_JJdd = define_decimalDay(test_jour, test_heures, test_minutes, test_secondes);
var test_jourJulien = define_JulianDay(test_a, test_m, test_B, test_JJdd);
var test_Apparent_heureSideraleGreenwich = _360deg(
    define_apparentSiderealTime_Greenwich(test_jourJulien, define_T(test_jourJulien))
);
var test_mean_heureSideraleGreenwich = _360deg(
    define_meanSiderealTime_Greenwich(
        define_siderealTime_Greenwich_0(define_T(test_jourJulien)),
        convertTimeToDecimal(19, 21, 0)
    )
);

// console.log('-- Jour julien :: ');
// console.log(test_jourJulien);
// console.log('-- Temps sidéral Greenwich :: ');
// console.log(test_heureSideraleGreenwich);

// -- Observateur
var test_latitudeObservateur = convertDMSToDegrees(38, 55, 17);
var test_longitudeObservateur = convertDMSToDegrees(-77, 3, 56);

// console.log('-- Latitude OBS :: ');
// console.log(test_latitudeObservateur);
// console.log('-- Longitude OBS :: ');
// console.log(test_longitudeObservateur);

// -- Informations corps céleste
var test_declinaison = convertDMSToDegrees(-6, 43, 11.61);
var test_ascensionDroite = convertTimeToDecimal(23, 9, 16.641);
var test_angleHoraire = define_angleHoraire(
    convertDegreesToDecimalHour(test_Apparent_heureSideraleGreenwich),
    convertDegreesToDecimalHour(test_longitudeObservateur),
    test_ascensionDroite
);
console.log(' ');
console.log('>> Mean Sidereal Time Greenwich :: ' + test_mean_heureSideraleGreenwich
    + " => " + convertDegreesToDecimalHour(test_mean_heureSideraleGreenwich));

console.log('>> Apparent Sidereal Time Greenwich :: ' + test_Apparent_heureSideraleGreenwich
    + " => " + convertDegreesToDecimalHour(test_Apparent_heureSideraleGreenwich)
    + " -> ");

console.log('>> Longitude observateur :: ' + test_longitudeObservateur
    + " => " + convertDegreesToDecimalHour(test_longitudeObservateur));

console.log('>> Ascension Droite :: ' + test_ascensionDroite);

console.log(' ');
console.log('>> angle horaire :: ' + test_angleHoraire + " >> " + convertDecimalHourToDegrees(test_angleHoraire)
    + " => " + _360deg(convertDecimalHourToDegrees(test_angleHoraire)));
convert_coordonneesEquatoriales_to_coordoonneesHorizontales(
    test_latitudeObservateur * Math.PI / 180,
    test_declinaison * Math.PI / 180,
    _360deg(convertDecimalHourToDegrees(test_angleHoraire)) * Math.PI / 180
);

