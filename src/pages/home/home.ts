import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MobileRechargePage } from '../mobile-recharge/mobile-recharge';
import { BankingPage } from '../banking/banking';
import { RegisterService } from '../services/app-data.service';
import { Person } from '../View Models/person.model';
import { ActivatedRoute, Params} from '@angular/router';
import { TenantList } from '../View Models/TenantList';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{
  tenantList:TenantList;
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
