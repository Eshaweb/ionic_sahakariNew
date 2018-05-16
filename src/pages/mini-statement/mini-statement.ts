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

  SelfCareAcsBasedOnTenantID: SelfCareAc;
  SelfCareACs: SelfCareAc;
  Tenant: Tenant;
  Tenants: Tenant;
  stmntItem: StatementItem;
  ministmnt: MiniStatement;
  AcNo: any;
  HeadName: any;
  balance: any;
  stmentreq: StatementRequest;
  ActiveBankName: any;
  ShowHide: boolean;

  ActiveTenantId = JSON.parse(StorageService.GetItem(this.constant.DB.User)).ActiveTenantId;

  constructor(public loadingController: LoadingController, private regService: RegisterService, public constant: ConstantService, public navCtrl: NavController) {

  }

  ngOnInit() {
    this.ShowHide = true;

    var ActiveTenantId = JSON.parse(StorageService.GetItem(this.constant.DB.User)).ActiveTenantId;
    this.Tenants = JSON.parse(StorageService.GetItem(this.constant.DB.Tenant));
    this.Tenant = this.Tenants.filter(function (obj) { return obj.Id === ActiveTenantId; });
    this.ActiveBankName = this.Tenant[0].Name;
    this.SelfCareACs = JSON.parse(StorageService.GetItem(this.constant.DB.SelfCareAc));
    this.SelfCareAcsBasedOnTenantID = this.SelfCareACs.filter(function (obj) { return obj.TenantId === ActiveTenantId; })
  }


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
    loading.dismiss();
  }

}
