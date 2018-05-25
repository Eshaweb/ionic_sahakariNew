import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { StorageService } from '../services/Storage_Service';
import { ConstantService } from '../services/Constants';
import { StatementRequest } from '../View Models/StatementRequest';
import { RegisterService } from '../services/app-data.service';
import { Tenant } from '../LocalStorageTables/Tenant';
import { SelfCareAc } from '../LocalStorageTables/SelfCareAc';

@Component({
  selector: 'page-balance-enquiry',
  templateUrl: 'balance-enquiry.html'
})
export class BalanceEnquiryPage implements OnInit {

    HideMsg: boolean;
    SelfCareAcsBasedOnTenantID: SelfCareAc;
    SelfCareACs: SelfCareAc;
    Tenant: Tenant;
    Tenants: Tenant;
    ShowHide: boolean;
    balance: any;
    stmentreq: StatementRequest;
    AcNo: any;
    HeadName: any;
    ActiveBankName: any;
    ActiveTenantId=JSON.parse(StorageService.GetUser()).ActiveTenantId;

    constructor(public loadingController: LoadingController,private regService : RegisterService,public constant:ConstantService,public navCtrl: NavController) {
    }

    ngOnInit(){
        this.HideMsg=true;
        this.ShowHide=true;       
           this.ActiveBankName=StorageService.GetActiveBankName();   
           this.SelfCareAcsBasedOnTenantID=StorageService.GetSelfCareAcsBasedOnTenantID();
    }
  
    OnGetAccountBalance(AcHeadId,AcSubId){
        let loading = this.loadingController.create({
            content: 'Loading the Account Balance..'
          });
          loading.present();
        this.stmentreq={
            AcMastId:AcHeadId,
            AcSubId:AcSubId,
            TenantId:this.ActiveTenantId
        }
        this.regService.GetAccountBalance(this.stmentreq).subscribe((data:any)=>{
       this.balance=data;
        });
        this.ShowHide=false;
        this.HideMsg=false;
        loading.dismiss();
    }
}
