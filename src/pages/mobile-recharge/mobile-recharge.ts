import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
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
import { Tenant } from '../LocalStorageTables/Tenant';
import { DigiParty } from '../LocalStorageTables/DigiParty';
import { SelfCareAc } from '../LocalStorageTables/SelfCareAc';
import { ToastrService } from 'ngx-toastr';
import { TranResponse } from '../View Models/TranResponse';
import { PlanRequest } from '../View Models/PlanRequest';
import { PlanResponse, PlanDet } from '../View Models/PlanResponse';
import { PlanTypes } from '../View Models/PlanTypes';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { OperaterCircleQuery } from '../View Models/OperaterCircleQuery';
import { OperaterCircle } from '../View Models/OperaterCircle';
import { SingleState } from '../View Models/SingleState';
import { BasicPage, TabBasicContentPage1 } from '../ViewPlans_Tabs/ViewPlans_Tabs';
@Component({
  selector: 'page-mobile-recharge',
  templateUrl: 'mobile-recharge.html'
})
export class MobileRechargePage implements OnInit{

  statename: string;
  operatorname: string;
  showerrortext: boolean;
  oid: string;
  sid: string;
  singleState: SingleState;
  singleosrespone: OSResponse;
  operatorcircle: OperaterCircle;
  operatorcircleqry: OperaterCircleQuery;
  showSuccess: boolean;
  showConfirm: boolean;
  osid: string;
  planResponse: PlanDet;
  planRequest: PlanRequest;
  tranresponse: TranResponse;
  selfCareAC: SelfCareAc;
  SelfCareACs: SelfCareAc;
  PartyMastID: any;
  DigiPartyId: any;
  digiparty: DigiParty;
  DigiParties: DigiParty;
  ShowEntryForm: boolean;
  existingentry: FavouriteItem;
  duplicateFavourite: FavouriteItem;
  ShowLabel: boolean;
  label: string;
  Tenant: Tenant;
  Tenants: Tenant;
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
  ActiveTenantId=JSON.parse(StorageService.GetItem(this.constant.DB.User)).ActiveTenantId;

  
  constructor(private toastr: ToastrService,public constant:ConstantService,private regService : RegisterService, public loadingController: LoadingController, public navParams: NavParams,public navCtrl: NavController,public formbuilder:FormBuilder) {
    this.formgroup = formbuilder.group({
      //selectoperator:['',[Validators.required,Validators.minLength(2)]],
      mobno:['',[Validators.required,Validators.minLength(10)]],
      amount:['',[Validators.required,Validators.minLength(1)]],
      nickname:['',[Validators.required,Validators.minLength(2)]]
    });
    this.gender = 'f';
    //this.selectoperator = this.formgroup.controls['selectoperator'];
    this.mobno = this.formgroup.controls['selectoperator'];
    this.amount = this.formgroup.controls['selectoperator'];
    this.nickname = this.formgroup.controls['selectoperator'];

  }
  ngOnInit(){
    this.ShowEntryForm=true;
    var ActiveTenantId=JSON.parse(StorageService.GetItem(this.constant.DB.User)).ActiveTenantId;
    this.Tenants=JSON.parse(StorageService.GetItem(this.constant.DB.Tenant));
       this.Tenant=this.Tenants.find(function (obj) { return obj.Id === ActiveTenantId; });
       this.ActiveBankName=this.Tenant.Name;   
    this.resetForm();
    this.Id=this.navParams.get('Id');
    this.ParentId=this.navParams.get('ParentId');
    this.osid=this.navParams.get('OperatorId');
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
    this.ShowLabel=true;
  }else{
    this.DTHNo="Enter";
    this.ShowLabel=true;
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

    if(StorageService.GetItem("OSResponse")==null){
    this.OldOSResponseInString="";
    }
    else{
      this.OldOSResponseInString=StorageService.GetItem("OSResponse");
    }
    this.osreq={
      Starts:"",
      //PerentId:localStorage.getItem('OS.Id'),
      PerentId:this.ParentId,
      TenantId:this.ActiveTenantId,
    }
    this.regService.GetOperators(this.osreq).subscribe((data : any)=>{
      this.OSResponseNew = data;
  
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
    Amount:'',
    CircleId:''
  }
}

// OnNext(operatorId,mobileNo,amount,nickName){
//   if(this.Id==null){
//     this.rechargeitem={
      
//       Id:this.guid(),
//       OperatorId:this.rechargeitem.OperatorId,
//       SubscriptionId:this.rechargeitem.SubscriptionId,
//       ParentId:this.OSResponseNew[0].ParentId,
//       NickName:this.rechargeitem.NickName,
//       Amount:this.rechargeitem.Amount
//     }

//     this.favouriteitem={ 
//       Id:this.guid(),
//       OperatorId:this.rechargeitem.OperatorId,
//       SubscriptionId:this.rechargeitem.SubscriptionId,
//       ParentId:this.OSResponseNew[0].ParentId,
//       NickName:this.rechargeitem.NickName
//     }

//     switch (this.OSResponseNew[0].ParentId) {
//       case "S1":
//       var existingEntries = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S1));
//       break;
//       case "S2":
//       var existingEntries = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S2));
//         break;
//       case "S3":
//       var existingEntries = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S3));
//         break;
//       case "S4":
//       var existingEntries = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S4));
//         break;
//       case "S5":
//       var existingEntries = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S5));
//         break;
//       case "S6":
//       var existingEntries = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S6));
//         break;
//       default:
//       var existingEntries = JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S7));
//     }
//     if(existingEntries == null){ 
//       switch (this.OSResponseNew[0].ParentId) {
//         case "S1":
//         StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S1, JSON.stringify([this.favouriteitem]));
//         break;
//         case "S2":
//         StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S2, JSON.stringify([this.favouriteitem]));
//           break;
//         case "S3":
//         StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S3, JSON.stringify([this.favouriteitem]));
//           break;
//         case "S4":
//         StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S4, JSON.stringify([this.favouriteitem]));
//           break;
//         case "S5":
//         StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S5, JSON.stringify([this.favouriteitem]));
//           break;
//         case "S6":
//         StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S6, JSON.stringify([this.favouriteitem]));
//           break;
//         default:
//         StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S7, JSON.stringify([this.favouriteitem]));
//       }
//       //localStorage.setItem(this.constant.DB.Favourite, JSON.stringify([this.favouriteitem]));
//     }
    
//     else{
//       var MobileNumber=this.favouriteitem.SubscriptionId;
//       var NickName=this.favouriteitem.NickName;
//       this.existingentry=existingEntries;
//       //this.duplicateFavourite= this.existingentry.find(function (obj) { return obj === fav; });
//       //this.duplicateFavourite= this.existingentry.find(function (obj) { return obj.SubscriptionId === MobileNumber; });
//       this.duplicateFavourite= this.existingentry.find(function (obj) { return obj.SubscriptionId === MobileNumber||obj.NickName===NickName; });

//       if(this.duplicateFavourite==null){
//         existingEntries.push(this.favouriteitem);

//         switch (this.OSResponseNew[0].ParentId) {
//           case "S1":
//           StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S1,JSON.stringify(existingEntries));  
//           break;
//           case "S2":
//           StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S2,JSON.stringify(existingEntries));  
//             break;
//           case "S3":
//           StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S3,JSON.stringify(existingEntries));  
//             break;
//           case "S4":
//           StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S4,JSON.stringify(existingEntries));  
//             break;
//           case "S5":
//           StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S5,JSON.stringify(existingEntries));  
//             break;
//           case "S6":
//           StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S6,JSON.stringify(existingEntries));  
//             break;
//           default:
//           StorageService.SetItem(this.constant.favouriteBasedOnParentId.Favourite_S7,JSON.stringify(existingEntries));  
//         }
        
//       }else{
//         //No action needed
//       }
      
//     }
//   }
    
//     //above code is for updating or adding row for FavouriteKey local storage.
    
//     switch (this.OSResponseNew[0].ParentId) {
//       case "S1":
//       this.favouriteNew=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S1));
//       break;
//       case "S2":
//       this.favouriteNew=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S2));
//         break;
//       case "S3":
//       this.favouriteNew=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S3));
//         break;
//       case "S4":
//       this.favouriteNew=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S4));
//         break;
//       case "S5":
//       this.favouriteNew=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S5));
//         break;
//       case "S6":
//       this.favouriteNew=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S6));
//         break;
//       default:
//       this.favouriteNew=JSON.parse(StorageService.GetItem(this.constant.favouriteBasedOnParentId.Favourite_S7));
//     }
//     switch (this.rechargeitem.OperatorId) {
//       case "O1":
//       this.operator="Airtel";
//       break;
//       case "O2":
//       this.operator="BSNL";       
//       break;
//       case "O3":
//       this.operator="Vodafone";        
//       break;
//       case "O4":
//       this.operator="Idea";
//         break;
//       case "O5":
//       this.operator="Jio";
//         break;
//       case "O6":
//       this.operator="Reliance GSM";
//         break;
//       case "O7":
//       this.operator="Reliance CDMA";
//       break;
//       case "O8":
//       this.operator="Tata Indicom";       
//       break;
//       case "O9":
//       this.operator="Tata Docomo";        
//       break;
//       case "O10":
//       this.operator="Telenor";
//         break;
//       case "O11":
//       this.operator="MTNL";
//         break;
//       case "O12":
//       this.operator="Aircel";
//         break;
//         case "O13":
//       this.operator="Videocon";
//       break;
//       case "O14":
//       this.operator="MTS";       
//       break;
//       case "O15":
//       this.operator="BSNL STV";        
//       break;
//       case "O16":
//       this.operator="Tata Docomo STV";
//       break;
//       case "O17":
//       this.operator="Telenor STV";
//       break;
//       case "O18":
//       this.operator="VIDEOCON STV";
//       break;
//       case "O19":
//       this.operator="MTNL STV";
//       break;
//       case "O20":
//       this.operator="Airtel";
//       break;
//       case "O21":
//       this.operator="Idea";
//       break;
//       case "O22":
//       this.operator="Vodafone";
//       break;
//       case "O23":
//       this.operator="Reliance GSM";
//       break;
//       case "O24":
//       this.operator="Reliance CDMA";
//       break;
//       case "O25":
//       this.operator="Tata Docomo";
//       break;
//       case "O26":
//       this.operator="Aircel";
//       break;
//       case "O27":
//       this.operator="MTS";
//       break;
//       case "O28":
//       this.operator="BSNL";
//       break;
//       case "O29":
//       this.operator="Dish TV";
//       this.label="Viewing Card Number";
//       break;
//       case "O30":
//       this.operator="TATA Sky";
//       this.label="Registered Mobile Number or Subscriber ID";
//       break;
//       case "O31":
//       this.operator="Sun TV";
//       this.label="Smart Card Number";
//       break;
//       case "O32":
//       this.operator="Videocon D2H TV";
//       this.label="Subscriber ID";
//       break;
//       case "O33":
//       this.operator="Reliance Big TV";
//       this.label="Smart Card Number";
//       break;
//       case "O34":
//       this.operator="Airtel Digital TV";
//       this.label="Customer ID";
//       break;
//       default:
//       this.operator="BESCOM";
//     }
//     this.ShowEntryForm=false;
//     this.showConfirm=true;

//   }
  

OnNext(form: NgForm){
  if(this.Id==null){
    this.rechargeitem={
      
      Id:this.guid(),
      OperatorId:this.rechargeitem.OperatorId,
      SubscriptionId:this.rechargeitem.SubscriptionId,
      ParentId:this.OSResponseNew[0].ParentId,
      NickName:this.rechargeitem.NickName,
      Amount:this.rechargeitem.Amount,
      CircleId:this.rechargeitem.CircleId
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
    
    else{
      var MobileNumber=this.favouriteitem.SubscriptionId;
      var NickName=this.favouriteitem.NickName;
      this.existingentry=existingEntries;
      //this.duplicateFavourite= this.existingentry.find(function (obj) { return obj === fav; });
      //this.duplicateFavourite= this.existingentry.find(function (obj) { return obj.SubscriptionId === MobileNumber; });
      this.duplicateFavourite= this.existingentry.find(function (obj) { return obj.SubscriptionId === MobileNumber||obj.NickName===NickName; });

      if(this.duplicateFavourite==null){
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
        
      }else{
        //No action needed
      }
      
    }
  }
    
    //above code is for updating or adding row for FavouriteKey local storage.
    
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
      this.label="Viewing Card Number";
      break;
      case "O30":
      this.operator="TATA Sky";
      this.label="Registered Mobile Number or Subscriber ID";
      break;
      case "O31":
      this.operator="Sun TV";
      this.label="Smart Card Number";
      break;
      case "O32":
      this.operator="Videocon D2H TV";
      this.label="Subscriber ID";
      break;
      case "O33":
      this.operator="Reliance Big TV";
      this.label="Smart Card Number";
      break;
      case "O34":
      this.operator="Airtel Digital TV";
      this.label="Customer ID";
      break;
      default:
      this.operator="BESCOM";
    }
    this.ShowEntryForm=false;
    this.showConfirm=true;

  }
  StatesOfIndia = [
    {Id: "1", Name: "Delhi/NCR"},
    {Id: "2", Name: "Mumbai"},
    {Id: "3", Name: "Kolkata"},
    {Id: "4", Name: "Maharashtra"},
    {Id: "5", Name: "Andhra Pradesh"},
    {Id: "6", Name: "Tamil Nadu"},
    {Id: "7", Name: "Karnataka"},
    {Id: "8", Name: "Gujarat"},
    {Id: "9", Name: "Uttar Pradesh (E)"},
    {Id: "10", Name: "Madhya Pradesh"},
    {Id: "11", Name: "Uttar Pradesh (W)"},
    {Id: "12", Name: "West Bengal"},
    {Id: "13", Name: "Rajasthan"},
    {Id: "14", Name: "Kerala"},
    {Id: "15", Name: "Punjab "},
    {Id: "16", Name: "Haryana"},
    {Id: "17", Name: "Bihar & Jharkhand"},
    {Id: "18", Name: "Orissa"},
    {Id: "19", Name: "Assam"},
    {Id: "20", Name: "North East"},
    {Id: "21", Name: "Himachal Pradesh"},
    {Id: "22", Name: "Jammu & Kashmir"},
    {Id: "23", Name: "Chennai"}
 ];
 StatesOfIndiayy={"1":"Delhi/NCR","2":""}
 OperatorsOfIndia=[{Id: "1", Name: "Aircel"},
 {Id: "2", Name: "Airtel"},
 {Id: "O2", Name: "BSNL"},
 {Id: "4", Name: "Idea"},
 {Id: "5", Name: "Jio"},
 {Id: "6", Name: "MTNL"},
 {Id: "7", Name: "MTS"},
 {Id: "8", Name: "Reliance Mobile"},
 {Id: "9", Name: "Tata Docomo CDMA"},
 {Id: "10", Name: "Tata Docomo GSM"},
 {Id: "11", Name: "Telenor"},
 {Id: "12", Name: "Vodafone"},
];
  OnMobileNo(id){
    if(id.length<10){
       //return null;
       return this.showerrortext=true;
    }else{
      var firstfive=id.substring(0,5);
      this.operatorcircleqry={
       Mobile:firstfive
      }
      this.regService.GetOperaterCircle(this.operatorcircleqry).subscribe((data:any)=>{
      this.operatorcircle=data;
      var operator=this.operatorcircle.operator;
      this.operatorname=this.operatorcircle.operator;
      this.singleosrespone=this.OSResponseNew.find(function (obj) { return obj.Operator === operator; });
      this.oid=this.singleosrespone.Id;
      this.rechargeitem.OperatorId=this.oid;
  
      var circle=this.operatorcircle.circle;
      this.statename=this.operatorcircle.circle;
      this.singleState=this.StatesOfIndia.find(function(obj){return obj.Name===circle})
      this.sid=this.singleState.Id;
      this.rechargeitem.CircleId=this.sid;
    });
    }
    
  }
  
  
  GetDigiPartyandPartyMastID(ActiveTenantId){
    this.DigiParties=JSON.parse(StorageService.GetItem(this.constant.DB.DigiParty));
       this.digiparty=this.DigiParties.find(function (obj) { return obj.TenantId === ActiveTenantId; });
       return this.digiparty;
  }
  GetSelfCareAcByTenantID(ActiveTenantId){
    this.SelfCareACs=JSON.parse(StorageService.GetItem(this.constant.DB.SelfCareAc));
    this.selfCareAC=this.SelfCareACs.find(function (obj) { return obj.TenantId === ActiveTenantId&&obj.AcActId=="#SB"; });
    return this.selfCareAC;
  }
  OperatorChanged(event){
    switch(event){
      case "O1":
      this.operatorname="Airtel";
      break;
      case "O2":
      this.operatorname="BSNL";
      break;
      case "O3":
      this.operatorname="Vodafone";
      break;
      case "O4":
      this.operatorname="Idea";
      break;
      case "O5":
      this.operatorname="Jio";
      break;
      case "O6":
      this.operatorname="Reliance GSM";
      break;
      case "O7":
      this.operatorname="Reliance CDMA";
      break;
      case "O8":
      this.operatorname="Tata Indicom";
      break;
      case "O9":
      this.operatorname="Tata Docomo";
      break;
      case "O10":
      this.operatorname="Telenor";
      break;
      case "O11":
      this.operatorname="MTNL";
      break;
      case "O12":
      this.operatorname="Aircel";
      break;
      case "O13":
      this.operatorname="Videocon";
      break;
      case "O14":
      this.operatorname="MTS";
      break;
      case "O15":
      this.operatorname="BSNL STV";
      break;
      case "O16":
      this.operatorname="Tata Docomo STV";
      break;
      case "O17":
      this.operatorname="Telenor STV";
      break;
      case "O18":
      this.operatorname="VIDEOCON STV";
      break;
      case "O19":
      this.operatorname="MTNL STV";
      break;
      case "O20":
      this.operatorname="Airtel";
      break;
      case "O21":
      this.operatorname="Idea";
      break;
      case "O22":
      this.operatorname="Vodafone";
      break;
      case "O23":
      this.operatorname="Reliance GSM";
      break;
      case "O24":
      this.operatorname="Reliance CDMA";
      break;
      case "O25":
      this.operatorname="Tata Docomo";
      break;
      case "O26":
      this.operatorname="Aircel";
      break;
      case "O27":
      this.operatorname="MTS";
      break;
      case "O28":
      this.operatorname="BSNL";
      break;
      case "O29":
      this.label="Viewing Card Number";
      this.osid="O29";
      break;
      case "O30":
      this.label="Registered Mobile Number or Subscriber ID";
      this.osid="O30";
      break;
      case "O31":
      this.label="Smart Card Number";
      this.osid="O31"
      break;
      case "O32":
      this.label="Subscriber ID";
      this.osid="O32"
      break;
      case "O33":
      this.label="Smart Card Number";
      this.osid="O33";
      break;
      case "O35":
      this.osid="O35";
      break;
      default:
      this.label="Customer ID";
    }
  }
  
  StateChanged(event){
    switch(event){
      case "1":
      this.statename="Delhi/NCR";
      break;
      case "2":
      this.statename="Mumbai";
      break;
      case "3":
      this.statename="Kolkata";
      break;
      case "4":
      this.statename="Maharashtra";
      break;
      case "5":
      this.statename="Andhra Pradesh";
      break;
      case "6":
      this.statename="Tamil Nadu";
      break;
      case "7":
      this.statename="Karnataka";
      break;
      case "8":
      this.statename="Gujarat";
      break;
      case "9":
      this.statename="Uttar Pradesh (E)";
      break;
      case "10":
      this.statename="Madhya Pradesh";
      break;
      case "11":
      this.statename="Uttar Pradesh (W)";
      break;
      case "12":
      this.statename="West Bengal";
      break;
      case "13":
      this.statename="Rajasthan";
      break;
      case "14":
      this.statename="Kerala";
      break;
      case "15":
      this.statename="Punjab";
      break;
      case "16":
      this.statename="Haryana";
      break;
      case "17":
      this.statename="Bihar & Jharkhand";
      break;
      case "18":
      this.statename="Orissa";
      break;
      case "19":
      this.statename="Assam";
      break;
      case "20":
      this.statename="North East";
      break;
      case "21":
      this.statename="Himachal Pradesh";
      break;
      case "22":
      this.statename="Jammu & Kashmir";
      break;
      default:
      this.statename="Chennai";
    }
  }
  
  OnViewPlans(operatorId,circleId){
    this.showConfirm=false;
   
    this.navCtrl.push(BasicPage, { 'OperatorId':operatorId,'CircleId': circleId});
    
  }

OnConfirm(){
  let loading = this.loadingController.create({
    content: 'Recharging...'
  });
  loading.present();
 var  DigiPartyId=JSON.parse(StorageService.GetItem("DigiParty")).DigiPartyId;
 var PartyMastId=JSON.parse(StorageService.GetItem("DigiParty")).PartyMastId;
 
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
  DigiPartyId:this.GetDigiPartyandPartyMastID(this.ActiveTenantId).DigiPartyId,
  PartyMastId:this.GetDigiPartyandPartyMastID(this.ActiveTenantId).PartyMastId,
  AcMastId:this.GetSelfCareAcByTenantID(this.ActiveTenantId).AcHeadId,
  AcSubId:this.GetSelfCareAcByTenantID(this.ActiveTenantId).AcSubId,
  Amount:this.rechargeitem.Amount,
  OperatorId:this.rechargeitem.OperatorId,
  SubscriptionId:this.rechargeitem.SubscriptionId,
  LocId:this.GetSelfCareAcByTenantID(this.ActiveTenantId).LocId  
}
    this.regService.PostRecharge(this.recharge).subscribe((data : any)=>{
      this.tranresponse=data;
      this.toastr.success('Recharge is successful with ' + this.tranresponse.StatusCode, 'Success!');
this.showConfirm=false;
this.showSuccess=true;

    //},(err) => {console.log(err)});
  //},(error) => {this.toastr.error(error.error.ExceptionMessage, 'Error!')
},(error) => {this.toastr.error(error.message, 'Error!')

});
    
    loading.dismiss();
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
