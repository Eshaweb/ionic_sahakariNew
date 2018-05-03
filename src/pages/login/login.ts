import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { MobileRechargePage } from '../mobile-recharge/mobile-recharge';
import { BankingPage } from '../banking/banking';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { RegisterService } from '../services/app-data.service';
//import { HttpErrorResponse } from '@angular/common/http';
import { PagePage } from '../page/page';
//import { Observable } from "rxjs/Observable";
//import { TokenParams } from '../View Models/TokenParams';
import { SCRequest } from '../View Models/SCRequest';
import { StorageService } from '../services/Storage_Service';
import { ConstantService } from '../services/Constants';
import { User } from '../LocalStorageTables/User';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage implements OnInit {
  TenantId: any;
  PartyMastId: any;
  username=JSON.parse(localStorage.getItem(this.constant.DB.User)).UserName;
  user:User;
  uniqueKey=JSON.parse(StorageService.GetItem(this.constant.DB.User)).UniqueKey;
  ActiveBankName=JSON.parse(StorageService.GetItem(this.constant.DB.User)).ActiveTenantName;
  userTokenData: any;
  tokendata: any;
  SCReq: any;
  OS: string;
  scr: SCRequest;
  UToken: any;
  isLoginError: boolean;
  formgroup:FormGroup;
  pword:AbstractControl;
  //userName=this.regService.userresult.UserName;

  constructor(public constant:ConstantService,public loadingController: LoadingController,public formbuilder:FormBuilder, private regService : RegisterService, public navCtrl: NavController) {
    this.formgroup = formbuilder.group({
      pword:['',[Validators.required,Validators.minLength(4)]]

    });
    this.pword = this.formgroup.controls['pword'];
  }
  ngOnInit() {

 }
  OnSubmit(password){
    let loading = this.loadingController.create({
      content: 'Please wait till the screen loads'
    });

    loading.present();
    var param1=JSON.parse(localStorage.getItem(this.constant.DB.OS));
    var param2=JSON.parse(localStorage.getItem(this.constant.DB.SelfCareAc));
    //var param3="UserName";
    //var param4="unique";
      //this.regService.loginbyHttpClient(StorageService.GetItem(param3), password,StorageService.GetItem(param4)).subscribe((data : any)=>{       
                //this.regService.loginbyHttpClient(StorageService.GetItem(this.constant.GetUserKey.UserName), password,StorageService.GetItem(this.constant.GetUserKey.UniqueKey)).subscribe((data : any)=>{        
      //this.regService.loginbyHttpClient(this.constant.GetUserKey.UserName, password,this.constant.GetUserKey.UniqueKey).subscribe((data : any)=>{        
          //this.regService.loginbyHttpClient(this.user.UserName, password,this.user.UniqueKey).subscribe((data : any)=>{        
            this.regService.loginbyHttpClient(this.username, password,this.uniqueKey).subscribe((data : any)=>{        

        this.userTokenData=data;
          this.regService.userToken=this.userTokenData.access_token;
          localStorage.setItem('userToken',this.userTokenData.access_token);
          // LocalStorageService.SetAuthorizationData(data.access_token);
        //if(localStorage.getItem("OSKey")==null||localStorage.getItem("SelfCareAcKey")==null)
          if(param1==null||param2==null){
          this.callservices();
          }
          setTimeout(() => {
            this.navCtrl.push(PagePage, { 'ActiveBankName': this.ActiveBankName });
          }, 1000);
                 
          setTimeout(() => {
            loading.dismiss();
          }, 2000); 
      });
      
  }


  callservices(){
    this.regService.getservicesByHttpclient().subscribe((data: any) => {
          this.OS=JSON.stringify(data);
          StorageService.SetItem(this.constant.DB.OS,this.OS);

      });
      this.PartyMastId=JSON.parse(StorageService.GetItem(this.constant.DB.DigiParty)).PartyMastId;
      this.TenantId=JSON.parse(StorageService.GetItem(this.constant.DB.DigiParty)).TenantId;      
      this.scr={
              // PartyMastId:localStorage.getItem('PartyMastId'),
              PartyMastId:this.PartyMastId,
              TenantId:this.TenantId
            }
      
            this.regService.getAccountsbyHttpClient(this.scr).subscribe((data: any) => {
            this.SCReq=JSON.stringify(data);
            StorageService.SetItem(this.constant.DB.SelfCareAc,this.SCReq)

            });
  }
             
    

  goToHome(params){
    if (!params) params = {};
    this.navCtrl.push(HomePage);
  }
  goToMobileRecharge(params){
    if (!params) params = {};
    this.navCtrl.push(MobileRechargePage);
  }
  goToBanking(params){
    if (!params) params = {};
    this.navCtrl.push(BankingPage);
  }
}
