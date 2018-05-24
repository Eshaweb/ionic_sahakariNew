import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OS } from '../View Models/OS';
import { StorageService } from '../services/Storage_Service';
import { ConstantService } from '../services/Constants';
import { RegisterService } from '../services/app-data.service';
import { RRRequest } from '../View Models/RRRequest';
import { RRResponse } from '../View Models/RRResponse';
import { DigiParty } from '../LocalStorageTables/DigiParty';

/**
 * Generated class for the RechargeReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-recharge-report',
  templateUrl: 'recharge-report.html',
})
export class RechargeReportPage implements OnInit{
  digiPartyId: string;
  digiparty: DigiParty;
  DigiParties: DigiParty;
  rRResponse: RRResponse;
  ActiveBankName: any;
  Tenant: any;
  Tenants: any;
  ActiveTenantId: any;
  rRRequest: RRRequest;
  categories:OS[]=[];
  constructor(private regService : RegisterService,public constant:ConstantService,public navCtrl: NavController, public navParams: NavParams) {
  
  }
  ngOnInit() {
    this.categories=JSON.parse(StorageService.GetItem(this.constant.DB.OS));
    this.ActiveTenantId=JSON.parse(StorageService.GetItem(this.constant.DB.User)).ActiveTenantId;
    var ATenantId=this.ActiveTenantId;
    this.Tenants=JSON.parse(StorageService.GetItem(this.constant.DB.Tenant));
       this.Tenant=this.Tenants.find(function (obj) { return obj.Id === ATenantId; });
       this.ActiveBankName=this.Tenant.Name;
       this.DigiParties=JSON.parse(StorageService.GetItem(this.constant.DB.DigiParty));
       this.digiparty=this.DigiParties.find(function (obj) { return obj.TenantId === ATenantId; });
       this.digiPartyId=this.digiparty.DigiPartyId;
      }
  ObjChanged(event){
    this.rRRequest={
       TenantId:this.ActiveTenantId,
       DigiPartyId:this.digiPartyId,
       SelectedType:event,
       Number:10
    }
this.regService.GetRechargeReport(this.rRRequest).subscribe((data:any)=>{
  this.rRResponse=data;
  
});
  }


}
