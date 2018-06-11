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
@Component({
  selector: 'page-enter-otp',
  templateUrl: 'enter-otp.html'
})
export class EnterOTPPage implements OnInit{
  
  //Tenant: Tenant;
  
  SavePasswordForm: FormGroup;
  formgroup: FormGroup;
  otp: AbstractControl;
  password: AbstractControl;
  confirmpwd: AbstractControl;
  constructor(private toastrService: ToastrService,public navParams: NavParams, public loadingController: LoadingController, private fb: FormBuilder, public navCtrl: NavController, private registerService: RegisterService) {
    this.formgroup = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(4)]]
    });
    this.otp = this.formgroup.controls['otp'];

    this.SavePasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmpwd: ['', [Validators.required, Validators.minLength(4)]]
    }, { validator: this.matchingPasswords });

    this.password = this.SavePasswordForm.controls['password'];
    this.confirmpwd = this.SavePasswordForm.controls['confirmpwd'];
    this.password
      .valueChanges
      .debounceTime(100)
      .distinctUntilChanged()
      .subscribe(val => {
        if (val && val.length < 4) {
          this.password.setErrors({ minlength: true });
        }
      });
    this.confirmpwd
      .valueChanges
      .debounceTime(100)
      .distinctUntilChanged()
      .subscribe(val => {
        if (val && val.length < 4) {
          this.confirmpwd.setErrors({ minlength: true });
        }
      });
  }

  OTPRefNo: string;
  MobileNo:string;
  TenantId:string;
  countDown;
  counter = 10;
  tick = 1000;
  ngOnInit() {
    this.OTPRefNo=this.navParams.get('OTPRefNo');
    this.TenantId=this.navParams.get('TenantId');
    this.MobileNo=this.navParams.get('MobileNo');
    // this.countDown = Observable.timer(0, this.tick)
    //   .take(this.counter)
    //   .map(() => --this.counter);

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
  otpno: any;
  storeboolean: boolean;
  ShowIf: boolean;
  HideIf= true;
  postOPT: PostOPT;
  OnSubmit(otpno) {
    let loading = this.loadingController.create({
      content: 'Please wait till the screen loads'
    });

    loading.present();

    this.otpno = otpno;
    this.postOPT = {
      TenantId: this.registerService.TenantId,  //ActiveTenantId
      MobileNo: this.registerService.MobileNo,
      OTPRef: this.OTPRefNo,
      OTP: this.otpno
    }
    this.registerService.ValidateOTP(this.postOPT).subscribe((data: any) => {
      this.storeboolean = data;
      if(this.storeboolean==true){
        this.ShowIf = true;
        this.HideIf = false;
      }else{
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

  OnResendOTP(){
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
      this.OTPRefNo=data.OTPRef;
      //ADDED toastr.css in the path "node_modules/ngx-toastr/toastr.css" from https://github.com/scttcper/ngx-toastr/blob/master/src/lib/toastr.css
      this.toastrService.success('OTP Sent to ' + this.digiCustWithOTPRefNo.MobileNo + ' with Reference No. ' + this.OTPRefNo, 'Success!');
      loading.dismiss();
  },(error) => {this.toastrService.error(error.error.ExceptionMessage, 'Error!')
});
}
  user: User;
  pin: any;
  userResult: UserResult;
  userPost: UserPost;

  OnSavePassword(pin) {
    this.pin = pin;
    this.userPost = {
      TenantId: this.registerService.TenantId,  //ActiveTenantId
      PIN: this.pin,
      UniqueId: this.guid(),
      OTPRef: this.OTPRefNo,
      OTP: this.otpno,
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

    },(error) => {this.toastrService.error(error.error.ExceptionMessage, 'Error!')

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
