import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { StorageService } from '../services/Storage_Service';
import { RegisterService } from '../services/app-data.service';
import { ToastrService } from 'ngx-toastr';
import { BankBranch } from '../View Models/BankBranch';

/**
 * Generated class for the BankBranchesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-bank-branches',
  templateUrl: 'bank-branches.html',
})
export class BankBranchesPage implements OnInit{
  bankBranch: BankBranch;
  constructor(private storageService:StorageService, private alertCtrl: AlertController,private toastr: ToastrService, public loadingController: LoadingController,private registerService: RegisterService,public navCtrl: NavController, public navParams: NavParams) {
  
  }
  ngOnInit() {
    let loading = this.loadingController.create({
      content: 'Loading the Account Balance..'
  });
  loading.present();
    var ActiveTenantId=this.storageService.GetUser().ActiveTenantId;
    this.registerService.GetLocations(ActiveTenantId).subscribe((data: any) => {
      this.bankBranch = data;
      //alert(data.Balance);
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad BankBranchesPage');
  }

}
