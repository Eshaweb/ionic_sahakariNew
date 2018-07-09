import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, Form, NavParams, AlertController } from 'ionic-angular';
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
  mobilenum_Message: string;
  mobilenumforOTP_Message: string;
  formgroup2: FormGroup;
  isForgotPassword: boolean;
  formgroup1: FormGroup;
  constructor(private alertCtrl: AlertController, private uiService: UISercice, public navParams: NavParams, public loadingController: LoadingController, public formbuilder: FormBuilder, private toastrService: ToastrService, private regService: RegisterService, public navCtrl: NavController) {
    this.formgroup1 = formbuilder.group({
      mobilenum: ['', [Validators.required, Validators.minLength(10)]]
    });
    this.formgroup1.controls['mobilenum']
    .valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(val => {
        if (val && val.length < 10) {
          this.formgroup1.controls['mobilenum'].setErrors({ minlength: true });
        }
      });
    // let loader = this.loadingController.create({
    //   content: "Page Loading....."
    // });  
    // loader.present();
    // setTimeout(() => {
    //   loader.dismiss();
    // }, 2000); 

    const mobilenumControl = this.formgroup1.get('mobilenum');
    mobilenumControl.valueChanges.subscribe(value => this.setErrorMessage(mobilenumControl));
  
    this.formgroup2 = formbuilder.group({
      mobilenumforOTP: ['', [Validators.required, Validators.minLength(10)]]
    });
   const mobilenumforOTPControl = this.formgroup2.get('mobilenumforOTP');
    mobilenumforOTPControl.valueChanges.subscribe(value => this.setErrorMessage(mobilenumforOTPControl));
  }
  hidethisform: boolean;
  setErrorMessage(c: AbstractControl): void {
 this.mobilenum_Message='';
this.mobilenumforOTP_Message='';
    let control = this.uiService.getControlName(c);
    if ((c.touched || c.dirty) && c.errors) {
      if (control === 'mobilenum') {
        this.mobilenum_Message = Object.keys(c.errors).map(key => this.validationMessages[control + '_' + key]).join(' ');
      }
      else if (control === 'mobilenumforOTP') {
        this.mobilenumforOTP_Message = Object.keys(c.errors).map(key => this.validationMessages[control + '_' + key]).join(' ');
      }
    }
  }
  private validationMessages = {
    mobilenum_required: '*Enter mobile number',
    mobilenum_minlength: 'invalid mobile number',

    mobilenumforOTP_required: '*Enter mobile number',
    mobilenumforOTP_minlength: 'invalid mobile number'
  };

  ngOnInit() {
    this.hidethisform = true;
    this.isForgotPassword = this.navParams.get('isForgotPassword');
if(this.isForgotPassword==true){
  this.hidethisform = false;
}
  }

  tenant: Tenant;

    OnGetTenants() {
    let loading = this.loadingController.create({
      content: 'Please wait till we get banks for you'
    });
    loading.present();
    
    this.tenant = null;
      this.regService.GetTenantsByMobile(this.formgroup1.get('mobilenum').value).subscribe((data: any) => {
      this.tenant = data;
      var TenantList = data;
      if (TenantList.length == 0) {
        this.toastrService.error("Non-Registered/InCorrect Mobile Number", 'Error!');
        this.tenant = null;
      }
      else {
        this.hidethisform = false;
      }
      loading.dismiss();
    }, (error) => {
      this.toastrService.error(error.error.ExceptionMessage, 'Error!');
      var alert = this.alertCtrl.create({
        title: "Error Message",
        subTitle: error.error.ExceptionMessage,
        buttons: ['OK']
      });
      alert.present();
    });

  }
  //TenantIdActive: string;
  //digiCustWithOTPRefNo: DigiCustWithOTPRefNo;

  OnRequestOTP(Id) {
    var mobilenum=this.formgroup1.get('mobilenum')
    let loading = this.loadingController.create({
      content: 'Please wait till the screen loads'
    });
    loading.present();
    //this.TenantIdActive = Id;
    var oTPRequest = {
      TenantId: Id,
      MobileNo: mobilenum.value
    }
    this.regService.RequestOTP(oTPRequest).subscribe((data: any) => {
      //this.digiCustWithOTPRefNo = data;
      //this.digiCustWithOTPRefNo.OTPRef = data.OTPRef;

      //ADDED toastr.css in the path "node_modules/ngx-toastr/toastr.css" from https://github.com/scttcper/ngx-toastr/blob/master/src/lib/toastr.css
      this.toastrService.success('OTP Sent to ' + mobilenum.value + ' with Reference No. ' +data.OTPRef, 'Success!');
      loading.dismiss();
       this.navCtrl.push(EnterOTPPage, { 'OTPRefNo': data.OTPRef, 'TenantId': Id, 'MobileNo': mobilenum.value, 'DigiPartyId': data.DigiPartyId});
    }, (error) => {
      this.toastrService.error(error.error.ExceptionMessage, 'Error!');
      var alert = this.alertCtrl.create({
        title: "Error Message",
        subTitle: error.error.ExceptionMessage,
        buttons: ['OK']
      });
      alert.present();
    });
  }

  OnMobNo(){
    var mobilenumforOTP=this.formgroup2.get('mobilenumforOTP')
    var ActiveTenantId:string = StorageService.GetUser().ActiveTenantId;
    localStorage.clear();
    let loading = this.loadingController.create({
      content: 'Please wait till the screen loads'
    });
    loading.present();
    var oTPRequest= {
      TenantId: ActiveTenantId,
      MobileNo: mobilenumforOTP.value
    }
    this.regService.RequestOTP(oTPRequest).subscribe((data: any) => {
      // this.digiCustWithOTPRefNo = data;
       //this.digiCustWithOTPRefNo.OTPRef = data.OTPRef;

      this.toastrService.success('OTP Sent to ' + mobilenumforOTP.value + ' with Reference No. ' + data.OTPRef, 'Success!');
      this.navCtrl.push(EnterOTPPage, { 'OTPRefNo': data.OTPRef, 'TenantId': ActiveTenantId, 'MobileNo': mobilenumforOTP.value, 'DigiPartyId':data.DigiPartyId});
    }, (error) => {
      this.toastrService.error(error.error.ExceptionMessage, 'Error!');
      var alert = this.alertCtrl.create({
        title: "Error Message",
        subTitle: error.error.ExceptionMessage,
        buttons: ['OK']
      });
      alert.present();
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


