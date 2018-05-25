import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { SelectOperatorPage } from '../select-operator/select-operator';
import { MobileRechargePage } from '../mobile-recharge/mobile-recharge';
import { StorageService } from '../services/Storage_Service';
import { FavouriteItem } from '../LocalStorageTables/FavouriteItem';
import { Favourites } from '../LocalStorageTables/Favourites';
import { ConstantService } from '../services/Constants';
import { Tenant } from '../LocalStorageTables/Tenant';
@Component({
  selector: 'page-favourites',
  templateUrl: 'favourites.html'
})
export class FavouritesPage implements OnInit{
  Tenant: Tenant;
  Tenants: Tenant;
  newfavourites: Favourites;
  favourites: Favourites;
  nkname: any;
  ActiveBankName: any;
  public firstParam;
  TId: any;
  ParentId: any;
  constructor(public loadingController: LoadingController,public constant:ConstantService,public navCtrl: NavController,
    public navParams: NavParams) {
    }
ngOnInit(){
  this.ParentId=this.navParams.get('ParentId');
  
  // var ActiveTenantId=JSON.parse(StorageService.GetItem(this.constant.DB.User)).ActiveTenantId;
  // this.Tenants=JSON.parse(StorageService.GetItem(this.constant.DB.Tenant));
  //    this.Tenant=this.Tenants.find(function (obj) { return obj.Id === ActiveTenantId; });
     this.ActiveBankName=StorageService.GetActiveBankName();  
     
     switch (this.ParentId) {
    case "S1":
    this.favourites=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S1));      
    break;
    case "S2":
    this.favourites=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S2));      
    break;
    case "S3":
    this.favourites=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S3));      
    break;
    case "S4":
    this.favourites=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S4));      
    break;
    case "S5":
    this.favourites=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S5));      
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
