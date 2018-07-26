import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, Events, ViewController } from 'ionic-angular';
import { BankingPage } from '../banking/banking';
import { RechargePage } from '../recharge/recharge';
import { StorageService } from '../services/Storage_Service';
import { RechargeReportPage } from '../recharge-report/recharge-report';
import { window } from 'rxjs/operator/window';

@Component({
  selector: 'page-page',
  templateUrl: 'page.html'
})
export class PagePage implements OnInit {
  ActiveBankName: string;
  constructor(private storageService:StorageService, public viewCtrl:ViewController,private events: Events,public navCtrl: NavController,public navParams: NavParams) {
  }
ngOnInit(){
     this.ActiveBankName=this.storageService.GetActiveBankName();
     this.events.publish('REFRESH_DIGIPARTYNAME');
     this.viewCtrl.didEnter.subscribe(() => {
      console.log('Component active');
   });   
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
