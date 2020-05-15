import {Component, OnInit} from '@angular/core';
import {Main} from "../../../typescript/Main";
import starsData from "./../../../data/stars_data.json";
import constelationData from "./../../../data/constellations_data.json";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  ngOnInit(): void {
    console.log(starsData);
    console.log(constelationData);
    Main.hello();
  }

}
