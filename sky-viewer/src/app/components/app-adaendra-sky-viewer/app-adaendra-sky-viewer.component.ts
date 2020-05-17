import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {Algorithm} from "../../../../../typescript/Algorithm";
// @ts-ignore
import starsData from "./../../../../../data/stars_data.json";
// @ts-ignore
import constellationData from "./../../../../../data/constellations_data.json";
import {StarData} from "../../../../../typescript/models/data/StarData";
import {ConstellationData} from "../../../../../typescript/models/data/ConstellationData";
import {DMSCoordinates} from "../../../../../typescript/models/coordinates/DMSCoordinates";
import {GregorianDateTime} from "../../../../../typescript/models/time/GregorianDateTime";
import {GregorianDateTimeService} from "../../../../../typescript/services/GregorianDateTime.service";

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

  @Input('radius')
  public radius: number;
  @Input('margin')
  public margin: number;
  @Input('gap')
  public gap: number;

  // PUBLIC METHODS
  ngAfterViewInit(): void {
    this.calculateStarsLocation();
  }

  // PRIVATE METHODS
  private calculateStarsLocation() {
    // TODO : A déplacer dans un store
    var dateTime = new GregorianDateTime(
      2020, 5, 16, 12, 0, 0, 0
    );
    var observer_latitude = new DMSCoordinates(38, 55, 17);
    var observer_longitude = new DMSCoordinates(-77, 3, 56);

    var starPositionList = this.starList
      .map(star => this.calculateHorizontalCoordinates(star, dateTime, observer_latitude, observer_longitude))
      .map(star => this.calculateScreenPosition(star))
      .filter(o => o != null);

    var ctx = this.skyMapCanvas.nativeElement.getContext("2d");

    this.drawBackground(ctx);

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

    constellationsData.forEach(constellationLines => this.drawConstellationLines(constellationLines, ctx));

    starPositionList.forEach(d => {
      if (d.magnitude < 1) {
        this.drawStar(ctx, 255, 6, d.x, d.y);
      } else if (d.magnitude < 2) {
        this.drawStar(ctx, 223, 5, d.x, d.y);
      } else if (d.magnitude < 3) {
        this.drawStar(ctx, 191, 4, d.x, d.y);
      } else if (d.magnitude < 4) {
        this.drawStar(ctx, 159, 3, d.x, d.y);
      } else if (d.magnitude < 4.5) {
        this.drawStar(ctx, 127, 2, d.x, d.y);
      } else {
        this.drawStar(ctx, 95, 2, d.x, d.y);
      }
    });

  }


  // -- Coordinates
  private calculateHorizontalCoordinates(
    star: StarData, dateTime: GregorianDateTime, observer_latitude: DMSCoordinates, observer_longitude: DMSCoordinates
  ) {
    star.horizontalCoordinates = Algorithm.calculateHorizontalCoordinates(
      dateTime, observer_latitude, observer_longitude,
      Algorithm.convertDMSToDegrees(+star.decD, +star.decM, +star.decS) * Math.PI / 180,
      Math.PI / 12.0 * Algorithm.convertTimeToDecimal(+star.raH, +star.raM, +star.raS)
    );
    return star;
  }

  // -- Screen Position
  private calculateScreenPosition(star: StarData) {
    // Calculate the positions on the screen
    if (star.horizontalCoordinates.altitude >= 0) {
      return this.createScreenPosition(star.horizontalCoordinates.azimuth, star.horizontalCoordinates.altitude, star.key, +star.magnitude);
    } else {
      return null;
    }
  }

  private createScreenPosition(azimuth, height, key, magnitude) {
    var bounded_x = Math.sin(azimuth) * (1.0 - height / Math.PI * 2.0);
    var bounded_y = Math.cos(azimuth) * (1.0 - height / Math.PI * 2.0);

    var canvas_x = this.getScreenPositionFromBounded(this.margin, this.gap, this.radius *2, bounded_x);
    var canvas_y = this.getScreenPositionFromBounded(this.margin, this.gap, this.radius *2, bounded_y);

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

  // -- Drawing
  private drawBackground(ctx: CanvasRenderingContext2D){
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0, (this.margin + this.radius + this.gap) * 2 ,(this.margin + this.radius + this.gap) * 2);

    ctx.translate(this.gap, this.gap);
    ctx.strokeStyle = "rgba(255,255,255,1)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.radius + this.margin,0);
    ctx.lineTo(this.radius + this.margin, this.margin);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(this.radius + this.margin,(this.radius * 2) + this.margin);
    ctx.lineTo(this.radius + this.margin, (this.radius + this.margin) * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0,this.radius + this.margin);
    ctx.lineTo(this.margin, this.radius + this.margin);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo((this.radius * 2) + this.margin,this.radius + this.margin);
    ctx.lineTo((this.radius + this.margin) * 2, this.radius + this.margin);
    ctx.stroke();

    ctx.beginPath();
    ctx.translate(this.radius + this.margin, this.radius + this.margin);
    ctx.rotate(45 * Math.PI / 180);
    ctx.moveTo(0,this.radius);
    ctx.lineTo(0, this.radius + this.margin);
    ctx.rotate(90 * Math.PI / 180);
    ctx.moveTo(0,this.radius);
    ctx.lineTo(0, this.radius + this.margin);
    ctx.rotate(90 * Math.PI / 180);
    ctx.moveTo(0,this.radius);
    ctx.lineTo(0, this.radius + this.margin);
    ctx.rotate(90 * Math.PI / 180);
    ctx.moveTo(0,this.radius);
    ctx.lineTo(0, this.radius + this.margin);
    ctx.rotate(90 * Math.PI / 180);
    ctx.rotate(-45 * Math.PI / 180);
    ctx.translate((this.radius + this.margin) * -1, (this.radius + this.margin) * -1);
    ctx.stroke();
    ctx.translate(-this.gap, -this.gap);

    ctx.beginPath();
    ctx.arc(this.radius + this.margin + this.gap, this.radius + this.margin + this.gap, this.radius, 0, 2 * Math.PI);
    ctx.stroke();
  }

  private drawConstellationLines(constellationLines, ctx: CanvasRenderingContext2D) {
    constellationLines.coordinates.forEach(coordinate => {
      if (coordinate.start != undefined && coordinate.end != undefined) {
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(coordinate.start.x, coordinate.start.y);
        ctx.lineTo(coordinate.end.x, coordinate.end.y);
        ctx.stroke();
      }
    })
  }

  private drawStar(ctx: CanvasRenderingContext2D, starColor: number, scale: number, x: number, y : number) {
    ctx.fillStyle = "rgba(" + starColor + ", " + starColor + ", " + starColor + ", 1)";
    ctx.beginPath();
    ctx.shadowBlur = 10;
    ctx.shadowColor = "rgba(255,255,255,0.5)";
    ctx.arc(x, y, this.scale(scale), 0, 2 * Math.PI);
    ctx.fill();
  }

  private scale(size) {
    return Math.max(Math.round(size * 639 / 1000), 1);
  }

}
