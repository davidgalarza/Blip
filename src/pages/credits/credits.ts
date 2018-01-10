import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

/**
 * Generated class for the CreditsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-credits',
  templateUrl: 'credits.html',
})
export class CreditsPage {
  transactions: Array<object> = [];
  rewards: number =0;
  constructor(public navCtrl: NavController, public navParams: NavParams, private menu: MenuController) {
    this.menu.enable(false);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreditsPage');
    this.initBranch();
  }
  initBranch(){
    const Branch = window['Branch'];
    var self = this;
    Branch.loadRewards().then(function (res) {
      self.rewards = res/100;
    }).catch(function (err) {
      console.log('Error: ' + JSON.stringify(err))
    })
    Branch.creditHistory().then(function (res) {
      res.forEach(tran => {
        let transaction: any = tran;
        console.log(transaction);
        let type;
        switch(transaction.transaction.type){
          case 0:
                  type = "Deposito";
                  break
          case 2:
                  type = "Retiro";
                  break;
          default:
                  type = "Transaccion"
        }
        self.transactions.push({
          amount: Math.abs(transaction.transaction.amount)/100,
          type: type
        })
      });
    });
  
  }

}
