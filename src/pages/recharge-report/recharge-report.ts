import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { OS } from '../View Models/OS';
import { StorageService } from '../services/Storage_Service';
import { RegisterService } from '../services/app-data.service';
import { RRRequest } from '../View Models/RRRequest';
import { RRResponse } from '../View Models/RRResponse';
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
  ActiveBankName: string;
  ActiveTenantId: string;
  // categories: OS[] = [];
  categories: OS;
  constructor(public loadingController: LoadingController, private toastr: ToastrService, private registerService: RegisterService, public navCtrl: NavController, public navParams: NavParams) {

  }
  ngOnInit() {
    this.categories = StorageService.GetOS();
    this.ActiveTenantId = StorageService.GetUser().ActiveTenantId;
    this.ActiveBankName = StorageService.GetActiveBankName();
    this.digiPartyId = StorageService.GetDigiPartyID();
  }
  rRResponse: RRResponse;
  rRRequest: RRRequest;

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
    this.registerService.GetRechargeReport(this.rRRequest).subscribe((data: any) => {
      this.rRResponse = data;

    }, (error) => {
      this.toastr.error(error.message, 'Error!')
    });
    loading.dismiss();
  }


}
