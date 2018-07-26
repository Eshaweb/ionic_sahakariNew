import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
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
import { ChangeBankPage } from '../change-bank/change-bank';
import { BankingPage } from '../banking/banking';
import { FundTransferConfirmPage } from '../fund-transfer-confirm/fund-transfer-confirm';

@Component({
  selector: 'page-fund-transfer',
  templateUrl: 'fund-transfer.html'
})
export class FundTransferPage implements OnInit {
  amountMessage: string;
  mobileMessage: string;
  formgroup2: FormGroup;
  formgroup1: FormGroup;
  Showthis: boolean;
  HeadName: string;
  AcNo: string;
  ToName: string;
  ToAcNo: string;


  // constructor(private regService : RegisterService, public formbuilder:FormBuilder,public constant:ConstantService,private autoLogoutService: AutoLogoutService,public navCtrl: NavController) {
  constructor(private storageService:StorageService, private alertCtrl: AlertController, private uiService: UISercice, private toastr: ToastrService, public loadingController: LoadingController, private registerService: RegisterService, public formbuilder: FormBuilder, public navCtrl: NavController) {

    //StorageService.SetItem('lastAction', Date.now().toString());
    this.formgroup1 = formbuilder.group({
      mobilenum: ['', [Validators.required, Validators.minLength(10)]]
    });
    const mobileControl = this.formgroup1.get('mobilenum');
    mobileControl.valueChanges.subscribe(value => this.setErrorMessage(mobileControl));

    this.formgroup2 = formbuilder.group({
      amount: ['', [Validators.required, Validators.minLength(1)]]
    });
    const amountControl = this.formgroup2.get('amount');
    amountControl.valueChanges.subscribe(value => this.setErrorMessage(amountControl));
  }
  setErrorMessage(c: AbstractControl): void {
    this.mobileMessage = '';
    this.amountMessage = '';
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
  ActiveBankName: string;
  selfCareAC: SelfCareAc;
  SelfCareACs: SelfCareAc;
  SelfCareAcBasedOnTenantID: SelfCareAc;
  ngOnInit() {
    this.Showthis=true;
    this.ShowHide = true;
    this.disablenextwithoutToAccount = true;
    var ActiveTenantId = this.storageService.GetUser().ActiveTenantId;
    this.ActiveBankName = this.storageService.GetActiveBankName();
    var SelfCareACs = this.storageService.GetSelfCareAc();
    var SelfCareAcBasedOnTenantID = SelfCareACs.filter(function (obj) { return obj.TenantId === ActiveTenantId && obj.AcActId == "#SB"; })
    if (SelfCareAcBasedOnTenantID.length==0) {
      this.Showthis = false;
      this.ShowHide=false;
      var alert = this.alertCtrl.create({
        title: "Error Message",
        subTitle: "Fund Transfer is not Available Since there is no SB Account",
        buttons: [{
          text: 'OK',
          handler: () => {this.navCtrl.pop();}
        }]
      });
      alert.present();
    }
    else{
      this.SelfCareAcBasedOnTenantID=SelfCareAcBasedOnTenantID;
      this.HeadName=this.SelfCareAcBasedOnTenantID[0].HeadName;
      this.AcNo=this.SelfCareAcBasedOnTenantID[0].AcNo;
    }
  }
  OnBack(){
    this.navCtrl.push(BankingPage);
  }
  OnChangeBank(){
    var isFromFundTransfer:boolean=true;
    //this.navCtrl.push(ChangeBankPage,{'isFromFundTransfer':isFromFundTransfer});
    this.navCtrl.push(ChangeBankPage,{'isFromFundTransfer':isFromFundTransfer}).then(() => {
      const startIndex = this.navCtrl.getActive().index - 1;
      this.navCtrl.remove(startIndex, 1);
    });
  }
  GetSelfCareAcByTenantID(ActiveTenantId) {
    var AcSubId = this.SelfCareAcBasedOnTenantID[0].AcSubId;
    var SelfCareACs = this.storageService.GetSelfCareAc();
    // this.selfCareAC=this.SelfCareACs.find(function (obj) { return obj.TenantId === ActiveTenantId&&obj.AcActId=="#SB"&&obj.AcSubId===this.AcSubId; });
    this.selfCareAC = SelfCareACs.find(function (obj) { return obj.TenantId === ActiveTenantId && obj.AcSubId === AcSubId; });
    return this.selfCareAC;

  }
  fundTransferResponse: FundTransferResponse;
  OnSearchingAccount() {
    let loading = this.loadingController.create({
      content: 'Searching For the Account'
    });
    loading.present();
    var fundTransferRequest = {
      TenantId: this.storageService.GetUser().ActiveTenantId,
      MobileNo: this.formgroup1.get('mobilenum').value
    }
    this.registerService.GetFTAccount(fundTransferRequest).subscribe((data: any) => {
      this.fundTransferResponse = data;
      this.ToName=this.fundTransferResponse.Name;
      this.ToAcNo=this.fundTransferResponse.AcNo;
      this.disablenextwithoutToAccount = false;
      loading.dismiss();
    }, (error) => {
      this.toastr.error(error.message, 'Error!');
      var alert = this.alertCtrl.create({
        title: "Error Message",
        subTitle: error.message,
        buttons: ['OK']
      });
      alert.present(); 
      loading.dismiss();
   });
    
  }

  OnNext() {
    var ActiveTenantId = this.storageService.GetUser().ActiveTenantId;
    const doFundTransfer = {
      TenantId: ActiveTenantId,
      DigiPartyId: this.storageService.GetDigipartyBasedOnActiveTenantId().DigiPartyId,
      FromAcMastId: this.GetSelfCareAcByTenantID(ActiveTenantId).AcHeadId,
      FromAcSubId: this.GetSelfCareAcByTenantID(ActiveTenantId).AcSubId,
      FromLocId: this.GetSelfCareAcByTenantID(ActiveTenantId).LocId,
      ToAcMastId: this.fundTransferResponse.AcHeadId,
      ToAcSubId: this.fundTransferResponse.AcSubId,
      ToLocId: this.fundTransferResponse.LocId,
      Amount: this.formgroup2.get('amount').value,
      ToAcNo: this.fundTransferResponse.AcNo
    }
     this.navCtrl.push(FundTransferConfirmPage,{doFundTransfer,'AcSubId':this.SelfCareAcBasedOnTenantID[0].AcSubId,'HeadName':this.HeadName,'AcNo':this.AcNo,'ToName':this.ToName,'ToAcNo':this.ToAcNo});
    // this.navCtrl.push(FundTransferConfirmPage,{'doFundTransfer':doFundTransfer});
  }
  
}
