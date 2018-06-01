import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { StorageService } from '../services/Storage_Service';
import { ConstantService } from '../services/Constants';
import { RechargeModel } from '../View Models/RechargeModel';
import { SelfCareAc } from '../LocalStorageTables/SelfCareAc';
import { DigiParty } from '../LocalStorageTables/DigiParty';
import { RegisterService } from '../services/app-data.service';
import { ToastrService } from 'ngx-toastr';
import { TranResponse } from '../View Models/TranResponse';

@Component({
  selector: 'page-prepaid-confirm',
  templateUrl: 'prepaid-confirm.html',
})
export class PrepaidConfirmPage implements OnInit{
  ActiveBankName: string;
  showConfirm: boolean;
  showSuccess: boolean;
  tranResponse: TranResponse;
  ActiveTenantId=JSON.parse(StorageService.GetUser()).ActiveTenantId;
  rechargeModel:RechargeModel;
  OperatorId: string;
  Amount: string;
  SubscriptionId: string;
  operator: string;
  constructor(private toastr: ToastrService,private registerService : RegisterService,public constantService:ConstantService,public loadingController: LoadingController,public navCtrl: NavController, public navParams: NavParams) {
  }

  ngOnInit(){
    this.operator=this.navParams.get('Operator');
    this.SubscriptionId=this.navParams.get('SubscriptionId');
    this.Amount=this.navParams.get('Amount');
    this.ActiveBankName =StorageService.GetActiveBankName();

  }
  DigiParties: DigiParty;
  digiparty: DigiParty;

  GetDigiPartyandPartyMastID(ActiveTenantId){
    this.DigiParties=JSON.parse(StorageService.GetDigiParty());
       this.digiparty=this.DigiParties.find(function (obj) { return obj.TenantId === ActiveTenantId; });
       return this.digiparty;
  }
  selfCareAC: SelfCareAc;
  SelfCareACs: SelfCareAc;
  GetSelfCareAcByTenantID(ActiveTenantId){
    this.SelfCareACs=JSON.parse(StorageService.GetSelfCareAc());
    this.selfCareAC=this.SelfCareACs.find(function (obj) { return obj.TenantId === ActiveTenantId&&obj.AcActId=="#SB"; });
    return this.selfCareAC;
  }
  OnConfirm(){
    let loading = this.loadingController.create({
      content: 'Recharging...'
    });
    loading.present();
   var  DigiPartyId=JSON.parse(StorageService.GetDigiParty()).DigiPartyId;
   var PartyMastId=JSON.parse(StorageService.GetDigiParty()).PartyMastId;
   this.OperatorId=JSON.parse(StorageService.GetItem(this.constantService.favouriteBasedOnParentId.Favourite_S1)).OperatorId;

   
    //this.OperatorId=JSON.parse(StorageService.GetItem("Favourite")).OperatorId;
    this.rechargeModel={
    TenantId:this.ActiveTenantId,
    DigiPartyId:this.GetDigiPartyandPartyMastID(this.ActiveTenantId).DigiPartyId,
    PartyMastId:this.GetDigiPartyandPartyMastID(this.ActiveTenantId).PartyMastId,
    AcMastId:this.GetSelfCareAcByTenantID(this.ActiveTenantId).AcHeadId,
    AcSubId:this.GetSelfCareAcByTenantID(this.ActiveTenantId).AcSubId,
    Amount:this.Amount,
    OperatorId:this.OperatorId,
    SubscriptionId:this.SubscriptionId,
    LocId:this.GetSelfCareAcByTenantID(this.ActiveTenantId).LocId  
  }
      this.registerService.PostRecharge(this.rechargeModel).subscribe((data : any)=>{
        this.tranResponse=data;
        this.showConfirm=false;
        this.toastr.success('Recharge is successful with ' + this.tranResponse.StatusCode, 'Success!');
  
  this.showSuccess=true;
  
      //},(err) => {console.log(err)});
    //},(error) => {this.toastr.error(error.error.ExceptionMessage, 'Error!')
  },(error) => {this.toastr.error(error.message, 'Error!')
  
  });
      
      loading.dismiss();
    }
  

}
