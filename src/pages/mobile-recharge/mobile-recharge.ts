import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, Navbar, ViewController } from 'ionic-angular';
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
@Component({
  selector: 'page-mobile-recharge',
  templateUrl: 'mobile-recharge.html'
})
export class MobileRechargePage implements OnInit {
  nicknameMessage: string;
  subscriptionIdMessage: string;

  title: string;
  @ViewChild(Navbar) navBar: Navbar;
  showNavbar: boolean;

  gender: string;
  formGroup: FormGroup;
  ActiveTenantId = StorageService.GetUser().ActiveTenantId;


  constructor(private uiService: UISercice, public viewCtrl: ViewController, private toastr: ToastrService, public constant: ConstantService, private registerService: RegisterService, public loadingController: LoadingController, public navParams: NavParams, public navCtrl: NavController, public formbuilder: FormBuilder) {
    this.formGroup = formbuilder.group({
      //selectoperator:['',[Validators.required,Validators.minLength(2)]],
      subscriptionId: ['', [Validators.required, Validators.minLength(10)]],
      operatorId: ['', [Validators.required]],
      circleId: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.minLength(1)]],
      nickname: ['', [Validators.required, Validators.minLength(2)]]
    });

    const subscriptionIdControl = this.formGroup.get('subscriptionId');
    subscriptionIdControl.valueChanges.subscribe(value => this.setErrorMessage(subscriptionIdControl));
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
    // this.amount = this.formGroup.controls['amount'];
    let nickname = this.formGroup.controls['nickname'];
    // this.circleId = this.formGroup.controls['circleId'];
    this.subscriptionIdMessage = '';
    this.nicknameMessage = '';
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
    }
    else {
      if (control === 'subscriptionId' && subscriptionId.value != null && (this.ParentId == "S3" || this.ParentId == "S5")) {
        //this.OnMobileNo(this.subscriptionId.value);
      }
      else if (control === 'subscriptionId' && subscriptionId.value != null) {
        this.OnMobileNo(subscriptionId.value);
      }
      else if (control === 'nickname' && nickname.value != null) {
        this.onNickName(nickname.value);
      }
    }
  }
  private validationMessages = {
    subscriptionId_required: '*Enter the Field',
    subscriptionId_minlength: 'Field cannot be less than 10 character',

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
  OldOSResponseInString: string;
  oSRequest: OSRequest;
  OSResponseNew: OSResponse;
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
    this.ActiveBankName = StorageService.GetActiveBankName();
    //this.resetForm();
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
      if ((StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S1) != null) && this.Id != null) {
        var PId = this.Id;
        this.favourites = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S1));
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
      if ((StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S2) != null) && this.Id != null) {
        var PId = this.Id;
        this.favourites = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S2));
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
      if (StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S3) != null && this.Id != null) {
        this.favourites = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S3));
        this.rechargeitem = this.favourites.find(function (obj) { return obj.Id === PId; });
        //this.favouriteitem = this.favourites.find(function (obj) { return obj.Id === PId; });
        this.DTHNo = this.rechargeitem.SubscriptionId;
        this.title = "DTH RECHARGE";
        this.ShowLabel = true;
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
      if (StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S5) != null && this.Id != null) {
        this.favourites = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S5));
        this.rechargeitem = this.favourites.find(function (obj) { return obj.Id === PId; });
        this.ElectricityConsumerNo = this.rechargeitem.SubscriptionId;
        this.title = "ELECTRICITY BILL";
        this.isOperatorEnabled = true;
        this.isNickNameEntered = true;
        this.isMobileNoEntered = true;
      } else {
        this.ElectricityConsumerNo = "Enter";
        this.title = "ELECTRICITY BILL";
      }
    }

    if (StorageService.GetItem("OSResponse") == null) {
      this.OldOSResponseInString = "";
    }
    else {
      this.OldOSResponseInString = StorageService.GetItem("OSResponse");
    }
    var oSRequest = {
      Starts: "",
      PerentId: this.ParentId,
      TenantId: this.ActiveTenantId,
    }
    this.registerService.GetOperators(oSRequest).subscribe((data: any) => {
      this.OSResponseNew = data;

      switch (this.OSResponseNew[0].ParentId) {
        case "S1":
          StorageService.SetItem(this.constant.osBasedOnParentId.OS_S1, JSON.stringify(this.OSResponseNew));
          break;
        case "S2":
          StorageService.SetItem(this.constant.osBasedOnParentId.OS_S2, JSON.stringify(this.OSResponseNew))
          break;
        case "S3":
          StorageService.SetItem(this.constant.osBasedOnParentId.OS_S3, JSON.stringify(this.OSResponseNew))
          break;
        case "S4":
          StorageService.SetItem(this.constant.osBasedOnParentId.OS_S4, JSON.stringify(this.OSResponseNew))
          break;
        case "S5":
          StorageService.SetItem(this.constant.osBasedOnParentId.OS_S5, JSON.stringify(this.OSResponseNew))
          break;
        case "S6":
          StorageService.SetItem(this.constant.osBasedOnParentId.OS_S6, JSON.stringify(this.OSResponseNew))
          break;
        default:
          StorageService.SetItem(this.constant.osBasedOnParentId.OS_S7, JSON.stringify(this.OSResponseNew))
      }
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

  existingentry: FavouriteItem;
  duplicateFavourite: FavouriteItem;
  showConfirm: boolean;
  label: string;
  operator: string;
  favouriteNew: Favourites;
  
  OnNext() {
    let subscriptionId = this.formGroup.controls['subscriptionId'];
    let amount = this.formGroup.controls['amount'];
    let nickname = this.formGroup.controls['nickname'];
    let circleId = this.formGroup.controls['circleId'];
    let operatorId = this.formGroup.controls['operatorId'];
    this.operator=this.GetOperatorBasedOnID(operatorId.value);

    if (this.Id == null) {

      this.rechargeitem = {
        Id: this.guid(),
        OperatorId: operatorId.value,
        SubscriptionId: subscriptionId.value,
        ParentId: this.OSResponseNew[0].ParentId,
        NickName: nickname.value,
        Amount: amount.value,
        CircleId: circleId.value
      }
      var favouriteitem = {
        Id: this.guid(),
        NickName: nickname.value,
        OperatorId: operatorId.value,
        ParentId: this.OSResponseNew[0].ParentId,
        SubscriptionId: subscriptionId.value,
        CircleId: circleId.value
      }
      switch (this.OSResponseNew[0].ParentId) {
        case "S1":
          var existingEntries: FavouriteItem = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S1));
          break;
        case "S2":
          var existingEntries: FavouriteItem = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S2));
          break;
        case "S3":
          var existingEntries: FavouriteItem = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S3));
          break;
        case "S4":
          var existingEntries: FavouriteItem = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S4));
          break;
        case "S5":
          var existingEntries: FavouriteItem = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S5));
          break;
        case "S6":
          var existingEntries: FavouriteItem = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S6));
          break;
        default:
          var existingEntries: FavouriteItem = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S7));
      }
      if (existingEntries == null) {
        switch (this.OSResponseNew[0].ParentId) {
          case "S1":
            StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S1, JSON.stringify([favouriteitem]));
            break;
          case "S2":
            StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S2, JSON.stringify([favouriteitem]));
            break;
          case "S3":
            StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S3, JSON.stringify([favouriteitem]));
            break;
          case "S4":
            StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S4, JSON.stringify([favouriteitem]));
            break;
          case "S5":
            StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S5, JSON.stringify([favouriteitem]));
            break;
          case "S6":
            StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S6, JSON.stringify([favouriteitem]));
            break;
          default:
            StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S7, JSON.stringify([favouriteitem]));
        }
        //localStorage.setItem(this.constant.DB.Favourite, JSON.stringify([this.favouriteitem]));
      }

      else {
        var MobileNumber: string = favouriteitem.SubscriptionId;
        var NickName: string = favouriteitem.NickName;
        var duplicateFavourite: FavouriteItem = existingEntries.find(function (obj) { return obj.SubscriptionId === MobileNumber || obj.NickName === NickName; });
        if (duplicateFavourite == null) {
          existingEntries.push(favouriteitem);
          switch (this.OSResponseNew[0].ParentId) {
            case "S1":
              StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S1, JSON.stringify(existingEntries));
              break;
            case "S2":
              StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S2, JSON.stringify(existingEntries));
              break;
            case "S3":
              StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S3, JSON.stringify(existingEntries));
              break;
            case "S4":
              StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S4, JSON.stringify(existingEntries));
              break;
            case "S5":
              StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S5, JSON.stringify(existingEntries));
              break;
            case "S6":
              StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S6, JSON.stringify(existingEntries));
              break;
            default:
              StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S7, JSON.stringify(existingEntries));
          }
        }
        else {
          //No action needed

        }

      }
      switch (this.OSResponseNew[0].ParentId) {
        case "S1":
          this.favouriteNew = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S1));
          this.navCtrl.push(PrepaidConfirmPage, { 'ParentId': "S1", 'Operator': this.operator, 'SubscriptionId': this.rechargeitem.SubscriptionId, 'Amount': this.rechargeitem.Amount });
          break;
        case "S2":
          this.favouriteNew = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S2));
          this.navCtrl.push(PrepaidConfirmPage, { 'ParentId': "S2", 'Operator': this.operator, 'SubscriptionId': this.rechargeitem.SubscriptionId, 'Amount': this.rechargeitem.Amount });
          // this.ShowEntryForm = false;
          // this.showConfirm = true;
          break;
        case "S3":
          this.favouriteNew = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S3));
          // this.navCtrl.push(PrepaidConfirmPage, { 'ParentId':"S3",'Operator': this.operator, 'SubscriptionId': this.rechargeitem.SubscriptionId, 'Amount': this.rechargeitem.Amount });
          this.navCtrl.push(PrepaidConfirmPage, { 'ParentId': "S3", 'Operator': this.operator, 'SubscriptionId': subscriptionId.value, 'Amount': amount.value });
          // this.ShowEntryForm = false;
          // this.showConfirm = true;
          break;
        case "S4":
          this.favouriteNew = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S4));
          this.navCtrl.push(PrepaidConfirmPage, { 'ParentId': "S4", 'Operator': this.operator, 'SubscriptionId': this.rechargeitem.SubscriptionId, 'Amount': this.rechargeitem.Amount });
          // this.ShowEntryForm = false;
          // this.showConfirm = true;
          break;
        case "S5":
          this.favouriteNew = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S5));
          this.navCtrl.push(PrepaidConfirmPage, { 'ParentId': "S5", 'Operator': this.operator, 'SubscriptionId': this.rechargeitem.SubscriptionId, 'Amount': this.rechargeitem.Amount });
          // this.ShowEntryForm = false;
          // this.showConfirm = true;
          break;
        case "S6":
          this.favouriteNew = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S6));
          this.ShowEntryForm = false;
          this.showConfirm = true;
          break;
        default:
          this.favouriteNew = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S7));
      }
    }
    else {
      var MobileNumber: string = subscriptionId.value;
      var NickName: string = nickname.value;
      var Id = this.Id;
      switch (this.OSResponseNew[0].ParentId) {
        case "S1":
          var favouriteNew: Favourites = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S1));
          var duplicateFavourite: FavouriteItem = favouriteNew.find(function (obj) { return obj.SubscriptionId === MobileNumber || obj.NickName === NickName; });
          favouriteNew = favouriteNew.filter(function (obj) {
            return obj.Id !== Id;
          });
          duplicateFavourite = {
            Id: this.Id,
            NickName: nickname.value,
            OperatorId: operatorId.value,
            ParentId: this.OSResponseNew[0].ParentId,
            SubscriptionId: subscriptionId.value,
            CircleId: circleId.value
          }
          favouriteNew.push(duplicateFavourite);

          StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S1, JSON.stringify(favouriteNew));
          this.navCtrl.push(PrepaidConfirmPage, { 'ParentId': this.OSResponseNew[0].ParentId, 'Operator': this.operator, 'SubscriptionId': subscriptionId.value, 'Amount': amount.value });
          break;
        case "S2":
          var favouriteNew: Favourites = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S2));
          var duplicateFavourite: FavouriteItem = favouriteNew.find(function (obj) { return obj.SubscriptionId === MobileNumber || obj.NickName === NickName; });
          favouriteNew = favouriteNew.filter(function (obj) {
            return obj.Id !== Id;
          });
          duplicateFavourite = {
            Id: this.Id,
            NickName: nickname.value,
            OperatorId: operatorId.value,
            ParentId: this.OSResponseNew[0].ParentId,
            SubscriptionId: subscriptionId.value,
            CircleId: circleId.value
          }
          favouriteNew.push(duplicateFavourite);

          StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S2, JSON.stringify(favouriteNew));
          this.navCtrl.push(PrepaidConfirmPage, { 'ParentId': this.OSResponseNew[0].ParentId, 'Operator': this.operator, 'SubscriptionId': subscriptionId.value, 'Amount': amount.value });
          break;
        case "S3":
          var favouriteNew: Favourites = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S3));
          var duplicateFavourite: FavouriteItem = favouriteNew.find(function (obj) { return obj.SubscriptionId === MobileNumber || obj.NickName === NickName; });
          favouriteNew = favouriteNew.filter(function (obj) {
            return obj.Id !== Id;
          });
          duplicateFavourite = {
            Id: this.Id,
            NickName: nickname.value,
            OperatorId: operatorId.value,
            ParentId: this.OSResponseNew[0].ParentId,
            SubscriptionId: subscriptionId.value,
            CircleId: circleId.value
          }
          favouriteNew.push(duplicateFavourite);

          StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S3, JSON.stringify(favouriteNew));
          this.navCtrl.push(PrepaidConfirmPage, { 'ParentId': this.OSResponseNew[0].ParentId, 'Operator': this.operator, 'SubscriptionId': subscriptionId.value, 'Amount': amount.value });
          break;
        case "S4":
          var favouriteNew: Favourites = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S4));
          var duplicateFavourite: FavouriteItem = favouriteNew.find(function (obj) { return obj.SubscriptionId === MobileNumber || obj.NickName === NickName; });
          favouriteNew = favouriteNew.filter(function (obj) {
            return obj.Id !== Id;
          });
          duplicateFavourite = {
            Id: this.Id,
            NickName: nickname.value,
            OperatorId: operatorId.value,
            ParentId: this.OSResponseNew[0].ParentId,
            SubscriptionId: subscriptionId.value,
            CircleId: circleId.value
          }
          favouriteNew.push(duplicateFavourite);

          StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S4, JSON.stringify(favouriteNew));
          this.navCtrl.push(PrepaidConfirmPage, { 'ParentId': this.OSResponseNew[0].ParentId, 'Operator': this.operator, 'SubscriptionId': subscriptionId.value, 'Amount': amount.value });
          break;
        case "S5":
          var favouriteNew: Favourites = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S5));
          var duplicateFavourite: FavouriteItem = favouriteNew.find(function (obj) { return obj.SubscriptionId === MobileNumber || obj.NickName === NickName; });
          favouriteNew = favouriteNew.filter(function (obj) {
            return obj.Id !== Id;
          });
          duplicateFavourite = {
            Id: this.Id,
            NickName: nickname.value,
            OperatorId: operatorId.value,
            ParentId: this.OSResponseNew[0].ParentId,
            SubscriptionId: subscriptionId.value,
            CircleId: circleId.value
          }
          favouriteNew.push(duplicateFavourite);
          StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S5, JSON.stringify(favouriteNew));
          this.navCtrl.push(PrepaidConfirmPage, { 'ParentId': this.OSResponseNew[0].ParentId, 'Operator': this.operator, 'SubscriptionId': subscriptionId.value, 'Amount': amount.value });
          break;
        case "S6":
          var favouriteNew: Favourites = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S6));
          var duplicateFavourite: FavouriteItem = favouriteNew.find(function (obj) { return obj.SubscriptionId === MobileNumber || obj.NickName === NickName; });
          favouriteNew = favouriteNew.filter(function (obj) {
            return obj.Id !== Id;
          });
          duplicateFavourite = {
            Id: this.Id,
            NickName: nickname.value,
            OperatorId: operatorId.value,
            ParentId: this.OSResponseNew[0].ParentId,
            SubscriptionId: subscriptionId.value,
            CircleId: circleId.value
          }
          favouriteNew.push(duplicateFavourite);

          StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S6, JSON.stringify(favouriteNew));
          this.navCtrl.push(PrepaidConfirmPage, { 'ParentId': this.OSResponseNew[0].ParentId, 'Operator': this.operator, 'SubscriptionId': subscriptionId.value, 'Amount': amount.value });
          break;
        default:
          this.favouriteNew = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S7));
      }
    }
    //above code is for updating or adding row for FavouriteKey local storage.

  }


  GetOperatorBasedOnID(operatorId): string {
    switch (this.ParentId) {
      case "S1": var ListOfOperatorsBasedOnParentID = JSON.parse(StorageService.GetItem("OS(S1)"));
        break;
      case "S2": var ListOfOperatorsBasedOnParentID = JSON.parse(StorageService.GetItem("OS(S2)"));
        break;
      case "S3": var ListOfOperatorsBasedOnParentID = JSON.parse(StorageService.GetItem("OS(S3)"));
        break;
      case "S4": var ListOfOperatorsBasedOnParentID = JSON.parse(StorageService.GetItem("OS(S4)"));
        break;
      case "S5": var ListOfOperatorsBasedOnParentID = JSON.parse(StorageService.GetItem("OS(S5)"));
        break;
      case "S6": var ListOfOperatorsBasedOnParentID = JSON.parse(StorageService.GetItem("OS(S6)"));
        break;
      default: var ListOfOperatorsBasedOnParentID = JSON.parse(StorageService.GetItem("OS(S7)"));
        break;
    }
    var SingleOperatorDetailBasedOnId = ListOfOperatorsBasedOnParentID.find(function (obj) { return obj.Id === operatorId; });
    switch (SingleOperatorDetailBasedOnId.Operator) {
      case "Dish TV":
        this.label = "Viewing Card Number";
        this.osid="29";
        break;
      case "TATA Sky":
        this.label = "Registered Mobile Number or Subscriber ID";
        this.osid="30";
        break;
      case "Sun TV":
        this.label = "Smart Card Number";
        this.osid="31";
        break;
      case "Videocon D2H TV":
        this.label = "Subscriber ID";
        this.osid="32";
        break;
      case "Reliance Big TV":
        this.label = "Smart Card Number";
        this.osid="33";
        break;
      default:
        this.label = "Customer ID";
        this.osid="34";
        break;
    }
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
  StatesOfIndiayy = { "1": "Delhi/NCR", "2": "" }
  OperatorsOfIndia = [
    { Id: "1", Name: "Aircel" },
    { Id: "2", Name: "Airtel" },
    { Id: "O2", Name: "BSNL" },
    { Id: "4", Name: "Idea" },
    { Id: "5", Name: "Jio" },
    { Id: "6", Name: "MTNL" },
    { Id: "7", Name: "MTS" },
    { Id: "8", Name: "Reliance Mobile" },
    { Id: "9", Name: "Tata Docomo CDMA" },
    { Id: "10", Name: "Tata Docomo GSM" },
    { Id: "11", Name: "Telenor" },
    { Id: "12", Name: "Vodafone" },
  ];
  showerrortext: boolean;
  //operaterCircleQuery: OperaterCircleQuery;
  operaterCircle: OperaterCircle;
  singleosrespone: OSResponse;
  oid: string;
  statename: string;
  sid: string;
  singleState: SingleState;
  operatorname: string;

  // OnMobileNo(id) {
  OnMobileNo(id) {
    if (id.length < 10) {
      //return null;
      this.isMobileNoEntered = false;
      return this.showerrortext = true;
    } else {
      var firstfive = id.substring(0, 5);
      var operaterCircleQuery = {
        Mobile: firstfive
      }
      this.registerService.GetOperaterCircle(operaterCircleQuery).subscribe((data: any) => {
        this.operaterCircle = data;
        var operator = this.operaterCircle.operator;
        //this.operatorname = this.operaterCircle.operator;
        this.singleosrespone = this.OSResponseNew.find(function (obj) { return obj.Operator === operator; });
        this.oid = this.singleosrespone.Id;
        this.rechargeitem.OperatorId = this.oid;

        var circle = this.operaterCircle.circle;
        this.statename = this.operaterCircle.circle;
        this.singleState = this.StatesOfIndia.find(function (obj) { return obj.Name === circle })
        this.sid = this.singleState.Id;
        this.rechargeitem.CircleId = this.sid;
      });
      this.isStateEnabled = true;
      this.isOperatorEnabled = true;
      this.isMobileNoEntered = true;
    }
  }

  GetDigiPartyandPartyMastID(ActiveTenantId) {
    const DigiParties = StorageService.GetDigiParty();
    const digiparty = DigiParties.find(function (obj) { return obj.TenantId === ActiveTenantId; });
    return digiparty;
  }

  GetSelfCareAcByTenantID(ActiveTenantId) {
    const SelfCareACs = StorageService.GetSelfCareAc();
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
    this.GetOperatorBasedOnID(event);
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
    }
  }
  onAmount(event) {

    if (this.formGroup.controls['amount'].value.length < 1) {
      this.isAmountEntered = false;
      this.isButtonEnabled = false;
    } else {
      this.isAmountEntered = true;
      this.isButtonEnabled = true;
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
  //rechargeModel: RechargeModel;
  tranResponse: TranResponse;
  showSuccess: boolean;
  OperatorId: string;

  OnConfirm() {
    let loading = this.loadingController.create({
      content: 'Recharging...'
    });
    loading.present();
    switch (this.OSResponseNew[0].ParentId) {
      case "S1":
        this.OperatorId = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S1)).OperatorId;
        break;
      case "S2":
        this.OperatorId = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S2)).OperatorId;
        break;
      case "S3":
        this.OperatorId = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S3)).OperatorId;
        break;
      case "S4":
        this.OperatorId = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S4)).OperatorId;
        break;
      case "S5":
        this.OperatorId = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S5)).OperatorId;
        break;
      case "S6":
        this.OperatorId = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S6)).OperatorId;
        break;
      default:
        this.OperatorId = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S7)).OperatorId;
    }
    //this.OperatorId=JSON.parse(StorageService.GetItem("Favourite")).OperatorId;
    var rechargeModel: RechargeModel = {
      TenantId: this.ActiveTenantId,
      DigiPartyId: this.GetDigiPartyandPartyMastID(this.ActiveTenantId).DigiPartyId,
      PartyMastId: this.GetDigiPartyandPartyMastID(this.ActiveTenantId).PartyMastId,
      AcMastId: this.GetSelfCareAcByTenantID(this.ActiveTenantId).AcHeadId,
      AcSubId: this.GetSelfCareAcByTenantID(this.ActiveTenantId).AcSubId,
      // Amount: this.rechargeitem.Amount,
      // OperatorId: this.rechargeitem.OperatorId,
      // SubscriptionId: this.rechargeitem.SubscriptionId,
      Amount: this.formGroup.controls['amount'].value,
      OperatorId: this.formGroup.controls['operatorId'].value,
      SubscriptionId: this.formGroup.controls['subscriptionId'].value,
      LocId: this.GetSelfCareAcByTenantID(this.ActiveTenantId).LocId
    }
    this.registerService.PostRecharge(rechargeModel).subscribe((data: any) => {
      this.tranResponse = data;
      this.showConfirm = false;
      this.toastr.success('Recharge is successful with ' + this.tranResponse.StatusCode, 'Success!');
      this.showSuccess = true;
      loading.dismiss();
    }, (error) => {
      this.toastr.error(error.message, 'Error!')
      loading.dismiss();
    });
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
