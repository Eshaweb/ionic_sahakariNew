import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { StorageService } from '../services/Storage_Service';
import { ConstantService } from '../services/Constants';
import { StatementRequest } from '../View Models/StatementRequest';
import { RegisterService } from '../services/app-data.service';

@Component({
  selector: 'page-mini-statement',
  templateUrl: 'mini-statement.html'
})
export class MiniStatementPage implements OnInit{

  AcNo: any;
  HeadName: any;
  balance: any;
  stmentreq: StatementRequest;
  ActiveBankName: any;
  ShowHide: boolean;
  AcHeadId=JSON.parse(StorageService.GetItem(this.constant.DB.SelfCareAc))[0].AcHeadId;
  AcSubId=JSON.parse(StorageService.GetItem(this.constant.DB.SelfCareAc))[0].AcSubId;
  ActiveTenantId=JSON.parse(StorageService.GetItem(this.constant.DB.DigiParty)).TenantId;

  constructor(private regService : RegisterService,public constant:ConstantService,public navCtrl: NavController) {

  }

  ngOnInit() {
    this.ShowHide=true;
    this.ActiveBankName=JSON.parse(StorageService.GetItem(this.constant.DB.User)).ActiveTenantName;
    this.HeadName=JSON.parse(StorageService.GetItem(this.constant.DB.SelfCareAc))[0].HeadName;
    this.AcNo=JSON.parse(StorageService.GetItem(this.constant.DB.SelfCareAc))[0].AcNo;
  }
 

  OnPress(){
    this.stmentreq={
        AcMastId:this.AcHeadId,
        AcSubId:this.AcSubId,
        TenantId:this.ActiveTenantId
    }
    this.regService.GetStatement(this.stmentreq).subscribe((data:any)=>{
   this.balance=data;
    });
    this.ShowHide=false;
}
  
}
