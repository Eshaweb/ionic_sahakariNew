import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform, LoadingController, NavParams, NavController, Tabs, Navbar, Slides, Segment, SegmentButton, ViewController, AlertController } from 'ionic-angular';
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
export class BasicPage implements OnInit {
  active_Segmant: string;
  @ViewChild('slider') slider: Slides;
  @ViewChild(Segment)
  private segment: Segment;
  page = 0;
  // @ViewChild(Navbar) navBar: Navbar;
  navparams: any;
  planTypes: string[] = ["FTT", "TUP", "LSC", "SMS", "OTR", "RMG"];
  planResponse: PlanDet;
  isAndroid: boolean = false;
  isButtonEnabled: boolean = false;
  constructor(private storageService:StorageService,private alertCtrl: AlertController, private viewCtrl: ViewController, private toastr: ToastrService, public constant: ConstantService, private registerService: RegisterService, public loadingController: LoadingController, public navParams: NavParams, public navCtrl: NavController, platform: Platform) {
    this.active_Segmant = "0";
    var FTT = "FullTalkTime";
    var LSC = "LSC";
    var TUP = "TopUp";
    var SMS = "SMS";
    var OTR = "Other";
    var RMG = "Roaming";
    this.navparams = this.navParams.data;
    let loading = this.loadingController.create({
      content: 'Please wait till the screen loads'
    });

    loading.present();
    this.isAndroid = platform.is('android');
    this.navparams = this.navParams.data;
    var operatorId = this.navParams.get('OperatorId');
    var circleId = this.navParams.get('CircleId');
    const planRequest = {
      OSId: operatorId,
      CircleId: circleId,
      PlanType: this.planTypes[0],
      TenantId: this.storageService.GetUser().ActiveTenantId
    }
    this.registerService.GetPlans(planRequest).subscribe((data: any) => {
      this.planResponse = data;
    }, (error) => {
      this.toastr.error(error.message, 'Error!');
      var alert = this.alertCtrl.create({
        title: "Error Message",
        subTitle: error.message,
        buttons: ['OK']
      });
      alert.present();
    });
    loading.dismiss();
  }

  ActiveBankName: string;

  ngOnInit() {
    this.ActiveBankName = this.storageService.GetActiveBankName();
  }

  onSegmentChange(event) {
    // this.slider.slideTo(event.value);
    // this.active_Segmant=event.value.toString();
    this.active_Segmant = event.toString();
    this.slider.slideTo(event);
  }
  slideChanged() {
    var operatorId = this.navParams.get('OperatorId');
    var circleId = this.navParams.get('CircleId');
    let currentIndex = this.slider.getActiveIndex();
    this.active_Segmant = currentIndex.toString();
    if (this.active_Segmant == "6") {
      this.slider.isEnd();
      return null;
    }
    console.log('Current index is', currentIndex);
    let loading = this.loadingController.create({
      content: 'Please wait till the screen loads'
    });
    loading.present();
    this.slider.slideTo(currentIndex);
    const planRequest = {
      OSId: operatorId,
      CircleId: circleId,
      PlanType: this.planTypes[currentIndex],
      TenantId: this.storageService.GetUser().ActiveTenantId
    }
    this.registerService.GetPlans(planRequest).subscribe((data: any) => {
      this.planResponse = data;
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

  OnAmount(amount) {
    this.isButtonEnabled = true;
    this.navCtrl.push(MobileRechargePage, { 'Amount': amount, 'ParentId': this.navParams.get('ParentId'), 'OperatorId': this.navParams.get('OperatorId'), 'CircleId': this.navParams.get('CircleId'), 'SubscriptionId': this.navParams.get('SubscriptionId'), 'nname': this.navParams.get('nname'), 'ButtonEnabled': this.isButtonEnabled });

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

