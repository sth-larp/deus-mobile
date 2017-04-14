import { Component } from '@angular/core';
import { NavParams } from "ionic-angular";

@Component({
  selector: 'page-character',
  templateUrl: 'character.html'
})
export class CharacterPage {
  public characterId: string;
  constructor(navParams: NavParams) {
    this.characterId = navParams.data.value;
  }
}
