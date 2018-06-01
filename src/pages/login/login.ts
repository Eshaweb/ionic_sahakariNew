import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { MobileRechargePage } from '../mobile-recharge/mobile-recharge';
import { BankingPage } from '../banking/banking';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { RegisterService } from '../services/app-data.service';
import { PagePage } from '../page/page';
import { StorageService } from '../services/Storage_Service';
import { AddBankResponse } from '../View Models/AddBankResponse';
import { AddBankRequest } from '../View Models/AddBankRequest';
import { SelfCareAc } from '../LocalStorageTables/SelfCareAc';
import { DigiParty } from '../LocalStorageTables/DigiParty';
import { Tenant } from '../LocalStorageTables/Tenant';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage implements OnInit { 
  formGroup: FormGroup;
  pword: AbstractControl;

  constructor(private toastrService: ToastrService, public loadingController: LoadingController, public formbuilder: FormBuilder, private registerService: RegisterService, public navCtrl: NavController) {
    this.formGroup = formbuilder.group({
      pword: ['', [Validators.required, Validators.minLength(4)]]

    });
    this.pword = this.formGroup.controls['pword'];
  }

  ActiveBankName: string;
  ngOnInit() {
    if (StorageService.GetTenant()!= null) {
      this.ActiveBankName = StorageService.GetActiveBankName();
    }

  }
  SelfCareAcs: SelfCareAc;
  DigiParties: DigiParty;
  tenant: Tenant;
  tenants: Tenant;
  userName = JSON.parse(StorageService.GetUser()).UserName;
  uniqueKey = JSON.parse(StorageService.GetUser()).UniqueKey;
  userTokenData: any;
  oS: string;
  OnLogin(password) {
    let loading = this.loadingController.create({
      content: 'Wait for a second..'
    });  
    loading.present();
    var OS = JSON.parse(StorageService.GetOS());
    var SelfCareAc = JSON.parse(StorageService.GetSelfCareAc());
    this.registerService.loginbyHttpClient(this.userName, password, this.uniqueKey).subscribe((data: any) => {
      this.userTokenData = data;
      this.registerService.userToken = this.userTokenData.access_token;
      StorageService.SetItem('userToken', this.userTokenData.access_token);

      if (OS == null) {
        let loading = this.loadingController.create({
          content: 'Syncing Operators and Services'
        });  
        loading.present();
        this.registerService.GetServices().subscribe((data: any) => {
          this.oS = JSON.stringify(data);
          StorageService.SetOS(this.oS);
        });
        loading.dismiss();
      }
      
      // var ActiveTenantId=this.regService.TenantId;
      this.tenants = JSON.parse(StorageService.GetTenant());
      // this.Tenant= this.Tenants.filter(function (obj) { return obj.Id === ActiveTenantId; });
      this.DigiParties = JSON.parse(StorageService.GetDigiParty());
      // this.DigiParty=this.DigiParties.filter(function (obj) { return obj.Id === ActiveTenantId; });
      this.SelfCareAcs = JSON.parse(StorageService.GetSelfCareAc());
      // this.SelfCareAc=this.SelfCareAcs.filter(function (obj) { return obj.Id === ActiveTenantId; });
      if (this.tenants == null || this.DigiParties == null || this.SelfCareAcs == null) {
        let loadingnew = this.loadingController.create({
          content: 'Syncing Accounts'
        });
        loadingnew.present();
        this.callservices();
          loadingnew.dismiss();
      }
      // if(this.Tenant==null||this.DigiParty==null||this.SelfCareAc==null){
      //      this.callservices();
      //   }
      //  setTimeout(() => {
      //  loading.dismiss();
      //  }, 2000);
      
        //this.navCtrl.push(PagePage);
    },(error) => {this.toastrService.error(error.error.ExceptionMessage, 'Error!')

  });
      //this.navCtrl.setRoot(PagePage, { 'ActiveBankName': this.ActiveBankName });
       loading.dismiss();
  }

 addBankResponse: AddBankResponse;
 addBankRequest: AddBankRequest;
 digiParty: DigiParty;

  callservices() {
    this.addBankRequest = {
      TenantId: JSON.parse(StorageService.GetUser()).ActiveTenantId,
      MobileNo: JSON.parse(StorageService.GetUser()).UserName
    }
    this.registerService.AddBank(this.addBankRequest).subscribe((data: any) => {
      this.addBankResponse = data;
      this.tenant = {
        Id: this.addBankResponse.Tenant.Id,
        //TenantId:this.addbankresponse.Tenant.TenantId,   //ActiveTenantId
        Name: this.addBankResponse.Tenant.Name,
        Address: this.addBankResponse.Tenant.Address,
        IconHtml: this.addBankResponse.Tenant.IconHtml
      }
      StorageService.SetTenant(JSON.stringify([this.tenant]));
      this.digiParty = {
        Id: this.addBankResponse.DigiPartyId,
        DigiPartyId: this.addBankResponse.DigiPartyId,
        PartyMastId: this.addBankResponse.PartyMastId,
        MobileNo: this.addBankResponse.MobileNo,
        TenantId: this.addBankResponse.TenantId,  //ActiveTenantId
        Name: this.addBankResponse.Name
      }
      StorageService.SetDigiParty(JSON.stringify([this.digiParty]));
      StorageService.SetSelfCareAc(JSON.stringify(this.addBankResponse.SelfCareAcs));
      this.navCtrl.setRoot(PagePage, { 'ActiveBankName': this.ActiveBankName });

    },(error) => {this.toastrService.error(error.error.ExceptionMessage, 'Error!')

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
