import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, Navbar, ViewController, AlertController } from 'ionic-angular';
import { RegisterService } from '../services/app-data.service';
import { StorageService } from '../services/Storage_Service';
import { OSRequest } from '../View Models/OSRequest';
import { OSResponse } from '../View Models/OSResponse';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, NgForm } from '@angular/forms';
import { FavouriteItem } from '../LocalStorageTables/FavouriteItem';
import { ConstantService } from '../services/Constants';
import { RechargeModel } from '../View Models/RechargeModel';
import { Favourites } from '../LocalStorageTables/Favourites';
import { Recharge } from '../LocalStorageTables/Recharge';
import { DigiParty } from '../LocalStorageTables/DigiParty';
import { SelfCareAc } from '../LocalStorageTables/SelfCareAc';
import { ToastrService } from 'ngx-toastr';
import { TranResponse } from '../View Models/TranResponse';
import { OperaterCircleQuery } from '../View Models/OperaterCircleQuery';
import { OperaterCircle } from '../View Models/OperaterCircle';
import { SingleState } from '../View Models/SingleState';
import { BasicPage } from '../ViewPlans_Tabs/ViewPlans_Tabs';
import { FavouritesPage } from '../favourites/favourites';
import { PrepaidConfirmPage } from '../prepaid-confirm/prepaid-confirm';
import { PagePage } from '../page/page';
import { UISercice } from '../services/UIService';
import { delay } from 'rxjs/operator/delay';
import { OSBasedOnParentId } from '../LocalStorageTables/OSBasedOnParentId';
@Component({
  selector: 'page-mobile-recharge',
  templateUrl: 'mobile-recharge.html'
})
export class MobileRechargePage implements OnInit {
  amountMessage: string;
  nicknameMessage: string;
  subscriptionIdMessage: string;
  title: string;
  @ViewChild(Navbar) navBar: Navbar;
  //showNavbar: boolean;
  //gender: string;
  formGroup: FormGroup;
  ActiveTenantId = this.storageService.GetUser().ActiveTenantId;


  constructor(private storageService: StorageService, private alertCtrl: AlertController, private uiService: UISercice, public viewCtrl: ViewController, private toastr: ToastrService, public constant: ConstantService, private registerService: RegisterService, public loadingController: LoadingController, public navParams: NavParams, public navCtrl: NavController, public formbuilder: FormBuilder) {
    this.formGroup = formbuilder.group({
      subscriptionId: ['', [Validators.required, Validators.minLength(10)]],
      // operatorId: ['', [Validators.required]],
      // circleId: ['', [Validators.required]],
      operatorId: [''],
      circleId: [''],
      amount: ['', [Validators.required]],
      nickname: ['', [Validators.required, Validators.minLength(2)]]
    });

    const subscriptionIdControl = this.formGroup.get('subscriptionId');
    subscriptionIdControl.valueChanges.subscribe(value => this.setErrorMessage(subscriptionIdControl));
    const amountControl = this.formGroup.get('amount');
    amountControl.valueChanges.subscribe(value => this.setErrorMessage(amountControl));
    const nicknameControl = this.formGroup.get('nickname');
    nicknameControl.valueChanges.subscribe(value => this.setErrorMessage(nicknameControl));
  }
  ionViewDidLoad() {
    this.navCtrl.remove(2, 1);
    //this.navCtrl.pop();
    this.setBackButtonAction();
  }
  setErrorMessage(c: AbstractControl): void {
    let subscriptionId = this.formGroup.controls['subscriptionId'];
    let amount = this.formGroup.controls['amount'];
    let nickname = this.formGroup.controls['nickname'];
    this.subscriptionIdMessage = '';
    this.nicknameMessage = '';
    this.amountMessage = '';
    let control = this.uiService.getControlName(c);
    if ((c.touched || c.dirty) && c.errors) {
      if (control === 'subscriptionId' && subscriptionId.value != null && (this.ParentId == "S3" || this.ParentId == "S5")) {
        this.subscriptionIdMessage = Object.keys(c.errors).map(key => this.validationMessages[control + '_' + key]).join(' ');
        if (subscriptionId.value.length < 10) {
          this.isMobileNoEntered = false;
        } else {
          this.isMobileNoEntered = true;
        }
      }
      else if (control === 'subscriptionId' && subscriptionId.value != null) {
        this.subscriptionIdMessage = Object.keys(c.errors).map(key => this.validationMessages[control + '_' + key]).join(' ');
        this.OnMobileNo(subscriptionId.value);
      }
      else if (control === 'nickname' && nickname.value != null) {
        this.nicknameMessage = Object.keys(c.errors).map(key => this.validationMessages[control + '_' + key]).join(' ');
        this.onNickName(nickname.value);
      }
      else if (control === 'amount') {
        this.amountMessage = Object.keys(c.errors).map(key => this.validationMessages[control + '_' + key]).join(' ');
      }
    }
    else {
      if (control === 'subscriptionId' && subscriptionId.value != null && (this.ParentId == "S3" || this.ParentId == "S5")) {
        
      }
      else if (control === 'subscriptionId' && subscriptionId.value != null) {
        this.OnMobileNo(subscriptionId.value);
      }
      else if (control === 'nickname' && nickname.value != null) {
        this.onNickName(nickname.value);
      }
      // else if (control === 'amount' && amount.value != null && (this.ParentId == "S3" || this.ParentId == "S5")){    
      //   this.formGroup.patchValue({
      //     circleId: ""
      //   });      
      // }
    }
  }
  private validationMessages = {
    subscriptionId_required: '*Enter the Field',
    subscriptionId_minlength: 'Field cannot be less than 10 character',
    amount_required: '*Enter the Field',
    nickname_required: '*Enter the Field',
    nickname_minlength: 'Field cannot be less than 2 character',
  };
  setBackButtonAction() {
    this.navBar.backButtonClick = () => {
      this.navCtrl.push(FavouritesPage).then(() => {
        const index = this.viewCtrl.index;
        this.navCtrl.remove(index, 1); //this will remove page3 and page2
      });
    }
  }
  Id: string;
  ParentId: string;
  amountforRecharge: string;
  osid: string;
  favouriteNewOfDTH: string;
  postpaid: string;
  favourites: Favourites;
  rechargeitem: Recharge;
  prepaid: string;
  DTHNo: any;
  ShowLabel: boolean;
  ElectricityConsumerNo: any;
  OSResponseNew: OSResponse[];
  ShowEntryForm: boolean;
  isOperatorEnabled: boolean = false;
  isStateEnabled: boolean = false;
  isMobileNoEntered: boolean = false;
  isNickNameEntered: boolean = false;
  isAmountEntered: boolean = false;
  isButtonEnabled: boolean = false;
  ActiveBankName: string;

  ngOnInit() {
    this.ShowEntryForm = true;
    this.ActiveBankName = this.storageService.GetActiveBankName();
    this.Id = this.navParams.get('Id');
    this.ParentId = this.navParams.get('ParentId');
    this.amountforRecharge = this.navParams.get('Amount');
    this.osid = this.navParams.get('OperatorId');
    this.isButtonEnabled = this.navParams.get('ButtonEnabled');
    if (this.isButtonEnabled == null) {
      this.isButtonEnabled = false;
    } else {
      this.isButtonEnabled = true;
      this.isOperatorEnabled = true;
      this.isStateEnabled = true;
      this.isNickNameEntered = true;
      this.isMobileNoEntered = true;
      this.isAmountEntered = true;
    }
    if (this.ParentId == "S3") {
      this.favouriteNewOfDTH = this.ParentId;
    }
    if (this.ParentId == "S1") {
      this.postpaid = null;
      var PId = this.Id;
      var ParentId = this.ParentId;
      var xx: Favourites = this.storageService.GetFavourite();
      var favouriteNew: Favourites = xx.filter(function (obj) { return obj.ParentId === ParentId; })
      if (favouriteNew != null && this.Id != null) {
        this.favourites = favouriteNew;
        this.rechargeitem = this.favourites.find(function (obj) { return obj.Id === PId; });
        this.prepaid = this.rechargeitem.SubscriptionId;
        this.title = "PREPAID RECHARGE";
        this.isOperatorEnabled = true;
        this.isStateEnabled = true;
        this.isNickNameEntered = true;
        this.isMobileNoEntered = true;
      } else {
        this.prepaid = "Enter";
        this.title = "PREPAID RECHARGE";
      }

    }
    else if (this.ParentId == "S2") {
      this.prepaid = null;
      var PId = this.Id;
      var ParentId = this.ParentId;
      var xx: Favourites = this.storageService.GetFavourite();
      var favouriteNew: Favourites = xx.filter(function (obj) { return obj.ParentId === ParentId; })
      if (favouriteNew != null && this.Id != null) {
        this.favourites = favouriteNew;
        this.rechargeitem = this.favourites.find(function (obj) { return obj.Id === PId; });
        this.postpaid = this.rechargeitem.SubscriptionId;
        this.title = "POSTPAID BILL";
        this.isOperatorEnabled = true;
        this.isStateEnabled = true;
        this.isNickNameEntered = true;
        this.isMobileNoEntered = true;
      } else {
        this.postpaid = "Enter";
        this.title = "POSTPAID BILL";
      }
    }
    else if (this.ParentId == "S3") {
      this.prepaid = null;
      this.postpaid = null;
      var PId = this.Id;
      var ParentId = this.ParentId;
      var xx: Favourites = this.storageService.GetFavourite();
      if (xx != null) {
        var favouriteNew: Favourites = xx.filter(function (obj) { return obj.ParentId === ParentId; })
      }
      if (favouriteNew != null && this.Id != null) {
        this.favourites = favouriteNew;
        this.rechargeitem = this.favourites.find(function (obj) { return obj.Id === PId; });
        //this.favouriteitem = this.favourites.find(function (obj) { return obj.Id === PId; });
        this.DTHNo = this.rechargeitem.SubscriptionId;
        this.title = "DTH RECHARGE";
        this.ShowLabel = true;
        this.isStateEnabled = true;
        this.isOperatorEnabled = true;
        this.isNickNameEntered = true;
        this.isMobileNoEntered = true;
      } else {
        this.DTHNo = "Enter";
        this.ShowLabel = true;
        this.title = "DTH RECHARGE";
      }
    }
    else if (this.ParentId == "S5") {
      this.prepaid = null;
      this.postpaid = null;
      this.DTHNo = null;
      var PId = this.Id;
      var ParentId = this.ParentId;
      var xx: Favourites = this.storageService.GetFavourite();
      var favouriteNew: Favourites = xx.filter(function (obj) { return obj.ParentId === ParentId; })
      if (favouriteNew != null && this.Id != null) {
        this.favourites = favouriteNew;
        this.rechargeitem = this.favourites.find(function (obj) { return obj.Id === PId; });
        this.ElectricityConsumerNo = this.rechargeitem.SubscriptionId;
        this.title = "ELECTRICITY BILL";
        this.isStateEnabled = true;
        this.isOperatorEnabled = true;
        this.isNickNameEntered = true;
        this.isMobileNoEntered = true;
      } else {
        this.ElectricityConsumerNo = "Enter";
        this.title = "ELECTRICITY BILL";
      }
    }

    var oSRequest = {
      PerentId: this.ParentId,
      TenantId: this.ActiveTenantId,
    }
    var ActiveTenantId = this.storageService.GetUser().ActiveTenantId;
    let loading = this.loadingController.create({
      content: 'Loading the Operators..'
    });
    loading.present();
    this.registerService.GetOperators(oSRequest).subscribe((data: any) => {
      this.OSResponseNew = data;
      var OSResponseNew = data;
      this.OSResponseNew = OSResponseNew.filter(function (obj) { return obj.TenantId === ActiveTenantId; })
      var SetOfOSes = this.storageService.GetOSResponse();
      if (SetOfOSes == null) {
        this.storageService.SetOSResponse(JSON.stringify(this.OSResponseNew));
      }
      else {
        var ParentId = this.ParentId;
        var OSesBasedOnParentId = SetOfOSes.filter(function (obj) { return obj.ParentId === ParentId && obj.TenantId === ActiveTenantId; });
        if (OSesBasedOnParentId.length == 0) {
          SetOfOSes = SetOfOSes.concat(this.OSResponseNew);
          this.storageService.SetOSResponse(JSON.stringify(SetOfOSes));
        }
      }

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
    this.rechargeitem = {
      Id: '',
      NickName: this.navParams.get('nname'),
      OperatorId: this.navParams.get('OperatorId'),
      ParentId: this.navParams.get('ParentId'),
      SubscriptionId: this.navParams.get('SubscriptionId'),
      Amount: this.navParams.get('Amount'),
      CircleId: this.navParams.get('CircleId')

    }
  }

  showConfirm: boolean;
  label: string;
  operator: string;
  //favouriteNew: Favourites;

  OnNext() {
    let subscriptionId = this.formGroup.controls['subscriptionId'];
    let amount = this.formGroup.controls['amount'];
    let nickname = this.formGroup.controls['nickname'];
    let circleId = this.formGroup.controls['circleId'];
    let operatorId = this.formGroup.controls['operatorId'];
    this.operator = this.GetOperatorBasedOnID(operatorId.value);
    var ParentId = this.ParentId;

    if (this.Id == null) {

      this.rechargeitem = {
        Id: this.guid(),
        NickName: nickname.value,
        OperatorId: operatorId.value,
        ParentId: this.OSResponseNew[0].ParentId,
        SubscriptionId: subscriptionId.value,
        CircleId: circleId.value,
        Amount: amount.value
      }
      var favouriteitem = {
        Id: this.guid(),
        NickName: nickname.value,
        OperatorId: operatorId.value,
        ParentId: this.OSResponseNew[0].ParentId,
        SubscriptionId: subscriptionId.value,
        CircleId: circleId.value
      }

      var xx: Favourites = this.storageService.GetFavourite();
      if (xx != null) {
        var existingEntries = xx.filter(function (obj) { return obj.ParentId === ParentId; })
        if (existingEntries.length == 0) {
          xx.push(favouriteitem);
          this.storageService.SetFavourite(JSON.stringify(xx));
        }

        else {
          var MobileNumber: string = favouriteitem.SubscriptionId;
          var NickName: string = favouriteitem.NickName;
          var duplicateFavourite: FavouriteItem = existingEntries.find(function (obj) { return obj.SubscriptionId === MobileNumber || obj.NickName === NickName; });
          if (duplicateFavourite == null) {
            xx.push(favouriteitem);

            this.storageService.SetFavourite(JSON.stringify(xx));
          }
          else {
            var Id_old = duplicateFavourite.Id;
            xx = xx.filter(function (obj) {
              return obj.Id !== Id_old;
            });
            duplicateFavourite = {
              Id: Id_old,
              NickName: nickname.value,
              OperatorId: operatorId.value,
              ParentId: this.ParentId,
              SubscriptionId: subscriptionId.value,
              CircleId: circleId.value
            }
            xx.push(duplicateFavourite);
            this.storageService.SetFavourite(JSON.stringify(xx));
          }

        }
      }
      else {
        this.storageService.SetFavourite(JSON.stringify([favouriteitem]));
      }
      this.navCtrl.push(PrepaidConfirmPage, { 'ParentId': this.ParentId, 'Operator': this.operator, 'OperatorId': operatorId.value, 'SubscriptionId': this.rechargeitem.SubscriptionId, 'Amount': this.rechargeitem.Amount });
    }
    else {
      var MobileNumber: string = subscriptionId.value;
      var NickName: string = nickname.value;
      var Id = this.Id;

      var xx: Favourites = this.storageService.GetFavourite();
      var favouriteNew: Favourites = xx.filter(function (obj) { return obj.ParentId === ParentId; })
      var duplicateFavourite: FavouriteItem = favouriteNew.find(function (obj) { return obj.SubscriptionId === MobileNumber || obj.NickName === NickName; });
      favouriteNew = favouriteNew.filter(function (obj) {
        return obj.Id !== Id;
      });
      duplicateFavourite = {
        Id: this.Id,
        NickName: nickname.value,
        OperatorId: operatorId.value,
        ParentId: this.ParentId,
        SubscriptionId: subscriptionId.value,
        CircleId: circleId.value
      }
      xx.push(duplicateFavourite);
      this.storageService.SetFavourite(JSON.stringify(xx));
      this.navCtrl.push(PrepaidConfirmPage, { 'ParentId': this.ParentId, 'Operator': this.operator, 'OperatorId': operatorId.value, 'SubscriptionId': subscriptionId.value, 'Amount': amount.value });
    }
    //above code is for updating or adding row for FavouriteKey local storage.

  }


  GetOperatorBasedOnID(operatorId): string {
    var ParentId = this.ParentId;
    var ListOfOperatorsBasedOnParentID = this.storageService.GetOSResponse();
    var SingleOperatorDetailBasedOnId = ListOfOperatorsBasedOnParentID.find(function (obj) { return obj.Id === operatorId && obj.ParentId === ParentId; });

    this.label = SingleOperatorDetailBasedOnId.Hint;
    return SingleOperatorDetailBasedOnId.Operator;
  }
  StatesOfIndia = [
    { Id: "1", Name: "Delhi/NCR" },
    { Id: "2", Name: "Mumbai" },
    { Id: "3", Name: "Kolkata" },
    { Id: "4", Name: "Maharashtra" },
    { Id: "5", Name: "Andhra Pradesh" },
    { Id: "6", Name: "Tamil Nadu" },
    { Id: "7", Name: "Karnataka" },
    { Id: "8", Name: "Gujarat" },
    { Id: "9", Name: "Uttar Pradesh (E)" },
    { Id: "10", Name: "Madhya Pradesh" },
    { Id: "11", Name: "Uttar Pradesh (W)" },
    { Id: "12", Name: "West Bengal" },
    { Id: "13", Name: "Rajasthan" },
    { Id: "14", Name: "Kerala" },
    { Id: "15", Name: "Punjab " },
    { Id: "16", Name: "Haryana" },
    { Id: "17", Name: "Bihar & Jharkhand" },
    { Id: "18", Name: "Orissa" },
    { Id: "19", Name: "Assam" },
    { Id: "20", Name: "North East" },
    { Id: "21", Name: "Himachal Pradesh" },
    { Id: "22", Name: "Jammu & Kashmir" },
    { Id: "23", Name: "Chennai" }
  ];

  showerrortext: boolean;
  operaterCircle: OperaterCircle;
  singleosrespone: OSResponse;
  oid: string;
  statename: string;
  sid: string;
  singleState: SingleState;

  OnMobileNo(id) {
    if (id.length < 10) {
      this.isMobileNoEntered = false;
      return this.showerrortext = true;
    }
    else {
      let loading = this.loadingController.create({
        content: 'Loading the Operator and Circle..'
      });
      loading.present();
      var firstfive = id.substring(0, 5);
      var operaterCircleQuery = {
        ParentId: this.ParentId,
        TenantId: this.storageService.GetUser().ActiveTenantId,
        Mobile: firstfive
      }

      this.registerService.GetOperaterCircle(operaterCircleQuery).subscribe((data: any) => {
        this.operaterCircle = data;
        var operaterCircle = data;
        if (data.ResponseMessage == null) {
          //var OsId = this.operaterCircle.operator;
          var OsId = operaterCircle.operator;
          //this.operatorname = this.operaterCircle.operator;
          const OSResponseNew = this.OSResponseNew;
          this.singleosrespone = OSResponseNew.find(function (obj) { return obj.Id === OsId; });
          this.oid = this.singleosrespone.Id;
          this.rechargeitem.OperatorId = this.oid;
          //setTimeout(()=>{ this.rechargeitem.OperatorId = this.oid; }, 8000);
          var circle = this.operaterCircle.circle;
          this.statename = this.operaterCircle.circle;
          this.singleState = this.StatesOfIndia.find(function (obj) { return obj.Name === circle })
          this.sid = this.singleState.Id;
          this.rechargeitem.CircleId = this.sid;
          this.isStateEnabled = true;
          this.isOperatorEnabled = true;
          this.isMobileNoEntered = true;
        } else {
          this.isStateEnabled = false;
          this.isOperatorEnabled = false;
          this.isMobileNoEntered = true;
        }
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
  }

  GetDigiPartyandPartyMastID(ActiveTenantId) {
    const DigiParties = this.storageService.GetDigiParty();
    const digiparty = DigiParties.find(function (obj) { return obj.TenantId === ActiveTenantId; });
    return digiparty;
  }

  GetSelfCareAcByTenantID(ActiveTenantId) {
    const SelfCareACs = this.storageService.GetSelfCareAc();
    const selfCareAC = SelfCareACs.find(function (obj) { return obj.TenantId === ActiveTenantId && obj.AcActId == "#SB"; });
    return selfCareAC;
  }
  OperatorChanged(event) {
    this.isOperatorEnabled = true;
    //this.operatorname=this.GetOperatorBasedOnID(event);
  }

  ObjChanged(event) {
    this.ShowLabel = false;
    this.isOperatorEnabled = true;
    if (event != null) {
      this.GetOperatorBasedOnID(event);
    }
  }
  OnGoBack() {
    this.navCtrl.setRoot(PagePage);
  }
  StateChanged(event) {
    this.isStateEnabled = true;
    switch (event) {
      case "1":
        this.statename = "Delhi/NCR";
        break;
      case "2":
        this.statename = "Mumbai";
        break;
      case "3":
        this.statename = "Kolkata";
        break;
      case "4":
        this.statename = "Maharashtra";
        break;
      case "5":
        this.statename = "Andhra Pradesh";
        break;
      case "6":
        this.statename = "Tamil Nadu";
        break;
      case "7":
        this.statename = "Karnataka";
        break;
      case "8":
        this.statename = "Gujarat";
        break;
      case "9":
        this.statename = "Uttar Pradesh (E)";
        break;
      case "10":
        this.statename = "Madhya Pradesh";
        break;
      case "11":
        this.statename = "Uttar Pradesh (W)";
        break;
      case "12":
        this.statename = "West Bengal";
        break;
      case "13":
        this.statename = "Rajasthan";
        break;
      case "14":
        this.statename = "Kerala";
        break;
      case "15":
        this.statename = "Punjab";
        break;
      case "16":
        this.statename = "Haryana";
        break;
      case "17":
        this.statename = "Bihar & Jharkhand";
        break;
      case "18":
        this.statename = "Orissa";
        break;
      case "19":
        this.statename = "Assam";
        break;
      case "20":
        this.statename = "North East";
        break;
      case "21":
        this.statename = "Himachal Pradesh";
        break;
      case "22":
        this.statename = "Jammu & Kashmir";
        break;
      default:
        this.statename = "Chennai";
    }
  }
  OnSubscriberID(value) {
    if (value.length < 10) {
      this.isMobileNoEntered = false;
    } else {
      this.isMobileNoEntered = true;
      this.isOperatorEnabled = true;
      this.isStateEnabled = true;
      this.formGroup.patchValue({
        circleId: "7"
      });
    }
  }
  onAmount(event) {
    if (this.formGroup.controls['amount'].value.length < 1) {
      this.isAmountEntered = false;
      this.isButtonEnabled = false;
      // this.isStateEnabled=false;
      // this.isMobileNoEntered=false;
    } else {
      this.isAmountEntered = true;
      this.isButtonEnabled = true;
      // this.isStateEnabled=true;
      // this.isMobileNoEntered=true;
    }
  }
  onNickName(event) {
    if (this.formGroup.controls['nickname'].value.length < 2) {
      this.isNickNameEntered = false;
    } else {
      this.isNickNameEntered = true;
    }
  }
  OnViewPlans() {
    let subscriptionId = this.formGroup.controls['subscriptionId'];
    let nickname = this.formGroup.controls['nickname'];
    let circleId = this.formGroup.controls['circleId'];
    let operatorId = this.formGroup.controls['operatorId'];
    this.showConfirm = false;
    //this.navCtrl.push(BasicPage, { 'OperatorId':operatorId,'ParentId':this.ParentId});
    // this.navCtrl.push(BasicPage, { 'OperatorId': operatorId, 'CircleId': circleId, 'ParentId': this.ParentId, 'SubscriptionId': subscriptionId, 'nname': nname });
    this.navCtrl.push(BasicPage, { 'OperatorId': operatorId.value, 'CircleId': circleId.value, 'ParentId': this.ParentId, 'SubscriptionId': subscriptionId.value, 'nname': nickname.value });

  }

  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
}
