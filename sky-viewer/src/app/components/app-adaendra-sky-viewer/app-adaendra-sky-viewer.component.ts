import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Algorithm} from "../../../../../typescript/Algorithm";
// @ts-ignore
import starsData from "./../../../../../data/stars_data.json";
// @ts-ignore
import constellationData from "./../../../../../data/constellations_data.json";
import {StarData} from "../../../../../typescript/models/data/StarData";
import {ConstellationData} from "../../../../../typescript/models/data/ConstellationData";
import {GregorianDateTimeService} from "../../../../../typescript/services/GregorianDateTime.service";
import {DMSCoordinates} from "../../../../../typescript/models/coordinates/DMSCoordinates";
import {GregorianDateTime} from "../../../../../typescript/models/time/GregorianDateTime";

@Component({
  selector: 'app-adaendra-sky-viewer',
  templateUrl: './app-adaendra-sky-viewer.component.html',
  styleUrls: ['./app-adaendra-sky-viewer.component.scss']
})
export class AppAdaendraSkyViewerComponent implements AfterViewInit {

  // ATTRIBUTES
  @ViewChild('skyMap')
  private skyMapCanvas: ElementRef<HTMLCanvasElement>;
  private starList: StarData[] = starsData;
  private constellationList: ConstellationData[] = constellationData;

  // PUBLIC METHODS
  ngAfterViewInit(): void {
    this.calculateStarsLocation();
  }

  // PRIVATE METHODS
  private calculateStarsLocation() {
    // TODO / A déplacer dans un store
    var dateTime = new GregorianDateTime(
      2020, 5, 16, 12, 0, 0, 0
    );
    var observer_latitude = new DMSCoordinates(38, 55, 17);
    var observer_longitude = new DMSCoordinates(-77, 3, 56);

    var starPositionList = this.starList.map(star => {
      var declination = Algorithm.convertDMSToDegrees(+star.decD, +star.decM, +star.decS) * Math.PI / 180;
      var rightAscension = Math.PI / 12.0 * Algorithm.convertTimeToDecimal(+star.raH, +star.raM, +star.raS);

      star.horizontalCoordinates = Algorithm.calculateHorizontalCoordinates(
        dateTime, observer_latitude, observer_longitude, declination, rightAscension
      );

      return this.toScreenPosition(
        rightAscension,
        declination,
        star.horizontalCoordinates.azimuth,
        star.horizontalCoordinates.altitude,
        0,
        star.key,
        +star.magnitude
      )
    }).filter(o => o != null);

    // TODO : à mettre au propre
    var ctx = this.skyMapCanvas.nativeElement.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0,1000,1000);


    var constellationsData = this.constellationList.map(a => {
      return {
        code: a.code,
        coordinates: a.coordinates.map(c => {
          return {
            start : starPositionList.filter(k => k.key == String(c.start))[0],
            end : starPositionList.filter(k => k.key == String(c.end))[0]
          }
        })
      }
    });

    constellationsData.forEach(c => {
      c.coordinates.forEach(cc => {
        if (cc.start != undefined && cc.end != undefined) {
          ctx.strokeStyle = "rgba(255,255,255,0.2)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(cc.start.x, cc.start.y);
          ctx.lineTo(cc.end.x, cc.end.y);
          ctx.stroke();
        }
      })
    });

    starPositionList.forEach(d => {
      if (d.magnitude < 1) {
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.beginPath();
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(255,255,255,0.5)";
        ctx.arc(d.x, d.y, this.scale(6), 0, 2 * Math.PI);
        ctx.fill();
      } else if (d.magnitude < 2) {
        ctx.fillStyle = "rgba(223, 223, 223, 1)";
        ctx.beginPath();
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(255,255,255,0.5)";
        ctx.arc(d.x, d.y, this.scale(5), 0, 2 * Math.PI);
        ctx.fill();
      } else if (d.magnitude < 3) {
        ctx.fillStyle = "rgba(191, 191, 191, 1)";
        ctx.beginPath();
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(255,255,255,0.5)";
        ctx.arc(d.x, d.y, this.scale(4), 0, 2 * Math.PI);
        ctx.fill();
      } else if (d.magnitude < 4) {
        ctx.fillStyle = "rgba(159, 159, 159, 1)";
        ctx.beginPath();
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(255,255,255,0.5)";
        ctx.arc(d.x, d.y, this.scale(3), 0, 2 * Math.PI);
        ctx.fill();
      } else if (d.magnitude < 4.5) {
        ctx.fillStyle = "rgba(127, 127, 127, 1)";
        ctx.beginPath();
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(255,255,255,0.5)";
        ctx.arc(d.x, d.y, this.scale(2), 0, 2 * Math.PI);
        ctx.fill();
      } else {
        ctx.fillStyle = "rgba(95, 95, 95, 1)";
        ctx.beginPath();
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(255,255,255,0.5)";
        ctx.arc(d.x, d.y, this.scale(1), 0, 2 * Math.PI);
        ctx.fill();
      }
    });

  }

  private toScreenPosition(rightAscension, declination, azimuth, altitude, margin, key, magnitude) {
        // Calculate the positions on the screen
    if (altitude >= margin) {
      return this.createScreenPosition(azimuth, altitude, key, magnitude);
    } else {
      return null;
    }
  }

  private createScreenPosition(azimuth, height, key, magnitude) {
    var bounded_x = Math.sin(azimuth) * (1.0 - height / Math.PI * 2.0);
    var bounded_y = Math.cos(azimuth) * (1.0 - height / Math.PI * 2.0);

    // TODO : remplacer par des paramètres stockés dans le store (entre autre)
    var canvas_x = this.getScreenPositionFromBounded(30, 15, 600, bounded_x);
    var canvas_y = this.getScreenPositionFromBounded(30, 10, 600, bounded_y);

    // TODO : créer un objet contenant ces paramètres
    return {
      x: canvas_x,
      y: canvas_y,
      key: key,
      magnitude: magnitude
    };
  }

  private getScreenPositionFromBounded(margin, gap, circleSize, bounded) {
    return margin + gap + circleSize / 2 + Math.round(circleSize / 2 * bounded + 0.5)
  }

  private scale(size) {
    return Math.max(Math.round(size * 639 / 1000), 1);
  }

}
