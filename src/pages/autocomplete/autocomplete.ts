/**
 * Page that Use autocomple Api of google maps, helping the user
 * to write the correct adres.
 */

import { Component, NgZone, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';


@IonicPage()

@Component({
  selector: 'page-autocomplete',
  templateUrl: 'autocomplete.html',
})
export class AutocompletePage {
  @ViewChild('myInput') myInput;  
  autocompleteItems;
  autocomplete;
  service = new (<any>window).google.maps.places.AutocompleteService(); // Using Autocomplete Service of GoogleMapsPlugin

  constructor(public navCtrl: NavController, public navParams: NavParams, private zone: NgZone, public viewCtrl: ViewController) {
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
 
  chooseItem(item: any) {
    this.viewCtrl.dismiss(item);
  }
  
  updateSearch() {
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }
    let me = this;
    this.service.getPlacePredictions({ input: this.autocomplete.query, componentRestrictions: {country: 'EC'} }, function (predictions, status) {
      me.autocompleteItems = []; 
      me.zone.run(function () {
        predictions.forEach(function (prediction) {
          me.autocompleteItems.push(prediction.description);
        });
      });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AutocompletePage');
    window.setTimeout(() => {
      this.myInput.setFocus();
      (<any>window).cordova.plugins.Keyboard.show();
    }, 600); //Autofcocos on Search 
  }

}
