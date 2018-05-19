import { Component, OnInit } from '@angular/core';

import { Platform, LoadingController, NavParams, NavController } from 'ionic-angular';
import { ToastrService } from 'ngx-toastr';
import { ConstantService } from '../services/Constants';
import { RegisterService } from '../services/app-data.service';
import { PlanRequest } from '../View Models/PlanRequest';
import { StorageService } from '../services/Storage_Service';
import { PlanDet } from '../View Models/PlanResponse';


@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>Tabs</ion-title>
      </ion-navbar>
    </ion-header>

    <ion-content>
    Music
    </ion-content>
`})
export class TabBasicContentPage1 implements OnInit{
  
  
  circleId: any;
  operatorId: any;
  planResponse: PlanDet;
  isAndroid: boolean = false;
  planRequest: PlanRequest;
  i:any;
  planTypes:string[]= ["RMG","OTR","LSC","TUP","SMS","FTT"];

  constructor(private toastr: ToastrService,public constant:ConstantService,private regService : RegisterService, public loadingController: LoadingController, public navParams: NavParams,public navCtrl: NavController,platform: Platform) {
    this.isAndroid = platform.is('android');
    
    this.operatorId=this.navParams.get('OperatorId');
    this.circleId=this.navParams.get('CircleId');

  }

  ngOnInit() {
    for(this.i=0;this.i<this.planTypes.length;this.i++){
      this.planRequest={
        OSId:this.operatorId,
        CircleId:this.circleId,
        PlanType:this.planTypes[this.i],
        TenantId:JSON.parse(StorageService.GetItem(this.constant.DB.User)).ActiveTenantId
      }
      
    }
    //this.planResponse=this.bpage.planResponse;
    // this.regService.GetPlans(this.planRequest).subscribe((data : any)=>{
    //   this.planResponse=data;
    // },(error) => {this.toastr.error(error.message, 'Error!')
    //   });

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
    Movies
    </ion-content>
`})
export class TabBasicContentPage2 {
  isAndroid: boolean = false;

  constructor(platform: Platform) {
    this.isAndroid = platform.is('android');
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
    Games
    </ion-content>
`})
export class TabBasicContentPage3 {
  isAndroid: boolean = false;

  constructor(platform: Platform) {
    this.isAndroid = platform.is('android');
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
    SMS
    </ion-content>
`})
export class TabBasicContentPage4 {
  isAndroid: boolean = false;

  constructor(platform: Platform) {
    this.isAndroid = platform.is('android');
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
    OTR
    </ion-content>
`})
export class TabBasicContentPage5 {
  isAndroid: boolean = false;

  constructor(platform: Platform) {
    this.isAndroid = platform.is('android');
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
    RMG
    </ion-content>
`})
export class TabBasicContentPage6 {
  isAndroid: boolean = false;

  constructor(platform: Platform) {
    this.isAndroid = platform.is('android');
  }
}

@Component({
  template: `
    <ion-tabs class="tabs-basic" [selectedIndex]="1">
      
    <ion-tab tabTitle={{FTT}} [root]="FTTPage"></ion-tab>
    <ion-tab tabTitle={{TUP}} [root]="TUPPage"></ion-tab>
    <ion-tab tabTitle={{LSC}} [root]="LSCPage"></ion-tab>
    <ion-tab tabTitle={{SMS}} [root]="SMSPage"></ion-tab>
    <ion-tab tabTitle={{OTR}} [root]="OTRPage"></ion-tab>
    <ion-tab tabTitle={{RMG}} [root]="RMGPage" (ionSelect)="myMethod()" (click)="myMethod()"></ion-tab>

    </ion-tabs>
`})
export class BasicPage implements OnInit{
  planResponse: PlanDet;
  planRequest: PlanRequest;
  i:any;
  planTypes:string[]= ["RMG","OTR","LSC","TUP","SMS","FTT"];
  circleId: any;
  operatorId: any;
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

      
  }

  ngOnInit(){
    for(this.i=0;this.i<this.planTypes.length;this.i++){
      this.planRequest={
        OSId:this.operatorId,
        CircleId:this.circleId,
        PlanType:this.planTypes[this.i],
        TenantId:JSON.parse(StorageService.GetItem(this.constant.DB.User)).ActiveTenantId
      }
      
    }
    this.regService.GetPlans(this.planRequest).subscribe((data : any)=>{
      this.planResponse=data;
    },(error) => {this.toastr.error(error.message, 'Error!')
      });

  }


}
