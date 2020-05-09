var annee = 2020;
var mois = 5;
var jour = 9;

var heures = 11;
var minutes = 13;
var secondes = 20;

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
console.log('Jour Julien : ' + define_JourJulien(a, m, B, JJdd));

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
