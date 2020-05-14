"use strict";

var planetaryElementData = new Array(5);
var cityData = new Array();
var starData = new Array();
var constellationData = new Array();
var starMappingData = new Array();
var starNames = new Array();

var cityDataByEnglishName = new Object();

var starDataByKey = new Object();
var starNamesByKey = new Object();

var constellationDataByKey = new Object();
var constellationDataByShortName = new Object();

var planetaryElementDataInitialised = false;
var cityDataInitialised = false;
var starDataInitialised = false;
var constellationDataInitialised = false;
var starMappingDataInitialised = false;
var starNamesInitialised = false;

var starEquatorialPositions = new Array(1628);
var constellationEquatorialPositions = new Array(88);

var starEquatorialPositionsByKey = new Array(1628);

var httpCityRequest;
var httpStarRequest;
var httpConstellationRequest;
var httpStarMappingRequest;
var httpStarNamesRequest;

var DEG_TO_RAD = Math.PI / 180.0;

var HOURS_TO_MINUTES = 60.0;

var HOURS_IN_SIDEREAL_DAY = 23;

var MINUTES_IN_SIDEREAL_DAY = 56;

var SECONDS_IN_SIDEREAL_DAY = 4;

var interval;
var currentAnimation = "Off";

var devicePixelRatio = window.devicePixelRatio || 1;

var mousePressed = false;
var lastMouseDownCanvas_x = null;
var lastMouseDownCanvas_y = null;

var allowMouseMoveCalculation = true;

var azimuthCorrection = 0;

// Add an event listener for the initial load

window.addEventListener('load', init, false)

// Add an event listener to the canvas for resize and orientation change

window.addEventListener('resize', doResize, false);
window.addEventListener('orientationchange', doResize, false);

// Add an event listener to the canvas for mouse up/down/move

window.addEventListener("mousedown", doMouseDown, false);
window.addEventListener("mouseup", doMouseUp, false);
window.addEventListener("mousemove", doMouseMove, false);

function init() {

    initPlanetaryElementData();
    initCityData();
    initStarData();
    initConstellationData();
    initStarMappingData();
    initStarNameData();
}

function start() {

    if (planetaryElementDataInitialised && cityDataInitialised
        && starDataInitialised && constellationDataInitialised
        && starMappingDataInitialised && starNamesInitialised) {

        initialiseStarAndContellationData();

        // Deal with location

        if (navigator.geolocation) {

            console.log("Geolocation available");

            navigator.geolocation.getCurrentPosition(setPosition,
                setPositionFromDefault);

        } else {

            console.log("Geolocation not available");

            setPositionFromDefault(null);
        }
    }
}

function setPosition(position) {

    var longitude = position.coords.longitude;
    var latitude = position.coords.latitude;

    console.log("Geo-coordinates : " + longitude + " " + latitude);

    var today = new Date();

    var observationData = new ObservationData(today.getDate(),
        today.getMonth() + 1, today.getFullYear(), today.getHours(), today
            .getMinutes(), today.getSeconds(),
        getStandardTimeZoneOffset(), isDaylightSavingTime(today),
        longitude, latitude);

    initFormElements(observationData, false);

    doResize();
}

function setPositionFromDefault(error) {

    console.log("Defaulting coordinates");

    var city = defaultCity();
    var longitude = city.longitude;
    var latitude = city.latitude;

    var today = new Date();

    var observationData = new ObservationData(today.getDate(),
        today.getMonth() + 1, today.getFullYear(), today.getHours(), today
            .getMinutes(), today.getSeconds(), city.timeZone,
        isDaylightSavingTime(today), longitude, latitude);

    initFormElements(observationData, true);

    doResize();
}

function initialiseStarAndContellationData() {

    // Initialise equatorial positions of stars

    for (var i = 0; i < 1628; i++) {

        starEquatorialPositions[i] = new EquatorialPosition(
            starData[i].rightAscension, starData[i].declination,
            starData[i].key);

        starEquatorialPositionsByKey[starEquatorialPositions[i].key] = starEquatorialPositions[i];
    }

    // Initialise equatorial positions of constellations

    for (var i = 0; i < 88; i++) {

        constellationEquatorialPositions[i] = new EquatorialPosition(
            constellationData[i].rightAscension,
            constellationData[i].declination, constellationData[i].key);
    }

    // Initialise mappings

    for (var i = 0; i < 264; i++) {

        var startPosition = starEquatorialPositionsByKey[starMappingData[i].start];

        var endPosition = starEquatorialPositionsByKey[starMappingData[i].end];

        startPosition.nextPosition = endPosition;
    }
}

function defaultCity() {

    if (language.language == "my") {
        return cityDataByEnglishName["Kuala Lumpur"];
    } else {
        if (language.language == "en") {
            return cityDataByEnglishName["London"];
        } else {
            if (language.language == "de") {
                return cityDataByEnglishName["Berlin"];
            } else {
                return cityDataByEnglishName["Paris"];
            }
        }
    }
}

function doResize(event) {

    var canvas = document.getElementById("sky");

    // Careful: the lookup on element "primary" below is specific to the theme (Astra currently)

    var canvasSize = Math.round(0.9 * document.getElementById("primary").clientWidth);

    canvas.width = canvasSize * devicePixelRatio;
    canvas.height = canvasSize * devicePixelRatio;

    canvas.style.width = canvasSize + 'px';
    canvas.style.height = canvasSize + 'px';

    setCanvasSize(canvasSize * devicePixelRatio);

    refresh(buildObservationData());
}

function doMouseDown(event) {

    var canvas = document.getElementById("sky");
    var rect = canvas.getBoundingClientRect();

    var canvas_x = Math.round((event.clientX - rect.left) * devicePixelRatio);
    var canvas_y = Math.round((event.clientY - rect.top) * devicePixelRatio);

    var bounded_x = getBoundedFromScreenPosition(getCircleMargin(),
        getCircleGapX(), getCircleSize(), canvas_x);
    var bounded_y = getBoundedFromScreenPosition(getCircleMargin(),
        getCircleGapY(), getCircleSize(), canvas_y);

    // Did the user click in the central part of the canvas ?

    if (Math.abs(bounded_x) <= 1 && Math.abs(bounded_y) <= 1) {

        mousePressed = true;

        lastMouseDownCanvas_x = canvas_x;
        lastMouseDownCanvas_y = canvas_y;

        seekClosest(canvas_x, canvas_y);
    }
}

function doMouseUp(event) {

    mousePressed = false;

    lastMouseDownCanvas_x = null;
    lastMouseDownCanvas_y = null;
}

function doMouseMove(event) {

    if (!mousePressed) {

        return;
    }

    if (!allowMouseMoveCalculation) {

        return;
    }

    var canvas = document.getElementById("sky");
    var rect = canvas.getBoundingClientRect();

    var canvas_x = Math.round((event.clientX - rect.left) * devicePixelRatio);
    var canvas_y = Math.round((event.clientY - rect.top) * devicePixelRatio);

    if (canvas_x != lastMouseDownCanvas_x && canvas_y != lastMouseDownCanvas_y) {

        var bounded_x = getBoundedFromScreenPosition(getCircleMargin(),
            getCircleGapX(), getCircleSize(), canvas_x);
        var bounded_y = getBoundedFromScreenPosition(getCircleMargin(),
            getCircleGapY(), getCircleSize(), canvas_y);

        // Did the user click in the central part of the canvas ?

        if (Math.abs(bounded_x) <= 1 && Math.abs(bounded_y) <= 1) {

            // Allow no other mouse move event for 100 ms

            allowMouseMoveCalculation = false;

            setTimeout(function () {
                allowMouseMoveCalculation = true;
            }, 100);

            var azimuthMouse = Math.atan(bounded_x / bounded_y);

            if (bounded_y < 0.0) {
                azimuthMouse = azimuthMouse + Math.PI;
            }

            var lastBounded_x = getBoundedFromScreenPosition(getCircleMargin(),
                getCircleGapX(), getCircleSize(), lastMouseDownCanvas_x);
            var lastBounded_y = getBoundedFromScreenPosition(getCircleMargin(),
                getCircleGapY(), getCircleSize(), lastMouseDownCanvas_y);

            var lastAzimuthMouse = Math.atan(lastBounded_x / lastBounded_y);

            if (lastBounded_y < 0.0) {
                lastAzimuthMouse = lastAzimuthMouse + Math.PI;
            }

            console.log("Angle adjustment : "
                + (azimuthMouse - lastAzimuthMouse) * 180 / Math.PI);

            azimuthCorrection += azimuthMouse - lastAzimuthMouse;

            lastMouseDownCanvas_x = canvas_x;
            lastMouseDownCanvas_y = canvas_y;

            refresh(buildObservationData());
        }
    }
}

function seekClosest(canvas_x, canvas_y) {

    if (canvas_x < 0 || canvas_y < 0) {

        return;
    }

    var currentClosestStar = allSkyScreenPositionData.stars[0];
    var currentClosestDistance = 1000000;

    for (var i = 0; i < allSkyScreenPositionData.stars.length; i++) {

        var starInformation = allSkyScreenPositionData.stars[i];

        if (starInformation) {

            var distance = computeSquaredDistance(canvas_x, canvas_y,
                starInformation.x, starInformation.y);

            if (distance <= currentClosestDistance) {

                currentClosestDistance = distance;
                currentClosestStar = starInformation;
            }
        }
    }

    if (starDataByKey[currentClosestStar.key].constellation) {

        var constellation;

        if (language.language == "fr") {
            constellation = constellationDataByShortName[starDataByKey[currentClosestStar.key].constellation].frenchName;
        } else {
            if (language.language == "de") {
                constellation = constellationDataByShortName[starDataByKey[currentClosestStar.key].constellation].germanName;
            } else {
                constellation = constellationDataByShortName[starDataByKey[currentClosestStar.key].constellation].englishName;
            }
        }

        var cbxConstellation = document.getElementById("cbxConstellation");
        cbxConstellation.value = constellation;
    }

    if (starNames[currentClosestStar.key]) {

        document.getElementById("lblChosenStar").innerHTML = starNames[currentClosestStar.key];

    } else {

        document.getElementById("lblChosenStar").innerHTML = "*";
    }

    refresh(buildObservationData());
}

function computeSquaredDistance(start_x, start_y, end_x, end_y) {

    return (start_x - end_x) * (start_x - end_x) + (start_y - end_y)
        * (start_y - end_y);
}

function refreshCityData() {

    if (document.getElementById("cbxCity").selectedIndex != 0) {

        var city = cityData[document.getElementById("cbxCity").selectedIndex - 1];

        console.log("City chosen : " + city.englishName);

        document.getElementById("txtLongitude").value = city.longitude
            .toFixed(2);

        document.getElementById("txtLatitude").value = city.latitude.toFixed(2);

        document.getElementById("txtTimeZone").value = city.timeZone;

        refresh(buildObservationData());
    }
}

function refreshNow() {

    var today = new Date();

    var longitude = document.getElementById("txtLongitude").value;

    var latitude = document.getElementById("txtLatitude").value;

    var timeZone = parseFloat(document.getElementById("txtTimeZone").value);

    var observationData = new ObservationData(today.getDate(),
        today.getMonth() + 1, today.getFullYear(), today.getHours(), today
            .getMinutes(), today.getSeconds(), timeZone,
        isDaylightSavingTime(today), longitude, latitude);

    setDateAndTime(observationData);

    refresh(observationData);
}

function refreshObservationData() {

    refresh(buildObservationData());
}

function buildObservationData() {

    var longitude = document.getElementById("txtLongitude").value;

    var latitude = document.getElementById("txtLatitude").value;

    var timeZone = parseFloat(document.getElementById("txtTimeZone").value);

    var date = parseInt(document.getElementById("txtDay").value);
    var month = parseInt(document.getElementById("txtMonth").value);
    var year = parseInt(document.getElementById("txtYear").value);

    var hours = parseInt(document.getElementById("txtHours").value);
    var minutes = parseInt(document.getElementById("txtMinutes").value);
    var seconds = parseInt(document.getElementById("txtSeconds").value);

    var daylightSavingTime = document.getElementById("chkDaylightSavingTime").checked;

    return new ObservationData(date, month, year, hours, minutes, seconds,
        timeZone, daylightSavingTime, longitude, latitude);
}

function refresh(observationData) {

    var canvas = document.getElementById("sky");

    var ctx = canvas.getContext("2d");

    // Store the current transformation matrix
    ctx.save();

    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Restore the transform
    ctx.restore();

    var equatorialPositionData = computeEquatorialPositionData(observationData);

    var screenPositionData = toScreenPositionData(equatorialPositionData);

    paintCanvas(screenPositionData);

    // Save the screen position data

    allSkyScreenPositionData = screenPositionData;
}

// ---------------------- Main engine --------------------

/**
 * Main method : generate ecliptic positions for a set of observation data
 */
function computeEquatorialPositionData(observationData) {

    if (observationData) {

        // Time difference due to daylight saving time

        var timeDifference = observationData.daylightSavingTime ? observationData.timeZone + 1.0
            : observationData.timeZone;

        // Julian day at 0 h UT, assuming year > 1582

        var julianDayZero = computeJulianDayZero(observationData.day,
            observationData.month, observationData.year);

        // Real Julian Day (with fraction of a day)

        var julianDay = computeJulianDay(observationData.hours,
            observationData.minutes, observationData.seconds,
            timeDifference, julianDayZero);

        // Julian Time

        var julianTime = computeJulianTime(julianDay);

        // Ecliptic obliquity

        var eclipticObliquity = computeMeanEclipticObliquity(julianTime);
        var eclipticObliquityForSunApparentPosition = computeEclipticObliquityForSunApparentPosition(julianTime);

        // Sidereal time

        var siderealTime = computeSiderealTime(julianDayZero,
            observationData.hours, observationData.minutes,
            observationData.seconds, timeDifference);

        // Ecliptic & Celestial equator

        var ecliptic = new Array(180);
        var equator = new Array(180);

        for (var i = 0; i < 180; i++) { // Watch out : step 2 degrees

            var angle = i / 90.0 * Math.PI;

            ecliptic[i] = new EquatorialPosition(eclipticToRightAscension(
                angle, 0.0, eclipticObliquity), eclipticToDeclination(
                angle, 0.0, eclipticObliquity), 0.0);
            equator[i] = new EquatorialPosition(angle, 0.0, 0.0);
        }

        // Some general data for the Sun

        var sunTrueLongitude = computeSunTrueLongitude(julianTime);

        var sunDistance = computeSunDistance(julianTime);

        // The Sun

        var sun = computeSunEquatorialPosition(julianTime,
            eclipticObliquityForSunApparentPosition);

        // The Moon

        var longitude = -toRadians(observationData.longitude);
        var latitude = toRadians(observationData.latitude);

        var geocentricCoordinates = computeMoonGeocentricEclipticCoordinates(julianTime);

        var moonGeocentricLongitude = geocentricCoordinates[0];
        var moonGeocentricLatitude = geocentricCoordinates[1];
        var moonParallax = geocentricCoordinates[2];

        var geocentricMoonRightAscension = eclipticToRightAscension(
            moonGeocentricLongitude, moonGeocentricLatitude,
            eclipticObliquity);
        var geocentricMoonDeclination = eclipticToDeclination(
            moonGeocentricLongitude, moonGeocentricLatitude,
            eclipticObliquity);

        // We assume a height of zero

        var topocentricMoonCoordinates = computeTopocentricCoordinates(
            geocentricMoonRightAscension, geocentricMoonDeclination,
            moonParallax, longitude, latitude, 0.0, eclipticObliquity,
            siderealTime);

        var moon = new EquatorialPosition(topocentricMoonCoordinates[0],
            topocentricMoonCoordinates[1], 0);

        // The five planets

        var planets = new Array(5);

        var eclipticCoordinates = computePlanetsEclipticCoordinates(julianTime,
            sunTrueLongitude, sunDistance, planetaryElementData);

        for (var i = 0; i < 5; i++) {

            planets[i] = createEquatorialPosition(eclipticObliquity,
                eclipticCoordinates, i);
        }

        return new EquatorialPositionData(starEquatorialPositions, sun, moon,
            planets, ecliptic, equator, constellationEquatorialPositions,
            observationData, siderealTime);
    }
}

function createEquatorialPosition(eclipticObliquity, eclipticCoordinates, i) {

    var geocentricLongitude = eclipticCoordinates[i][0];

    var geocentricLatitude = eclipticCoordinates[i][1];

    var planetRA = eclipticToRightAscension(geocentricLongitude,
        geocentricLatitude, eclipticObliquity);

    var planetDeclination = eclipticToDeclination(geocentricLongitude,
        geocentricLatitude, eclipticObliquity);

    return new EquatorialPosition(planetRA, planetDeclination, 0);
}

// Constructors

function EquatorialPositionData(stars, sun, moon, planets, ecliptic, equator,
                                constellations, observationData, siderealTime) {

    this.stars = stars;
    this.sun = sun;
    this.moon = moon;
    this.planets = planets;
    this.ecliptic = ecliptic;
    this.equator = equator;
    this.constellations = constellations;
    this.observationData = observationData;
    this.siderealTime = siderealTime;
}

function EquatorialPosition(rightAscension, declination, key) {

    this.rightAscension = rightAscension;
    this.declination = declination;
    this.key = key;
    this.nextPosition = null;
}

function ScreenPositionData(stars, sun, moon, planets, ecliptic, equator,
                            constellations, starMappings, observationData) {

    this.stars = stars;
    this.sun = sun;
    this.moon = moon;
    this.planets = planets;
    this.ecliptic = ecliptic;
    this.equator = equator;
    this.constellations = constellations;
    this.starMappings = starMappings;
    this.observationData = observationData;
}

function ScreenPosition(x, y, key) {

    this.x = x;
    this.y = y;
    this.key = key;
}

function DateTimeData(day, month, year, hours, minutes, seconds,
                      daylightSavingTime) {

    this.day = day;
    this.month = month;
    this.year = year;
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
    this.daylightSavingTime = daylightSavingTime;
}

function LocationData(longitude, latitude, timeZone) {

    this.longitude = longitude;
    this.latitude = latitude;
    this.timeZone = timeZone;
}

function ObservationData(day, month, year, hours, minutes, seconds, timeZone,
                         daylightSavingTime, longitude, latitude) {

    this.day = day;
    this.month = month;
    this.year = year;
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
    this.daylightSavingTime = daylightSavingTime;

    this.longitude = longitude;
    this.latitude = latitude;

    this.timeZone = timeZone;
}

ObservationData.prototype.toString = function observationDataToString() {

    return "Observation data " + this.day + "/" + this.month + "/" + this.year
        + " " + this.hours + "/" + this.minutes + "/" + this.seconds + " "
        + this.longitude + " " + this.latitude;
};

// Animation

function animationStop() {

    if (currentAnimation != "Off") {

        clearInterval(interval);
        currentAnimation = "Off";
    }
}

function animationStart(animationType) {

    if (currentAnimation != "Off") {

        clearInterval(interval);
    }

    currentAnimation = animationType;

    interval = setInterval(function () {
        increment(animationType);
    }, 40);
}

function increment(animationType) {

    var observationData = buildObservationData();

    var currentDate = new Date(observationData.year, observationData.month - 1,
        observationData.day, observationData.hours,
        observationData.minutes, observationData.seconds);

    var newDate;

    switch (animationType) {

        case "ANIMATION_MINUTES_PLUS":

            newDate = new Date(currentDate.getTime() + 3 * 60 * 1000);
            break;

        case "ANIMATION_DAYS_PLUS":

            newDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
            break;

        case "ANIMATION_SIDEREAL_DAYS_PLUS":

            newDate = new Date(currentDate.getTime() + HOURS_IN_SIDEREAL_DAY * 60
                * 60 * 1000 + MINUTES_IN_SIDEREAL_DAY * 60 * 1000
                + SECONDS_IN_SIDEREAL_DAY * 1000);
            break;

        case "ANIMATION_MINUTES_MINUS":

            newDate = new Date(currentDate.getTime() - 3 * 60 * 1000);
            break;

        case "ANIMATION_DAYS_MINUS":

            newDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
            break;

        case "ANIMATION_SIDEREAL_DAYS_MINUS":

            newDate = new Date(currentDate.getTime() - HOURS_IN_SIDEREAL_DAY * 60
                * 60 * 1000 - MINUTES_IN_SIDEREAL_DAY * 60 * 1000
                - SECONDS_IN_SIDEREAL_DAY * 1000);
            break;

        default:

            newDate = currentDate;
    }

    observationData.daylightSavingTime = isDaylightSavingTime(newDate);

    observationData.day = newDate.getDate();
    observationData.month = newDate.getMonth() + 1;
    observationData.year = newDate.getFullYear();
    observationData.hours = newDate.getHours();
    observationData.minutes = newDate.getMinutes();
    observationData.seconds = newDate.getSeconds();

    setDateAndTime(observationData);

    refresh(observationData);
}

// function refreshLanguage() {
//
//     var chosenLanguage = document.getElementById("cbxLanguage").value;
//
//     switch (chosenLanguage) {
//
//         case "en":
//             language = English;
//             break;
//         case "my":
//             language = Malay;
//             break;
//         case "de":
//             language = German;
//             break;
//         default:
//             language = French;
//     }
//
//     var today = new Date();
//
//     var city;
//
//     if (language.language == "my") {
//         city = cityDataByEnglishName["Kuala Lumpur"];
//     } else {
//         if (language.language == "en") {
//             city = cityDataByEnglishName["London"];
//         } else {
//             if (language.language == "de") {
//                 city = cityDataByEnglishName["Berlin"];
//             } else {
//                 city = cityDataByEnglishName["Paris"];
//             }
//         }
//     }
//
//     var observationData = new ObservationData(today.getDate(),
//         today.getMonth() + 1, today.getFullYear(), today.getHours(), today
//             .getMinutes(), today.getSeconds(), city.timeZone,
//         isDaylightSavingTime(today), city.longitude, city.latitude);
//
//     initFormElements(observationData, true);
//
//     refresh(observationData);
// }
