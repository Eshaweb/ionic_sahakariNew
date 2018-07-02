import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, Form, NavParams } from 'ionic-angular';
import { EnterOTPPage } from '../enter-otp/enter-otp';
import { HomePage } from '../home/home';
import { MobileRechargePage } from '../mobile-recharge/mobile-recharge';
import { BankingPage } from '../banking/banking';
import { RegisterService } from '../services/app-data.service';
import { OTPRequest } from '../View Models/OTPrequest.vm';
import { ToastrService } from 'ngx-toastr';
import { DigiCustWithOTPRefNo } from '../View Models/DigiCustWithOTPRefNo';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { TenantList } from '../View Models/TenantList';
import { Tenant } from '../LocalStorageTables/Tenant';
import { UISercice } from '../services/UIService';
import { StorageService } from '../services/Storage_Service';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage implements OnInit {
  mobilenumforOTP: AbstractControl;
  formgroup2: FormGroup;
  isForgotPassword: boolean;
  userMessage: string;
  formgroup1: FormGroup;
  mobilenum: AbstractControl;
  lastname: AbstractControl;
  constructor(private uiService: UISercice, public navParams: NavParams, public loadingController: LoadingController, public formbuilder: FormBuilder, private toastrService: ToastrService, private regService: RegisterService, public navCtrl: NavController) {
    this.formgroup1 = formbuilder.group({
      mobilenum: ['', [Validators.required, Validators.minLength(10)]]
    });
    this.mobilenum = this.formgroup1.controls['mobilenum'];
    this.mobilenum
      .valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(val => {
        if (val && val.length < 10) {
          this.mobilenum.setErrors({ minlength: true });
        }
      });
    // let loader = this.loadingController.create({
    //   content: "Page Loading....."
    // });  
    // loader.present();
    // setTimeout(() => {
    //   loader.dismiss();
    // }, 2000); 

    const userControl = this.formgroup1.get('mobilenum');
    userControl.valueChanges.subscribe(value => this.setErrorMessage(userControl));
  
    this.formgroup2 = formbuilder.group({
      mobilenumforOTP: ['', [Validators.required, Validators.minLength(10)]]
    });
    this.mobilenumforOTP = this.formgroup2.controls['mobilenumforOTP'];
    const MobileNoControl = this.formgroup2.get('mobilenumforOTP');
    MobileNoControl.valueChanges.subscribe(value => this.setErrorMessage(MobileNoControl));
  }
  hidethisform: boolean;
  setErrorMessage(c: AbstractControl): void {
 this.userMessage='';
    let control = this.uiService.getControlName(c);
    if ((c.touched || c.dirty) && c.errors) {
      if (control === 'mobilenum') {
        this.userMessage = Object.keys(c.errors).map(key => this.validationMessages[control + '_' + key]).join(' ');
      }
    }
  }
  private validationMessages = {
    mobilenum_required: '*Enter mobile number',
    mobilenum_minlength: 'invalid mobile number'
  };

  ngOnInit() {
    this.hidethisform = true;
    this.isForgotPassword = this.navParams.get('isForgotPassword');
if(this.isForgotPassword==true){
  this.hidethisform = false;
}
  }
  //mobno: string;
  // tenantList: TenantList;
  tenant: Tenant;
  //isLoginError: boolean = false;
  // OnGetTenants(mobno) {
    OnGetTenants() {
    let loading = this.loadingController.create({
      content: 'Please wait till we get banks for you'
    });
    loading.present();
    // this.mobno = mobno;
    //this.mobno = this.mobilenum.value;
    this.tenant = null;
    // this.regService.GetTenantsByMobile(mobno).subscribe((data: any) => {
      this.regService.GetTenantsByMobile(this.mobilenum.value).subscribe((data: any) => {
      this.tenant = data;
      var TenantList = data;
      //this.tenantList.Id = data[0].Id;
      if (TenantList.length == 0) {
        this.toastrService.error("Non-Registered/InCorrect Mobile Number", 'Error!');
        this.tenant = null;
      }
      else {
        this.hidethisform = false;
      }
      loading.dismiss();
    }, (error) => {
      this.toastrService.error(error.error.ExceptionMessage, 'Error!')
    });

  }
  TenantIdActive: string;
  digiCustWithOTPRefNo: DigiCustWithOTPRefNo;

  OnRequestOTP(Id) {
    let loading = this.loadingController.create({
      content: 'Please wait till the screen loads'
    });
    loading.present();
    this.TenantIdActive = Id;
    var oTPRequest = {
      TenantId: this.TenantIdActive,
      MobileNo: this.mobilenum.value
    }
    this.regService.RequestOTP(oTPRequest).subscribe((data: any) => {
      this.digiCustWithOTPRefNo = data;
      this.digiCustWithOTPRefNo.OTPRef = data.OTPRef;

      //ADDED toastr.css in the path "node_modules/ngx-toastr/toastr.css" from https://github.com/scttcper/ngx-toastr/blob/master/src/lib/toastr.css
      this.toastrService.success('OTP Sent to ' + this.mobilenum.value + ' with Reference No. ' + this.digiCustWithOTPRefNo.OTPRef, 'Success!');
      loading.dismiss();
       this.navCtrl.push(EnterOTPPage, { 'OTPRefNo': this.digiCustWithOTPRefNo.OTPRef, 'TenantId': this.TenantIdActive, 'MobileNo': this.mobilenum.value, 'DigiPartyId': this.digiCustWithOTPRefNo.DigiPartyId});
    }, (error) => {
      this.toastrService.error(error.error.ExceptionMessage, 'Error!')
    });
  }

  OnMobNo(){
    var ActiveTenantId:string = StorageService.GetUser().ActiveTenantId;
    localStorage.clear();
    let loading = this.loadingController.create({
      content: 'Please wait till the screen loads'
    });
    loading.present();
    var oTPRequest= {
      TenantId: ActiveTenantId,
      MobileNo: this.mobilenumforOTP.value
    }
    this.regService.RequestOTP(oTPRequest).subscribe((data: any) => {
       this.digiCustWithOTPRefNo = data;
       this.digiCustWithOTPRefNo.OTPRef = data.OTPRef;

      this.toastrService.success('OTP Sent to ' + this.mobilenumforOTP.value + ' with Reference No. ' + this.digiCustWithOTPRefNo.OTPRef, 'Success!');
      this.navCtrl.push(EnterOTPPage, { 'OTPRefNo': this.digiCustWithOTPRefNo.OTPRef, 'TenantId': ActiveTenantId, 'MobileNo': this.mobilenumforOTP.value, 'DigiPartyId': this.digiCustWithOTPRefNo.DigiPartyId});
    }, (error) => {
      this.toastrService.error(error.error.ExceptionMessage, 'Error!')
    });

  }
  goToBankList(params) {
    if (!params) params = {};
    this.navCtrl.push(HomePage);
  } goToEnterOTP(params) {
    if (!params) params = {};
    this.navCtrl.push(EnterOTPPage);
  } goToHome(params) {
    if (!params) params = {};
    this.navCtrl.push(HomePage);
  } goToMobileRecharge(params) {
    if (!params) params = {};
    this.navCtrl.push(MobileRechargePage);
  } goToBanking(params) {
    if (!params) params = {};
    this.navCtrl.push(BankingPage);
  }
}


