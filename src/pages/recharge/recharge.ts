import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { OS } from '../View Models/OS';
import { FavouritesPage }  from '../favourites/favourites';
import { StorageService } from '../services/Storage_Service';
import { ConstantService } from '../services/Constants';
import { Tenant } from '../LocalStorageTables/Tenant';
import { RechargeReportPage } from '../recharge-report/recharge-report';
@Component({
  selector: 'page-recharge',
  templateUrl: 'recharge.html'
})
export class RechargePage implements OnInit {
  ActiveBankName: string;
  categories:OS[]=[];
  NewCategories:OS[]=[];
  constructor(public constant:ConstantService,public navCtrl: NavController) {
  }
  ngOnInit(){
this.categories=JSON.parse(StorageService.GetOS());
this.NewCategories=this.categories.filter(function (obj) { return obj.Id === "S1"||obj.Id === "S2"||obj.Id === "S3"||obj.Id === "S5"; });
//for(var i=0;i<this.categories.length;i++){
  //this.showMsg=false;
// if(this.categories[i].Id=="S4"){
//   this.showMsg=true;
//   break;
// }
// else{
//   this.showMsg=false;
// }
// switch(this.categories[i].Id){
//   case "S1":
//   this.showMsg=false;
//   break;
//   case "S2":
//   this.showMsg=false;
//   break;
//   case "S3":
//   this.showMsg=false;
//   break;
//   case "S4":
//   this.showMsg=true;
//   break;
//   case "S5":
//   this.showMsg=true;
//   break;
//   case "S6":
//   this.showMsg=false;
//   break;
//   default:
//   this.showMsg=true;
//   break;
// }
//}
   this.ActiveBankName=StorageService.GetActiveBankName();
  }
  ParentId: string;
  OnOperatorSelection(ParentId){
    this.ParentId=ParentId;
    this.navCtrl.push(FavouritesPage, { 'ParentId': this.ParentId });

  }
  OnReports(){
    this.navCtrl.push(RechargeReportPage);
  }
}
