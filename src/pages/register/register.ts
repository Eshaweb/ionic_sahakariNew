import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, Form } from 'ionic-angular';
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

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage implements OnInit {
  formgroup: FormGroup;
  mobilenum: AbstractControl;
  lastname: AbstractControl;
  constructor(public loadingController: LoadingController, public formbuilder: FormBuilder,private toastrService: ToastrService, private regService: RegisterService, public navCtrl: NavController) {
    this.formgroup = formbuilder.group({
      mobilenum: ['', [Validators.required, Validators.minLength(10)]]
    });
    this.mobilenum = this.formgroup.controls['mobilenum'];
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
  }
  hidethisform: boolean;

  ngOnInit() {
    this.hidethisform = true;
  }
  mobno: any;
  tenantList: TenantList;
  isLoginError: boolean = false;
  OnGetTenants(mobno) {
    let loading = this.loadingController.create({
      content: 'Please wait till we get banks for you'
    });
    loading.present();
    this.mobno = mobno;
    this.tenantList = null;
    this.regService.GetTenantsByMobile(mobno).subscribe((data: any) => {
      this.tenantList = data;  
      var TenantList=data;
      //this.tenantList.Id = data[0].Id;
      if(TenantList.length==0){
        this.toastrService.error("Non-Registered/InCorrect Mobile Number", 'Error!');
        this.tenantList = null;
      }
      else{
        this.hidethisform = false;
      }
      
      
      loading.dismiss();
    },(error) => {this.toastrService.error(error.error.ExceptionMessage, 'Error!')

  });

  }
  TenantIdActive: any;
  digiCustWithOTPRefNo: DigiCustWithOTPRefNo;
  oTPRequest: OTPRequest;

  OnRequestOTP(Id) {
    let loading = this.loadingController.create({
      content: 'Please wait till the screen loads'
    });
    loading.present();
    this.TenantIdActive = Id;
    this.oTPRequest = {
      TenantId: this.TenantIdActive,
      MobileNo: this.mobno
    }
    this.regService.RequestOTP(this.oTPRequest).subscribe((data: any) => {
      this.digiCustWithOTPRefNo = data;
      this.digiCustWithOTPRefNo.OTPRef = data.OTPRef;

      //ADDED toastr.css in the path "node_modules/ngx-toastr/toastr.css" from https://github.com/scttcper/ngx-toastr/blob/master/src/lib/toastr.css
      this.toastrService.success('OTP Sent to ' + this.oTPRequest.MobileNo + ' with Reference No. ' + this.digiCustWithOTPRefNo.OTPRef, 'Success!');
      loading.dismiss();
      this.navCtrl.push(EnterOTPPage, { 'OTPRefNo': this.digiCustWithOTPRefNo.OTPRef,'TenantId':this.oTPRequest.TenantId ,'MobileNo':this.oTPRequest.MobileNo});
    },(error) => {this.toastrService.error(error.error.ExceptionMessage, 'Error!')

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


