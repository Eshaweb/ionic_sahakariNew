import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BankingPage } from '../banking/banking';
import { RechargePage } from '../recharge/recharge';

@Component({
  selector: 'page-page',
  templateUrl: 'page.html'
})
export class PagePage implements OnInit {
  ActiveBankName: any;
ngOnInit(){
  this.ActiveBankName=this.navParams.get('ActiveBankName');
}
  constructor(public navCtrl: NavController,public navParams: NavParams) {
  }
  OnBanking(){
    this.navCtrl.push(BankingPage);
  }
  OnRecharge(){
    this.navCtrl.push(RechargePage);
  }
}
