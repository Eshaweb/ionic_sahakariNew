import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MobileRechargePage } from '../mobile-recharge/mobile-recharge';
import { BankingPage } from '../banking/banking';
import { RegisterService } from '../services/app-data.service';
//import { ActivatedRoute, Params} from '@angular/router';
//import { TenantList } from '../View Models/TenantList';
import { Tenant } from '../LocalStorageTables/Tenant';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{
  tenantList:Tenant;
    constructor(public navCtrl: NavController, private registerService: RegisterService) {

}
  ngOnInit() {  
   this.tenantList= this.registerService.tenantlist;
  }

  goToMobileRecharge(params){
    if (!params) params = {};
    this.navCtrl.push(MobileRechargePage);
  }
  goToBanking(params){
    if (!params) params = {};
    this.navCtrl.push(BankingPage);
  }
}
