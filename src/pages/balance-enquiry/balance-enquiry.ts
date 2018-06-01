import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { StorageService } from '../services/Storage_Service';
import { StatementRequest } from '../View Models/StatementRequest';
import { RegisterService } from '../services/app-data.service';
import { SelfCareAc } from '../LocalStorageTables/SelfCareAc';

@Component({
  selector: 'page-balance-enquiry',
  templateUrl: 'balance-enquiry.html'
})
export class BalanceEnquiryPage implements OnInit {

    ActiveTenantId=JSON.parse(StorageService.GetUser()).ActiveTenantId;

    constructor(public loadingController: LoadingController,private registerService : RegisterService,public navCtrl: NavController) {
    }
    ActiveBankName: string;
    HideMsg: boolean;
    ShowHide: boolean;
    SelfCareAcsBasedOnTenantID: SelfCareAc;
    ngOnInit(){
        this.HideMsg=true;
        this.ShowHide=true;       
           this.ActiveBankName=StorageService.GetActiveBankName();   
           this.SelfCareAcsBasedOnTenantID=StorageService.GetSelfCareAcsBasedOnTenantID();
    }
    statementRequest: StatementRequest;
    balance: any;
    OnGetAccountBalance(AcHeadId,AcSubId){
        let loading = this.loadingController.create({
            content: 'Loading the Account Balance..'
          });
          loading.present();
        this.statementRequest={
            AcMastId:AcHeadId,
            AcSubId:AcSubId,
            TenantId:this.ActiveTenantId
        }
        this.registerService.GetAccountBalance(this.statementRequest).subscribe((data:any)=>{
       this.balance=data;
        });
        this.ShowHide=false;
        this.HideMsg=false;
        loading.dismiss();
    }
}
