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
import { AddBankResponse } from '../View Models/AddBankResponse';
import { AddBankRequest } from '../View Models/AddBankRequest';
import { SelfCareAc } from '../LocalStorageTables/SelfCareAc';
import { DigiParty } from '../LocalStorageTables/DigiParty';
import { Tenant } from '../LocalStorageTables/Tenant';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage implements OnInit {
  ActiveBankName: any;
  addbankresponse: AddBankResponse;
  addbankreq: AddBankRequest;
  SelfCareAc: SelfCareAc;
  DigiParty: DigiParty;
  Tenant: Tenant;
  SelfCareAcs: SelfCareAc;
  DigiParties: DigiParty;
  Tenants: Tenant;
  TenantId: any;
  PartyMastId: any;
  username = JSON.parse(localStorage.getItem(this.constant.DB.User)).UserName;
  user: User;
  uniqueKey = JSON.parse(StorageService.GetItem(this.constant.DB.User)).UniqueKey;
  //ActiveBankName=JSON.parse(StorageService.GetItem(this.constant.DB.User)).ActiveTenantName;
  userTokenData: any;
  tokendata: any;
  SCReq: any;
  OS: string;
  scr: SCRequest;
  UToken: any;
  isLoginError: boolean;
  formgroup: FormGroup;
  pword: AbstractControl;

  //userName=this.regService.userresult.UserName;

  constructor(public constant: ConstantService, public loadingController: LoadingController, public formbuilder: FormBuilder, private regService: RegisterService, public navCtrl: NavController) {
    this.formgroup = formbuilder.group({
      pword: ['', [Validators.required, Validators.minLength(4)]]

    });
    this.pword = this.formgroup.controls['pword'];
  }
  ngOnInit() {
    if (StorageService.GetItem(this.constant.DB.Tenant) != null) {
      var ActiveTenantId = JSON.parse(StorageService.GetItem(this.constant.DB.User)).ActiveTenantId;
      this.Tenants = JSON.parse(StorageService.GetItem(this.constant.DB.Tenant));
      this.Tenant = this.Tenants.find(function (obj) { return obj.Id === ActiveTenantId; });
      this.ActiveBankName = this.Tenant.Name;
    }

  }
  OnLogin(password) {
    let loading = this.loadingController.create({
      content: 'Wait for a second..'
    });  
    loading.present();
    var OS = JSON.parse(localStorage.getItem(this.constant.DB.OS));
    var SelfCareAc = JSON.parse(localStorage.getItem(this.constant.DB.SelfCareAc));
    this.regService.loginbyHttpClient(this.username, password, this.uniqueKey).subscribe((data: any) => {
      this.userTokenData = data;
      this.regService.userToken = this.userTokenData.access_token;
      localStorage.setItem('userToken', this.userTokenData.access_token);

      if (OS == null) {
        let loading = this.loadingController.create({
          content: 'Syncing Operators and Services'
        });  
        loading.present();
        this.regService.GetServices().subscribe((data: any) => {
          this.OS = JSON.stringify(data);
          StorageService.SetItem(this.constant.DB.OS, this.OS);

        });
        loading.dismiss();
      }
      
      // var ActiveTenantId=this.regService.TenantId;
      this.Tenants = JSON.parse(StorageService.GetItem(this.constant.DB.Tenant));
      // this.Tenant= this.Tenants.filter(function (obj) { return obj.Id === ActiveTenantId; });
      this.DigiParties = JSON.parse(StorageService.GetItem(this.constant.DB.DigiParty));
      // this.DigiParty=this.DigiParties.filter(function (obj) { return obj.Id === ActiveTenantId; });
      this.SelfCareAcs = JSON.parse(StorageService.GetItem(this.constant.DB.SelfCareAc));
      // this.SelfCareAc=this.SelfCareAcs.filter(function (obj) { return obj.Id === ActiveTenantId; });
      if (this.Tenants == null || this.DigiParties == null || this.SelfCareAcs == null) {
        let loadingnew = this.loadingController.create({
          content: 'Syncing Accounts'
        });
        loadingnew.present();
        this.callservices();
        setTimeout(() => {
          loadingnew.dismiss();
        }, 1500);
      }
      // if(this.Tenant==null||this.DigiParty==null||this.SelfCareAc==null){
      //      this.callservices();
      //   }
      //  setTimeout(() => {
      //  loading.dismiss();
      //  }, 2000);
      
      setTimeout(() => {
        //this.navCtrl.push(PagePage, { 'ActiveBankName': this.ActiveBankName });
        this.navCtrl.setRoot(PagePage, { 'ActiveBankName': this.ActiveBankName });
      }, 1000);
    });
    setTimeout(() => {
       loading.dismiss();
       }, 2000);
  }


  callservices() {
    this.addbankreq = {
      TenantId: JSON.parse(StorageService.GetItem(this.constant.DB.User)).ActiveTenantId,
      MobileNo: JSON.parse(StorageService.GetItem(this.constant.DB.User)).UserName
    }
    this.regService.AddBank(this.addbankreq).subscribe((data: any) => {
      this.addbankresponse = data;
      this.Tenant = {
        Id: this.addbankresponse.Tenant.Id,
        //TenantId:this.addbankresponse.Tenant.TenantId,   //ActiveTenantId
        Name: this.addbankresponse.Tenant.Name,
        Address: this.addbankresponse.Tenant.Address,
        IconHtml: this.addbankresponse.Tenant.IconHtml
      }
      StorageService.SetItem(this.constant.DB.Tenant, JSON.stringify([this.Tenant]));  //Works, But not as of reqment

      this.DigiParty = {
        Id: this.addbankresponse.DigiPartyId,
        DigiPartyId: this.addbankresponse.DigiPartyId,
        PartyMastId: this.addbankresponse.PartyMastId,
        MobileNo: this.addbankresponse.MobileNo,
        TenantId: this.addbankresponse.TenantId,  //ActiveTenantId
        Name: this.addbankresponse.Name
      }
      StorageService.SetItem(this.constant.DB.DigiParty, JSON.stringify([this.DigiParty]));  //Works, But not as of reqment
      StorageService.SetItem(this.constant.DB.SelfCareAc, JSON.stringify(this.addbankresponse.SelfCareAcs))
    });

  }

  goToHome(params) {
    if (!params) params = {};
    this.navCtrl.push(HomePage);
  }
  goToMobileRecharge(params) {
    if (!params) params = {};
    this.navCtrl.push(MobileRechargePage);
  }
  goToBanking(params) {
    if (!params) params = {};
    this.navCtrl.push(BankingPage);
  }
}
