import { Component, ViewChild, OnInit } from '@angular/core';
import { Platform, Nav, Events } from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MobileRechargePage } from '../pages/mobile-recharge/mobile-recharge';
import { BankingPage } from '../pages/banking/banking';
import { SettingPage } from '../pages/setting/setting';
import { ChangeBankPage } from '../pages/change-bank/change-bank';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { StorageService } from '../pages/services/Storage_Service';
import { RegisterService } from '../pages/services/app-data.service';
import { PagePage } from '../pages/page/page';
import { ConstantService } from '../pages/services/Constants';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  digipartyname: string;
  ActiveBankName: string;
  @ViewChild(Nav) navCtrl: Nav;
  rootPage: any;
  // constructor(platform: Platform, statusBar: StatusBar, private reg:RegisterPage, log:LoginPage, splashScreen: SplashScreen) {
  constructor(private translate: TranslateService,private event: Events, public constant: ConstantService, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private regService: RegisterService) {
    this.event.subscribe('UNAUTHORIZED', () => {
      this.navCtrl.push(LoginPage);
    });
    
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      translate.setDefaultLang('ka');
      //localStorage.clear();
      
      this.event.subscribe('REFRESH_DIGIPARTYNAME', () => {  
        this.ActiveBankName = StorageService.GetActiveBankName();
          this.digipartyname = StorageService.Getdigipartyname();
      });
      if (StorageService.GetUser() == null) {
        this.rootPage = RegisterPage;
        

      }
      else {
        this.rootPage = PagePage;
        this.ActiveBankName = StorageService.GetActiveBankName();
          this.digipartyname = StorageService.Getdigipartyname();
        }
    });
  }
  changeLanguage(language:string)
  {
    this.translate.use(language);
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
