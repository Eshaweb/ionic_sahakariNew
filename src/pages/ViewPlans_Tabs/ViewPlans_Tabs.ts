import { Component, OnInit, ViewChild } from '@angular/core';

import { Platform, LoadingController, NavParams, NavController, Tabs } from 'ionic-angular';
import { ToastrService } from 'ngx-toastr';
import { ConstantService } from '../services/Constants';
import { RegisterService } from '../services/app-data.service';
import { PlanRequest } from '../View Models/PlanRequest';
import { StorageService } from '../services/Storage_Service';
import { PlanDet } from '../View Models/PlanResponse';
import { MobileRechargePage } from '../mobile-recharge/mobile-recharge';
import { Tenant } from '../LocalStorageTables/Tenant';


//(ionSelect)="myMethod()"
@Component({
//   template: `
//   <ion-tabs #paymentTabs class="tabs-basic" [selectedIndex]="0" tabsPlacement="top" color="primary">
//     <ion-tab tabTitle={{FTT}} [root]="FTTPage" tabsHideOnSubPages="true" [rootParams]="navp"></ion-tab>
//     <ion-tab tabTitle={{TUP}} [root]="TUPPage" tabsHideOnSubPages="true" [rootParams]="navp"></ion-tab>
//     <ion-tab tabTitle={{LSC}} [root]="LSCPage" tabsHideOnSubPages="true" [rootParams]="navp"></ion-tab>
//     <ion-tab tabTitle={{SMS}} [root]="SMSPage" tabsHideOnSubPages="true" [rootParams]="navp"></ion-tab>
//     <ion-tab tabTitle={{OTR}} [root]="OTRPage" tabsHideOnSubPages="true" [rootParams]="navp"></ion-tab>
//     <ion-tab tabTitle={{RMG}} [root]="RMGPage" tabsHideOnSubPages="true" [rootParams]="navp"></ion-tab>
//     </ion-tabs>
// `
selector: 'page-ViewPlans_Tabs',
templateUrl: 'ViewPlans_Tabs.html'
})
export class BasicPage implements OnInit{
  navp: any;
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
      this.navp=this.navParams.data;
      
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
 
}

@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>Tabs</ion-title>
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
  //@ViewChild("paymentTabs") paymentTabs: Tabs;

  
  navp: any;
  circleId: any;
  operatorId: any;
  planResponse: PlanDet;
  isAndroid: boolean = false;
  planRequest: PlanRequest;
  i:any;
  planTypes:string[]= ["FTT","TUP","LSC","SMS","OTR","RMG"];

  constructor(private toastr: ToastrService,public constant:ConstantService,private regService : RegisterService, public loadingController: LoadingController, public navParams: NavParams,public navCtrl: NavController,platform: Platform) {
    let loading = this.loadingController.create({
      content: 'Please wait till the screen loads'
    });

    loading.present();
    this.isAndroid = platform.is('android');
    
    this.operatorId=this.navParams.get('OperatorId');
    this.circleId=this.navParams.get('CircleId');
    this.navp=this.navParams.data;
 
    this.planRequest={
      OSId:this.operatorId,
      CircleId:this.circleId,
      PlanType:this.planTypes[0],
      TenantId:JSON.parse(StorageService.GetUser()).ActiveTenantId
    }
  //this.planResponse=this.bpage.planResponse;
  this.regService.GetPlans(this.planRequest).subscribe((data : any)=>{
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
      <ion-navbar>
        <ion-title>Tabs</ion-title>
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
  navp: any;
  circleId: any;
  operatorId: any;
  planResponse: PlanDet;
  isAndroid: boolean = false;
  planRequest: PlanRequest;
  i:any;
  planTypes:string[]= ["FTT","TUP","LSC","SMS","OTR","RMG"];

  constructor(private toastr: ToastrService,public constant:ConstantService,private regService : RegisterService, public loadingController: LoadingController, public navParams: NavParams,public navCtrl: NavController,platform: Platform) {
    let loading = this.loadingController.create({
      content: 'Please wait till the screen loads'
    });

    loading.present();
    this.isAndroid = platform.is('android');
    this.operatorId=this.navParams.get('OperatorId');
    this.circleId=this.navParams.get('CircleId');
    this.navp=this.navParams.data;
    this.planRequest={
      OSId:this.operatorId,
      CircleId:this.circleId,
      PlanType:this.planTypes[1],
      TenantId:JSON.parse(StorageService.GetUser()).ActiveTenantId
    }
  this.regService.GetPlans(this.planRequest).subscribe((data : any)=>{
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
      <ion-navbar>
        <ion-title>Tabs</ion-title>
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
  navp: any;
  circleId: any;
  operatorId: any;
  planResponse: PlanDet;
  isAndroid: boolean = false;
  planRequest: PlanRequest;
  i:any;
  planTypes:string[]= ["FTT","TUP","LSC","SMS","OTR","RMG"];

  constructor(private toastr: ToastrService,public constant:ConstantService,private regService : RegisterService, public loadingController: LoadingController, public navParams: NavParams,public navCtrl: NavController,platform: Platform) {
    let loading = this.loadingController.create({
      content: 'Please wait till the screen loads'
    });

    loading.present();
    this.isAndroid = platform.is('android');
    this.operatorId=this.navParams.get('OperatorId');
    this.circleId=this.navParams.get('CircleId');
    this.navp=this.navParams.data;
    this.planRequest={
      OSId:this.operatorId,
      CircleId:this.circleId,
      PlanType:this.planTypes[2],
      TenantId:JSON.parse(StorageService.GetUser()).ActiveTenantId
    }
  this.regService.GetPlans(this.planRequest).subscribe((data : any)=>{
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
      <ion-navbar>
        <ion-title>Tabs</ion-title>
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
  navp: any;
  circleId: any;
  operatorId: any;
  planResponse: PlanDet;
  isAndroid: boolean = false;
  planRequest: PlanRequest;
  i:any;
  planTypes:string[]= ["FTT","TUP","LSC","SMS","OTR","RMG"];

  constructor(private toastr: ToastrService,public constant:ConstantService,private regService : RegisterService, public loadingController: LoadingController, public navParams: NavParams,public navCtrl: NavController,platform: Platform) {
    let loading = this.loadingController.create({
      content: 'Please wait till the screen loads'
    });

    loading.present();
    this.isAndroid = platform.is('android');
    this.operatorId=this.navParams.get('OperatorId');
    this.circleId=this.navParams.get('CircleId');
    this.navp=this.navParams.data;
    this.planRequest={
      OSId:this.operatorId,
      CircleId:this.circleId,
      PlanType:this.planTypes[3],
      TenantId:JSON.parse(StorageService.GetUser()).ActiveTenantId
    }
  this.regService.GetPlans(this.planRequest).subscribe((data : any)=>{
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
      <ion-navbar>
        <ion-title>Tabs</ion-title>
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
  navp: any;
  circleId: any;
  operatorId: any;
  planResponse: PlanDet;
  isAndroid: boolean = false;
  planRequest: PlanRequest;
  i:any;
  planTypes:string[]= ["FTT","TUP","LSC","SMS","OTR","RMG"];

  constructor(private toastr: ToastrService,public constant:ConstantService,private regService : RegisterService, public loadingController: LoadingController, public navParams: NavParams,public navCtrl: NavController,platform: Platform) {
    
    let loading = this.loadingController.create({
      content: 'Please wait till the screen loads'
    });

    loading.present();
    this.isAndroid = platform.is('android');
    this.operatorId=this.navParams.get('OperatorId');
    this.circleId=this.navParams.get('CircleId');
    this.navp=this.navParams.data;
    this.planRequest={
      OSId:this.operatorId,
      CircleId:this.circleId,
      PlanType:this.planTypes[4],
      TenantId:JSON.parse(StorageService.GetUser()).ActiveTenantId
    }
  this.regService.GetPlans(this.planRequest).subscribe((data : any)=>{
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
      <ion-navbar>
        <ion-title>Tabs</ion-title>
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
  navp: string;
  circleId: string;
  operatorId: string;
  planResponse: PlanDet;
  isAndroid: boolean = false;
  planRequest: PlanRequest;
  i:number;
  planTypes:string[]= ["FTT","TUP","LSC","SMS","OTR","RMG"];

  constructor(private toastr: ToastrService,public constant:ConstantService,private regService : RegisterService, public loadingController: LoadingController, public navParams: NavParams,public navCtrl: NavController,platform: Platform) {
    
    let loading = this.loadingController.create({
      content: 'Please wait till the screen loads'
    });

    loading.present();
    this.isAndroid = platform.is('android');
    this.operatorId=this.navParams.get('OperatorId');
    this.circleId=this.navParams.get('CircleId');
    this.navp=this.navParams.data;
    this.planRequest={
      OSId:this.operatorId,
      CircleId:this.circleId,
      PlanType:this.planTypes[5],
      TenantId:JSON.parse(StorageService.GetUser()).ActiveTenantId
    }
  this.regService.GetPlans(this.planRequest).subscribe((data : any)=>{
    this.planResponse=data;
  },(error) => {this.toastr.error(error.message, 'Error!')
    });
    loading.dismiss();
  }
  OnAmount(amount){
    this.navCtrl.push(MobileRechargePage, { 'Amount':amount,'ParentId':this.navParams.get('ParentId'),'OperatorId':this.navParams.get('OperatorId'),'CircleId':this.navParams.get('CircleId'),'SubscriptionId':this.navParams.get('SubscriptionId'),'nname':this.navParams.get('nname')});  
  }
}

