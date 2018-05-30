import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { MobileRechargePage } from '../mobile-recharge/mobile-recharge';
import { BankingPage } from '../banking/banking';
import { RegisterService } from '../services/app-data.service';
import { PostOPT } from '../View Models/PostOPT';
import { NewPasswordEntry } from '../View Models/NewPasswordEntry';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UserPost } from '../View Models/UserPost';
import { UserResult } from '../View Models/UserResult';
import "rxjs/add/operator/debounceTime";
import { LoginPage } from '../login/login';
import { StorageService } from '../services/Storage_Service';
import { ConstantService } from "../services/Constants";
import { User } from '../LocalStorageTables/User';
import { Tenant } from '../LocalStorageTables/Tenant';
import { ToastrService } from 'ngx-toastr';
import { OTPRequest } from '../View Models/OTPrequest.vm';
import { DigiCustWithOTPRefNo } from '../View Models/DigiCustWithOTPRefNo';
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
  constructor(private toastr: ToastrService,public navParams: NavParams,public constant: ConstantService, public loadingController: LoadingController, private fb: FormBuilder, public navCtrl: NavController, private regService: RegisterService) {
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
  ngOnInit() {
    this.OTPRefNo=this.navParams.get('OTPRefNo');
    this.TenantId=this.navParams.get('TenantId');
    this.MobileNo=this.navParams.get('MobileNo');
    }

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
  postingotp: PostOPT;
  OnSubmit(otpno) {
    let loading = this.loadingController.create({
      content: 'Please wait till the screen loads'
    });

    loading.present();

    this.otpno = otpno;
    this.postingotp = {
      TenantId: this.regService.TenantId,  //ActiveTenantId
      MobileNo: this.regService.MobileNo,
      OTPRef: this.OTPRefNo,
      OTP: this.otpno
    }
    this.regService.ValidateOTP(this.postingotp).subscribe((data: any) => {
      this.storeboolean = data;
      if(this.storeboolean==true){
        this.ShowIf = true;
        this.HideIf = false;
      }else{
        this.ShowIf = false;
        this.HideIf = true;
        this.toastr.error("OTP is Invalid", 'Error!')
      }
      
    })
      loading.dismiss();
  }
  OTPreq: OTPRequest;
  store: DigiCustWithOTPRefNo;

  OnResendOTP(){
    let loading = this.loadingController.create({
      content: 'Please wait till the screen loads'
    });
    loading.present();
    this.OTPreq = {
      TenantId: this.TenantId,
      MobileNo: this.MobileNo
    }
    this.regService.RequestOTP(this.OTPreq).subscribe((data: any) => {
      this.store = data;
      this.OTPRefNo=data.OTPRef;
      //ADDED toastr.css in the path "node_modules/ngx-toastr/toastr.css" from https://github.com/scttcper/ngx-toastr/blob/master/src/lib/toastr.css
      this.toastr.success('OTP Sent to ' + this.OTPreq.MobileNo + ' with Reference No. ' + this.OTPRefNo, 'Success!');
      loading.dismiss();
  },(error) => {this.toastr.error(error.error.ExceptionMessage, 'Error!')
});
}
  User: User;
  pin: any;
  userresult: UserResult;
  userpost: UserPost;

  OnSavePassword(pin) {
    this.pin = pin;
    this.userpost = {
      //DigiPartyId: this.regService.store.DigiPartyId,
      TenantId: this.regService.TenantId,  //ActiveTenantId
      PIN: this.pin,
      //PartyMastId: this.regService.store.PartyMastId,
      //UniqueId:userposting.UniqueId,
      //UniqueId:this.guid.str,
      UniqueId: this.guid(),
      OTPRef: this.OTPRefNo,
      OTP: this.otpno,
      MobileNo: this.regService.MobileNo
    }

    let loading = this.loadingController.create({
      content: 'Please wait for a minute......'
    });
    loading.present();

    this.regService.SaveMPin(this.userpost).subscribe((data: any) => {
      this.userresult = data;

      this.User = {
        ActiveTenantId: this.regService.TenantId,
        //ActiveTenantId:data.TenantId,
        //ActiveTenantName:"",
        UserId: data.UserId,
        UserName: data.UserName,
        UniqueKey: data.UniqueKey
      }

      //StorageService.SetItem(this.constant.DB.User, JSON.stringify(this.User));
       //localStorage.setItem("User", JSON.stringify(this.User));
       StorageService.SetUser(JSON.stringify(this.User));
      this.navCtrl.push(LoginPage);
        loading.dismiss();

    },(error) => {this.toastr.error(error.error.ExceptionMessage, 'Error!')

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
