import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { StorageService } from '../services/Storage_Service';
import { ConstantService } from '../services/Constants';
import { RechargeModel } from '../View Models/RechargeModel';
import { SelfCareAc } from '../LocalStorageTables/SelfCareAc';
import { DigiParty } from '../LocalStorageTables/DigiParty';
import { RegisterService } from '../services/app-data.service';
import { ToastrService } from 'ngx-toastr';
import { TranResponse } from '../View Models/TranResponse';

@Component({
  selector: 'page-prepaid-confirm',
  templateUrl: 'prepaid-confirm.html',
})
export class PrepaidConfirmPage implements OnInit {
  OperatorService: string;
  ParentId: string;
  showTitle: boolean;
  ActiveBankName: string;
  showConfirm: boolean;
  showSuccess: boolean;
  Amount: string;
  SubscriptionId: string;
  operator: string;
  constructor(private toastr: ToastrService, private registerService: RegisterService, public constantService: ConstantService, public loadingController: LoadingController, public navCtrl: NavController, public navParams: NavParams) {
  }

  ngOnInit() {
    this.operator = this.navParams.get('Operator');
    this.SubscriptionId = this.navParams.get('SubscriptionId');
    this.Amount = this.navParams.get('Amount');
    this.ParentId = this.navParams.get('ParentId');
    this.ActiveBankName = StorageService.GetActiveBankName();
    this.showTitle = true;
    switch (this.ParentId) {
      case "S1": this.OperatorService = "PrePaid";
        break;
      case "S2": this.OperatorService = "PostPaid";
        break;
      case "S3": this.OperatorService = "DTH";
        break;
      default: this.OperatorService = "Electricity Bill";
        break;
    }
  }
  
  GetDigiPartyandPartyMastID(ActiveTenantId) {
    var DigiParties = StorageService.GetDigiParty();
    var digiparty = DigiParties.find(function (obj) { return obj.TenantId === ActiveTenantId; });
    return digiparty;
  }
  
  GetSelfCareAcByTenantID(ActiveTenantId) {
    var SelfCareACs = StorageService.GetSelfCareAc();
    var selfCareAC = SelfCareACs.find(function (obj) { return obj.TenantId === ActiveTenantId && obj.AcActId == "#SB"; });
    return selfCareAC;
  }
  OnConfirm() {
    var ActiveTenantId = StorageService.GetUser().ActiveTenantId;
    let loading = this.loadingController.create({
      content: 'Recharging...'
    });
    loading.present();
   
    var OperatorId = JSON.parse(StorageService.GetItem(this.constantService.favouriteBasedOnParentId.Favourite_S1)).OperatorId;
    const rechargeModel = {
      TenantId: ActiveTenantId,
      DigiPartyId: this.GetDigiPartyandPartyMastID(ActiveTenantId).DigiPartyId,
      PartyMastId: this.GetDigiPartyandPartyMastID(ActiveTenantId).PartyMastId,
      AcMastId: this.GetSelfCareAcByTenantID(ActiveTenantId).AcHeadId,
      AcSubId: this.GetSelfCareAcByTenantID(ActiveTenantId).AcSubId,
      Amount: this.Amount,
      OperatorId: OperatorId,
      SubscriptionId: this.SubscriptionId,
      LocId: this.GetSelfCareAcByTenantID(ActiveTenantId).LocId
    }
    this.registerService.PostRecharge(rechargeModel).subscribe((data: any) => {
      this.showConfirm = false;
      this.toastr.success('Recharge is successful with ' + data.StatusCode, 'Success!');

      this.showSuccess = true;
      this.showTitle = false;
    }, (error) => {
      this.toastr.error(error.message, 'Error!')

    });

    loading.dismiss();
  }


}
