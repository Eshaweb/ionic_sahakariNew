import { Component } from '@angular/core';
import { LoadingController,NavController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { MobileRechargePage } from '../mobile-recharge/mobile-recharge';
import { BankingPage } from '../banking/banking';
import { RegisterService } from '../services/app-data.service';
import { PostOPT } from '../View Models/PostOPT';
import { NewPasswordEntry } from '../View Models/NewPasswordEntry';
import { FormBuilder, FormGroup, Validators,AbstractControl } from '@angular/forms';
//import { Validator, NG_VALIDATORS } from '@angular/forms';
import { UserPost } from '../View Models/UserPost';
//import { Directive, forwardRef, Attribute } from '@angular/core';
//import { ValidatorFn } from '@angular/forms';
import { UserResult } from '../View Models/UserResult';
import "rxjs/add/operator/debounceTime";
import { LoginPage } from '../login/login';
import { StorageService } from '../services/Storage_Service';
import { ConstantService }  from "../services/Constants";
import { User } from '../LocalStorageTables/User';
import { Tenant } from '../LocalStorageTables/Tenant';
@Component({
  selector: 'page-enter-otp',
  templateUrl: 'enter-otp.html'
})
export class EnterOTPPage {
  Tenant: Tenant;
  User: User;
  pin: any;
  userresult: UserResult;
  storeboolean: any;
  showHide:boolean;
  postingotp: PostOPT;
  otpno: any;
  npef:NewPasswordEntry;
  SavePasswordForm: FormGroup;
  formgroup:FormGroup;
  userpost:UserPost;
  otp:AbstractControl;
  password:AbstractControl;
  confirmpwd:AbstractControl;
  constructor(public constant:ConstantService,public loadingController: LoadingController,private fb: FormBuilder, public navCtrl: NavController, private regService : RegisterService) {
  
this.formgroup = this.fb.group({
  otp:['',[Validators.required,Validators.minLength(4)]]
});
this.otp = this.formgroup.controls['otp'];

this.SavePasswordForm = this.fb.group({
  password:['',[Validators.required,Validators.minLength(4)]],
  confirmpwd:['',[Validators.required,Validators.minLength(4)]]
},{validator: this.matchingPasswords});

this.password = this.SavePasswordForm.controls['password'];
this.confirmpwd = this.SavePasswordForm.controls['confirmpwd'];

  }
  
  matchingPasswords(group: FormGroup) { // here we have the 'passwords' group
  let password = group.controls.password.value;
  let confirmpwd = group.controls.confirmpwd.value;

  return password === confirmpwd ? null : { notSame: true }     
}
 
  OnSubmit(otpno){
    let loading = this.loadingController.create({
      content: 'Please wait till the screen loads'
    });

    loading.present();

    this.otpno=otpno;
    this.postingotp={
      TenantId:this.regService.store.TenantId,  //ActiveTenantId
      PartyMastId:this.regService.store.PartyMastId,
      OTPRef:this.regService.store.OTPRef,
      OTP:this.otpno
    }
    this.regService.ValidatingOTP(this.postingotp).subscribe((data:any)=>{
      this.storeboolean=data;  
      this.showHide=true;   
    })   
    
    setTimeout(() => {
      loading.dismiss();
    }, 4000); 
}

OnPress(pin){
  this.pin=pin;
  this.userpost={

    DigiPartyId: this.regService.store.DigiPartyId,
    TenantId: this.regService.store.TenantId,  //ActiveTenantId
    PIN:this.pin,
    PartyMastId: this.regService.store.PartyMastId,
    //UniqueId:userposting.UniqueId,
    //UniqueId:this.guid.str,
    UniqueId:this.guid(),
    OTPRef:this.regService.store.OTPRef,
    OTP:this.otpno,
    MobileNo: this.regService.store.MobileNo
  }
 
  let loading = this.loadingController.create({
    content: 'Please wait for a minute......'
  });
  loading.present();

  this.regService.SaveMPin(this.userpost).subscribe((data:any)=>{
this.userresult=data;
this.User={
  ActiveTenantId:this.regService.store.TenantId,
  //ActiveTenantId:data.TenantId,
  ActiveTenantName:data.TenantName,
  UserId:data.UserId,
  UserName:data.UserName,
  UniqueKey:data.UniqueKey
}
this.Tenant={
  Id:data.UserId,
  TenantId:data.TenantId,   //ActiveTenantId
  Name:data.TenantName,
  Address:data.TenantAddress,
  Logo:this.regService.Logo
}
//StorageService.SetItem(this.constant.UserKey,User);
//StorageService.SetItem("UserKey",JSON.stringify(this.User));  //Works, But not as of reqment
StorageService.SetItem(this.constant.DB.User,JSON.stringify(this.User));  //Works, But not as of reqment
StorageService.SetItem(this.constant.DB.Tenant,JSON.stringify([this.Tenant]));  //Works, But not as of reqment
//StorageService.SetItem(this.constant.UserKey,this.User);  //Not Works 
//StorageService.RemoveItem(this.constant.UserKey);  //Not Works 

setTimeout(() => {
  this.navCtrl.push(LoginPage);
}, 1000);

setTimeout(() => {
  loading.dismiss();
}, 4000);

  })
   
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

  goToHome(params){
    if (!params) params = {};
    this.navCtrl.push(HomePage);
  }goToMobileRecharge(params){
    if (!params) params = {};
    this.navCtrl.push(MobileRechargePage);
  }goToBanking(params){
    if (!params) params = {};
    this.navCtrl.push(BankingPage);
  }
}
