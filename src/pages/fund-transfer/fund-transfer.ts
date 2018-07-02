import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
//import { AutoLogoutService } from '../services/AutoLogOutService';
import { StorageService } from '../services/Storage_Service';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { RegisterService } from '../services/app-data.service';
import { FundTransferRequest } from '../View Models/FundTransferRequest';
import { FundTransferResponse } from '../View Models/FundTransferResponse';
import { DoFundTransfer } from '../View Models/DoFundTransfer';
import { FundTransferDone } from '../View Models/FundTransferDone';
import { SelfCareAc } from '../LocalStorageTables/SelfCareAc';
import { ToastrService } from 'ngx-toastr';
import { UISercice } from '../services/UIService';

@Component({
  selector: 'page-fund-transfer',
  templateUrl: 'fund-transfer.html'
})
export class FundTransferPage implements OnInit{
  amountMessage: string;
  mobileMessage: string;
  amount: AbstractControl;
  formgroup2: FormGroup;
  mobilenum: AbstractControl;
  formgroup1: FormGroup;
 
  
  // constructor(private regService : RegisterService, public formbuilder:FormBuilder,public constant:ConstantService,private autoLogoutService: AutoLogoutService,public navCtrl: NavController) {
    constructor(private uiService: UISercice, private toastr: ToastrService,public loadingController: LoadingController,private registerService : RegisterService, public formbuilder:FormBuilder,public navCtrl: NavController) {

  //StorageService.SetItem('lastAction', Date.now().toString());
    this.formgroup1 = formbuilder.group({
      mobilenum:['',[Validators.required,Validators.minLength(10)]]
    });
    this.mobilenum = this.formgroup1.controls['mobilenum'];
    const mobileControl = this.formgroup1.get('mobilenum');
    mobileControl.valueChanges.subscribe(value => this.setErrorMessage(mobileControl));
    
    this.formgroup2 = formbuilder.group({
      amount:['',[Validators.required,Validators.minLength(1)]]
    });
    this.amount = this.formgroup2.controls['amount'];
    const amountControl = this.formgroup2.get('amount');
    amountControl.valueChanges.subscribe(value => this.setErrorMessage(amountControl));
  }
  setErrorMessage(c: AbstractControl): void {
    this.mobileMessage='';
    this.amountMessage='';
       let control = this.uiService.getControlName(c);
       if ((c.touched || c.dirty) && c.errors) {
         if (control === 'mobilenum') {
           this.mobileMessage = Object.keys(c.errors).map(key => this.validationMessages[control + '_' + key]).join(' ');
         }
         else if (control === 'amount') {
          this.amountMessage = Object.keys(c.errors).map(key => this.validationMessages[control + '_' + key]).join(' ');
        }
       }
     }
     private validationMessages = {
       mobilenum_required: '*Enter mobile number',
       mobilenum_minlength: '*Enter 10 Digit Mobile Number',

       amount_required: '*Enter Amount'
     };
   
  ShowHide: boolean;
  disablenextwithoutToAccount: boolean;
  disablenextwithoutFromAccount: boolean;
  ActiveBankName: string;
  ActiveTenantId=StorageService.GetUser().ActiveTenantId;
  selfCareAC: SelfCareAc;
  SelfCareACs: SelfCareAc;
  ShowManyAccounts: boolean;
  SelfCareAcsBasedOnTenantID: SelfCareAc;
  ngOnInit(){
    this.ShowHide=true;
    this.disablenextwithoutFromAccount=true;
    this.disablenextwithoutToAccount=true;
    var ActiveTenantId=StorageService.GetUser().ActiveTenantId;
       this.ActiveBankName=StorageService.GetActiveBankName();
      this.SelfCareACs=StorageService.GetSelfCareAc();    
       this.SelfCareAcsBasedOnTenantID=this.SelfCareACs.filter(function (obj) { return obj.TenantId === ActiveTenantId&&obj.AcActId=="#SB";})       
       this.ShowManyAccounts=true;
  }

  errormsg: string;
  AcSubId: string;
  OnFromAccount(AcSubId){
   this.AcSubId=AcSubId;
   this.errormsg=null;
  // this.SelfCareACs=JSON.parse(StorageService.GetSelfCareAc());
  this.SelfCareACs=StorageService.GetSelfCareAc();
  this.selfCareAC=this.SelfCareACs.find(function (obj) { return obj.AcSubId === AcSubId&&obj.AcActId=="#SB"; });
  if(this.selfCareAC==null){
  this.errormsg="Through Pigmy Account Fund can not be transferred";
  }else{
    this.ShowManyAccounts=false;
    this.disablenextwithoutFromAccount=false;
    return this.selfCareAC;
  }
 }  

  GetSelfCareAcByTenantID(ActiveTenantId){
    var AcSubId=this.AcSubId; 
    this.SelfCareACs=StorageService.GetSelfCareAc();
    // this.selfCareAC=this.SelfCareACs.find(function (obj) { return obj.TenantId === ActiveTenantId&&obj.AcActId=="#SB"&&obj.AcSubId===this.AcSubId; });
    this.selfCareAC=this.SelfCareACs.find(function (obj) { return obj.TenantId === ActiveTenantId&&obj.AcSubId===AcSubId; });
    return this.selfCareAC;
    
  }
  fundTransferRequest: FundTransferRequest;
  fundTransferResponse: FundTransferResponse;
  OnSearchingAccount(){
    let loading = this.loadingController.create({
      content: 'Searching For the Account'
    });
    loading.present();
    this.fundTransferRequest={
      TenantId:this.ActiveTenantId,
      MobileNo:this.mobilenum.value
    }
    this.registerService.GetFTAccount(this.fundTransferRequest).subscribe((data : any)=>{
      this.fundTransferResponse=data;
      this.disablenextwithoutToAccount=false;
    });
    loading.dismiss();
  }
 
  Rs: string;
  confirm: FundTransferResponse;
  OnNext(){
this.confirm=this.fundTransferResponse;
this.Rs=this.amount.value;
this.ShowHide=false;
  }
  showstatus: boolean;
  fundTransferDone: FundTransferDone;
  doFundTransfer: DoFundTransfer;
  OnConfirm(){
    let loading = this.loadingController.create({
      content: 'Transferring the Fund..'
    });
    loading.present();
    this.doFundTransfer={
      TenantId:this.ActiveTenantId,
      DigiPartyId:StorageService.GetDigiPartyID(),
      FromAcMastId:this.GetSelfCareAcByTenantID(this.ActiveTenantId).AcHeadId,
      FromAcSubId:this.GetSelfCareAcByTenantID(this.ActiveTenantId).AcSubId,
      FromLocId:this.GetSelfCareAcByTenantID(this.ActiveTenantId).LocId,
      ToAcMastId:this.fundTransferResponse.AcHeadId,
      ToAcSubId:this.fundTransferResponse.AcSubId,
      ToLocId:this.fundTransferResponse.LocId,
      Amount:this.Rs,
      ToAcNo:this.fundTransferResponse.AcNo
    }
    this.registerService.FundTransfer(this.doFundTransfer).subscribe((data : any)=>{
      this.fundTransferDone=data;
      this.confirm=null;
      this.toastr.success('Fund Transferred with ' + this.fundTransferDone.Status, 'Success!');
      this.showstatus=true;
    });
    loading.dismiss();
  }
}
