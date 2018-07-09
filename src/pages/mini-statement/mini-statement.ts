import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { StorageService } from '../services/Storage_Service';
import { StatementRequest } from '../View Models/StatementRequest';
import { RegisterService } from '../services/app-data.service';
import { MiniStatement } from '../View Models/MiniStatement';
import { StatementItem } from '../View Models/StatementItem';
import { SelfCareAc } from '../LocalStorageTables/SelfCareAc';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'page-mini-statement',
  templateUrl: 'mini-statement.html'
})
export class MiniStatementPage implements OnInit {
  ActiveTenantId = StorageService.GetUser().ActiveTenantId;
  label: string;
  showCredited: boolean;
  ShowDebited: boolean;
  constructor(private alertCtrl: AlertController, private toastr: ToastrService, public loadingController: LoadingController, private registerService: RegisterService, public navCtrl: NavController) {

  }
  ActiveBankName: string;
  ShowHide: boolean;
  HideMsg: boolean;
  SelfCareAcsBasedOnTenantID: SelfCareAc;
  ngOnInit() {
    this.ShowHide = true;
    this.HideMsg=true;
    this.ActiveBankName =StorageService.GetActiveBankName();
    this.SelfCareAcsBasedOnTenantID =StorageService.GetSelfCareAcsBasedOnTenantID();
  }

  statementItem: StatementItem;
  miniStatement: MiniStatement;
  balance: string;
  OnGetMiniStatement(AcHeadId, AcSubId) {
    let loading = this.loadingController.create({
      content: 'Loading the Mini Statement..'
    });
    loading.present();
    const statementRequest = {
      AcMastId: AcHeadId,
      AcSubId: AcSubId,
      TenantId: this.ActiveTenantId
    }
    this.registerService.GetStatement(statementRequest).subscribe((data: any) => {
      this.balance = data;
      this.miniStatement = data;
      this.statementItem = data.StatementItems;
      // this.ShowDebited=true;
      // if(data.StatementItems.Dr==0){
      //   this.showCredited=true;
      //   this.ShowDebited=false;
      // }
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
    this.HideMsg=false;
    loading.dismiss();
  }

}
