import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { StorageService } from '../services/Storage_Service';
import { StatementRequest } from '../View Models/StatementRequest';
import { RegisterService } from '../services/app-data.service';
import { SelfCareAc } from '../LocalStorageTables/SelfCareAc';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'page-balance-enquiry',
    templateUrl: 'balance-enquiry.html'
})
export class BalanceEnquiryPage implements OnInit {

    constructor(private alertCtrl: AlertController, private toastr: ToastrService, public loadingController: LoadingController, private registerService: RegisterService, public navCtrl: NavController) {
    }
    ActiveBankName: string;
    HideMsg: boolean;
    ShowHide: boolean;
    SelfCareAcsBasedOnTenantID: SelfCareAc;
    ngOnInit() {
        this.HideMsg = true;
        this.ShowHide = true;
        this.ActiveBankName = StorageService.GetActiveBankName();
        this.SelfCareAcsBasedOnTenantID = StorageService.GetSelfCareAcsBasedOnTenantID();
    }
    balance: string;
    OnGetAccountBalance(AcHeadId, AcSubId) {
        let loading = this.loadingController.create({
            content: 'Loading the Account Balance..'
        });
        loading.present();
        var statementRequest = {
            AcMastId: AcHeadId,
            AcSubId: AcSubId,
            TenantId: StorageService.GetUser().ActiveTenantId
        }
        this.registerService.GetAccountBalance(statementRequest).subscribe((data: any) => {
            this.balance = data;
            //alert(data.Balance);
            loading.dismiss();
        }, (error) => {
            this.toastr.error(error.message, 'Error!');
            var alert = this.alertCtrl.create({
                title: "Error Message",
                subTitle: error.message,
                buttons: ['OK']
              });
              alert.present();
          });
        this.ShowHide = false;
        this.HideMsg = false;
    }
}
