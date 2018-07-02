import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
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
import { UISercice } from '../services/UIService';
import { RegisterPage } from '../register/register';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage implements OnInit {
  passwordMessage: string;
  formGroup: FormGroup;
  password: AbstractControl;

  constructor(private uiService: UISercice, public navParams: NavParams, private toastrService: ToastrService, public loadingController: LoadingController, public formbuilder: FormBuilder, private registerService: RegisterService, public navCtrl: NavController) {
    this.formGroup = formbuilder.group({
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
    this.password = this.formGroup.controls['password'];
    const userControl = this.formGroup.get('password');
    userControl.valueChanges.subscribe(value => this.setErrorMessage(userControl));
  }
  setErrorMessage(c: AbstractControl): void {
    this.passwordMessage = '';
    let control = this.uiService.getControlName(c);
    if ((c.touched || c.dirty) && c.errors) {
      if (control === 'password') {
        this.passwordMessage = Object.keys(c.errors).map(key => this.validationMessages[control + '_' + key]).join(' ');
      }
    }
  }
  private validationMessages = {
    password_required: '*Enter Password',
    password_minlength: 'Password cannot be less than 4 character'
  };
  ActiveBankName: string;
  ngOnInit() {
    if (StorageService.GetTenant() != null) {
      this.ActiveBankName = StorageService.GetActiveBankName();
    }

  }
  SelfCareAcs: SelfCareAc;
  DigiParties: DigiParty;
  tenant: Tenant;
  tenants: Tenant;
  userName = StorageService.GetUser().UserName;
  uniqueKey = StorageService.GetUser().UniqueKey;
  OnLogin() {
    let loading = this.loadingController.create({
      content: 'Wait for a second..'
    });
    loading.present();
    var OS = StorageService.GetOS();
    var SelfCareAc = StorageService.GetSelfCareAc();
    this.registerService.loginbyHttpClient(this.userName, this.password.value, this.uniqueKey).subscribe((data: any) => {
      var userTokenData = data;
      this.registerService.userToken = userTokenData.access_token;
      StorageService.SetItem('userToken', userTokenData.access_token);

      if (OS == null) {
        let loading = this.loadingController.create({
          content: 'Syncing Operators and Services'
        });
        loading.present();
        this.registerService.GetServices().subscribe((data: any) => {
          var oS = JSON.stringify(data);
          StorageService.SetOS(oS);
        });
        loading.dismiss();
      }

      // var ActiveTenantId=this.regService.TenantId;
      this.tenants = StorageService.GetTenant();
      // this.Tenant= this.Tenants.filter(function (obj) { return obj.Id === ActiveTenantId; });
      this.DigiParties = StorageService.GetDigiParty();
      // this.DigiParty=this.DigiParties.filter(function (obj) { return obj.Id === ActiveTenantId; });
      this.SelfCareAcs = StorageService.GetSelfCareAc();
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
    }, (error) => {
      this.toastrService.error(error.error.ExceptionMessage, 'Error!')

    });
    //this.navCtrl.setRoot(PagePage, { 'ActiveBankName': this.ActiveBankName });
    loading.dismiss();
  }

  addBankResponse: AddBankResponse;
  addBankRequest: AddBankRequest;
  digiParty: DigiParty;

  callservices() {
    this.addBankRequest = {
      TenantId: StorageService.GetUser().ActiveTenantId,
      MobileNo: StorageService.GetUser().UserName
    }
    this.registerService.AddBank(this.addBankRequest).subscribe((data: any) => {
      this.addBankResponse = data;

      this.tenant = {
        Id: this.addBankResponse.Tenant.Id,
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

    }, (error) => {
      this.toastrService.error(error.error.ExceptionMessage, 'Error!')

    });

  }
  isForgotten: boolean=false;
  OnForgot(){
    this.isForgotten=true;
    this.navCtrl.push(RegisterPage,{'isForgotPassword':this.isForgotten});
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
