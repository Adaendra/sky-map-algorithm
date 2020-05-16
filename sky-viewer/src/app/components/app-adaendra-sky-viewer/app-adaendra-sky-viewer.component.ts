import {Component, OnInit} from '@angular/core';
import {Algorithm} from "../../../../../typescript/Algorithm";
// @ts-ignore
import starsData from "./../../../../../data/stars_data.json";
// @ts-ignore
import constellationData from "./../../../../../data/constellations_data.json";
import {StarData} from "../../../../../typescript/models/StarData";
import {ConstellationData} from "../../../../../typescript/models/ConstellationData";
import {GregorianDateTime} from "../../../../../typescript/formulas/GregorianDateTime";
import {DMSCoordinates} from "../../../../../typescript/models/DMSCoordinates";

@Component({
  selector: 'app-adaendra-sky-viewer',
  templateUrl: './app-adaendra-sky-viewer.component.html',
  styleUrls: ['./app-adaendra-sky-viewer.component.scss']
})
export class AppAdaendraSkyViewerComponent implements OnInit {

  // ATTRIBUTES
  private starList: StarData[] = starsData;
  private constellationList: ConstellationData[] = constellationData;

  // PUBLIC METHODS
  ngOnInit(): void {

  }

  // PRIVATE METHODS
  private calculateStarsLocation() {
    // TODO / A déplacer dans un store
    var dateTime = GregorianDateTime.now();
    var observer_latitude = new DMSCoordinates(38, 55, 17);
    var observer_longitude = new DMSCoordinates(-77, 3, 56);

    this.starList = this.starList.map(star => {
      star.horizontalCoordinates = Algorithm.calculateHorizontalCoordinates(
        dateTime, observer_latitude, observer_longitude,
        Algorithm.convertDMSToDegrees(star.decD, star.decM, star.decS),
        Algorithm.convertTimeToDecimal(star.raH, star.raM, star.raS)
      );
      return star;
    });

    console.log(this.starList)

  }


}
