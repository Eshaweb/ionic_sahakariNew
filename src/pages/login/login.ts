import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, NavParams, AlertController } from 'ionic-angular';
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

  constructor(private alertCtrl: AlertController, private uiService: UISercice, public navParams: NavParams, private toastrService: ToastrService, public loadingController: LoadingController, public formbuilder: FormBuilder, private registerService: RegisterService, public navCtrl: NavController) {
    this.formGroup = formbuilder.group({
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
    const passwordControl = this.formGroup.get('password');
    passwordControl.valueChanges.subscribe(value => this.setErrorMessage(passwordControl));
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

  userName = StorageService.GetUser().UserName;
  uniqueKey = StorageService.GetUser().UniqueKey;
  OnLogin() {
    let loading = this.loadingController.create({
      content: 'Wait for a second..'
    });
    loading.present();
    var OS = StorageService.GetOS();
    this.registerService.loginbyHttpClient(this.userName, this.formGroup.get('password').value, this.uniqueKey).subscribe((data: any) => {
      this.registerService.userToken = data.access_token;
      StorageService.SetItem('userToken', data.access_token);

      if (OS == null) {
        let loading = this.loadingController.create({
          content: 'Syncing Operators and Services'
        });
        loading.present();
        this.registerService.GetServices().subscribe((data: any) => {
          var oS = JSON.stringify(data);
          StorageService.SetOS(oS);
          loading.dismiss();
        }, (error) => {
          this.toastrService.error(error.message, 'Error!');
          loading.dismiss();
          var alert = this.alertCtrl.create({
            title: "Error Message",
            subTitle: error.message,
            buttons: ['OK']
          });
          alert.present();

        });

      }

      let tenants = StorageService.GetTenant();
      let DigiParties = StorageService.GetDigiParty();
      let SelfCareAcs = StorageService.GetSelfCareAc();
      if (tenants == null || DigiParties == null || SelfCareAcs == null) {
        let loadingnew = this.loadingController.create({
          content: 'Syncing Accounts'
        });
        loadingnew.present();
        this.callservices();
        loadingnew.dismiss();
      }
      else {
        this.navCtrl.setRoot(PagePage, { 'ActiveBankName': this.ActiveBankName });
      }
      loading.dismiss();
    }, (error) => {
      this.toastrService.error(error.error.ExceptionMessage, 'Error!');
      loading.dismiss();
    });
  }

  callservices() {
    var addBankRequest = {
      TenantId: StorageService.GetUser().ActiveTenantId,
      MobileNo: StorageService.GetUser().UserName
    }
    this.registerService.AddBank(addBankRequest).subscribe((data: any) => {

      var tenant = {
        Id: data.Tenant.Id,
        Name: data.Tenant.Name,
        Address: data.Tenant.Address,
        IconHtml: data.Tenant.IconHtml
      }
      StorageService.SetTenant(JSON.stringify([tenant]));

      var digiParty = {
        Id: data.DigiPartyId,
        DigiPartyId: data.DigiPartyId,
        PartyMastId: data.PartyMastId,
        MobileNo: data.MobileNo,
        TenantId: data.TenantId,  //ActiveTenantId
        Name: data.Name
      }
      StorageService.SetDigiParty(JSON.stringify([digiParty]));

      StorageService.SetSelfCareAc(JSON.stringify(data.SelfCareAcs));

      this.navCtrl.setRoot(PagePage, { 'ActiveBankName': this.ActiveBankName });

    }, (error) => {
      this.toastrService.error(error.error.ExceptionMessage, 'Error!');
      var alert = this.alertCtrl.create({
        title: "Error Message",
        subTitle: error.error.ExceptionMessage,
        buttons: ['OK']
      });
      alert.present();
    });

  }
  isForgotten: boolean = false;
  OnForgot() {
    this.isForgotten = true;
    this.navCtrl.push(RegisterPage, { 'isForgotPassword': this.isForgotten });
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
