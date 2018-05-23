import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BankingPage } from '../banking/banking';
import { RechargePage } from '../recharge/recharge';
import { StorageService } from '../services/Storage_Service';
import { ConstantService } from '../services/Constants';
import { Tenant } from '../LocalStorageTables/Tenant';
import { RechargeReportPage } from '../recharge-report/recharge-report';

@Component({
  selector: 'page-page',
  templateUrl: 'page.html'
})
export class PagePage implements OnInit {
  Tenant: Tenant;
  Tenants: Tenant;
  ActiveBankName: any;
  constructor(public constant:ConstantService,public navCtrl: NavController,public navParams: NavParams) {
  }
ngOnInit(){
  var ActiveTenantId=JSON.parse(StorageService.GetItem(this.constant.DB.User)).ActiveTenantId;
  this.Tenants=JSON.parse(StorageService.GetItem(this.constant.DB.Tenant));
     this.Tenant=this.Tenants.find(function (obj) { return obj.Id === ActiveTenantId; });
     this.ActiveBankName=this.Tenant.Name;
     //this.ActiveBankName=this.navParams.get('ActiveBankName');

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
