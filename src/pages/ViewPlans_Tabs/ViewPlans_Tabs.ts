import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform, LoadingController, NavParams, NavController, Tabs, Navbar } from 'ionic-angular';
import { ToastrService } from 'ngx-toastr';
import { ConstantService } from '../services/Constants';
import { RegisterService } from '../services/app-data.service';
import { PlanRequest } from '../View Models/PlanRequest';
import { StorageService } from '../services/Storage_Service';
import { PlanDet } from '../View Models/PlanResponse';
import { MobileRechargePage } from '../mobile-recharge/mobile-recharge';

@Component({
selector: 'page-ViewPlans_Tabs',
templateUrl: 'ViewPlans_Tabs.html'
})
export class BasicPage implements OnInit{
 // @ViewChild(Navbar) navBar: Navbar;
  navparams: any;
  planTypes:string[]= ["FTT","TUP","LSC","SMS","OTR","RMG"];
  circleId: string;
  operatorId: string;
  RMG: string;
  OTR: string;
  SMS: string;
  TUP: string;
  LSC: string;
  FTT: string;
  FTTPage = TabBasicContentPage1;
  TUPPage= TabBasicContentPage2;
  LSCPage= TabBasicContentPage3;
  SMSPage = TabBasicContentPage4;
  OTRPage= TabBasicContentPage5;
  RMGPage= TabBasicContentPage6;
  constructor(private toastr: ToastrService,public constant:ConstantService,private regService : RegisterService, public loadingController: LoadingController, public navParams: NavParams,public navCtrl: NavController,platform: Platform) {
    this.FTT="FullTalkTime";
      this.LSC="LSC";
      this.TUP="TopUp";
      this.SMS="SMS";
      this.OTR="Other";
      this.RMG="Roaming";
      this.operatorId=this.navParams.get('OperatorId');
      this.circleId=this.navParams.get('CircleId');
      this.navparams=this.navParams.data;
      
  }
  ActiveBankName: string;
  planRequest: PlanRequest;

  ngOnInit(){
      this.ActiveBankName=StorageService.GetActiveBankName();   
      this.planRequest={
        OSId:this.operatorId,
        CircleId:this.circleId,
        PlanType:this.planTypes[0],
        TenantId:JSON.parse(StorageService.GetUser()).ActiveTenantId
      }
  }
//   ionViewDidLoad() {
//     this.setBackButtonAction()
// }

// //Method to override the default back button action
// setBackButtonAction(){
//    this.navBar.backButtonClick = () => {
//    //Write here wherever you wanna do
//       this.navCtrl.push(FavouritesPage);
//    }
// }
}

@Component({
  template: `
  
  <ion-header>
  <ion-navbar hideBackButton="true" color="primary">
      <ion-title>
        {{ActiveBankName}}  Mobile App
      </ion-title>
    </ion-navbar>
    </ion-header>

    <ion-content>
    Select the plans you want
    <ion-list *ngFor="let order of planResponse" (click)="OnAmount(order.amount)">
    <ion-item style="border: 1px solid lightgrey; padding: 15px; margin: 5px 0;background-color: bisque">
    <h3>Talktime:{{ order.talktime }}</h3>
    <button ion-button outline icon-start item-end round medium>
      <ion-icon name='briefcase' is-active="false"></ion-icon>
      {{ order.amount | number }}
    </button>
    <a style="color:red">{{ order.detail }}</a>
    <h2>Validity:{{ order.validity }}</h2>
    </ion-item>
  </ion-list>
    </ion-content>
`})
export class TabBasicContentPage1 {
  isButtonEnabled: boolean=false;
  //@ViewChild("paymentTabs") paymentTabs: Tabs;

  
  navparams: any;
  circleId: any;
  operatorId: any;
  planResponse: PlanDet;
  isAndroid: boolean = false;
  planRequest: PlanRequest;
  i:any;
  planTypes:string[]= ["FTT","TUP","LSC","SMS","OTR","RMG"];

  constructor(private toastr: ToastrService,private registerService : RegisterService, public loadingController: LoadingController, public navParams: NavParams,public navCtrl: NavController,platform: Platform) {
    let loading = this.loadingController.create({
      content: 'Please wait till the screen loads'
    });

    loading.present();
    this.isAndroid = platform.is('android');
    
    this.operatorId=this.navParams.get('OperatorId');
    this.circleId=this.navParams.get('CircleId');
    this.navparams=this.navParams.data;
 
    this.planRequest={
      OSId:this.operatorId,
      CircleId:this.circleId,
      PlanType:this.planTypes[0],
      TenantId:JSON.parse(StorageService.GetUser()).ActiveTenantId
    }
  //this.planResponse=this.bpage.planResponse;
  this.registerService.GetPlans(this.planRequest).subscribe((data : any)=>{
    this.planResponse=data;
  },(error) => {this.toastr.error(error.message, 'Error!')
    });
loading.dismiss();
  }
  OnAmount(amount){
    this.isButtonEnabled=true;
     this.navCtrl.push(MobileRechargePage, { 'Amount':amount,'ParentId':this.navParams.get('ParentId'),'OperatorId':this.navParams.get('OperatorId'),'CircleId':this.navParams.get('CircleId'),'SubscriptionId':this.navParams.get('SubscriptionId'),'nname':this.navParams.get('nname'),'ButtonEnabled':this.isButtonEnabled});
    //this.navCtrl.push(MobileRechargePage, { 'Amount':amount,'ParentId':this.navParams.get('ParentId'),'OperatorId':this.navParams.get('OperatorId'),'CircleId':this.navParams.get('CircleId'),'SubscriptionId':this.navParams.get('SubscriptionId'),'nname':this.navParams.get('nname')});
   
  }
  
}
@Component({
  template: `
  <ion-header>
  <ion-navbar hideBackButton="true" color="primary">
      <ion-title>
        {{ActiveBankName}}  Mobile App
      </ion-title>
    </ion-navbar>
    </ion-header>
    <ion-content>
    Select the plans you want
    <ion-list *ngFor="let order of planResponse" (click)="OnAmount(order.amount)">
    <ion-item style="border: 1px solid lightgrey; padding: 15px; margin: 5px 0;background-color: bisque">
    <h3>Talktime:{{ order.talktime }}</h3>
    <button ion-button outline icon-start item-end round medium>
      <ion-icon name='briefcase' is-active="false"></ion-icon>
      {{ order.amount | number }}
    </button>
    <a style="color:red">{{ order.detail }}</a>
    <h2>Validity:{{ order.validity }}</h2>
    </ion-item>
  </ion-list>
    </ion-content>
`})
export class TabBasicContentPage2 {
  navparams: any;
  circleId: any;
  operatorId: any;
  planResponse: PlanDet;
  isAndroid: boolean = false;
  planRequest: PlanRequest;
  i:any;
  planTypes:string[]= ["FTT","TUP","LSC","SMS","OTR","RMG"];

  constructor(private toastr: ToastrService,private registerService : RegisterService, public loadingController: LoadingController, public navParams: NavParams,public navCtrl: NavController,platform: Platform) {
    let loading = this.loadingController.create({
      content: 'Please wait till the screen loads'
    });

    loading.present();
    this.isAndroid = platform.is('android');
    this.operatorId=this.navParams.get('OperatorId');
    this.circleId=this.navParams.get('CircleId');
    this.navparams=this.navParams.data;
    this.planRequest={
      OSId:this.operatorId,
      CircleId:this.circleId,
      PlanType:this.planTypes[1],
      TenantId:JSON.parse(StorageService.GetUser()).ActiveTenantId
    }
  this.registerService.GetPlans(this.planRequest).subscribe((data : any)=>{
    this.planResponse=data;
  },(error) => {this.toastr.error(error.message, 'Error!')
    });
    loading.dismiss();
  }
  OnAmount(amount){
    this.navCtrl.push(MobileRechargePage, { 'Amount':amount,'ParentId':this.navParams.get('ParentId'),'OperatorId':this.navParams.get('OperatorId'),'CircleId':this.navParams.get('CircleId'),'SubscriptionId':this.navParams.get('SubscriptionId'),'nname':this.navParams.get('nname')});    
  }
}
@Component({
  template: `
  <ion-header>
  <ion-navbar hideBackButton="true" color="primary">
      <ion-title>
        {{ActiveBankName}}  Mobile App
      </ion-title>
    </ion-navbar>
    </ion-header>
    <ion-content>
    Select the plans you want
    <ion-list *ngFor="let order of planResponse" (click)="OnAmount(order.amount)">
    <ion-item style="border: 1px solid lightgrey; padding: 15px; margin: 5px 0;background-color: bisque">
    <h3>Talktime:{{ order.talktime }}</h3>
    <button ion-button outline icon-start item-end round medium>
      <ion-icon name='briefcase' is-active="false"></ion-icon>
      {{ order.amount | number }}
    </button>
    <a style="color:red">{{ order.detail }}</a>
    <h2>Validity:{{ order.validity }}</h2>
    </ion-item>
  </ion-list>
    </ion-content>
`})
export class TabBasicContentPage3 {
  navparams: any;
  circleId: any;
  operatorId: any;
  planResponse: PlanDet;
  isAndroid: boolean = false;
  planRequest: PlanRequest;
  i:any;
  planTypes:string[]= ["FTT","TUP","LSC","SMS","OTR","RMG"];

  constructor(private toastr: ToastrService,private registerService : RegisterService, public loadingController: LoadingController, public navParams: NavParams,public navCtrl: NavController,platform: Platform) {
    let loading = this.loadingController.create({
      content: 'Please wait till the screen loads'
    });

    loading.present();
    this.isAndroid = platform.is('android');
    this.operatorId=this.navParams.get('OperatorId');
    this.circleId=this.navParams.get('CircleId');
    this.navparams=this.navParams.data;
    this.planRequest={
      OSId:this.operatorId,
      CircleId:this.circleId,
      PlanType:this.planTypes[2],
      TenantId:JSON.parse(StorageService.GetUser()).ActiveTenantId
    }
  this.registerService.GetPlans(this.planRequest).subscribe((data : any)=>{
    this.planResponse=data;
  },(error) => {this.toastr.error(error.message, 'Error!')
    });
    loading.dismiss();
  }
  OnAmount(amount){
    this.navCtrl.push(MobileRechargePage, { 'Amount':amount,'ParentId':this.navParams.get('ParentId'),'OperatorId':this.navParams.get('OperatorId'),'CircleId':this.navParams.get('CircleId'),'SubscriptionId':this.navParams.get('SubscriptionId'),'nname':this.navParams.get('nname')});
  }
}
@Component({
  template: `
  <ion-header>
  <ion-navbar hideBackButton="true" color="primary">
      <ion-title>
        {{ActiveBankName}}  Mobile App
      </ion-title>
    </ion-navbar>
    </ion-header>
    <ion-content>
    Select the plans you want
    <ion-list *ngFor="let order of planResponse" (click)="OnAmount(order.amount)">
    <ion-item style="border: 1px solid lightgrey; padding: 15px; margin: 5px 0;background-color: bisque">
    <h3>Talktime:{{ order.talktime }}</h3>
    <button ion-button outline icon-start item-end round medium>
      <ion-icon name='briefcase' is-active="false"></ion-icon>
      {{ order.amount | number }}
    </button>
    <a style="color:red">{{ order.detail }}</a>
    <h2>Validity:{{ order.validity }}</h2>
    </ion-item>
  </ion-list> 
  </ion-content>
`})
export class TabBasicContentPage4 {
  navparams: any;
  circleId: any;
  operatorId: any;
  planResponse: PlanDet;
  isAndroid: boolean = false;
  planRequest: PlanRequest;
  i:any;
  planTypes:string[]= ["FTT","TUP","LSC","SMS","OTR","RMG"];

  constructor(private toastr: ToastrService,private registerService : RegisterService, public loadingController: LoadingController, public navParams: NavParams,public navCtrl: NavController,platform: Platform) {
    let loading = this.loadingController.create({
      content: 'Please wait till the screen loads'
    });

    loading.present();
    this.isAndroid = platform.is('android');
    this.operatorId=this.navParams.get('OperatorId');
    this.circleId=this.navParams.get('CircleId');
    this.navparams=this.navParams.data;
    this.planRequest={
      OSId:this.operatorId,
      CircleId:this.circleId,
      PlanType:this.planTypes[3],
      TenantId:JSON.parse(StorageService.GetUser()).ActiveTenantId
    }
  this.registerService.GetPlans(this.planRequest).subscribe((data : any)=>{
    this.planResponse=data;
  },(error) => {this.toastr.error(error.message, 'Error!')
    });
    loading.dismiss();
  }
  OnAmount(amount){
    this.navCtrl.push(MobileRechargePage, { 'Amount':amount,'ParentId':this.navParams.get('ParentId'),'OperatorId':this.navParams.get('OperatorId'),'CircleId':this.navParams.get('CircleId'),'SubscriptionId':this.navParams.get('SubscriptionId'),'nname':this.navParams.get('nname')});  
  }
}
@Component({
  template: `
  <ion-header>
  <ion-navbar hideBackButton="true" color="primary">
      <ion-title>
        {{ActiveBankName}}  Mobile App
      </ion-title>
    </ion-navbar>
    </ion-header>
    <ion-content>
    Select the plans you want
    <ion-list *ngFor="let order of planResponse" (click)="OnAmount(order.amount)">
    <ion-item style="border: 1px solid lightgrey; padding: 15px; margin: 5px 0;background-color: bisque">
    <h3>Talktime:{{ order.talktime }}</h3>
    <button ion-button outline icon-start item-end round medium>
      <ion-icon name='briefcase' is-active="false"></ion-icon>
      {{ order.amount | number }}
    </button>
    <a style="color:red">{{ order.detail }}</a>
    <h2>Validity:{{ order.validity }}</h2>
    </ion-item>
  </ion-list> 
  </ion-content>
`})
export class TabBasicContentPage5 {
  navparams: any;
  circleId: any;
  operatorId: any;
  planResponse: PlanDet;
  isAndroid: boolean = false;
  planRequest: PlanRequest;
  i:any;
  planTypes:string[]= ["FTT","TUP","LSC","SMS","OTR","RMG"];

  constructor(private toastr: ToastrService,private registerService : RegisterService, public loadingController: LoadingController, public navParams: NavParams,public navCtrl: NavController,platform: Platform) {
    
    let loading = this.loadingController.create({
      content: 'Please wait till the screen loads'
    });

    loading.present();
    this.isAndroid = platform.is('android');
    this.operatorId=this.navParams.get('OperatorId');
    this.circleId=this.navParams.get('CircleId');
    this.navparams=this.navParams.data;
    this.planRequest={
      OSId:this.operatorId,
      CircleId:this.circleId,
      PlanType:this.planTypes[4],
      TenantId:JSON.parse(StorageService.GetUser()).ActiveTenantId
    }
  this.registerService.GetPlans(this.planRequest).subscribe((data : any)=>{
    this.planResponse=data;
  },(error) => {this.toastr.error(error.message, 'Error!')
    });
    loading.dismiss();
  }
  OnAmount(amount){
    this.navCtrl.push(MobileRechargePage, { 'Amount':amount,'ParentId':this.navParams.get('ParentId'),'OperatorId':this.navParams.get('OperatorId'),'CircleId':this.navParams.get('CircleId'),'SubscriptionId':this.navParams.get('SubscriptionId'),'nname':this.navParams.get('nname')});   
  }
}
@Component({
  template: `
  <ion-header>
  <ion-navbar hideBackButton="true" color="primary">
      <ion-title>
        {{ActiveBankName}}  Mobile App
      </ion-title>
    </ion-navbar>
    </ion-header>
    <ion-content>
    Select the plans you want
    <ion-list *ngFor="let order of planResponse" (click)="OnAmount(order.amount)">
    <ion-item style="border: 1px solid lightgrey; padding: 15px; margin: 5px 0;background-color: bisque">
    <h3>Talktime:{{ order.talktime }}</h3>
    <button ion-button outline icon-start item-end round medium>
      <ion-icon name='briefcase' is-active="false"></ion-icon>
      {{ order.amount | number }}
    </button>
    <a style="color:red">{{ order.detail }}</a>
    <h2>Validity:{{ order.validity }}</h2>
    </ion-item>
  </ion-list>  
  </ion-content>
`})
export class TabBasicContentPage6 {
  navparams: string;
  circleId: string;
  operatorId: string;
  planResponse: PlanDet;
  isAndroid: boolean = false;
  planRequest: PlanRequest;
  i:number;
  planTypes:string[]= ["FTT","TUP","LSC","SMS","OTR","RMG"];

  constructor(private toastr: ToastrService,private registerService : RegisterService, public loadingController: LoadingController, public navParams: NavParams,public navCtrl: NavController,platform: Platform) {
    
    let loading = this.loadingController.create({
      content: 'Please wait till the screen loads'
    });

    loading.present();
    this.isAndroid = platform.is('android');
    this.operatorId=this.navParams.get('OperatorId');
    this.circleId=this.navParams.get('CircleId');
    this.navparams=this.navParams.data;
    this.planRequest={
      OSId:this.operatorId,
      CircleId:this.circleId,
      PlanType:this.planTypes[5],
      TenantId:JSON.parse(StorageService.GetUser()).ActiveTenantId
    }
  this.registerService.GetPlans(this.planRequest).subscribe((data : any)=>{
    this.planResponse=data;
  },(error) => {this.toastr.error(error.message, 'Error!')
    });
    loading.dismiss();
  }
  OnAmount(amount){
    this.navCtrl.push(MobileRechargePage, { 'Amount':amount,'ParentId':this.navParams.get('ParentId'),'OperatorId':this.navParams.get('OperatorId'),'CircleId':this.navParams.get('CircleId'),'SubscriptionId':this.navParams.get('SubscriptionId'),'nname':this.navParams.get('nname')});  
  }
}

