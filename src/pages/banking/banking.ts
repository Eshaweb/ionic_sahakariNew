import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AutoLogoutService } from '../services/AutoLogOutService';
import { StorageService } from '../services/Storage_Service';
import { ConstantService } from '../services/Constants';
import { FundTransferPage } from '../fund-transfer/fund-transfer';
import { BalanceEnquiryPage } from '../balance-enquiry/balance-enquiry';
import { MiniStatementPage } from '../mini-statement/mini-statement';
import { Tenant } from '../LocalStorageTables/Tenant';

@Component({
  selector: 'page-banking',
  templateUrl: 'banking.html'
})
export class BankingPage implements OnInit{

  Tenant: Tenant;
  Tenants: Tenant;
  ActiveBankName: any;
  // constructor(public constant:ConstantService,private autoLogoutService: AutoLogoutService,public navCtrl: NavController) {
    constructor(public constant:ConstantService,public navCtrl: NavController) {

  //StorageService.SetItem('lastAction', Date.now().toString());

  }

  ngOnInit(){
    var ActiveTenantId=JSON.parse(StorageService.GetItem(this.constant.DB.User)).ActiveTenantId;
    this.Tenants=JSON.parse(StorageService.GetItem(this.constant.DB.Tenant));
       this.Tenant=this.Tenants.find(function (obj) { return obj.Id === ActiveTenantId; });
       this.ActiveBankName=this.Tenant.Name;
  }
  OnFundTransfer(){
    this.navCtrl.push(FundTransferPage);
  }
  
  OnBalanceEnquiry(){
    this.navCtrl.push(BalanceEnquiryPage);
  }

  OnMiniStatement(){
    this.navCtrl.push(MiniStatementPage);
  }
}
