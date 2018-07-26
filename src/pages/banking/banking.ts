import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
//import { AutoLogoutService } from '../services/AutoLogOutService';
import { StorageService } from '../services/Storage_Service';
import { FundTransferPage } from '../fund-transfer/fund-transfer';
import { BalanceEnquiryPage } from '../balance-enquiry/balance-enquiry';
import { MiniStatementPage } from '../mini-statement/mini-statement';
import { PagePage } from '../page/page';

@Component({
  selector: 'page-banking',
  templateUrl: 'banking.html'
})
export class BankingPage implements OnInit {
  ActiveBankName: string;
  // constructor(public constant:ConstantService,private autoLogoutService: AutoLogoutService,public navCtrl: NavController) {
  constructor(private storageService:StorageService, public navCtrl: NavController) {

    //StorageService.SetItem('lastAction', Date.now().toString());

  }

  ngOnInit() {
    this.ActiveBankName = this.storageService.GetActiveBankName();
  }
  OnFundTransfer() {
    this.navCtrl.push(FundTransferPage);
  }
  OnBack(){
    this.navCtrl.setRoot(PagePage);
  }
  OnBalanceEnquiry() {
    this.navCtrl.push(BalanceEnquiryPage);
  }

  OnMiniStatement() {
    this.navCtrl.push(MiniStatementPage);
  }
}
