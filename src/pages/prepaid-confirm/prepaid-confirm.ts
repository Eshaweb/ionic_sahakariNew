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
import { AlertController } from 'ionic-angular';


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
  tranResponse: TranResponse;
  OperatorId: any;
  showPending: boolean;
  showFailure: boolean;
  showRefund: boolean;
  showBlocked: boolean;
  showInit: boolean;
  constructor(private storageService:StorageService, private alertCtrl: AlertController, private toastr: ToastrService, private registerService: RegisterService, public constantService: ConstantService, public loadingController: LoadingController, public navCtrl: NavController, public navParams: NavParams) {
  }

  ngOnInit() {
    this.operator = this.navParams.get('Operator');
    this.SubscriptionId = this.navParams.get('SubscriptionId');
    this.Amount = this.navParams.get('Amount');
    this.ParentId = this.navParams.get('ParentId');
    this.OperatorId=this.navParams.get('OperatorId');
    this.ActiveBankName = this.storageService.GetActiveBankName();
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
    var DigiParties = this.storageService.GetDigiParty();
    var digiparty = DigiParties.find(function (obj) { return obj.TenantId === ActiveTenantId; });
    return digiparty;
  }
  
  GetSelfCareAcByTenantID(ActiveTenantId) {
    var SelfCareACs = this.storageService.GetSelfCareAc();
    var selfCareAC = SelfCareACs.find(function (obj) { return obj.TenantId === ActiveTenantId && obj.AcActId == "#SB"; });
    return selfCareAC;
  }
  OnConfirm() {
    let loading = this.loadingController.create({
      content: 'Recharging...'
    });
    loading.present();
    this.showTitle = false;
    var ActiveTenantId = this.storageService.GetUser().ActiveTenantId;
    
    var rechargeModel: RechargeModel = {
      TenantId: ActiveTenantId,
      DigiPartyId: this.GetDigiPartyandPartyMastID(ActiveTenantId).DigiPartyId,
      PartyMastId: this.GetDigiPartyandPartyMastID(ActiveTenantId).PartyMastId,
      AcMastId: this.GetSelfCareAcByTenantID(ActiveTenantId).AcHeadId,
      AcSubId: this.GetSelfCareAcByTenantID(ActiveTenantId).AcSubId,
      // Amount: this.rechargeitem.Amount,
      // OperatorId: this.rechargeitem.OperatorId,
      // SubscriptionId: this.rechargeitem.SubscriptionId,
      Amount: this.navParams.get('Amount'),
      OperatorId: this.navParams.get('OperatorId'),
      SubscriptionId: this.navParams.get('SubscriptionId'),
      LocId: this.GetSelfCareAcByTenantID(ActiveTenantId).LocId
    }
    this.registerService.PostRecharge(rechargeModel).subscribe((data: any) => {
      this.tranResponse = data;
      this.showConfirm = false;
      switch (data.StatusCode) {
        case 1:
          var alert = this.alertCtrl.create({
            title: "Message",
            subTitle: 'Recharge is successful with Transaction ID ' + this.tranResponse.VendorExtCode,
            buttons: ['OK']
          });
          alert.present();
          this.showSuccess = true;
          break;
          case 2:
          //alert("Recharge is pending with Transaction ID "+ this.tranResponse.VendorExtCode);
          var alert = this.alertCtrl.create({
            title: "Message",
            subTitle: 'Recharge is pending with Transaction ID ' + this.tranResponse.VendorExtCode,
            buttons: ['OK']
          });
          alert.present();
          this.showPending=true;
          break;
          case 3:
          ///alert("Recharge is initiated with Transaction ID "+ this.tranResponse.VendorExtCode);
          var alert = this.alertCtrl.create({
            title: "Message",
            subTitle: 'Recharge is initiated with Transaction ID ' + this.tranResponse.VendorExtCode,
            buttons: ['OK']
          });
          alert.present();
          this.showInit = true;
          break;
          case 4:
          //alert("Recharge is failure with Transaction ID "+ this.tranResponse.VendorExtCode);
          var alert = this.alertCtrl.create({
            title: "Error Message",
            subTitle: 'Recharge is Unsuccessful with Transaction ID ' + this.tranResponse.VendorExtCode,
            buttons: ['OK']
          });
          alert.present();
          this.showFailure=true;
          break;
          case 5:
          //alert("Recharge is refunded with Transaction ID "+ this.tranResponse.VendorExtCode);
          var alert = this.alertCtrl.create({
            title: "Message",
            subTitle: 'Recharge is refunded with Transaction ID ' + this.tranResponse.VendorExtCode,
            buttons: ['OK']
          });
          alert.present();
          this.showRefund=true;
          break;
          case 9:
          //alert("Recharge is blocked with Transaction ID "+ this.tranResponse.VendorExtCode);
          var alert = this.alertCtrl.create({
            title: "Message",
            subTitle: 'Recharge is blocked with Transaction ID ' + this.tranResponse.VendorExtCode,
            buttons: ['OK']
          });
          alert.present();
          this.showBlocked=true;
          break;
          default:
          //alert("Recharge is blocked with Transaction ID "+ this.tranResponse.VendorExtCode);
          var alert = this.alertCtrl.create({
            title: "Message",
            subTitle: this.tranResponse.AISError,
            buttons: ['OK']
          });
          alert.present();
          this.showBlocked=true;
          break;
      }
      loading.dismiss();
    }, (error) => {
      this.toastr.error(error.message, 'Error!')
      loading.dismiss();
    });
  }


}
