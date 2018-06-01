import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { BankingPage } from '../banking/banking';
import { RechargePage } from '../recharge/recharge';
import { StorageService } from '../services/Storage_Service';
import { RechargeReportPage } from '../recharge-report/recharge-report';

@Component({
  selector: 'page-page',
  templateUrl: 'page.html'
})
export class PagePage implements OnInit {
  ActiveBankName: string;
  constructor(private events: Events,public navCtrl: NavController,public navParams: NavParams) {
  }
ngOnInit(){
     this.ActiveBankName=StorageService.GetActiveBankName();
     this.events.publish('REFRESH_DIGIPARTYNAME');
    }
  
  OnBanking(){
    this.navCtrl.push(BankingPage);
  }
  OnRecharge(){
    this.navCtrl.push(RechargePage);
  }
  OnReports(){
    this.navCtrl.push(RechargeReportPage);
  }
}
