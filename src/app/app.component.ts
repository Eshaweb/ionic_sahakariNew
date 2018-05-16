import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Events} from 'ionic-angular';
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

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navCtrl: Nav;
    //rootPage:any = HomePage;
rootPage:any;
SCReq: any;
  OS: string;
  scr: SCRequest;
  // constructor(platform: Platform, statusBar: StatusBar, private reg:RegisterPage, log:LoginPage, splashScreen: SplashScreen) {
    constructor(private event: Events,public constant:ConstantService,platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private regService : RegisterService) {
      this.event.subscribe('UNAUTHORIZED', () => {
        this.navCtrl.push(LoginPage);
    });


      platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
        //localStorage.removeItem(this.constant.GetUserKey.UniqueKey);
        //  localStorage.removeItem("User");
        //  StorageService.RemoveItem("Tenant");
        //  StorageService.RemoveItem("DigiParty");
        //  StorageService.RemoveItem("OS");
        //  StorageService.RemoveItem("SelfCareAc");
        //  StorageService.RemoveItem("userToken");
        //  StorageService.RemoveItem("entry");
        //  this.RemoveOSes();
        //  this.RemoveFavourites();
        //  StorageService.RemoveItem("lastAction");


        //localStorage.clear();

      if(StorageService.GetItem(this.constant.DB.User)==null){
          this.rootPage=RegisterPage;
      }
     
      else{
        this.rootPage=PagePage;
      }
        
    });
  }
  RemoveOSes(){
    StorageService.RemoveItem(this.constant.osBasedOnParentId.OS_S1);
    StorageService.RemoveItem(this.constant.osBasedOnParentId.OS_S2);
    StorageService.RemoveItem(this.constant.osBasedOnParentId.OS_S3);
    StorageService.RemoveItem(this.constant.osBasedOnParentId.OS_S4);
    StorageService.RemoveItem(this.constant.osBasedOnParentId.OS_S5);
    StorageService.RemoveItem(this.constant.osBasedOnParentId.OS_S6);
    StorageService.RemoveItem(this.constant.osBasedOnParentId.OS_S7);

  }
  RemoveFavourites(){
    StorageService.RemoveItem(this.constant.favouriteBasedOnParentId.Favourite_S1);
    StorageService.RemoveItem(this.constant.favouriteBasedOnParentId.Favourite_S2);
    StorageService.RemoveItem(this.constant.favouriteBasedOnParentId.Favourite_S3);
    StorageService.RemoveItem(this.constant.favouriteBasedOnParentId.Favourite_S4);
    StorageService.RemoveItem(this.constant.favouriteBasedOnParentId.Favourite_S5);
    StorageService.RemoveItem(this.constant.favouriteBasedOnParentId.Favourite_S6);
    StorageService.RemoveItem(this.constant.favouriteBasedOnParentId.Favourite_S7);

  }
  goToPage(params){
    if (!params) params = {};
    this.navCtrl.setRoot(PagePage);
  }
  goToMobileRecharge(params){
    if (!params) params = {};
    this.navCtrl.setRoot(MobileRechargePage);
  }
  goToBanking(params){
    if (!params) params = {};
    this.navCtrl.setRoot(BankingPage);
  }
  goToSetting(params){
    if (!params) params = {};
    this.navCtrl.setRoot(SettingPage);
  }
  goToChangeBank(params){
    if (!params) params = {};
    this.navCtrl.setRoot(ChangeBankPage);
  }
}
