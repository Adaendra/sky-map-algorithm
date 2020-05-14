"use strict";

var httpCityRequest;
var httpConstellationRequest;
var httpStarRequest;
var httpStarNameRequest;
var httpStarMappingRequest;

function trim(x) {

    return x.replace(/^\s+|\s+$/gm,'');
}

// // --------------------- Cities ---------------------
//
// function CityData(frenchName, englishName, longitudeDegrees, longitudeMinutes, latitudeDegrees, latitudeMinutes,
//                   timeZone) {
//
//     this.englishName = englishName;
//     this.frenchName = frenchName;
//     this.longitude = convertToDecimal(longitudeDegrees, longitudeMinutes);
//     this.latitude = convertToDecimal(latitudeDegrees, latitudeMinutes);
//     this.timeZone = parseFloat(timeZone);
// }
//
// CityData.prototype.toString = function cityDataToString() {
//
//     return "City " + this.englishName + "/" + this.frenchName + "/" + this.timeZone;
// };
//
// function initCityData() {
//
//     httpCityRequest = new XMLHttpRequest();
//     httpCityRequest.onreadystatechange = populateCityData;
//     httpCityRequest.open("GET", url + "Cities.txt", true);
//     httpCityRequest.send();
// }
//
// function populateCityData() {
//
//     if (httpCityRequest.readyState === 4) {
//         if (httpCityRequest.status === 200) {
//
//             var lines = httpCityRequest.responseText.split("\n");
//             for (var i = 0; i < lines.length; i++) {
//
//                 cityData[i] = new CityData(trim(lines[i].slice(0, 14)), trim(lines[i].slice(15, 29)), trim(lines[i].slice(
//                     30, 34)), trim(lines[i].slice(35, 37)), trim(lines[i].slice(38, 41)), trim(lines[i].slice(
//                     42, 44)), trim(lines[i].slice(45)));
//
//                 cityDataByEnglishName[cityData[i].englishName] = cityData[i];
//
//             }
//             cityDataInitialised = true;
//             start();
//
//         } else {
//             alert("There was a problem with the request");
//         }
//     }
// }

// --------------------- Stars loading ---------------------

function StarData(key, starName, constellationName, raH, raM, raS, decD, decM, decS, magnitude) {

    this.key = key;
    this.rightAscension = Math.PI / 12.0 * (parseFloat(raH) + parseFloat(raM) / 60.0 + parseFloat(raS) / 3600.0);
    if (decD.substring(0, 1) == "-") {
        this.declination = Math.PI / 180.0 * (parseFloat(decD) - parseFloat(decM) / 60.0 - parseFloat(decS) / 3600.0);
    } else {
        this.declination = Math.PI / 180.0 * (parseFloat(decD) + parseFloat(decM) / 60.0 + parseFloat(decS) / 3600.0);
    }
    this.magnitude = magnitude;
    this.name = starName;
    this.constellation = constellationName;
}

function initStarData() {

    httpStarRequest = new XMLHttpRequest();
    httpStarRequest.onreadystatechange = populateStarData;
    httpStarRequest.open("GET", url + "Stars.txt", true);
    httpStarRequest.send();
}

function populateStarData() {

    if (httpStarRequest.readyState === 4) {
        if (httpStarRequest.status === 200) {

            var lines = httpStarRequest.responseText.split("\n");

            for (var i = 0; i < lines.length; i++) {

                starData[i] = new StarData(parseInt(trim(lines[i].slice(0, 4))), trim(lines[i].slice(5, 9)), trim(lines[i]
                    .slice(10, 13)), trim(lines[i].slice(14, 16)), trim(lines[i].slice(17, 19)), trim(lines[i]
                    .slice(20, 24)), trim(lines[i].slice(25, 28)), trim(lines[i].slice(29, 31)), trim(lines[i]
                    .slice(32, 34)), parseFloat(trim(lines[i].slice(35, 40))));

                starDataByKey[starData[i].key] = starData[i];
            }

            starDataInitialised = true;
            start();

        } else {
            alert("There was a problem with the request for star data");
        }
    }
}

// // --------------------- Star mappings loading ---------------------
//
// function StarMappingData(start, end) {
//
//     this.start = start;
//     this.end = end;
// }
//
// function initStarMappingData() {
//
//     httpStarMappingRequest = new XMLHttpRequest();
//     httpStarMappingRequest.onreadystatechange = populateStarMappingData;
//     httpStarMappingRequest.open("GET", url + "StarMappings.txt", true);
//     httpStarMappingRequest.send();
// }
//
// function populateStarMappingData() {
//
//     if (httpStarMappingRequest.readyState === 4) {
//         if (httpStarMappingRequest.status === 200) {
//
//             var lines = httpStarMappingRequest.responseText.split("\n");
//
//             for (var i = 0; i < lines.length; i++) {
//
//                 if ("*" != lines[i].slice(0, 1)) {
//
//                     starMappingData.push(new StarMappingData(parseInt(trim(lines[i].slice(0, 4))), parseInt(trim(lines[i]
//                         .slice(5)))));
//                 }
//
//             }
//
//             starMappingDataInitialised = true;
//             start();
//
//         } else {
//             alert("There was a problem with the request for star mappings");
//         }
//     }
// }
//
// // --------------------- Constellations loading ---------------------
//
// function ConstellationData(key, raH, raM, decD, decM, shortName, englishName, frenchName, germanName) {
//
//     this.key = key;
//     this.shortName = shortName;
//     this.englishName = englishName;
//     this.frenchName = frenchName;
//     this.germanName = germanName;
//     this.rightAscension = Math.PI / 12.0 * (parseFloat(raH) + parseFloat(raM) / 60.0);
//     if (decD.substring(0, 1) === "-") {
//         this.declination = Math.PI / 180.0 * (parseFloat(decD) - parseFloat(decM) / 60.0);
//     } else {
//         this.declination = Math.PI / 180.0 * (parseFloat(decD) + parseFloat(decM) / 60.0);
//     }
// }
//
// function initConstellationData() {
//
//     httpConstellationRequest = new XMLHttpRequest();
//     httpConstellationRequest.onreadystatechange = populateConstellationData;
//     httpConstellationRequest.open("GET", url + "Constellations.txt", true);
//     httpConstellationRequest.send();
// }
//
// function populateConstellationData() {
//
//     if (httpConstellationRequest.readyState === 4) {
//         if (httpConstellationRequest.status === 200) {
//
//             var lines = httpConstellationRequest.responseText.split("\n");
//
//             for (var i = 0; i < lines.length; i++) {
//
//                 constellationData[i] = new ConstellationData(parseInt(trim(lines[i].slice(0, 2))), trim(lines[i]
//                     .slice(3, 5)), trim(lines[i].slice(6, 8)), trim(lines[i].slice(9, 12)), trim(lines[i].slice(
//                     13, 15)), trim(lines[i].slice(16, 19)), trim(lines[i].slice(20, 39)), trim(lines[i].slice(
//                     40, 61)), trim(lines[i].slice(62)));
//
//                 constellationDataByKey[constellationData[i].key] = constellationData[i];
//                 constellationDataByShortName[constellationData[i].shortName] = constellationData[i];
//             }
//
//             constellationDataInitialised = true;
//
//             start();
//
//         } else {
//             alert("There was a problem with the request for constellations");
//         }
//     }
// }
//
// // --------------------- Star names loading ---------------------
//
// function initStarNameData() {
//
//     httpStarNameRequest = new XMLHttpRequest();
//     httpStarNameRequest.onreadystatechange = populateStarNameData;
//     httpStarNameRequest.open("GET", url + "StarNames.txt", true);
//     httpStarNameRequest.send();
// }
//
// function populateStarNameData() {
//
//     if (httpStarNameRequest.readyState === 4) {
//         if (httpStarNameRequest.status === 200) {
//
//             var lines = httpStarNameRequest.responseText.split("\n");
//             for (var i = 0; i < lines.length; i++) {
//                 starNames[parseInt(trim(lines[i].slice(0, 4)))] = trim(lines[i].slice(5));
//             }
//             starNamesInitialised = true;
//             start();
//
//         } else {
//             alert("There was a problem with the request for star names");
//         }
//     }
// }
//
// // --------------------- Planetary elements initialisation ---------------------
//
// function PlanetaryElementData(name, meanAnomaly0, meanAnomaly1, meanAnomaly2, longitude0, longitude1, longitude2,
//                               longitude3, excentricity0, excentricity1, excentricity2, excentricity3, inclination0, inclination1,
//                               inclination2, inclination3, perihelion0, perihelion1, perihelion2, perihelion3, node0, node1, node2, node3,
//                               orbitAxis) {
//
//     this.name = name;
//     this.longitude = [ DEG_TO_RAD * longitude0, DEG_TO_RAD * longitude1, DEG_TO_RAD * longitude2,
//         DEG_TO_RAD * longitude3 ];
//     this.excentricity = [ excentricity0, excentricity1, excentricity2, excentricity3 ];
//     this.inclination = [ DEG_TO_RAD * inclination0, DEG_TO_RAD * inclination1, DEG_TO_RAD * inclination2,
//         DEG_TO_RAD * inclination3 ];
//     this.perihelion = [ DEG_TO_RAD * perihelion0, DEG_TO_RAD * perihelion1, DEG_TO_RAD * perihelion2,
//         DEG_TO_RAD * perihelion3 ];
//     this.node = [ DEG_TO_RAD * node0, DEG_TO_RAD * node1, DEG_TO_RAD * node2, DEG_TO_RAD * node3 ];
//     this.meanAnomaly = [ DEG_TO_RAD * meanAnomaly0, DEG_TO_RAD * meanAnomaly1, DEG_TO_RAD * meanAnomaly2 ];
//     this.orbitAxis = orbitAxis;
// }
//
// function initPlanetaryElementData() {
//
//     planetaryElementData[0] = new PlanetaryElementData("Mercury", 102.27938, 149472.51529, 0.000007, 178.179078,
//         149474.07078, 3.011E-4, 0, 2.0561421E-1, 2.046E-5, -3E-8, 0, 7.002881, 1.8608E-3, -1.83E-5, 0, 28.753753,
//         0.3702806, 0.00012080, 0, 47.145944, 1.1852083, 1.739E-4, 0, 0.3870986);
//     planetaryElementData[1] = new PlanetaryElementData("Venus", 212.60322, 58517.80387, 0.001286, 342.767053,
//         58519.21191, 3.097E-4, 0, 6.82069E-3, -4.774E-5, 9.1E-8, 0, 3.393631, 1.0058E-3, -1E-6, 0, 54.384186,
//         0.5081861, -0.0013864, 0, 75.779647, 8.9985E-1, 4.1E-4, 0, 0.7233316);
//     planetaryElementData[2] = new PlanetaryElementData("Mars", 319.51913, 19139.85475, 0.000181, 293.737334,
//         19141.69551, 3.107E-4, 0, 9.33129E-2, 9.2064E-5, -7.7E-8, 0, 1.850333, -6.75E-4, 1.26E-5, 0, 285.431761,
//         1.0697667, 0.00013130, 0.00000414, 48.786442, 7.709917E-1, -1.4E-6, -5.33E-6, 1.5236883);
//     planetaryElementData[3] = new PlanetaryElementData("Jupiter", 225.32833, 3034.69202, -0.000722, 238.049257,
//         3036.301986, 3.347E-4, -1.65E-6, 4.833475E-2, 1.6418E-4, -4.676E-7, -1.7E-9, 1.308736, -5.6961E-3, 3.9E-6,
//         0, 273.277558, 0.5994317, 0.00070405, 0.00000508, 99.443414, 1.01053, 3.5222E-4, -8.51E-6, 5.2025610);
//     planetaryElementData[4] = new PlanetaryElementData("Saturn", 175.46622, 1221.55147, -0.000502, 266.564377,
//         1223.509884, 3.245E-4, -5.8E-6, 5.589232E-2, -3.455E-4, -7.28E-7, 7.4E-10, 2.492519, -3.9189E-3, -1.549E-5,
//         4E-8, 338.307800, 1.0852207, 0.00097854, 0.00000992, 112.790414, 8.731951E-1, -1.5218E-4, -5.31E-6,
//         9.5547470);
//
//     planetaryElementDataInitialised = true;
//     start();
// }
