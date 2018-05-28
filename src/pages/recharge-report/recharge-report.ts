import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { OS } from '../View Models/OS';
import { StorageService } from '../services/Storage_Service';
import { ConstantService } from '../services/Constants';
import { RegisterService } from '../services/app-data.service';
import { RRRequest } from '../View Models/RRRequest';
import { RRResponse } from '../View Models/RRResponse';
import { DigiParty } from '../LocalStorageTables/DigiParty';
import { ToastrService } from 'ngx-toastr';

/**
 * Generated class for the RechargeReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-recharge-report',
  templateUrl: 'recharge-report.html',
})
export class RechargeReportPage implements OnInit {
  digiPartyId: string;
  digiparty: DigiParty;
  DigiParties: DigiParty;
  rRResponse: RRResponse;
  ActiveBankName: string;
  ActiveTenantId: string;
  rRRequest: RRRequest;
  categories: OS[] = [];
  constructor(public loadingController: LoadingController, private toastr: ToastrService, private regService: RegisterService, public constant: ConstantService, public navCtrl: NavController, public navParams: NavParams) {

  }
  ngOnInit() {
    this.categories = JSON.parse(StorageService.GetOS());
    this.ActiveTenantId = JSON.parse(StorageService.GetUser()).ActiveTenantId;
    const ATenantId = this.ActiveTenantId;
    this.ActiveBankName = StorageService.GetActiveBankName();
    this.DigiParties = JSON.parse(StorageService.GetDigiParty());
    this.digiparty = this.DigiParties.find(function (obj) { return obj.TenantId === ATenantId; });
    this.digiPartyId = this.digiparty.DigiPartyId;
  }
  ObjChanged(event) {
    let loading = this.loadingController.create({
      content: 'Please wait till the screen loads'
    });
    loading.present();
    this.rRRequest = {
      TenantId: this.ActiveTenantId,
      DigiPartyId: this.digiPartyId,
      SelectedType: event,
      Number: 10
    }
    this.regService.GetRechargeReport(this.rRRequest).subscribe((data: any) => {
      this.rRResponse = data;

    }, (error) => {
      this.toastr.error(error.message, 'Error!')
    });
    loading.dismiss();
  }


}
