import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ListPage } from '../../pages/list/list';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  grid: Array<any> =[{
    display_name: "Restaurantes",
    img: 'assets/img/food.png',
    category: "restaurants",
    color: "rgba(154, 236, 167, 1)"
  },{
    display_name: "Mercado",
    img: 'assets/img/tomato.png',
    category: "restaurants",
    color: "rgba(254, 190, 122, 1)"
  }, {
    display_name: "Librerias",
    img: '',
    category: "restaurants",
    color: "rgba(168, 182, 244, 1)"
  }, {
    display_name: "Farmacias",
    img: '',
    category: "restaurants",
    color: "rgba(255, 131, 96, 1)"
  }];

  constructor(public navCtrl: NavController) {

  }
  pushCategory(category: string, display_name: string){
    console.log(category);
    this.navCtrl.push(ListPage, {
      category: category,
      display_name: display_name
    });
  }
}
