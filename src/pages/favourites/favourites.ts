import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, Navbar } from 'ionic-angular';
import { MobileRechargePage } from '../mobile-recharge/mobile-recharge';
import { StorageService } from '../services/Storage_Service';
import { Favourites } from '../LocalStorageTables/Favourites';
import { ConstantService } from '../services/Constants';
import { RechargePage } from '../recharge/recharge';
import { Device } from '@ionic-native/device';


@Component({
  selector: 'page-favourites',
  templateUrl: 'favourites.html'
})
export class FavouritesPage implements OnInit{
  title: string;
  @ViewChild(Navbar) navBar: Navbar;

  public platformType:any;
  public versionType:any;

   constructor(public device: Device,public loadingController: LoadingController,public constant:ConstantService,public navCtrl: NavController, public navParams: NavParams) {
  //  constructor(public loadingController: LoadingController,public constant:ConstantService,public navCtrl: NavController, public navParams: NavParams) {

    }
  ionViewDidLoad() {
    this.setBackButtonAction()
}

setBackButtonAction(){
   this.navBar.backButtonClick = () => {
      this.navCtrl.push(RechargePage);
   }
}
    ActiveBankName: string;
    ParentId: string;
    favourites: Favourites;
    nkname: string;

ngOnInit(){
  this.ParentId=this.navParams.get('ParentId');
  this.ActiveBankName=StorageService.GetActiveBankName();  
  this.platformType = this.device.platform;
    this.versionType = this.device.version;
   
     switch (this.ParentId) {
    case "S1":
    this.favourites=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S1));      
    this.title="Recharge";
    break;
    case "S2":
    this.favourites=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S2));      
    this.title="Postpaid Bill";
    break;
    case "S3":
    this.favourites=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S3));      
    this.title="DTH Recharge";
    break;
    case "S4":
    this.favourites=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S4));      
    break;
    case "S5":
    this.favourites=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S5));      
    this.title="Electricity Bill";
    break;
    case "S6":
    this.favourites=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S6));      
    break;
    default:
    this.favourites=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S7));  
  }
  
  if(StorageService.GetItem("Favourite")!=null){
    this.nkname=JSON.parse(StorageService.GetItem("Favourite")).NickName;
  }
}
OnNewRecharge(ParentId){
   // this.navCtrl.push(SelectOperatorPage,{ 'Id': this.Id });
    this.navCtrl.push(MobileRechargePage,{ 'ParentId': this.ParentId });
  }

  OnNickName(order){
    let loading = this.loadingController.create({
      content: 'Recharging...'
    });
    loading.present();
    // this.navCtrl.push(SelectOperatorPage,{ 'Id': this.Id });
     this.navCtrl.push(MobileRechargePage,{ 'OperatorId':order.OperatorId,'ParentId': order.ParentId, 'Id':order.Id, 'nname':order.NickName,'SubscriptionId':order.SubscriptionId,'CircleId': order.CircleId});
   loading.dismiss();
    }

  OnDelete(order){
    var PId=order.Id;
    this.favourites = this.favourites.filter(function( obj ) {
      return obj.Id !== PId;
  });

  switch (this.ParentId) {
    case "S1":
    StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S1,JSON.stringify(this.favourites));
    this.favourites=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S1));    
    break;
    case "S2":
    StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S2,JSON.stringify(this.favourites));
    this.favourites=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S2));    
    break;
    case "S3":
    StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S3,JSON.stringify(this.favourites));
    this.favourites=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S3));    
    break;
    case "S4":
    StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S4,JSON.stringify(this.favourites));
    this.favourites=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S4));    
    break;
    case "S5":
    StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S5,JSON.stringify(this.favourites));
    this.favourites=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S5));    
    break;
    case "S6":
    StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S6,JSON.stringify(this.favourites));
    this.favourites=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S6));    
    break;
    default:
    StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S7,JSON.stringify(this.favourites));
    this.favourites=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S7));  
  }
    
  }
}
