import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, Form } from 'ionic-angular';
//import { BankListPage } from '../bank-list/bank-list';
import { EnterOTPPage } from '../enter-otp/enter-otp';
import { HomePage } from '../home/home';
import { MobileRechargePage } from '../mobile-recharge/mobile-recharge';
import { BankingPage } from '../banking/banking';
import { RegisterService } from '../services/app-data.service';
import { HttpErrorResponse } from '@angular/common/http';
//import { NgForm } from '@angular/forms';
//import { User } from '../View Models/user.model';
//import { userClaims } from '../services/userClaims.model';
import { Registervm } from '../View Models/register.vm';
import { OTPRequest } from '../View Models/OTPrequest.vm';
import { ToastrService } from 'ngx-toastr';
import { Toast } from '@ionic-native/toast';
import { ToastController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { DigiCustWithOTPRefNo } from '../View Models/DigiCustWithOTPRefNo';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { DigiParty } from '../LocalStorageTables/DigiParty';
import { StorageService } from '../services/Storage_Service';
import { ConstantService } from '../services/Constants';
import { TenantList } from '../View Models/TenantList';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage implements OnInit {
  hidethisform: boolean;
  clicked: boolean;
  TenantIdActive: any;
  DigiParty: DigiParty;
  OTPreq: OTPRequest;
  store: DigiCustWithOTPRefNo;
  mobno: any;
  registervm: Registervm;
  tenantList: TenantList;
  isLoginError: boolean = false;
  errorMessage: string;
  messages: string[] = [];
  formgroup: FormGroup;
  mobilenum: AbstractControl;
  lastname: AbstractControl;
  public items: number[][];

  constructor(public constant: ConstantService, public loadingController: LoadingController, public formbuilder: FormBuilder, private platform: Platform, private toastCtrl: ToastController, private toast: Toast, private toastr: ToastrService, private regService: RegisterService, public navCtrl: NavController) {
    this.items = [
      [1, 2, 3], 
      [4, 5, 6],
      [7, 8, 9]
  ];
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
  ngOnInit() {

    //this.registervm = new Registervm();
    this.hidethisform=true;

  }
  OnGetTenants(mobno) {

    let loading = this.loadingController.create({
      content: 'Please wait till we get banks for you'
    });

    loading.present();

    this.mobno = mobno;
    this.tenantList = null;
    this.regService.GetTenantsByMobile(mobno).subscribe((data: any) => {
      this.tenantList = data;   //got tenantlist from server
      this.tenantList.Id = data[0].Id;
      this.hidethisform=false;
      loading.dismiss();
    },
      (err: HttpErrorResponse) => {
        this.isLoginError = true;
      });

  }

  OnRequestOTP(Id) {
    let loading = this.loadingController.create({
      content: 'Please wait till the screen loads'
    });

    loading.present();
    this.TenantIdActive = Id;
    this.OTPreq = {
      TenantId: this.TenantIdActive,
      MobileNo: this.mobno
    }
    this.regService.RequestOTP(this.OTPreq).subscribe((data: any) => {
      this.store = data;
      this.store.OTPRef = data.OTPRef;

      //ADDED toastr.css in the path "node_modules/ngx-toastr/toastr.css" from https://github.com/scttcper/ngx-toastr/blob/master/src/lib/toastr.css
      this.toastr.success('OTP Sent to ' + this.OTPreq.MobileNo + ' with Reference No. ' + this.store.OTPRef, 'Success!');

      loading.dismiss();
      this.navCtrl.push(EnterOTPPage, { 'OTPRefNo': this.store.OTPRef });

    },
      (err: HttpErrorResponse) => {
        this.isLoginError = true;
      })




  }

  // private handleErrors(errors: any) {
  //   this.messages = [];
  //   for (let msg of errors) {
  //       this.messages.push(msg);
  //   }

  // }
  

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


