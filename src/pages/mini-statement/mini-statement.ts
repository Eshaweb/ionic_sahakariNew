import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { StorageService } from '../services/Storage_Service';
import { ConstantService } from '../services/Constants';
import { StatementRequest } from '../View Models/StatementRequest';
import { RegisterService } from '../services/app-data.service';
import { MiniStatement } from '../View Models/MiniStatement';
import { StatementItem } from '../View Models/StatementItem';
import { Tenant } from '../LocalStorageTables/Tenant';
import { SelfCareAc } from '../LocalStorageTables/SelfCareAc';

@Component({
  selector: 'page-mini-statement',
  templateUrl: 'mini-statement.html'
})
export class MiniStatementPage implements OnInit {
  ActiveTenantId = JSON.parse(StorageService.GetUser()).ActiveTenantId;
  constructor(public loadingController: LoadingController, private regService: RegisterService, public constant: ConstantService, public navCtrl: NavController) {

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

  stmentreq: StatementRequest;
  stmntItem: StatementItem;
  ministmnt: MiniStatement;
  balance: any;
  OnGetMiniStatement(AcHeadId, AcSubId) {
    let loading = this.loadingController.create({
      content: 'Loading the Mini Statement..'
    });
    loading.present();
    this.stmentreq = {
      AcMastId: AcHeadId,
      AcSubId: AcSubId,
      TenantId: this.ActiveTenantId
    }
    this.regService.GetStatement(this.stmentreq).subscribe((data: any) => {
      this.balance = data;
      this.ministmnt = data;
      this.stmntItem = data.StatementItems;
    });
    this.ShowHide = false;
    this.HideMsg=false;
    loading.dismiss();
  }

}
