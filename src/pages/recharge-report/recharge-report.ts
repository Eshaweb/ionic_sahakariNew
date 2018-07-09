import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
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
  ActiveBankName: string;
  ActiveTenantId: string;
  // categories: OS[] = [];
  categories: OS;
  constructor(private alertCtrl: AlertController, public loadingController: LoadingController, private toastr: ToastrService, private registerService: RegisterService, public navCtrl: NavController, public navParams: NavParams) {

  }
  ngOnInit() {
    this.categories = StorageService.GetOS();
    this.ActiveBankName = StorageService.GetActiveBankName();
  }
  rRResponse: RRResponse;

  ObjChanged(event) {
    var ActiveTenantId = StorageService.GetUser().ActiveTenantId;
    var digiPartyId = StorageService.GetDigiPartyID();
    let loading = this.loadingController.create({
      content: 'Please wait till the screen loads'
    });
    loading.present();
    const rRRequest = {
      TenantId: ActiveTenantId,
      DigiPartyId: digiPartyId,
      SelectedType: event,
      Number: 10
    }
    this.registerService.GetRechargeReport(rRRequest).subscribe((data: any) => {
      this.rRResponse = data;

    }, (error) => {
      this.toastr.error(error.message, 'Error!');
      var alert = this.alertCtrl.create({
        title: "Error Message",
        subTitle: error.message,
        buttons: ['OK']
      });
      alert.present();
    });
    loading.dismiss();
  }


}
