var jourJulien = 2458978.9675925925;

// ----- Jour Julien -> Jour Grégorien ----- //
var J = jourJulien + 0.5;
var Z = Math.floor(J);
var F = J - Math.floor(J);

var A = define_A(Z);
var B = A + 1524;
var C = Math.floor((B - 122.1) / 365.25);
var D = Math.floor(365.25 * C);
var E = Math.floor((B - D) / 30.6001);


var jourG_decimal = B - D - Math.floor(30.6001 * E) + F;
var jourG = Math.floor(jourG_decimal);
var moisG = E < 13.5 ? (E - 1) : (E - 13);
var anneeG = moisG > 2.5 ? (C - 4716) : (C - 4715);

var heuresG_decimal = (jourG_decimal - jourG) * 24;
var heuresG = Math.floor(heuresG_decimal);

var minutesG_decimal = (heuresG_decimal - heuresG) * 60;
var minutesG = Math.floor(minutesG_decimal);

var secondesG = Math.floor((minutesG_decimal - minutesG) * 60);

console.log(anneeG + "-" + moisG + "-" + jourG + " " + heuresG + ":" + minutesG + ":" + secondesG);

function define_A(_Z) {
    if (_Z < 2299161) {
        return _Z;
    } else {
        var a = Math.floor((_Z - 1867216.25) / 36534.25);
        return _Z + 1 + a - Math.floor(a / 4);
    }
}
