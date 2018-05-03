import { Component, OnInit} from '@angular/core';
import {LoadingController, NavController, Form } from 'ionic-angular';
//import { BankListPage } from '../bank-list/bank-list';
import { EnterOTPPage } from '../enter-otp/enter-otp';
import { HomePage } from '../home/home';
import { MobileRechargePage } from '../mobile-recharge/mobile-recharge';
import { BankingPage } from '../banking/banking';
import { RegisterService } from '../services/app-data.service';
import { HttpErrorResponse } from '@angular/common/http';
//import { NgForm } from '@angular/forms';
import { User } from '../View Models/user.model';
//import { userClaims } from '../services/userClaims.model';
import { UserClaim } from '../View Models/userclaim';
import { Registervm } from '../View Models/register.vm';
import { OTPRequest } from '../View Models/OTPrequest.vm';
import { ToastrService } from 'ngx-toastr';
import { Toast } from '@ionic-native/toast';
import { ToastController } from 'ionic-angular';
import {Platform} from 'ionic-angular';
import{ DigiCustWithOTPRefNo }from '../View Models/DigiCustWithOTPRefNo';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { DigiParty } from '../LocalStorageTables/DigiParty';
import { StorageService } from '../services/Storage_Service';
import { ConstantService } from '../services/Constants';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage implements OnInit{
  TenantIdActive: any;
  DigiParty: DigiParty;
  OTPreq:OTPRequest;
  mobno: any;
  store: DigiCustWithOTPRefNo;
   registervm: Registervm;
  //userClaims : UserClaim[];
  userClaims : UserClaim;
  isLoginError : boolean = false;
  user:User;
  errorMessage: string;
  messages: string[] = [];
  formgroup:FormGroup;
  mobilenum:AbstractControl;
  lastname:AbstractControl;
  //public loading = Loading.create();
  
constructor(public constant:ConstantService,public loadingController: LoadingController,public formbuilder:FormBuilder, private platform:Platform,private toastCtrl: ToastController, private toast: Toast, private toastr: ToastrService, private regService : RegisterService, public navCtrl: NavController) {

  this.formgroup = formbuilder.group({
    mobilenum:['',[Validators.required,Validators.minLength(10)]]
  });

  this.mobilenum = this.formgroup.controls['mobilenum'];
  let loader = this.loadingController.create({
    content: "Page Loading....."
  });  
  loader.present();
  setTimeout(() => {
    loader.dismiss();
  }, 2000); }

  OnSubmit(mobno){
    let loading = this.loadingController.create({
      content: 'Please wait till the screen loads'
    });

    loading.present();

    this.mobno=mobno;
    this.userClaims=null;
    this.regService.sendMobileNo(mobno).subscribe((data : any)=>{
    this.userClaims = data;   //got tenantlist from server
    this.userClaims.Id=data[0].Id;
      //this.navCtrl.push(HomePage);
      

      setTimeout(() => {
        loading.dismiss();
      }, 4000); 
},
(err : HttpErrorResponse)=>{
  this.isLoginError = true;
});
    
}

OnPress(Id){
this.TenantIdActive=Id;
  this.OTPreq={
    TenantId:this.TenantIdActive,
    MobileNo:this.mobno
  }
  this.regService.requestingOTP(this.OTPreq).subscribe((data:any)=>{
    this.store=data;
    this.DigiParty={
      Id:data.DigiPartyId,
      DigiPartyId:data.DigiPartyId,
      PartyMastId:data.PartyMastId,
      MobileNo:data.MobileNo,
      TenantId:data.TenantId,  //ActiveTenantId
      Name:data.Name
    }
    this.store.OTPRef=data.OTPRef;
    
    //this.toastr.success('You are awesome!'+data._body, 'Success!');
    
    //ADDED toastr.css in the path "node_modules/ngx-toastr/toastr.css" from https://github.com/scttcper/ngx-toastr/blob/master/src/lib/toastr.css
    this.toastr.success('OTP Sent to '+this.store.MobileNo+ ' with Reference No. '+this.store.OTPRef, 'Success!');
    StorageService.SetItem(this.constant.DB.DigiParty,JSON.stringify(this.DigiParty));  //Works, But not as of reqment
    //alert('You are awesome!'+ this.store.OTPRef+data._body);
    this.navCtrl.push(EnterOTPPage);
  },
  (err : HttpErrorResponse)=>{
    this.isLoginError = true;
  })


  
  
}

// private handleErrors(errors: any) {
//   this.messages = [];
//   for (let msg of errors) {
//       this.messages.push(msg);
//   }

// }
ngOnInit() {
  
   this.registervm = new Registervm();
}

  goToBankList(params){
    if (!params) params = {};
    this.navCtrl.push(HomePage);
  }goToEnterOTP(params){
    if (!params) params = {};
    this.navCtrl.push(EnterOTPPage);
  }goToHome(params){
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


