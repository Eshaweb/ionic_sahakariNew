import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { CompleteTestService } from '../services/CompleteTestService';
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
@Component({
  selector: 'page-mobile-recharge',
  templateUrl: 'mobile-recharge.html'
})
export class MobileRechargePage implements OnInit{

  ElectricityConsumerNo: any;
  DTHNo: any;
  favouriteNewOfDTH: any;
  ParentId: any;
  favouriteitem: FavouriteItem;
  rechargeitem:Recharge;
  OperatorId: any;
  nkname: any;
  mobile: any;
  LocId: any;
  AcSubId: any;
  AcMastId: any;
  recharge: RechargeModel;
  //recharge: Recharge;
  operator: any;
  AmountForRecharge: any;
  favouriteNew: Favourites;
  OId: any;
  Nickname1: string;
  amount: AbstractControl;
  mobno: AbstractControl;
  MobileNo: any;
  SubscriptionId: any;
  nickname: AbstractControl;
  favourites: Favourites;
  ActiveBankName: any;
  selectoperator: AbstractControl;
  gender: string;
  formgroup: FormGroup;
  OSResponseNew: OSResponse;
  osreq:OSRequest ;
  OldOSResponseInString: string;
  Id: string;
  pets: Array<string>;
  ActiveTenantId=JSON.parse(StorageService.GetItem("DigiParty")).TenantId;

  
  constructor(public constant:ConstantService,private regService : RegisterService, public loadingController: LoadingController,private completeTestService : CompleteTestService,public navParams: NavParams,public navCtrl: NavController,public formbuilder:FormBuilder) {
    this.formgroup = formbuilder.group({
      selectoperator:['',[Validators.required,Validators.minLength(2)]],
      mobno:['',[Validators.required,Validators.minLength(10)]],
      amount:['',[Validators.required,Validators.minLength(1)]],
      nickname:['',[Validators.required,Validators.minLength(2)]]
    });
    this.gender = 'f';
    this.selectoperator = this.formgroup.controls['selectoperator'];
    this.mobno = this.formgroup.controls['selectoperator'];
    this.amount = this.formgroup.controls['selectoperator'];
    this.nickname = this.formgroup.controls['selectoperator'];

  }
  ngOnInit(){
    this.ActiveBankName=JSON.parse(StorageService.GetItem("User")).ActiveTenantName;
    this.resetForm();
    this.Id=this.navParams.get('Id');
    this.ParentId=this.navParams.get('ParentId');
    if(this.ParentId=="S3"){
      this.favouriteNewOfDTH=this.ParentId;
    }
    //Below is for page, based on NickName..But HTML is not working..
    if(this.ParentId=="S1"){
    if((StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S1)!=null)&&this.Id!=null){
    var PId=this.Id;
    this.favourites=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S1));
    this.rechargeitem=this.favourites.find(function (obj) { return obj.Id === PId; });
    this.mobile=this.rechargeitem.SubscriptionId;
  }else{
    this.mobile="Enter";
  }
  
}
else if(this.ParentId=="S2"){
  if((StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S2)!=null)&&this.Id!=null){
  var PId=this.Id;
  this.favourites=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S2));
  this.rechargeitem=this.favourites.find(function (obj) { return obj.Id === PId; });
  this.mobile=this.rechargeitem.SubscriptionId;

}else{
  this.mobile="Enter";
}
}
else if(this.ParentId=="S3"){
  this.mobile=null;
  var PId=this.Id;
  if(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S3)!=null&&this.Id!=null){
    this.favourites=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S3));
    this.rechargeitem=this.favourites.find(function (obj) { return obj.Id === PId; });
    this.DTHNo=this.rechargeitem.SubscriptionId;
  }else{
    this.DTHNo="Enter";
  }
}
else if(this.ParentId=="S5"){
  this.mobile=null;
  this.DTHNo=null;
  
  var PId=this.Id;
  if(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S5)!=null&&this.Id!=null){
    this.favourites=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S5));
    this.rechargeitem=this.favourites.find(function (obj) { return obj.Id === PId; });
    this.ElectricityConsumerNo=this.rechargeitem.SubscriptionId;
  }else{
    this.ElectricityConsumerNo="Enter";
  }
}  

    // else{

    // }
    if(StorageService.GetItem("OSResponse")==null){
    this.OldOSResponseInString="";
    }
    else{
      this.OldOSResponseInString=StorageService.GetItem("OSResponse");
    }
    //this.OSResponseNew=JSON.parse(StorageService.GetItem("OSResponse"));
    this.osreq={
      Starts:"",
      //PerentId:localStorage.getItem('OS.Id'),
      PerentId:this.ParentId,
      TenantId:this.ActiveTenantId,
    }
    this.regService.GetOperators(this.osreq).subscribe((data : any)=>{
      this.OSResponseNew = data;
  // if(this.OSResponseNew[0].ParentId=="S1"){
  //   StorageService.SetItem("OS(S1)",JSON.stringify(this.OSResponseNew))
  // }
  // else if(this.OSResponseNew[0].ParentId=="S2"){
  //   StorageService.SetItem("OS(S2)",JSON.stringify(this.OSResponseNew))
  // }
  // else if(this.OSResponseNew[0].ParentId=="S3"){
  //   StorageService.SetItem("OS(S3)",JSON.stringify(this.OSResponseNew))
  // }

  switch (this.OSResponseNew[0].ParentId) {
    case "S1":
    StorageService.SetItem(this.constant.osBasedOnParentId.OS_S1,JSON.stringify(this.OSResponseNew));
      break;
    case "S2":
    StorageService.SetItem(this.constant.osBasedOnParentId.OS_S2,JSON.stringify(this.OSResponseNew))
      break;
    case "S3":
    StorageService.SetItem(this.constant.osBasedOnParentId.OS_S3,JSON.stringify(this.OSResponseNew))
      break;
    case "S4":
    StorageService.SetItem(this.constant.osBasedOnParentId.OS_S4,JSON.stringify(this.OSResponseNew))
      break;
    case "S5":
    StorageService.SetItem(this.constant.osBasedOnParentId.OS_S5,JSON.stringify(this.OSResponseNew))
      break;
    case "S6":
    StorageService.SetItem(this.constant.osBasedOnParentId.OS_S6,JSON.stringify(this.OSResponseNew))
      break;
    default:
    StorageService.SetItem(this.constant.osBasedOnParentId.OS_S7,JSON.stringify(this.OSResponseNew))
  }
    });
    //this.completeTestService=
  }

  resetForm(form?: NgForm) {
    if (form != null)
      form.reset();
  this.favouriteitem = {
    Id: '',
    NickName: '',
    OperatorId: '',
    ParentId: '',
    SubscriptionId: ''
  }
  this.rechargeitem = {
    Id: '',
    NickName: '',
    OperatorId: '',
    ParentId: '',
    SubscriptionId: '',
    Amount:''
  }
}

  OnClick(form: NgForm){
  //   OnClick(id,mob,amnt,nkname){
  //    this.AmountForRecharge=amnt;
  //this.AmountForRecharge=form.value.amount;
  // this.OId=id;
  // this.MobileNo=mob;
  // this.Nickname1=nkname;
  if(this.Id==null){
    this.rechargeitem={
      
      Id:this.guid(),
      //OperatorId:this.OId,
      OperatorId:this.rechargeitem.OperatorId,
      //SubscriptionId:this.MobileNo,
      SubscriptionId:this.rechargeitem.SubscriptionId,
      ParentId:this.OSResponseNew[0].ParentId,
      //NickName:this.Nickname1
      NickName:this.rechargeitem.NickName,
      Amount:this.rechargeitem.Amount
    }

    this.favouriteitem={ 
      Id:this.guid(),
      OperatorId:this.rechargeitem.OperatorId,
      SubscriptionId:this.rechargeitem.SubscriptionId,
      ParentId:this.OSResponseNew[0].ParentId,
      NickName:this.rechargeitem.NickName
    }

    switch (this.OSResponseNew[0].ParentId) {
      case "S1":
      var existingEntries = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S1));
      break;
      case "S2":
      var existingEntries = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S2));
        break;
      case "S3":
      var existingEntries = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S3));
        break;
      case "S4":
      var existingEntries = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S4));
        break;
      case "S5":
      var existingEntries = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S5));
        break;
      case "S6":
      var existingEntries = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S6));
        break;
      default:
      var existingEntries = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S7));
    }
    //var existingEntries = JSON.parse(StorageService.GetItem("Favourite"));
    if(existingEntries == null){ 
      switch (this.OSResponseNew[0].ParentId) {
        case "S1":
        StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S1, JSON.stringify([this.favouriteitem]));
        break;
        case "S2":
        StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S2, JSON.stringify([this.favouriteitem]));
          break;
        case "S3":
        StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S3, JSON.stringify([this.favouriteitem]));
          break;
        case "S4":
        StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S4, JSON.stringify([this.favouriteitem]));
          break;
        case "S5":
        StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S5, JSON.stringify([this.favouriteitem]));
          break;
        case "S6":
        StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S6, JSON.stringify([this.favouriteitem]));
          break;
        default:
        StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S7, JSON.stringify([this.favouriteitem]));
      }
      //localStorage.setItem(this.constant.DB.Favourite, JSON.stringify([this.favouriteitem]));
    }
    // else if(existingEntries==){

    // }
    else{
      existingEntries.push(this.favouriteitem);

      switch (this.OSResponseNew[0].ParentId) {
        case "S1":
        StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S1,JSON.stringify(existingEntries));  
        break;
        case "S2":
        StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S2,JSON.stringify(existingEntries));  
          break;
        case "S3":
        StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S3,JSON.stringify(existingEntries));  
          break;
        case "S4":
        StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S4,JSON.stringify(existingEntries));  
          break;
        case "S5":
        StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S5,JSON.stringify(existingEntries));  
          break;
        case "S6":
        StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S6,JSON.stringify(existingEntries));  
          break;
        default:
        StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S7,JSON.stringify(existingEntries));  
      }
      //StorageService.SetItem(this.constant.DB.Favourite,JSON.stringify(existingEntries));  
    }
  }
    
    //above code is for updating or adding row for FavouriteKey local storage.

    //StorageService.SetItem(this.constant.DB.FavouriteKey,JSON.stringify([this.favourite]));  
    
    switch (this.OSResponseNew[0].ParentId) {
      case "S1":
      this.favouriteNew=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S1));
      break;
      case "S2":
      this.favouriteNew=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S2));
        break;
      case "S3":
      this.favouriteNew=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S3));
        break;
      case "S4":
      this.favouriteNew=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S4));
        break;
      case "S5":
      this.favouriteNew=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S5));
        break;
      case "S6":
      this.favouriteNew=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S6));
        break;
      default:
      this.favouriteNew=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S7));
    }
    //this.favouriteNew=JSON.parse(StorageService.GetItem("Favourite"));
    switch (this.rechargeitem.OperatorId) {
      case "O1":
      this.operator="Airtel";
      break;
      case "O2":
      this.operator="BSNL";       
      break;
      case "O3":
      this.operator="Vodafone";        
      break;
      case "O4":
      this.operator="Idea";
        break;
      case "O5":
      this.operator="Jio";
        break;
      case "O6":
      this.operator="Reliance GSM";
        break;
      case "O7":
      this.operator="Reliance CDMA";
      break;
      case "O8":
      this.operator="Tata Indicom";       
      break;
      case "O9":
      this.operator="Tata Docomo";        
      break;
      case "O10":
      this.operator="Telenor";
        break;
      case "O11":
      this.operator="MTNL";
        break;
      case "O12":
      this.operator="Aircel";
        break;
        case "O13":
      this.operator="Videocon";
      break;
      case "O14":
      this.operator="MTS";       
      break;
      case "O15":
      this.operator="BSNL STV";        
      break;
      case "O16":
      this.operator="Tata Docomo STV";
      break;
      case "O17":
      this.operator="Telenor STV";
      break;
      case "O18":
      this.operator="VIDEOCON STV";
      break;
      case "O19":
      this.operator="MTNL STV";
      break;
      case "O20":
      this.operator="Airtel";
      break;
      case "O21":
      this.operator="Idea";
      break;
      case "O22":
      this.operator="Vodafone";
      break;
      case "O23":
      this.operator="Reliance GSM";
      break;
      case "O24":
      this.operator="Reliance CDMA";
      break;
      case "O25":
      this.operator="Tata Docomo";
      break;
      case "O26":
      this.operator="Aircel";
      break;
      case "O27":
      this.operator="MTS";
      break;
      case "O28":
      this.operator="BSNL";
      break;
      case "O29":
      this.operator="Dish TV";
      break;
      case "O30":
      this.operator="TATA Sky";
      break;
      case "O31":
      this.operator="Sun TV";
      break;
      case "O32":
      this.operator="Videocon D2H TV";
      break;
      case "O33":
      this.operator="Reliance Big TV";
      break;
      case "O34":
      this.operator="Airtel Digital TV";
      break;
      default:
      this.operator="BESCOM";
    }
  }

OnPress(){
  // var param=JSON.parse(localStorage.getItem("SelfCareAcKey"));
  // this.AcMastId=param[0].AcHeadId;
var  DigiPartyId=JSON.parse(StorageService.GetItem("DigiParty")).DigiPartyId;
 var PartyMastId=JSON.parse(StorageService.GetItem("DigiParty")).PartyMastId;
  
  this.AcMastId=JSON.parse(StorageService.GetItem("SelfCareAc"))[0].AcHeadId;
  this.AcSubId=JSON.parse(StorageService.GetItem("SelfCareAc"))[0].AcSubId;
  this.LocId=JSON.parse(StorageService.GetItem("SelfCareAc"))[0].LocId;
  switch (this.OSResponseNew[0].ParentId) {
    case "S1":
    this.OperatorId=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S1)).OperatorId;
    break;
    case "S2":
    this.OperatorId=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S2)).OperatorId;
    break;
    case "S3":
    this.OperatorId=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S3)).OperatorId;
      break;
    case "S4":
    this.OperatorId=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S4)).OperatorId;
      break;
    case "S5":
    this.OperatorId=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S5)).OperatorId;
      break;
    case "S6":
    this.OperatorId=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S6)).OperatorId;
      break;
    default:
    this.OperatorId=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S7)).OperatorId;
  }
  //this.OperatorId=JSON.parse(StorageService.GetItem("Favourite")).OperatorId;
  this.recharge={
  TenantId:this.ActiveTenantId,
  DigiPartyId:DigiPartyId,
  PartyMastId:PartyMastId,
  AcMastId:this.AcMastId,
  AcSubId:this.AcSubId,
  Amount:this.rechargeitem.Amount,
  OperatorId:this.rechargeitem.OperatorId,
  //OperatorId:this.OId,
  SubscriptionId:this.rechargeitem.SubscriptionId,
  LocId:this.LocId  
}
    this.regService.PostRecharge(this.recharge).subscribe((data : any)=>{


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
