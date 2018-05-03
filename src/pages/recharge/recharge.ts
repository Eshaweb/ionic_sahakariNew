import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { OS } from '../View Models/OS';
import { FavouritesPage }  from '../favourites/favourites';
import { StorageService } from '../services/Storage_Service';
import { ConstantService } from '../services/Constants';
@Component({
  selector: 'page-recharge',
  templateUrl: 'recharge.html'
})
export class RechargePage implements OnInit {
  ActiveBankName: any;
  ParentId: any;
categories:OS[]=[];
  constructor(public constant:ConstantService,public navCtrl: NavController) {
  }
  
  ngOnInit(){
this.categories=JSON.parse(StorageService.GetItem(this.constant.DB.OS));
this.ActiveBankName=JSON.parse(StorageService.GetItem(this.constant.DB.User)).ActiveTenantName;

  }
  OnOperatorSelection(ParentId){
    this.ParentId=ParentId;
    this.navCtrl.push(FavouritesPage, { 'ParentId': this.ParentId });

  }

}
