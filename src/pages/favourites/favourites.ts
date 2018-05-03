import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SelectOperatorPage } from '../select-operator/select-operator';
import { MobileRechargePage } from '../mobile-recharge/mobile-recharge';
import { StorageService } from '../services/Storage_Service';
import { FavouriteItem } from '../LocalStorageTables/FavouriteItem';
import { Favourites } from '../LocalStorageTables/Favourites';
import { ConstantService } from '../services/Constants';
@Component({
  selector: 'page-favourites',
  templateUrl: 'favourites.html'
})
export class FavouritesPage implements OnInit{
  newfavourites: Favourites;
  favourites: Favourites;
  nkname: any;
  ActiveBankName: any;
  public firstParam;
  TId: any;
  ParentId: any;
  constructor(public constant:ConstantService,public navCtrl: NavController,
    public navParams: NavParams) {
    }
ngOnInit(){
  this.ParentId=this.navParams.get('ParentId');
  this.ActiveBankName=JSON.parse(StorageService.GetItem(this.constant.DB.User)).ActiveTenant;
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
    
  
  //this.nkname=JSON.parse(StorageService.GetItem("FavouriteKey")).NickName;
  if(StorageService.GetItem("Favourite")!=null){
    this.nkname=JSON.parse(StorageService.GetItem("Favourite")).NickName;
  }
}
  OnClick(ParentId){
   // this.navCtrl.push(SelectOperatorPage,{ 'Id': this.Id });
    this.navCtrl.push(MobileRechargePage,{ 'ParentId': this.ParentId });
  }

  // OnClick(form:NgForm){
  //   this.navCtrl.push(MobileRechargePage,{ 'Id': this.Id, 'nkname':this.nkname });

  // }

  // OnPress(Id,nkname){
  //   // this.navCtrl.push(SelectOperatorPage,{ 'Id': this.Id });
  //    this.navCtrl.push(MobileRechargePage,{ 'Id': this.Id, 'nkname':this.nkname });
  //  }
  OnPress(order){
    // this.navCtrl.push(SelectOperatorPage,{ 'Id': this.Id });
     this.navCtrl.push(MobileRechargePage,{ 'ParentId': order.ParentId, 'Id':order.Id });
   }

   OnSubmit(order){
     var PId=order.Id;
    // var index = this.favourites.indexOf(PId);
    // if (index > -1) {
    // this.favourites.splice(PId,1);
    // }

    //removeByKey(this.favourites, order);
    //delete this.favourites[PId];
    
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
    // StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S1,JSON.stringify(this.favourites));
    // this.favourites=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S1));
  }
}


function removeByKey(array, params){
  array.some(function(item, index) {
    return (array[index][params.key] === params.value) ? !!(array.splice(index, 1)) : false;
  });
  return array;
}
