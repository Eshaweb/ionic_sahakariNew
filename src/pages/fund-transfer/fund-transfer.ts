import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AutoLogoutService } from '../services/AutoLogOutService';
import { StorageService } from '../services/Storage_Service';
import { ConstantService } from '../services/Constants';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { RegisterService } from '../services/app-data.service';
import { FundTransferRequest } from '../View Models/FundTransferRequest';
import { FundTransferResponse } from '../View Models/FundTransferResponse';
import { DoFundTransfer } from '../View Models/DoFundTransfer';
import { FundTransferDone } from '../View Models/FundTransferDone';

@Component({
  selector: 'page-fund-transfer',
  templateUrl: 'fund-transfer.html'
})
export class FundTransferPage implements OnInit{

  ftd: FundTransferDone;
  transfer: DoFundTransfer;
  ShowHide: boolean;
  Rs: string;
  confirm: FundTransferResponse;
  amount: AbstractControl;
  formgroup2: FormGroup;
  FTRequest: FundTransferRequest;
  fundTransferResponse: FundTransferResponse;
  mobilenum: AbstractControl;
  formgroup1: FormGroup;
  AcNo: any;
  HeadName: any;
  ActiveBankName: any;
  ActiveTenantId=JSON.parse(StorageService.GetItem(this.constant.DB.DigiParty)).TenantId;
  DigiPartyId=JSON.parse(StorageService.GetItem(this.constant.DB.DigiParty)).DigiPartyId;
  AcHeadId=JSON.parse(StorageService.GetItem(this.constant.DB.SelfCareAc))[0].AcHeadId;
  AcSubId=JSON.parse(StorageService.GetItem(this.constant.DB.SelfCareAc))[0].AcSubId;
  LocId=JSON.parse(StorageService.GetItem(this.constant.DB.SelfCareAc))[0].LocId;
  // constructor(private regService : RegisterService, public formbuilder:FormBuilder,public constant:ConstantService,private autoLogoutService: AutoLogoutService,public navCtrl: NavController) {
    constructor(private regService : RegisterService, public formbuilder:FormBuilder,public constant:ConstantService,public navCtrl: NavController) {

  //StorageService.SetItem('lastAction', Date.now().toString());
    this.formgroup1 = formbuilder.group({
      mobilenum:['',[Validators.required,Validators.minLength(10)]]
    });
    this.mobilenum = this.formgroup1.controls['mobilenum'];
    this.formgroup2 = formbuilder.group({
      amount:['',[Validators.required,Validators.minLength(1)]]
    });
    this.amount = this.formgroup2.controls['amount'];

  }

  ngOnInit(){
    this.ShowHide=true;
    this.ActiveBankName=JSON.parse(StorageService.GetItem(this.constant.DB.User)).ActiveTenantName;
this.HeadName=JSON.parse(StorageService.GetItem(this.constant.DB.SelfCareAc))[0].HeadName;
this.AcNo=JSON.parse(StorageService.GetItem(this.constant.DB.SelfCareAc))[0].AcNo;
  }
  
  OnSubmit(mobno){
    this.FTRequest={
      TenantId:this.ActiveTenantId,
      MobileNo:mobno
    }
    this.regService.SearchReceiverAccount(this.FTRequest).subscribe((data : any)=>{
      this.fundTransferResponse=data;
    });
  }
  OnClick(amnt){
this.confirm=this.fundTransferResponse;
this.Rs=amnt;
this.ShowHide=false;
  }
  OnPress(){
    this.transfer={
      TenantId:this.ActiveTenantId,
      DigiPartyId:this.DigiPartyId,
      FromAcMastId:this.AcHeadId,
      FromAcSubId:this.AcSubId,
      FromLocId:this.LocId,
      ToAcMastId:this.fundTransferResponse.AcHeadId,
      ToAcSubId:this.fundTransferResponse.AcSubId,
      ToLocId:this.fundTransferResponse.LocId,
      Amount:this.Rs,
      ToAcNo:this.fundTransferResponse.AcNo
    }
    this.regService.FundTransfer(this.transfer).subscribe((data : any)=>{
      this.ftd=data;
    });

  }
}
