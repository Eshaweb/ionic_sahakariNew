import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, DateTime } from 'ionic-angular';

/**
 * Generated class for the ModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage {

  Amount: string;
  VendorExtCode: string;
  Date: DateTime;
  Remarks: string;
  myParam: string;

  constructor(
    public viewCtrl: ViewController,
    params: NavParams
  ) {
    this.myParam = params.get('myParam');
    this.Amount = params.get('myParam').Amount;
    this.VendorExtCode=params.get('myParam').VendorExtCode;
    this.Date=params.get('myParam').Date;
    this.Remarks=params.get('myParam').Remarks;

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
