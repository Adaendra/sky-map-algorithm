console.log('-----------------------------');
console.log('----- Sky Map Algorithm -----');
console.log('-----------------------------');
console.log(' ');
var annee = 1984;
var mois = 8;
var jour = 17;

var heures = 0;
var minutes = 0;
var secondes = 0;

var jourJulien = 2458978.9675925925;

// ----- Jour Grégorien -> Jour Julien ----- //
console.log('-- Jour Grégorien -> Jour Julien --');
var a = define_a(annee, mois); // Année
var m = define_m(mois); // mois
var JJdd = define_JJdd(jour, heures, minutes, secondes);
var A = define_A(annee, mois, jour, a);
var B = define_B(annee, mois, jour, A);

console.log('a : ' + a);
console.log('m : ' + m);
console.log('JJdd : ' + JJdd);
console.log('A : ' + A);
console.log('B : ' + B);
console.log('Jour Julien : ' + define_JourJulien(a, m, B, jour));
var jj = define_JourJulien(a, m, B, jour);

function define_a(_annee, _mois) {
    if (_mois === 1 || _mois === 2) {
        return _annee - 1;
    } else {
        return _annee;
    }
}

function define_m(_mois) {
    if (_mois === 1 || _mois === 2) {
        return _mois + 12;
    } else {
        return _mois;
    }
}

function define_A(_annee, _mois, _jour, _a) {
    if (_annee > 1582 ||
        _annee === 1582 && _mois > 10 ||
        _annee === 1582 && _mois === 10 && _jour >= 15) {
        return Math.floor(_a / 100);
    } else {
        return 0;
    }
}

function define_B(annee, mois, jour, _A) {
    if (annee > 1582 ||
        annee === 1582 && mois > 10 ||
        annee === 1582 && mois === 10 && jour >= 15) {
        return 2 - _A + Math.floor(_A / 4);
    } else {
        return 0;
    }
}

function define_JJdd(_jour, _heures, _minutes, _secondes) {
    var minutes_decimal = _minutes + (_secondes / 60);
    var heures_decimal = _heures + (minutes_decimal / 60);
    return _jour + (heures_decimal / 24)
}

function define_JourJulien(_a, _m, _B, _JJdd) {
    return Math.floor((365.25 * _a) + Math.floor(30.6001 * (_m + 1))) + _B + _JJdd + 1720994.5;
}


// // ----- Jour Julien -> Jour Grégorien ----- //
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
define_heureSideraleGreenwich_00h(2451971.5);
define_heureSideraleGreenwich(2451971.5, 0,0,0);
define_heureSideraleGreenwich(2451971.5, 12,24,58);

// define_heureSideraleGreenwich_00h(2458978.5); // 09/05/2020 - 00:00:00
// define_heureSideraleGreenwich_00h(2451545); // 01/01/2000 - 12:00:00
// define_heureSideraleGreenwich_00h(2445074.5);

/*
https://books.google.ca/books?id=dZHhBwAAQBAJ&pg=PA42&lpg=PA42&dq=greenwich+sidereal+time+formula+0.276919398&source=bl&ots=IYYqd8_1jB&sig=ACfU3U0492F3R06JzRH0VB2cMxGz4zj7mQ&hl=en&sa=X&ved=2ahUKEwj3ld3ppqfpAhXGVN8KHbgSAuIQ6AEwAHoECAkQAQ#v=onepage&q&f=false
https://www.astrochinon.fr/index.php/documents/nos-dossiers/95-le-temps-sideral-de-greenwich
 */
function define_heureSideraleGreenwich(_jj, _h, _m, _s) {
    // 1.0027379 Jour Sidéral = 1 jour
    var SG = define_heureSideraleGreenwich_00h(_jj) + convertTimeToDecimal(_h, _m, _s) * 1.0027379; // heure décimale

    var heures = Math.floor(SG) > 23 ? Math.floor(SG)-24 : Math.floor(SG);
    var minutesD = (SG - Math.floor(SG)) * 60;
    var minutes = Math.floor(minutesD);
    var secondesD = (minutesD - minutes)*60;
    var secondes = Math.floor(secondesD);

    console.log(heures + ":" + minutes + ":" + secondes);

    return SG;
}

function define_heureSiderale(_jj, _h, _m, _s, _long) {
    var hsG = define_heureSideraleGreenwich(_jj, _h, _m, _s);
    var result = hsG + convertDegreesToDecimalHour(_long);

    var heures = Math.floor(result) > 23 ? Math.floor(result)-24 : Math.floor(result);
    var minutesD = (result - Math.floor(result)) * 60;
    var minutes = Math.floor(minutesD);
    var secondesD = (minutesD - minutes)*60;
    var secondes = Math.floor(secondesD);

    console.log('HEURE SIDERALE (' + _long + '): ')
    console.log(heures + ":" + minutes + ":" + secondes);
}

function define_heureSideraleGreenwich_00h(_jj)  {
    var T = (_jj - 2415020) / 36525; // Temps sidéral
    var T1 = 0.276919398 + (100.0021359 * T) + (0.000001075 * Math.pow(T, 2)); // Temps sidéral à Greenwich
    var T0 = (T1 - Math.floor(T1)) * 24; // Il est en heures décimales

    console.log('Heure sidérale Greenwich 00:00 :: ' + T0);
    return T0;
}



// ----- Time <-> Decimal -----
function convertTimeToDecimal(_h, _m, _s) {
    return _h + _m / 60 + _s / 3600;
}

// TODO : Fonction conversion objet temps à décimal
// TODO : Fonction conversion decimal à temps (et retourner un objet temps)

// ----- DMS <-> Radians
function convertDMSToDegrees(_d, _m, _s) {
    var result = _d + _m / 60 + _s / 3600;

    console.log(_d + "° " + _m + "' " + _s + "\" :: " + result + "°");
    return result;
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

console.log(' ');
console.log('----- DMS <-> Degrees -----');
convertDegreesToDMS(6.15);
var deg = convertDMSToDegrees(6,9,0);
console.log(convertDegreesToDecimalHour(deg));
console.log(convertDecimalHourToDegrees(0.41000000000000003));
console.log(convertTimeToDecimal(0,24,36));
define_heureSiderale(jj, 17, 7, 24, convertDMSToDegrees(6,9,0));
