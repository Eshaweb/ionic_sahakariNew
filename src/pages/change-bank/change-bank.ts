import { Component, OnInit } from '@angular/core';
import { NavController, Events, LoadingController, AlertController, NavParams } from 'ionic-angular';
import { StorageService } from '../services/Storage_Service';
import { RegisterService } from '../services/app-data.service';
import { Tenant } from '../LocalStorageTables/Tenant';
import { RequestForDigiParty } from '../View Models/RequestForDigiParty';
import { NgForm } from '@angular/forms';
import { DigiParty } from '../LocalStorageTables/DigiParty';
import { Idle } from 'idlejs/dist';
import { LoginPage } from '../login/login';
import { AddBankRequest } from '../View Models/AddBankRequest';
import { AddBankResponse } from '../View Models/AddBankResponse';
import { TenantList } from '../View Models/TenantList';
import { User } from '../LocalStorageTables/User';
import { PagePage } from '../page/page';
import { ToastrService } from 'ngx-toastr';
import { SelfCareAc } from '../LocalStorageTables/SelfCareAc';
import { FundTransferPage } from '../fund-transfer/fund-transfer';


const idle = new Idle()
  .whenNotInteractive()
  .within(5, 1000)
  //.do(() => console.log('IDLE'))
  .do(() => LoginPage)
  //.do(() => { this.navCtrl.setRoot(LoginPage);})  //Need to call LoginPage
  .start();

@Component({
  selector: 'page-change-bank',
  templateUrl: 'change-bank.html'
})
export class ChangeBankPage implements OnInit {
  tenants: Tenant;
  ActiveTenantId: string;
  Active: boolean;
  // constructor(private autoLogoutService: AutoLogoutService,private regService : RegisterService,public constant:ConstantService,public navCtrl: NavController) {
  constructor(private storageService: StorageService, public navParams: NavParams, private alertCtrl: AlertController, private toastr: ToastrService, public loadingController: LoadingController, private toastrService: ToastrService, private events: Events, private registerService: RegisterService, public navCtrl: NavController) {

  }
  tenant: Tenant;
  ActiveBankName: string;
  //Active: number;
  ngOnInit() {
    let loading = this.loadingController.create({
      content: 'Please wait till we get the Registered Banks'
    });
    loading.present();
    this.ActiveTenantId = this.storageService.GetUser().ActiveTenantId;
    var ActiveTenantId=this.storageService.GetUser().ActiveTenantId;
    //StorageService.SetItem('lastAction', Date.now().toString());
    let mobno = this.storageService.GetUser().UserName;
    this.tenants = this.storageService.GetTenant();
    this.tenant = this.tenants.find(function (obj) { return obj.Id === ActiveTenantId });
    this.ActiveBankName = this.tenant.Name;
    this.registerService.GetTenantsByMobile(mobno).subscribe((data: any) => {
      let tenantList = data;    //got tenantlist from server
      this.storageService.SetTenant(JSON.stringify(tenantList)); //Works, But not as of reqment
      if (this.tenants.length < tenantList.length) {
        for (var i = 0; i < tenantList.length; i++) {
          this.OnAddBankSelection(tenantList[i].Id);
        }
      }
      this.tenants = this.storageService.GetTenant();
      loading.dismiss();
    }, (error) => {
      this.toastr.error(error.message, 'Error!');
      alert(error.message);
      loading.dismiss();
    });
  }

  tenantList: Tenant;
  filterByString(tenantlist, ActiveTenantId) {
    return this.tenantList.filter(e => e.Id == ActiveTenantId);
  }
  OnAddBankSelection(Id) {
    const addBankRequest = {
      TenantId: Id,
      MobileNo: this.storageService.GetUser().UserName
    }
    this.registerService.AddBank(addBankRequest).subscribe((data: any) => {
      const tenant = {
        Id: data.Tenant.Id,
        Name: data.Tenant.Name,
        Address: data.Tenant.Address,
        IconHtml: data.Tenant.IconHtml
      }
      for (var i = 0; i < data.Tenant.length; i++) {
        if (tenant.IconHtml == "") {
          this.Active = true;
        } else {
          this.Active = false;
        }
      }
      this.tenants = this.storageService.GetTenant();

      const digiParty = {
        Id: data.DigiPartyId,
        DigiPartyId: data.DigiPartyId,
        PartyMastId: data.PartyMastId,
        MobileNo: data.MobileNo,
        TenantId: data.TenantId,  //ActiveTenantId
        Name: data.Name
      }
      var existingDigiParty = this.storageService.GetDigiParty();
      var TenantId = tenant.Id;
      let singleDigiParty = existingDigiParty.find(function (obj) { return obj.TenantId === TenantId; });
      if (singleDigiParty == null) {
        existingDigiParty.push(digiParty);
        this.storageService.SetDigiParty(JSON.stringify(existingDigiParty));
      }

      var existingSelfCareAcs = this.storageService.GetSelfCareAc();

      let singleSelfCareAC = existingSelfCareAcs.filter(function (obj) { return obj.TenantId === TenantId; });
      if (singleSelfCareAC.length == 0) {
        for (var j = 0; j < data.SelfCareAcs.length; j++) {
          const singleSelfCareAC = {
            AcActId: data.SelfCareAcs[j].AcActId,
            AcHeadId: data.SelfCareAcs[j].AcHeadId,
            AcNo: data.SelfCareAcs[j].AcNo,
            AcSubId: data.SelfCareAcs[j].AcSubId,
            HeadName: data.SelfCareAcs[j].HeadName,
            LocId: data.SelfCareAcs[j].LocId,
            TenantId: data.SelfCareAcs[j].TenantId
          }
          existingSelfCareAcs.push(singleSelfCareAC);
        }
        this.storageService.SetSelfCareAc(JSON.stringify(existingSelfCareAcs));
      }
      this.events.publish('REFRESH_DIGIPARTYNAME');
    }, (error) => {
      this.toastrService.error(error.message, 'Error!')
      var alert = this.alertCtrl.create({
        title: "Error Message",
        subTitle: error.message,
        buttons: ['OK']
      });
      alert.present();
    });
  }
  user: User;
  OnSelect(order) {
    var user = this.storageService.GetUser();
    user.ActiveTenantId = order.Id;
    this.storageService.SetUser(JSON.stringify(user));
    var ActiveTenantId = this.storageService.GetUser().ActiveTenantId;
    //this.Active = +ActiveTenantId;
    this.ActiveBankName = this.storageService.GetActiveBankName();
    if (this.navParams.get('isFromFundTransfer') == true) {
      this.events.publish('REFRESH_DIGIPARTYNAME');
      //   this.navCtrl.push(FundTransferPage);
      //  this.navCtrl.push(FundTransferPage).then(() => {
      //   const index = this.navCtrl.getActive().index;
      //   this.navCtrl.remove(0, index);
      // });
      this.navCtrl.push(FundTransferPage)
        .then(() => {
          const startIndex = this.navCtrl.getActive().index - 1;
          this.navCtrl.remove(startIndex, 1);
        });
    }
    else {
      this.navCtrl.setRoot(PagePage);
      this.events.publish('REFRESH_DIGIPARTYNAME');
    }

  }
}
