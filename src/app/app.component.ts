import { Component, ViewChild, OnInit } from '@angular/core';
import { Platform, Nav, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
//import { NavController } from 'ionic-angular';
import { MobileRechargePage } from '../pages/mobile-recharge/mobile-recharge';
import { BankingPage } from '../pages/banking/banking';
import { SettingPage } from '../pages/setting/setting';
import { ChangeBankPage } from '../pages/change-bank/change-bank';


//import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { StorageService } from '../pages/services/Storage_Service';
import { RegisterService } from '../pages/services/app-data.service';
import { SCRequest } from '../pages/View Models/SCRequest';
import { PagePage } from '../pages/page/page';
import { ConstantService } from '../pages/services/Constants';
import { RechargePage } from '../pages/recharge/recharge';
import { Tenant } from '../pages/LocalStorageTables/Tenant';
import { DigiParty } from '../pages/LocalStorageTables/DigiParty';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  name: string;
  ActiveBankName: string;
  @ViewChild(Nav) navCtrl: Nav;
  rootPage: any;
  // constructor(platform: Platform, statusBar: StatusBar, private reg:RegisterPage, log:LoginPage, splashScreen: SplashScreen) {
  constructor(private event: Events, public constant: ConstantService, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private regService: RegisterService) {
    this.event.subscribe('UNAUTHORIZED', () => {
      this.navCtrl.push(LoginPage);
    });
    
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      //localStorage.clear();

      this.event.subscribe('REFRESH_DIGIPARTYNAME', () => {  
        this.ActiveBankName = StorageService.GetActiveBankName();
          this.name = StorageService.Getdigipartyname();
      });
      if (StorageService.GetUser() == null) {
        this.rootPage = RegisterPage;
       
      }
      else {
        this.rootPage = PagePage;
        this.ActiveBankName = StorageService.GetActiveBankName();
          this.name = StorageService.Getdigipartyname();
        }
    });
  }

  goToPage(params) {
    if (!params) params = {};
    this.navCtrl.setRoot(PagePage);
  }
  goToMobileRecharge(params) {
    if (!params) params = {};
    this.navCtrl.setRoot(MobileRechargePage);
  }
  goToBanking(params) {
    if (!params) params = {};
    this.navCtrl.setRoot(BankingPage);
  }
  goToSetting(params) {
    if (!params) params = {};
    this.navCtrl.setRoot(SettingPage);
  }
  goToChangeBank(params) {
    if (!params) params = {};
    this.navCtrl.setRoot(ChangeBankPage);
  }
}
