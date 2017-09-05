import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';

/**
 * Generated class for the OptsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-opts',
  templateUrl: 'opts.html',
})
export class OptsPage {
  options: Array<any>;
  name: string;
  description: string;
  answers: Array<any> = [{answer: "", price: null},{answer: "", price: null},{answer: "", price:null},{answer: "", price: null}] 
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    console.log(this.navParams.get('options'));
    this.options = this.navParams.get('options');
    this.name = this.navParams.get('name');
    this.description = this.navParams.get('description');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OptsPage');
  }

  dismiss() {
    let data = null;
    this.viewCtrl.dismiss(data);
   }
   trackByIndex(index: number, obj: any): any {
     return index;
   }
   saveOptions(){
     let answers = this.answers;
     this.viewCtrl.dismiss(answers.filter(answer=>{
       return answer.answer != "";
     }));
   }
   setPrice(index, price){
     this.answers[index].price = Number(price);
   }
}
