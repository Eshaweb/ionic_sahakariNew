import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { AutoLogoutService } from '../services/AutoLogOutService';
import { StorageService } from '../services/Storage_Service';
import { ConstantService } from '../services/Constants';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { RegisterService } from '../services/app-data.service';
import { FundTransferRequest } from '../View Models/FundTransferRequest';
import { FundTransferResponse } from '../View Models/FundTransferResponse';
import { DoFundTransfer } from '../View Models/DoFundTransfer';
import { FundTransferDone } from '../View Models/FundTransferDone';
import { Tenant } from '../LocalStorageTables/Tenant';
import { DigiParty } from '../LocalStorageTables/DigiParty';
import { SelfCareAc } from '../LocalStorageTables/SelfCareAc';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'page-fund-transfer',
  templateUrl: 'fund-transfer.html'
})
export class FundTransferPage implements OnInit{

  SelfCareAcsBasedOnTenantID: SelfCareAc;
  disablenextwithoutToAccount: boolean;
  disablenextwithoutFromAccount: boolean;
  errormsg: string;
  AcSubId: string;
  ShowManyAccounts: boolean;
  showstatus: boolean;
  selfCareAC: SelfCareAc;
  SelfCareACs: SelfCareAc;
  DigiPartyId: string;
  digiparty: DigiParty;
  DigiParties: DigiParty;
  Tenant: Tenant;
  Tenants: Tenant;
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
  AcNo: string;
  HeadName: string;
  ActiveBankName: string;
  ActiveTenantId=JSON.parse(StorageService.GetUser()).ActiveTenantId;
  // constructor(private regService : RegisterService, public formbuilder:FormBuilder,public constant:ConstantService,private autoLogoutService: AutoLogoutService,public navCtrl: NavController) {
    constructor(private toastr: ToastrService,public loadingController: LoadingController,private regService : RegisterService, public formbuilder:FormBuilder,public constant:ConstantService,public navCtrl: NavController) {

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
    this.disablenextwithoutFromAccount=true;
    this.disablenextwithoutToAccount=true;
    var ActiveTenantId=JSON.parse(StorageService.GetUser()).ActiveTenantId;
       this.ActiveBankName=StorageService.GetActiveBankName();
       this.SelfCareACs=JSON.parse(StorageService.GetSelfCareAc());    
       this.SelfCareAcsBasedOnTenantID=this.SelfCareACs.filter(function (obj) { return obj.TenantId === ActiveTenantId&&obj.AcActId=="#SB";})       
       this.ShowManyAccounts=true;
  }

  
  OnFromAccount(AcSubId){
   this.AcSubId=AcSubId;
   this.errormsg=null;
  this.SelfCareACs=JSON.parse(StorageService.GetSelfCareAc());
  this.selfCareAC=this.SelfCareACs.find(function (obj) { return obj.AcSubId === AcSubId&&obj.AcActId=="#SB"; });
  if(this.selfCareAC==null){
  this.errormsg="Through Pigmy Account Fund can not be transferred";
  }else{
    this.ShowManyAccounts=false;
    this.disablenextwithoutFromAccount=false;
    return this.selfCareAC;
  }
 }
  GetDigiPartyID(){
    var ActiveTenantId=JSON.parse(StorageService.GetUser()).ActiveTenantId;
    this.DigiParties=JSON.parse(StorageService.GetDigiParty());
       this.digiparty=this.DigiParties.find(function (obj) { return obj.TenantId === ActiveTenantId; });
       this.DigiPartyId=this.digiparty.DigiPartyId;
       return this.DigiPartyId;
  }

  GetSelfCareAcByTenantID(ActiveTenantId){
    var AcSubId=this.AcSubId; 
    this.SelfCareACs=JSON.parse(StorageService.GetSelfCareAc());
    // this.selfCareAC=this.SelfCareACs.find(function (obj) { return obj.TenantId === ActiveTenantId&&obj.AcActId=="#SB"&&obj.AcSubId===this.AcSubId; });
    this.selfCareAC=this.SelfCareACs.find(function (obj) { return obj.TenantId === ActiveTenantId&&obj.AcSubId===AcSubId; });
    return this.selfCareAC;
    
  }
  OnSearchingAccount(mobno){
    let loading = this.loadingController.create({
      content: 'Searching For the Account'
    });
    loading.present();
    this.FTRequest={
      TenantId:this.ActiveTenantId,
      MobileNo:mobno
    }
    this.regService.GetFTAccount(this.FTRequest).subscribe((data : any)=>{
      this.fundTransferResponse=data;
      this.disablenextwithoutToAccount=false;
    });
    loading.dismiss();
  }
  
  OnNext(amnt){
this.confirm=this.fundTransferResponse;
this.Rs=amnt;
this.ShowHide=false;
  }

  OnConfirm(){
    let loading = this.loadingController.create({
      content: 'Transferring the Fund..'
    });
    loading.present();
    this.transfer={
      TenantId:this.ActiveTenantId,
       DigiPartyId:this.GetDigiPartyID(),
      //FromAcMastId:this.AcHeadId,
      FromAcMastId:this.GetSelfCareAcByTenantID(this.ActiveTenantId).AcHeadId,
      FromAcSubId:this.GetSelfCareAcByTenantID(this.ActiveTenantId).AcSubId,
      FromLocId:this.GetSelfCareAcByTenantID(this.ActiveTenantId).LocId,
      ToAcMastId:this.fundTransferResponse.AcHeadId,
      ToAcSubId:this.fundTransferResponse.AcSubId,
      ToLocId:this.fundTransferResponse.LocId,
      Amount:this.Rs,
      ToAcNo:this.fundTransferResponse.AcNo
    }
    this.regService.FundTransfer(this.transfer).subscribe((data : any)=>{
      this.ftd=data;
      this.confirm=null;
      this.toastr.success('Fund Transferred with ' + this.ftd.Status, 'Success!');
      this.showstatus=true;
    });
    loading.dismiss();
  }
}
