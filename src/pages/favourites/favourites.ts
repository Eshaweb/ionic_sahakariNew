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
export class FavouritesPage implements OnInit {
  title: string;
  @ViewChild(Navbar) navBar: Navbar;

  constructor(private storageService:StorageService, public loadingController: LoadingController, public constant: ConstantService, public navCtrl: NavController, public navParams: NavParams) {

   constructor(public device: Device,public loadingController: LoadingController,public constant:ConstantService,public navCtrl: NavController, public navParams: NavParams) {
  //  constructor(public loadingController: LoadingController,public constant:ConstantService,public navCtrl: NavController, public navParams: NavParams) {

    }
  ionViewDidLoad() {
    this.setBackButtonAction()
  }

  setBackButtonAction() {
    this.navBar.backButtonClick = () => {
      this.navCtrl.push(RechargePage);
    }
  }
  ActiveBankName: string;
  ParentId: string;
  favourites: Favourites;

  ngOnInit() {
    this.ParentId = this.navParams.get('ParentId');
    this.ActiveBankName = this.storageService.GetActiveBankName();
    var ParentId=this.ParentId;
    switch (this.ParentId) {
      case "S1":
        this.title = "Recharge";
        break;
      case "S2":
        this.title = "Postpaid Bill";
        break;
      case "S3":
        this.title = "DTH Recharge";
        break;
      case "S4":
        break;
      case "S5":
        this.title = "Electricity Bill";
        break;
      case "S6":
        break;
      default:
    }
    var xx: Favourites = this.storageService.GetFavourite();
    if(xx!=null){
      this.favourites = xx.filter(function (obj) {return obj.ParentId===ParentId;})
    }
    // if (StorageService.GetItem("Favourite") != null) {
    //   this.nkname = JSON.parse(StorageService.GetItem("Favourite")).NickName;
    // }
  }
  OnNewRecharge() {
    this.navCtrl.push(MobileRechargePage, { 'ParentId': this.ParentId });
  }

  OnNickName(order) {
      this.navCtrl.push(MobileRechargePage, { 'OperatorId': order.OperatorId, 'ParentId': order.ParentId, 'Id': order.Id, 'nname': order.NickName, 'SubscriptionId': order.SubscriptionId, 'CircleId': order.CircleId });
  }

  OnDelete(order) {
    var xx: Favourites = this.storageService.GetFavourite();
    var PId = order.Id;
    xx = xx.filter(function (obj) {
      return obj.Id !== PId;
    });
    this.favourites = this.favourites.filter(function (obj) {
      return obj.Id !== PId;
    });
    this.storageService.SetFavourite(JSON.stringify(xx));
  }
}
