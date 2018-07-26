import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, Navbar } from 'ionic-angular';
import { OS } from '../View Models/OS';
import { FavouritesPage }  from '../favourites/favourites';
import { StorageService } from '../services/Storage_Service';
import { ConstantService } from '../services/Constants';
import { RechargeReportPage } from '../recharge-report/recharge-report';
import { PagePage } from '../page/page';
@Component({
  selector: 'page-recharge',
  templateUrl: 'recharge.html'
})
export class RechargePage implements OnInit {
  @ViewChild(Navbar) navBar: Navbar;

  ActiveBankName: string;
  NewCategories:OS;
  constructor(private storageService:StorageService, public constant:ConstantService,public navCtrl: NavController) {
  }
  ionViewDidLoad() {
    this.setBackButtonAction()
  }
  setBackButtonAction(){
   this.navBar.backButtonClick = () => {
      this.navCtrl.setRoot(PagePage);
   }
  }
  ngOnInit(){
var categories=this.storageService.GetOS();
this.NewCategories=categories.filter(function (obj) { return obj.Id === "S1"||obj.Id === "S2"||obj.Id === "S3"||obj.Id === "S5"; });

   this.ActiveBankName=this.storageService.GetActiveBankName();
  }
  //ParentId: string;
  OnOperatorSelection(ParentId){
    //this.ParentId=ParentId;
    this.navCtrl.push(FavouritesPage, { 'ParentId': ParentId });

  }
  OnReports(){
    this.navCtrl.push(RechargeReportPage);
  }
}
