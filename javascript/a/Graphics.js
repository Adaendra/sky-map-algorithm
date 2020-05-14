"use strict";

var allSkyScreenPositionData;

var version = "1.6.1";

// Colours

var DARK_BACKGROUND = "rgb(0, 0, 51)";

var LIGHT_BACKGROUND = "rgb(255, 255, 255)";

var DARK_FOREGROUND = "rgb(0, 0, 51)";

var LIGHT_FOREGROUND = "rgb(204, 204, 204)";

var LIGHT_HIGHLIGHT = "rgb(255, 255, 0)";

var DARK_HIGHLIGHT = "rgb(204, 51, 51)";

var ECLIPTIC_COLOUR = "rgb(51, 204, 102)";

var EQUATOR_COLOUR = "rgb(204, 51, 51)";

var CONSTELLATIONS_COLOUR = "rgb(51, 102, 204)";

var GRID_COLOUR = "rgb(105, 105, 105)";

var CURRENT_BACKGROUND = DARK_BACKGROUND;

var CURRENT_FOREGROUND = LIGHT_FOREGROUND;

var CURRENT_HIGHLIGHT = LIGHT_HIGHLIGHT;

// Fonts

function getFont() {
    return scale(20) + "px Arial";
}

// Date & time formats

var DATE_FORMAT = "dd-MM-yyyy";

var TIME_FORMAT = "HH:mm:ss";

// Planets

function getDiameterSmallPlanet() {
    return scale(16);
}

function getDiameterLargePlanet() {
    return scale(19);
}

function getDiameterSun() {
    return scale(23);
}

function getDiameterMoon() {
    return scale(23);
}

// Star magnitudes

var FAINTEST_FAINT_TRANSITION = 4.5;

var FAINT_MEDIUMFAINT_TRANSITION = 4;

var MEDIUMFAINT_MEDIUMBRIGHT_TRANSITION = 3;

var MEDIUMBRIGHT_BRIGHT_TRANSITION = 2;

var BRIGHT_BRIGHTEST_TRANSITION = 1;

var NO_MARGIN = 0.0;

var CONSTELLATION_MARGIN = 0.15;

// --------------------- Frame Dimensions ---------------------

var CANVAS_SIZE;

function setCanvasSize(size) {
    CANVAS_SIZE = size;
}

function getCanvasSize() {
    return CANVAS_SIZE;
}

function getCircleMargin() {
    return 30;
}

function getCircleGapX() {
    return 15;
}

function getCircleGapY() {
    return 10;
}

function getCircleSize() {
    return getCanvasSize() - 80;
}

// Caption

var SIGNATURE_TOP_X = 165;

var SIGNATURE_TOP_Y = 630;

function getCaptionGap() {
    return scale(27);
}

function scale(size) {

    return Math.max(Math.round(size * getCanvasSize() / 1000), 1);
}

// --------------------- Form Elements ---------------------

function initFormElements(observationData, isDefaultCity) {

    document.getElementById("lblLocationSection").innerHTML = "<b>" + language.location + "</b>";
    document.getElementById("lblTimeSection").innerHTML = "<b>" + language.time + "</b>";
    document.getElementById("lblAnimationSection").innerHTML = "<b>" + language.animation + "</b>";
    document.getElementById("lblConstellationSection").innerHTML = "<b>" + language.displayConstellations + "</b>";
    document.getElementById("lblDisplaySection").innerHTML = "<b>" + language.display + "</b>";

    document.getElementById("lblLongitude").innerHTML = language.displayLongitude + ":";
    document.getElementById("txtLongitude").value = observationData.longitude.toFixed(2),

        document.getElementById("lblLatitude").innerHTML = language.displayLatitude + ":";
    document.getElementById("txtLatitude").value = observationData.latitude.toFixed(2);

    document.getElementById("lblTimeZone").innerHTML = language.displayTimeZone + ":";
    document.getElementById("txtTimeZone").value = observationData.timeZone;

    setDateAndTime(observationData);

    document.getElementById("buttonNow").innerHTML = language.now;

    document.getElementById("lblCity").innerHTML = language.displayCity + ":";

    var opt;

    var cbxCity = document.getElementById("cbxCity");
    cbxCity.options.length = 0;

    opt = document.createElement("option");
    opt.value = "-----";
    opt.text = "-----";
    cbxCity.appendChild(opt);

    for (var i = 0; i < cityData.length; i++) {

        opt = document.createElement("option");

        if (language.language == "fr") {

            opt.value = cityData[i].frenchName;
            opt.text = cityData[i].frenchName;

        } else {

            opt.value = cityData[i].englishName;
            opt.text = cityData[i].englishName;
        }

        cbxCity.appendChild(opt);
    }

    if (isDefaultCity) {

        if (language.language == "my") {
            cbxCity.value = "Kuala Lumpur";
        } else {
            if (language.language == "en") {
                cbxCity.value = "London";
            } else {
                if (language.language == "de") {
                    cbxCity.value = "Berlin";
                } else {
                    cbxCity.value = "Paris";
                }
            }
        }

    } else {

        cbxCity.value = "-----";
    }

    document.getElementById("lblMagnitude").innerHTML = "Magnitude (0-5)" + ":";
    document.getElementById("ranMagnitude").value = 5;
    document.getElementById("lblEcliptic").innerHTML = language.displayEcliptic + ":";
    document.getElementById("chkEcliptic").checked = true;
    document.getElementById("lblEquator").innerHTML = language.displayEquator + ":";
    document.getElementById("chkEquator").checked = true;
    document.getElementById("lblConstellations").innerHTML = language.displayConstellations + ":";
    document.getElementById("chkConstellations").checked = true;
    document.getElementById("lblConstellationNames").innerHTML = language.displayConstellationNames + ":";
    document.getElementById("chkConstellationNames").checked = true;

    document.getElementById("lblGrid").innerHTML = language.displayGrid + ":";
    document.getElementById("chkGrid").checked = false;

    document.getElementById("lblBlackOnWhite").innerHTML = language.blackOnWhite + ":";
    document.getElementById("lblConstellation").innerHTML = language.displayConstellation + ":";

    document.getElementById("lblStar").innerHTML = language.displayStar + ":";
    document.getElementById("lblChosenStar").innerHTML = "*";

    var cbxConstellation = document.getElementById("cbxConstellation");

    var nameArray = new Array();
    for (var i = 0; i < constellationData.length; i++) {

        if (language.language == "fr") {
            nameArray[i] = constellationData[i].frenchName;
        } else {
            if (language.language == "de") {
                nameArray[i] = constellationData[i].germanName;
            } else {
                nameArray[i] = constellationData[i].englishName;
            }
        }
    }

    nameArray.sort();

    cbxConstellation.options.length = 0;
    for (var i = 0; i < nameArray.length; i++) {

        opt = document.createElement("option");

        opt.value = nameArray[i];
        opt.text = nameArray[i];

        cbxConstellation.appendChild(opt);
    }

    cbxConstellation.value = "Orion";

    document.getElementById("lblLanguage").innerHTML = language.displayLanguage + ":";

    var cbxLanguage = document.getElementById("cbxLanguage");

    cbxLanguage.options.length = 0;

    opt = document.createElement("option");
    opt.value = "de";
    opt.text = "Deutsch";
    cbxLanguage.appendChild(opt);

    opt = document.createElement("option");
    opt.value = "en";
    opt.text = "English";
    cbxLanguage.appendChild(opt);

    opt = document.createElement("option");
    opt.value = "fr";
    opt.text = "Français";
    cbxLanguage.appendChild(opt);

    opt = document.createElement("option");
    opt.value = "my";
    opt.text = "Melayu";
    cbxLanguage.appendChild(opt);

    cbxLanguage.value = language.language;

    document.getElementById("lblAnimationMinutes").innerHTML = language.animationMinutes + ":";
    document.getElementById("lblAnimationDays").innerHTML = language.animationDays + ":";
    document.getElementById("lblAnimationSiderealDays").innerHTML = language.animationSiderealDays + ":";
}

function setDateAndTime(observationData) {

    document.getElementById("lblDay").innerHTML = language.displayDate + ":";

    document.getElementById("txtDay").value = observationData.day;
    document.getElementById("txtMonth").value = observationData.month;
    document.getElementById("txtYear").value = observationData.year;

    document.getElementById("lblTime").innerHTML = language.displayTime + ":";

    document.getElementById("txtHours").value = observationData.hours;
    document.getElementById("txtMinutes").value = observationData.minutes;
    document.getElementById("txtSeconds").value = observationData.seconds;

    document.getElementById("lblDaylightSavingTime").innerHTML = language.displayDaylightSavingTime + ":";

    if (observationData.daylightSavingTime) {

        document.getElementById("chkDaylightSavingTime").checked = true;

    } else {

        document.getElementById("chkDaylightSavingTime").checked = false;
    }
}

// --------------------- Canvas ---------------------

function paintCanvas(screenPositionData) {

    var chkBlackOnWhite = document.getElementById("chkBlackOnWhite").checked;

    if (chkBlackOnWhite) {

        CURRENT_BACKGROUND = LIGHT_BACKGROUND;

        CURRENT_FOREGROUND = DARK_FOREGROUND;

        CURRENT_HIGHLIGHT = DARK_HIGHLIGHT;

    } else {

        CURRENT_BACKGROUND = DARK_BACKGROUND;

        CURRENT_FOREGROUND = LIGHT_FOREGROUND;

        CURRENT_HIGHLIGHT = LIGHT_HIGHLIGHT;
    }

    var canvas = document.getElementById("sky");

    canvas.style.background = CURRENT_BACKGROUND;

    var ctx = canvas.getContext("2d");

    // Circle

    drawGreatCircle(ctx);


    var highlightedConstellationName = document.getElementById("cbxConstellation").value;

    // Stars

    drawStars(ctx, chkBlackOnWhite, highlightedConstellationName, screenPositionData);

}

// --------------------- Grid ---------------------

function drawGrid(ctx) {

    ctx.strokeStyle = GRID_COLOUR;
    ctx.fillStyle = GRID_COLOUR;

    // Height grid

    var numberHeightLines = 6; // That's 15 degrees

    for (var i = 1; i < numberHeightLines; i += 1) {

        drawCircle(ctx, getCircleSize() / 2 * i / numberHeightLines);

        ctx.fillText("" + 15 * i, getCircleMargin() + getCircleGapX() + getCircleSize() / 2 + 2, getCircleMargin()
            + getCircleGapY() + getCircleSize() / 2 + (getCircleSize() / 2 * (1 - i / numberHeightLines)) + 10);
    }

    // Azimuth grid

    var numberAzimuthLines = 24; // That's 15 degrees

    for (var i = 0; i < numberAzimuthLines; i += 1) {

        var angle = -2 * Math.PI * (0.25 + i / numberAzimuthLines);
        ctx.beginPath();
        ctx.moveTo(getCircleMargin() + getCircleGapX() + getCircleSize() / 2, getCircleMargin() + getCircleGapY()
            + getCircleSize() / 2);
        ctx.lineTo(getCircleMargin() + getCircleGapX() + getCircleSize() / 2 + getCircleSize() / 2 * Math.cos(angle),
            getCircleMargin() + getCircleGapY() + getCircleSize() / 2 + getCircleSize() / 2 * Math.sin(angle));
        ctx.stroke();

        ctx.fillText("" + 15 * i, getCircleMargin() + getCircleGapX() + getCircleSize() / 2 - 6
            + (getCircleSize() / 2 + 25) * Math.cos(angle), getCircleMargin() + getCircleGapY() + getCircleSize()
            / 2 + 5 + (getCircleSize() / 2 + 25) * Math.sin(angle));
    }
}

// --------------------- Circle ---------------------

function drawGreatCircle(ctx) {

    ctx.strokeStyle = CURRENT_FOREGROUND;
    ctx.fillStyle = CURRENT_FOREGROUND;

    // Main circle

    drawCircle(ctx, getCircleSize() / 2);

    // Cardinal points

    ctx.font = getFont();

    drawCardinalPoint(ctx, language.north, azimuthCorrection - Math.PI);
    drawCardinalPoint(ctx, language.northeast, azimuthCorrection - Math.PI * 3/4);
    drawCardinalPoint(ctx, language.east, azimuthCorrection - Math.PI / 2);
    drawCardinalPoint(ctx, language.southeast, azimuthCorrection - Math.PI / 4);
    drawCardinalPoint(ctx, language.south, azimuthCorrection + 0);
    drawCardinalPoint(ctx, language.southwest, azimuthCorrection +  Math.PI / 4);
    drawCardinalPoint(ctx, language.west, azimuthCorrection + Math.PI / 2);
    drawCardinalPoint(ctx, language.northwest, azimuthCorrection + Math.PI * 3/ 4);

}

function drawCardinalPoint(ctx, content, angle) {

    ctx.fillText(content,
        getCircleMargin() + getCircleGapX() +  getCircleSize() / 2 + 1.04 * getCircleSize() / 2 * Math.sin(angle) - 15,
        getCircleMargin() + getCircleGapY() + getCircleSize() / 2 + 1.04 * getCircleSize() / 2 * Math.cos(angle) + 10);

}

function drawCircle(ctx, radius) {

    ctx.beginPath();
    ctx.arc(getCircleMargin() + getCircleGapX() + getCircleSize() / 2, getCircleMargin() + getCircleGapY()
        + getCircleSize() / 2, radius, 0, 2 * Math.PI);
    ctx.stroke();
}


// --------------------- Ecliptic & Equator ---------------------

function drawDottedLine(ctx, points, strokeStyle) {
    ctx.strokeStyle = strokeStyle;
    for (var i = 0; i < 179; i += 2) {
        if (points[i] && points[i + 1]) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[i + 1].x, points[i + 1].y);
            ctx.stroke();
        }
    }
}

// --------------------- Stars ---------------------

function drawStars(ctx, chkBlackOnWhite, highlightedConstellationName, screenPositionData) {

    ctx.fillStyle = CURRENT_FOREGROUND;
    ctx.strokeStyle = CURRENT_FOREGROUND;

    for (var i = 0; i < screenPositionData.stars.length; i++) {

        var starInformation = screenPositionData.stars[i];

        if (starInformation) {

            var currentStar = starData[i];

            if (currentStar.magnitude <= document.getElementById("ranMagnitude").value) {

                var isHighlighted = "false";

                // Need to add the bit about colouring

                if (currentStar.magnitude >= FAINTEST_FAINT_TRANSITION) {

                    drawFaintestStar(ctx, chkBlackOnWhite, isHighlighted, starInformation.x, starInformation.y);

                } else {

                    if (currentStar.magnitude >= FAINT_MEDIUMFAINT_TRANSITION) {

                        drawFaintStar(ctx, chkBlackOnWhite, isHighlighted, starInformation.x, starInformation.y);

                    } else {

                        if (currentStar.magnitude >= MEDIUMFAINT_MEDIUMBRIGHT_TRANSITION) {

                            drawMediumFaintStar(ctx, chkBlackOnWhite, isHighlighted, starInformation.x, starInformation.y);

                        } else {

                            if (currentStar.magnitude >= MEDIUMBRIGHT_BRIGHT_TRANSITION) {

                                drawMediumBrightStar(ctx, chkBlackOnWhite, isHighlighted, starInformation.x,
                                    starInformation.y);

                            } else {

                                if (currentStar.magnitude >= BRIGHT_BRIGHTEST_TRANSITION) {

                                    drawBrightStar(ctx, chkBlackOnWhite, isHighlighted, starInformation.x,
                                        starInformation.y);

                                } else {

                                    drawBrightestStar(ctx, chkBlackOnWhite, isHighlighted, starInformation.x,
                                        starInformation.y);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function drawFaintestStar(ctx, chkBlackOnWhite, isHighlighted, x, y) {

    ctx.fillStyle = isHighlighted == "true" ? CURRENT_HIGHLIGHT : (chkBlackOnWhite ? simpleRGB(255 - 95)
        : simpleRGB(95));
    ctx.beginPath();
    ctx.arc(x, y, scale(1), 0, 2 * Math.PI);
    ctx.fill();
}

function drawFaintStar(ctx, chkBlackOnWhite, isHighlighted, x, y) {

    ctx.fillStyle = isHighlighted == "true" ? CURRENT_HIGHLIGHT : (chkBlackOnWhite ? simpleRGB(255 - 127)
        : simpleRGB(127));
    ctx.beginPath();
    ctx.arc(x, y, scale(2), 0, 2 * Math.PI);
    ctx.fill();
}

function drawMediumFaintStar(ctx, chkBlackOnWhite, isHighlighted, x, y) {

    ctx.fillStyle = isHighlighted == "true" ? CURRENT_HIGHLIGHT : (chkBlackOnWhite ? simpleRGB(255 - 159)
        : simpleRGB(159));
    ctx.beginPath();
    ctx.arc(x, y, scale(3), 0, 2 * Math.PI);
    ctx.fill();
}

function drawMediumBrightStar(ctx, chkBlackOnWhite, isHighlighted, x, y) {

    ctx.fillStyle = isHighlighted == "true" ? CURRENT_HIGHLIGHT : (chkBlackOnWhite ? simpleRGB(255 - 191)
        : simpleRGB(191));
    ctx.beginPath();
    ctx.arc(x, y, scale(4), 0, 2 * Math.PI);
    ctx.fill();
}

function drawBrightStar(ctx, chkBlackOnWhite, isHighlighted, x, y) {

    ctx.fillStyle = isHighlighted == "true" ? CURRENT_HIGHLIGHT : (chkBlackOnWhite ? simpleRGB(255 - 223)
        : simpleRGB(223));
    ctx.beginPath();
    ctx.arc(x, y, scale(5), 0, 2 * Math.PI);
    ctx.fill();
}

function drawBrightestStar(ctx, chkBlackOnWhite, isHighlighted, x, y) {

    ctx.fillStyle = isHighlighted == "true" ? CURRENT_HIGHLIGHT : (chkBlackOnWhite ? simpleRGB(255 - 255)
        : simpleRGB(255));
    ctx.beginPath();
    ctx.arc(x, y, scale(6), 0, 2 * Math.PI);
    ctx.fill();
}

function simpleRGB(rgb) {

    return "rgb(" + rgb + ", " + rgb + ", " + rgb + ")";
}

// Legend

function drawStarCaption(ctx, chkBlackOnWhite) {

    var start_x = getCanvasSize() - 3.5 * getCaptionGap();
    var start_y = 5 + getCaptionGap();

    ctx.font = getFont();

    ctx.fillStyle = CURRENT_FOREGROUND;

    ctx.fillText("Magnitude", start_x - 15, start_y);

    drawFaintestStar(ctx, chkBlackOnWhite, "false", start_x, start_y + getCaptionGap());

    ctx.fillText(FAINTEST_FAINT_TRANSITION, start_x + getCaptionGap(), start_y + 1.75 * getCaptionGap());

    drawFaintStar(ctx, chkBlackOnWhite, "false", start_x, start_y + 2 * getCaptionGap());

    ctx.fillText(FAINT_MEDIUMFAINT_TRANSITION, start_x + getCaptionGap(), start_y + 2.75 * getCaptionGap());

    drawMediumFaintStar(ctx, chkBlackOnWhite, "false", start_x, start_y + 3 * getCaptionGap());

    ctx.fillText(MEDIUMFAINT_MEDIUMBRIGHT_TRANSITION, start_x + getCaptionGap(), start_y + 3.75 * getCaptionGap());

    drawMediumBrightStar(ctx, chkBlackOnWhite, "false", start_x, start_y + 4 * getCaptionGap());

    ctx.fillText(MEDIUMBRIGHT_BRIGHT_TRANSITION, start_x + getCaptionGap(), start_y + 4.75 * getCaptionGap());

    drawBrightStar(ctx, chkBlackOnWhite, "false", start_x, start_y + 5 * getCaptionGap());

    ctx.fillText(BRIGHT_BRIGHTEST_TRANSITION, start_x + getCaptionGap(), start_y + 5.75 * getCaptionGap());

    drawBrightestStar(ctx, chkBlackOnWhite, "false", start_x, start_y + 6 * getCaptionGap());
}

// function drawPlanetCaption(ctx) {
//
//     var start_x = getCaptionGap();
//     var start_y = 5;
//
//     ctx.font = getFont();
//
//     drawSun(ctx, new ScreenPosition(start_x, start_y + 0.75 * getCaptionGap(), 0));
//     ctx.fillStyle = CURRENT_FOREGROUND;
//     ctx.fillText(language.sun, start_x + getCaptionGap(), start_y + getCaptionGap());
//
//     drawMoon(ctx, new ScreenPosition(start_x, start_y + 1.75 * getCaptionGap(), 0));
//     ctx.fillStyle = CURRENT_FOREGROUND;
//     ctx.fillText(language.moon, start_x + getCaptionGap(), start_y + 2 * getCaptionGap());
//
//     drawMercury(ctx, new ScreenPosition(start_x, start_y + 2.75 * getCaptionGap(), 0));
//     ctx.fillStyle = CURRENT_FOREGROUND;
//     ctx.fillText(language.mercury, start_x + getCaptionGap(), start_y + 3 * getCaptionGap());
//
//     drawVenus(ctx, new ScreenPosition(start_x, start_y + 3.75 * getCaptionGap(), 0));
//     ctx.fillStyle = CURRENT_FOREGROUND;
//     ctx.fillText(language.venus, start_x + getCaptionGap(), start_y + 4 * getCaptionGap());
//
//     drawMars(ctx, new ScreenPosition(start_x, start_y + 4.75 * getCaptionGap(), 0));
//     ctx.fillStyle = CURRENT_FOREGROUND;
//     ctx.fillText(language.mars, start_x + getCaptionGap(), start_y + 5 * getCaptionGap());
//
//     drawJupiter(ctx, new ScreenPosition(start_x, start_y + 5.75 * getCaptionGap(), 0));
//     ctx.fillStyle = CURRENT_FOREGROUND;
//     ctx.fillText(language.jupiter, start_x + getCaptionGap(), start_y + 6 * getCaptionGap());
//
//     drawSaturn(ctx, new ScreenPosition(start_x, start_y + 6.75 * getCaptionGap(), 0));
//     ctx.fillStyle = CURRENT_FOREGROUND;
//     ctx.fillText(language.saturn, start_x + getCaptionGap(), start_y + 7 * getCaptionGap());
// }
//
// // Constellations names
//
// function drawConstellationNames(ctx, highlightedConstellationName, screenPositionData) {
//
//     for (var i = 0; i < 88; i++) {
//
//         var constellationInformation = screenPositionData.constellations[i];
//
//         if (constellationInformation) {
//
//             // We store constellation keys as negative numbers
//
//             var currentConstellation = constellationDataByKey[constellationInformation.key];
//
//             var currentConstellationName = currentConstellation.englishName;
//
//             if (language.language == "fr") {
//                 currentConstellationName = currentConstellation.frenchName;
//             } else {
//                 if (language.language == "de") {
//                     currentConstellationName = currentConstellation.germanName;
//                 }
//             }
//
//             if (highlightedConstellationName == currentConstellationName) {
//                 ctx.fillStyle = CURRENT_HIGHLIGHT;
//             } else {
//                 ctx.fillStyle = CONSTELLATIONS_COLOUR;
//             }
//
//             ctx.font = getFont();
//             ctx.fillText(currentConstellationName, constellationInformation.x, constellationInformation.y);
//         }
//     }
// }
//
// Draw constellations
//
// function drawConstellations(ctx, highlightedConstellationName, screenPositionData) {
//
//     for (var i = 0; i < screenPositionData.starMappings.length; i++) {
//
//         var starMapping = screenPositionData.starMappings[i];
//
//         if (starMapping) {
//
//             var starData = starDataByKey[starMapping.startKey];
//
//             var currentConstellationName = constellationDataByShortName[starData.constellation].englishName;
//
//             if (language.language == "fr") {
//                 currentConstellationName = constellationDataByShortName[starData.constellation].frenchName;
//             }
//
//             if (highlightedConstellationName == currentConstellationName) {
//                 ctx.strokeStyle = CURRENT_HIGHLIGHT;
//             } else {
//                 ctx.strokeStyle = CONSTELLATIONS_COLOUR;
//             }
//
//             ctx.beginPath();
//             ctx.moveTo(starMapping.startX, starMapping.startY);
//             ctx.lineTo(starMapping.endX, starMapping.endY);
//             ctx.stroke();
//         }
//     }
// }
//
// Conversion to screen positions

/**
 * Turn equatorial position data to screen position data
 */
function toScreenPositionData(equatorialPositionData) {

    var observationData = equatorialPositionData.observationData;

    var observationLongitude = -toRadians(observationData.longitude);

    var observationLatitude = toRadians(observationData.latitude);

    // Start and mappings

    var screenStars = new Array(equatorialPositionData.stars.length);

    var screenStarMappings = new Array();

    for (var i = 0; i < equatorialPositionData.stars.length; i++) {

        // Star position

        var star = equatorialPositionData.stars[i];

        var screenPosition = toScreenPosition(star.rightAscension, star.declination, observationLongitude,
            observationLatitude, equatorialPositionData.siderealTime, NO_MARGIN, star.key);

        if (screenPosition) {

            screenStars[i] = screenPosition;

            if (star.nextPosition) {

                var nextScreenPosition = toScreenPosition(star.nextPosition.rightAscension,
                    star.nextPosition.declination, observationLongitude, observationLatitude,
                    equatorialPositionData.siderealTime, NO_MARGIN, star.nextPosition.key);

                if (nextScreenPosition) {

                    screenStarMappings.push(new ScreenLine(screenPosition, nextScreenPosition));
                }
            }
        }
    }

    // Planets

    var screenPlanets = new Array(equatorialPositionData.planets.length);

    for (var i = 0; i < equatorialPositionData.planets.length; i++) {

        var planet = equatorialPositionData.planets[i];

        screenPlanets[i] = toScreenPosition(planet.rightAscension, planet.declination, observationLongitude,
            observationLatitude, equatorialPositionData.siderealTime, NO_MARGIN, 0);
    }

    // Ecliptic

    var screenEcliptic = new Array(equatorialPositionData.ecliptic.length);

    for (var i = 0; i < equatorialPositionData.ecliptic.length; i++) {

        var eclipticPoint = equatorialPositionData.ecliptic[i];

        screenEcliptic[i] = toScreenPosition(eclipticPoint.rightAscension, eclipticPoint.declination,
            observationLongitude, observationLatitude, equatorialPositionData.siderealTime, NO_MARGIN, 0);
    }

    // Equator

    var screenEquator = new Array(equatorialPositionData.equator.length);

    for (var i = 0; i < equatorialPositionData.equator.length; i++) {

        var equatorPoint = equatorialPositionData.equator[i];

        screenEquator[i] = toScreenPosition(equatorPoint.rightAscension, equatorPoint.declination,
            observationLongitude, observationLatitude, equatorialPositionData.siderealTime, NO_MARGIN, 0);
    }

    // Constellations

    var screenConstellation = new Array(equatorialPositionData.constellations.length);

    for (var i = 0; i < equatorialPositionData.constellations.length; i++) {

        var constellation = equatorialPositionData.constellations[i];

        screenConstellation[i] = toScreenPosition(constellation.rightAscension, constellation.declination,
            observationLongitude, observationLatitude, equatorialPositionData.siderealTime, CONSTELLATION_MARGIN,
            constellation.key);
    }

    // Sun

    var screenSun = toScreenPosition(equatorialPositionData.sun.rightAscension, equatorialPositionData.sun.declination,
        observationLongitude, observationLatitude, equatorialPositionData.siderealTime, NO_MARGIN, 0);

    // Moon

    var screenMoon = toScreenPosition(equatorialPositionData.moon.rightAscension, equatorialPositionData.moon.declination,
        observationLongitude, observationLatitude, equatorialPositionData.siderealTime, NO_MARGIN, 0);

    // All information

    return new ScreenPositionData(screenStars, screenSun, screenMoon, screenPlanets, screenEcliptic, screenEquator,
        screenConstellation, screenStarMappings, observationData);
}

/**
 * Turn equatorial coordinates into a screen position
 */
function toScreenPosition(rightAscension, declination, longitude, latitude, siderealTime, margin, key) {

    // Convert to azimuth and height

    var angleHoraireLocal = siderealTime - longitude - rightAscension;

    var intD = Math.cos(angleHoraireLocal) * Math.sin(latitude) - Math.tan(declination) * Math.cos(latitude);

    var azimuth = Math.atan(Math.sin(angleHoraireLocal) / intD);

    if (intD < 0.0) {
        azimuth = azimuth + Math.PI;
    }

    var height = Math.asin(Math.sin(latitude) * Math.sin(declination) + Math.cos(latitude) * Math.cos(declination)
        * Math.cos(angleHoraireLocal));

    // Calculate the positions on the screen

    if (height >= margin) {

        return createScreenPosition(azimuth, height, key);

    } else {

        return null;
    }
}

/**
 * Turn horizontal coordinates into a screen position
 */
function createScreenPosition(azimuth, height, key) {

    var azimuthWithCorrection = azimuth + azimuthCorrection;

    var bounded_x = Math.sin(azimuthWithCorrection) * (1.0 - height / Math.PI * 2.0);

    var bounded_y = Math.cos(azimuthWithCorrection) * (1.0 - height / Math.PI * 2.0);

    var canvas_x = getScreenPositionFromBounded(getCircleMargin(), getCircleGapX(), getCircleSize(), bounded_x);

    var canvas_y = getScreenPositionFromBounded(getCircleMargin(), getCircleGapY(), getCircleSize(), bounded_y);

    return new ScreenPosition(canvas_x, canvas_y, key);
}

function getScreenPositionFromBounded(margin, gap, circleSize, bounded) {

    return margin + gap + circleSize / 2 + Math.round(circleSize / 2 * bounded + 0.5)
}

function getBoundedFromScreenPosition(margin, gap, circleSize, screenPosition) {

    return (screenPosition - margin - gap - circleSize / 2) * 2 / circleSize;
}

function ScreenLine(start, end) {

    this.startX = start.x;
    this.startY = start.y;
    this.startKey = start.key;
    this.endX = end.x;
    this.endY = end.y;
}
