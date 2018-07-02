import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { LoadingController, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { MobileRechargePage } from '../mobile-recharge/mobile-recharge';
import { BankingPage } from '../banking/banking';
import { RegisterService } from '../services/app-data.service';
import { PostOPT } from '../View Models/PostOPT';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UserPost } from '../View Models/UserPost';
import { UserResult } from '../View Models/UserResult';
import { LoginPage } from '../login/login';
import { StorageService } from '../services/Storage_Service';
import { User } from '../LocalStorageTables/User';
import { ToastrService } from 'ngx-toastr';
import { OTPRequest } from '../View Models/OTPrequest.vm';
import { DigiCustWithOTPRefNo } from '../View Models/DigiCustWithOTPRefNo';
import { Observable } from 'rxjs/Observable';
import { UISercice } from '../services/UIService';
@Component({
  selector: 'page-enter-otp',
  templateUrl: 'enter-otp.html'
})
export class EnterOTPPage implements OnInit {

  confirmpasswordMessage: string;
  passwordMessage: string;
  SavePasswordForm: FormGroup;
  formgroup: FormGroup;
  otp: AbstractControl;
  password: AbstractControl;
  confirmpwd: AbstractControl;
  userMessage: string;
  constructor(private uiService: UISercice, private toastrService: ToastrService, public navParams: NavParams, public loadingController: LoadingController, private fb: FormBuilder, public navCtrl: NavController, private registerService: RegisterService) {
    this.formgroup = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(4)]]
      });
    this.otp = this.formgroup.controls['otp'];
    const otpControl = this.formgroup.get('otp');
    otpControl.valueChanges.subscribe(value => this.setErrorMessageForOTPField(otpControl));

    this.SavePasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmpwd: ['', [Validators.required, Validators.minLength(4)]]
    }, { validator: this.matchingPasswords });
    this.password = this.SavePasswordForm.controls['password'];
    const passwordControl = this.SavePasswordForm.get('password');
    passwordControl.valueChanges.subscribe(value => this.setErrorMessageForPasswordField(passwordControl));
    
    this.confirmpwd = this.SavePasswordForm.controls['confirmpwd'];
    const confirmpasswordControl = this.SavePasswordForm.get('confirmpwd');
    confirmpasswordControl.valueChanges.subscribe(value => this.setErrorMessageForPasswordField(confirmpasswordControl));
  }
  setErrorMessageForOTPField(c: AbstractControl): void {
    this.userMessage = '';
    let control = this.uiService.getControlName(c);
    if ((c.touched || c.dirty) && c.errors) {
      if (control === 'otp') {
        this.userMessage = Object.keys(c.errors).map(key => this.validationMessages[control + '_' + key]).join(' ');
      }
    }
  }
  setErrorMessageForPasswordField(c: AbstractControl): void {
    this.passwordMessage='';
    this.confirmpasswordMessage='';
    let control = this.uiService.getControlName(c);
    if ((c.touched || c.dirty) && c.errors) {
      if (control === 'password') {
        this.passwordMessage  = Object.keys(c.errors).map(key => this.validationMessages[control + '_' + key]).join(' ');
      }
      else if (control === 'confirmpwd') {
        this.confirmpasswordMessage  = Object.keys(c.errors).map(key => this.validationMessages[control + '_' + key]).join(' ');
      }
    }
  }
  private validationMessages = {
    otp_required: '*Enter otp number',
    otp_minlength: 'Enter 4 digits',
    
    password_required: 'Please enter password',
    password_minlength: 'Enter minimum 4 digits',

    confirmpwd_required: 'Please Re-Enter password',
    confirmpwd_minlength: 'This field should match with Password',
    confirmpwd_invalid: 'Password doesnot match'
  };
  DigiPartyId: string;
  OTPRefNo: string;
  MobileNo: string;
  TenantId: string;
  countDown;
  counter = 40;
  tick = 1000;
  ngOnInit() {
    this.OTPRefNo = this.navParams.get('OTPRefNo');
    this.TenantId = this.navParams.get('TenantId');
    this.MobileNo = this.navParams.get('MobileNo');
    this.DigiPartyId = this.navParams.get('DigiPartyId');
    // this.countDown = Observable.timer(0, this.tick)
    //   .take(this.counter)
    //   .map(() => --this.counter);
this.ShowIf=this.navParams.get('ischangePassword');
if(this.ShowIf==null){
  this.ShowIf==false;
}
    this.countDown = this.registerService.getCounter().do(() => --this.counter);
  }
  // stopTimer() {
  //   this.countDown = null;
  // }
  matchingPasswords(group: FormGroup) { // here we have the 'passwords' group
    let password = group.controls.password.value;
    let confirmpwd = group.controls.confirmpwd.value;
    if (!password || !confirmpwd) {
      return null;
    }
    return password === confirmpwd ? null : { notSame: true }
  }
  //otpno: string;
  storeboolean: boolean;
  ShowIf: boolean;
  HideIf = true;
  postOPT: PostOPT;
  OnSubmit() {
    let loading = this.loadingController.create({
      content: 'Please wait till the screen loads'
    });

    loading.present();
    this.postOPT = {
      TenantId: this.registerService.TenantId,  //ActiveTenantId
      MobileNo: this.registerService.MobileNo,
      OTPRef: this.OTPRefNo,
      OTP: this.otp.value
    }
    this.registerService.ValidateOTP(this.postOPT).subscribe((data: any) => {
      this.storeboolean = data;
      if (this.storeboolean == true) {
        this.ShowIf = true;
        this.HideIf = false;
      } else {
        this.ShowIf = false;
        this.HideIf = true;
        this.toastrService.error("OTP is Invalid", 'Error!')
        this.otp.reset();
      }

    })
    loading.dismiss();
  }
  oTPRequest: OTPRequest;
  digiCustWithOTPRefNo: DigiCustWithOTPRefNo;

  OnResendOTP() {
    let loading = this.loadingController.create({
      content: 'Please wait till the screen loads'
    });
    loading.present();
    this.oTPRequest = {
      TenantId: this.TenantId,
      MobileNo: this.MobileNo
    }
    this.registerService.RequestOTP(this.oTPRequest).subscribe((data: any) => {
      this.digiCustWithOTPRefNo = data;
      this.OTPRefNo = data.OTPRef;
      //ADDED toastr.css in the path "node_modules/ngx-toastr/toastr.css" from https://github.com/scttcper/ngx-toastr/blob/master/src/lib/toastr.css
      this.toastrService.success('OTP Sent to ' + this.digiCustWithOTPRefNo.MobileNo + ' with Reference No. ' + this.OTPRefNo, 'Success!');
      loading.dismiss();
    }, (error) => {
      this.toastrService.error(error.error.ExceptionMessage, 'Error!')
    });
  }
  user: User;
  pin: any;
  userResult: UserResult;
  userPost: UserPost;

    OnSavePassword() {
    this.userPost = {
      DigiPartyId: this.DigiPartyId,
      TenantId: this.registerService.TenantId,  //ActiveTenantId
      PIN: this.confirmpwd.value,
      UniqueId: this.guid(),
      OTPRef: this.OTPRefNo,
      OTP: this.otp.value,
      MobileNo: this.registerService.MobileNo
    }

    let loading = this.loadingController.create({
      content: 'Please wait for a minute......'
    });
    loading.present();

    this.registerService.SaveMPin(this.userPost).subscribe((data: any) => {
      this.userResult = data;

      this.user = {
        ActiveTenantId: this.registerService.TenantId,
        UserId: data.UserId,
        UserName: data.UserName,
        UniqueKey: data.UniqueKey
      }
      StorageService.SetUser(JSON.stringify(this.user));
      this.navCtrl.push(LoginPage);
      loading.dismiss();

    }, (error) => {
      this.toastrService.error(error.error.ExceptionMessage, 'Error!')

    });

  }


  //below code is from here https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript/105074#105074
  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }



  goToHome(params) {
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

@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {

  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    return ('00' + minutes).slice(-2) + ':' + ('00' + Math.floor(value - minutes * 60)).slice(-2);
  }


  //for HH:MM:SS format

  // transform(value: number): string {
  //   const hours: number = Math.floor(value / 3600);
  //   const minutes: number = Math.floor((value % 3600) / 60);
  //   return ('00' + hours).slice(-2) + ':' + ('00' + minutes).slice(-2) + ':' + ('00' + Math.floor(value - minutes * 60)).slice(-2);
  // }


}
