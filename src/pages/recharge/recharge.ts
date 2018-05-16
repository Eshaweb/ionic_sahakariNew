import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { OS } from '../View Models/OS';
import { FavouritesPage }  from '../favourites/favourites';
import { StorageService } from '../services/Storage_Service';
import { ConstantService } from '../services/Constants';
import { Tenant } from '../LocalStorageTables/Tenant';
@Component({
  selector: 'page-recharge',
  templateUrl: 'recharge.html'
})
export class RechargePage implements OnInit {
  Tenant: Tenant;
  Tenants: Tenant;
  ActiveBankName: any;
  ParentId: any;
categories:OS[]=[];
  constructor(public constant:ConstantService,public navCtrl: NavController) {
  }
  
  ngOnInit(){
this.categories=JSON.parse(StorageService.GetItem(this.constant.DB.OS));
var ActiveTenantId=JSON.parse(StorageService.GetItem(this.constant.DB.User)).ActiveTenantId;
this.Tenants=JSON.parse(StorageService.GetItem(this.constant.DB.Tenant));
   this.Tenant=this.Tenants.find(function (obj) { return obj.Id === ActiveTenantId; });
   this.ActiveBankName=this.Tenant.Name;
  }
  OnOperatorSelection(ParentId){
    this.ParentId=ParentId;
    this.navCtrl.push(FavouritesPage, { 'ParentId': this.ParentId });

  }

}
