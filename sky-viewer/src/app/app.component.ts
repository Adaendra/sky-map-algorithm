import {Component, OnInit} from '@angular/core';
import {Main} from "../../../typescript/Main";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  ngOnInit(): void {
    Main.hello();
  }

}
