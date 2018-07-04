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
import { RegisterPage } from '../register/register';
@Component({
  selector: 'page-enter-otp',
  templateUrl: 'enter-otp.html'
})
export class EnterOTPPage implements OnInit {

  confirmpasswordMessage: string;
  passwordMessage: string;
  SavePasswordForm: FormGroup;
  formgroup: FormGroup;
  userMessage: string;
  ShowUserNameAndOldPassword: boolean;
  ChangePasswordForm: FormGroup;
  mobilenoMessage: string;
  oldPasswordMessage: string;
  isForgotten: boolean;
  constructor(private uiService: UISercice, private toastrService: ToastrService, public navParams: NavParams, public loadingController: LoadingController, private fb: FormBuilder, public navCtrl: NavController, private registerService: RegisterService) {
    this.formgroup = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(4)]]
    });
    const otpControl = this.formgroup.get('otp');
    otpControl.valueChanges.subscribe(value => this.setErrorMessageForOTPField(otpControl));

    this.SavePasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmpwd: ['', [Validators.required, Validators.minLength(4)]]
    }, { validator: this.matchingPasswords });
    const passwordControl = this.SavePasswordForm.get('password');
    passwordControl.valueChanges.subscribe(value => this.setErrorMessageForPasswordField(passwordControl));

    const confirmpasswordControl = this.SavePasswordForm.get('confirmpwd');
    confirmpasswordControl.valueChanges.subscribe(value => this.setErrorMessageForPasswordField(confirmpasswordControl));

    this.ChangePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(4)]],
      confirmNewpwd: ['', [Validators.required, Validators.minLength(4)]]
    }, { validator: this.matchingPasswordsForCP });

    const oldPasswordControl = this.ChangePasswordForm.get('oldPassword');
    oldPasswordControl.valueChanges.subscribe(value => this.setErrorMessageForChangePasswordForm(oldPasswordControl));

    const passwordControl_CP = this.ChangePasswordForm.get('newPassword');
    passwordControl_CP.valueChanges.subscribe(value => this.setErrorMessageForChangePasswordForm(passwordControl_CP));

    const confirmpasswordControl_CP = this.ChangePasswordForm.get('confirmNewpwd');
    confirmpasswordControl_CP.valueChanges.subscribe(value => this.setErrorMessageForChangePasswordForm(confirmpasswordControl_CP));
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
    this.passwordMessage = '';
    this.confirmpasswordMessage = '';
    let control = this.uiService.getControlName(c);
    if ((c.touched || c.dirty) && c.errors) {
      if (control === 'password') {
        this.passwordMessage = Object.keys(c.errors).map(key => this.validationMessages[control + '_' + key]).join(' ');
      }
      else if (control === 'confirmpwd') {
        this.confirmpasswordMessage = Object.keys(c.errors).map(key => this.validationMessages[control + '_' + key]).join(' ');
      }
    }
  }
  setErrorMessageForChangePasswordForm(c: AbstractControl): void {
    this.oldPasswordMessage = '';
    this.passwordMessage = '';
    this.confirmpasswordMessage = '';
    let control = this.uiService.getControlName(c);
    if ((c.touched || c.dirty) && c.errors) {
      if (control === 'oldPassword') {
        this.oldPasswordMessage = Object.keys(c.errors).map(key => this.validationMessages[control + '_' + key]).join(' ');
      }
      else if (control === 'newPassword') {
        this.passwordMessage = Object.keys(c.errors).map(key => this.validationMessages[control + '_' + key]).join(' ');
      }
      else if (control === 'confirmNewpwd') {
        this.confirmpasswordMessage = Object.keys(c.errors).map(key => this.validationMessages[control + '_' + key]).join(' ');
      }
    }
  }
  private validationMessages = {
    otp_required: '*Enter OTP Number',
    otp_minlength: 'Enter 4 digits',

    oldPassword_required: '*Please Enter Old Password',
    oldPassword_minlength: 'Mobile Number cannot be less than 4 characters',

    password_required: 'Please enter password',
    password_minlength: 'Enter minimum 4 digits',

    confirmpwd_required: 'Please Re-Enter password',
    confirmpwd_minlength: 'This field should match with Password',
    confirmpwd_invalid: 'Password doesnot match'
  };

  countDown;
  counter = 40;
  tick = 1000;
  ngOnInit() {

    // this.countDown = Observable.timer(0, this.tick)
    //   .take(this.counter)
    //   .map(() => --this.counter);
    this.ShowIf = this.navParams.get('ischangePassword');
    if (this.ShowIf == null) {
      this.ShowIf == false;
      this.ShowUserNameAndOldPassword = false;
    }
    else if (this.ShowIf == true) {
      this.HideIf = false;
      this.ShowUserNameAndOldPassword = true;
      this.ShowIf = false;
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
  matchingPasswordsForCP(group: FormGroup) { // here we have the 'passwords' group
    let password = group.controls.newPassword.value;
    let confirmpwd = group.controls.confirmNewpwd.value;
    if (!password || !confirmpwd) {
      return null;
    }
    return password === confirmpwd ? null : { notSame: true }
  }
  storeboolean: boolean;
  ShowIf: boolean;
  HideIf = true;
  postOPT: PostOPT;
  OnSubmit() {
    let OTPRefNo = this.navParams.get('OTPRefNo');
    let loading = this.loadingController.create({
      content: 'Please wait till the screen loads'
    });

    loading.present();
    const postOPT = {
      TenantId: this.registerService.TenantId,  //ActiveTenantId
      MobileNo: this.registerService.MobileNo,
      OTPRef: OTPRefNo,
      OTP: this.formgroup.get('otp').value
    }
    this.registerService.ValidateOTP(postOPT).subscribe((data: any) => {
      this.storeboolean = data;
      if (this.storeboolean == true) {
        this.ShowIf = true;
        this.HideIf = false;
        this.ShowUserNameAndOldPassword = false;
      } else {
        this.ShowIf = false;
        this.HideIf = true;
        this.toastrService.error("OTP is Invalid", 'Error!')
        this.formgroup.get('otp').reset();
      }
    })
    loading.dismiss();
  }

  OnResendOTP() {
    let loading = this.loadingController.create({
      content: 'Please wait till the screen loads'
    });
    loading.present();
    let oTPRequest = {
      TenantId: this.navParams.get('TenantId').value,
      MobileNo: this.navParams.get('MobileNo').value
    }
    this.registerService.RequestOTP(oTPRequest).subscribe((data: any) => {

      //ADDED toastr.css in the path "node_modules/ngx-toastr/toastr.css" from https://github.com/scttcper/ngx-toastr/blob/master/src/lib/toastr.css
      this.toastrService.success('OTP Sent to ' + data.MobileNo + ' with Reference No. ' + data.OTPRefNo, 'Success!');
      loading.dismiss();
    }, (error) => {
      this.toastrService.error(error.error.ExceptionMessage, 'Error!')
    });
  }

  OnSavePassword() {
    var DigiPartyId = this.navParams.get('DigiPartyId');

    var userPost = {
      DigiPartyId: DigiPartyId,
      TenantId: this.registerService.TenantId,  //ActiveTenantId
      PIN: this.SavePasswordForm.controls['confirmpwd'].value,
      UniqueId: this.guid(),
      OTPRef: this.navParams.get('OTPRefNo'),
      OTP: this.formgroup.get('otp').value,
      MobileNo: this.registerService.MobileNo
    }

    let loading = this.loadingController.create({
      content: 'Please wait while registering the Password......'
    });
    loading.present();

    this.registerService.SaveMPin(userPost).subscribe((data: any) => {

      const user = {
        ActiveTenantId: this.registerService.TenantId,
        UserId: data.UserId,
        UserName: data.UserName,
        UniqueKey: data.UniqueKey
      }
      StorageService.SetUser(JSON.stringify(user));
      this.navCtrl.push(LoginPage);
      loading.dismiss();

    }, (error) => {
      this.toastrService.error(error.error.ExceptionMessage, 'Error!')

    });

  }


  OnChangePassword() {
    var changePassword = {
      UserName: StorageService.GetUser().UserName,
      Old: this.ChangePasswordForm.get('oldPassword').value,
      New: this.ChangePasswordForm.get('confirmNewpwd').value
    }
    let loading = this.loadingController.create({
      content: 'Please wait while we Change Password....'
    });
    loading.present();

    this.registerService.ChangePassword(changePassword).subscribe((data: any) => {
      if (data.IsValid == false) {
        this.toastrService.error(data.Message, 'Error!');
      }
      else {
        this.toastrService.success('Please login with the New Password', 'Success!');
        this.navCtrl.push(LoginPage);
      }
      loading.dismiss();
    }, (error) => {
      this.toastrService.error(error.error.ExceptionMessage, 'Error!')

    });

  }
  OnForgot() {
    this.isForgotten = true;
    this.navCtrl.push(RegisterPage, { 'isForgotPassword': this.isForgotten });
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
