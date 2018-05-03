import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EnterOTPPage } from '../enter-otp/enter-otp';
import { HomePage } from '../home/home';
import { MobileRechargePage } from '../mobile-recharge/mobile-recharge';
import { BankingPage } from '../banking/banking';

@Component({
  selector: 'page-bank-list',
  templateUrl: 'bank-list.html'
})
export class BankListPage {

  constructor(public navCtrl: NavController) {
  }
  goToEnterOTP(params){
    if (!params) params = {};
    this.navCtrl.push(EnterOTPPage);
  }goToHome(params){
    if (!params) params = {};
    this.navCtrl.push(HomePage);
  }goToMobileRecharge(params){
    if (!params) params = {};
    this.navCtrl.push(MobileRechargePage);
  }goToBanking(params){
    if (!params) params = {};
    this.navCtrl.push(BankingPage);
  }
}
