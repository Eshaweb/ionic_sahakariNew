import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { StorageService } from '../services/Storage_Service';
import { Tenant } from '../LocalStorageTables/Tenant';
import { EnterOTPPage } from '../enter-otp/enter-otp';
import { RegisterService } from '../services/app-data.service';
import { LoginPage } from '../login/login';
import { ToastrService } from '../../../node_modules/ngx-toastr';
import { PagePage } from '../page/page';

/**
 * Generated class for the MyProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-my-profile',
  templateUrl: 'my-profile.html',
})
export class MyProfilePage implements OnInit {
  constructor(private toastrService: ToastrService, public loadingController: LoadingController, private alertCtrl: AlertController, private storageService: StorageService, private registerService: RegisterService, public navCtrl: NavController, public navParams: NavParams) {
  }
  addedTenantRecord: Tenant;
  tenantList: Tenant;
  tenants: Tenant;
  mobileno: string;
  digipartyname: string;
  ngOnInit() {
    let loading = this.loadingController.create({
      content: 'Loading the Mini Statement..'
    });
    loading.present();
    this.digipartyname = this.storageService.GetDigipartyBasedOnActiveTenantId().Name;
    this.mobileno = this.storageService.GetUser().UserName;
    this.registerService.GetTenantsByMobile(this.mobileno).subscribe((data: any) => {
      this.tenantList = data;
      this.storageService.SetTenant(JSON.stringify(this.tenantList));
      this.tenants = this.storageService.GetTenant();
      loading.dismiss();
    }, (error) => {
      var alert = this.alertCtrl.create({
        title: "Error Message",
        subTitle: error.message,
        buttons: ['OK']
      });
      alert.present();
      loading.dismiss();
    });
  }

  OnChange() {
    var ischangePassword: boolean = true;
    this.navCtrl.push(EnterOTPPage, { 'ischangePassword': ischangePassword });
  }
  OnLogOut() {
    this.storageService.RemoveRecordsForLogout();
    this.navCtrl.push(LoginPage);
  }
  OnSync() {
    this.storageService.RemoveRecordsForLogout();
    let loading = this.loadingController.create({
      content: 'Syncing Operators and Services'
    });
    loading.present();
    this.registerService.GetServices().subscribe((data: any) => {
      var oS = JSON.stringify(data);
      this.storageService.SetOS(oS);
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

    let loadingnew = this.loadingController.create({
      content: 'Syncing Accounts'
    });
    loadingnew.present();
    this.callservices();
    loadingnew.dismiss();
  }
  callservices() {
    var addBankRequest = {
      TenantId: this.storageService.GetUser().ActiveTenantId,
      MobileNo: this.storageService.GetUser().UserName
    }
    this.registerService.AddBank(addBankRequest).subscribe((data: any) => {

      var tenant = {
        Id: data.Tenant.Id,
        Name: data.Tenant.Name,
        Address: data.Tenant.Address,
        IconHtml: data.Tenant.IconHtml
      }
      this.storageService.SetTenant(JSON.stringify([tenant]));
      var ActiveBankName = this.storageService.GetActiveBankName();

      var digiParty = {
        Id: data.DigiPartyId,
        DigiPartyId: data.DigiPartyId,
        PartyMastId: data.PartyMastId,
        MobileNo: data.MobileNo,
        TenantId: data.TenantId,  //ActiveTenantId
        Name: data.Name
      }
      this.storageService.SetDigiParty(JSON.stringify([digiParty]));

      this.storageService.SetSelfCareAc(JSON.stringify(data.SelfCareAcs));

      this.navCtrl.setRoot(PagePage, { 'ActiveBankName': ActiveBankName });

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
}
