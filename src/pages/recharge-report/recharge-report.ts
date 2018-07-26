import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ModalController } from 'ionic-angular';
import { OS } from '../View Models/OS';
import { StorageService } from '../services/Storage_Service';
import { RegisterService } from '../services/app-data.service';
import { RRRequest } from '../View Models/RRRequest';
import { RRResponse } from '../View Models/RRResponse';
import { ToastrService } from 'ngx-toastr';
import { CheckVoucherResult } from '../View Models/CheckVoucherResult';
import { ModalPage } from '../modal/modal';

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
  showFailureButton: boolean;
  checkVoucherResult: CheckVoucherResult;
  showReport: boolean;
  showReversal: boolean;
  constructor(private storageService:StorageService, public modalCtrl: ModalController,private alertCtrl: AlertController, public loadingController: LoadingController, private toastr: ToastrService, private registerService: RegisterService, public navCtrl: NavController, public navParams: NavParams) {

  }
  ngOnInit() {
    this.categories = this.storageService.GetOS();
    this.ActiveBankName = this.storageService.GetActiveBankName();
    this.showReport=true;
  }
  rRResponse: RRResponse;

  ObjChanged(event) {
    var ActiveTenantId = this.storageService.GetUser().ActiveTenantId;
    var digiPartyId = this.storageService.GetDigipartyBasedOnActiveTenantId().DigiPartyId;
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
      loading.dismiss();
    }, (error) => {
      this.toastr.error(error.message, 'Error!');
      var alert = this.alertCtrl.create({
        title: "Error Message",
        subTitle: error.message,
        buttons: ['OK']
      });
      alert.present();
      loading.dismiss();
    });
  }
  OnShowReverse(Id){
    //this.showReport=false;
    var ActiveTenantId = this.storageService.GetUser().ActiveTenantId;
    let loading = this.loadingController.create({
      content: 'Please wait till the screen loads'
    });
    loading.present();
    const checkVoucher = {
      TenantId: ActiveTenantId,
      DigiTranLogId:Id
    }
    this.registerService.GetReversedVoucher(checkVoucher).subscribe((data: any) => {
      this.checkVoucherResult = data;
//this.showReversal=true;

this.openModalWithParams();
      loading.dismiss();
    }, (error) => {
      this.toastr.error(error.message, 'Error!');
      var alert = this.alertCtrl.create({
        title: "Error Message",
        subTitle: error.message,
        buttons: ['OK']
      });
      alert.present();
      loading.dismiss();
    });
  }
  openModalWithParams() {
    let myModal = this.modalCtrl.create(ModalPage, { 'myParam': this.checkVoucherResult });
    myModal.present();
  }
}
