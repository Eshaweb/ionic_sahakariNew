import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageService } from '../services/Storage_Service';
import { Tenant } from '../LocalStorageTables/Tenant';
import { EnterOTPPage } from '../enter-otp/enter-otp';
import { RegisterService } from '../services/app-data.service';
import { LoginPage } from '../login/login';

/**
 * Generated class for the MyProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-my-profile',
  templateUrl: 'my-profile.html',
})
export class MyProfilePage implements OnInit{

  addedTenantRecord: Tenant;
  tenantList: Tenant;
  tenants: Tenant;
  mobileno: string;
  digipartyname: string;
  ngOnInit(){

    this.digipartyname = StorageService.Getdigipartyname();
    this.mobileno=StorageService.GetUser().UserName;
    this.registerService.GetTenantsByMobile(this.mobileno).subscribe((data: any) => {
      this.tenantList = data;  
      StorageService.SetTenant(JSON.stringify(this.tenantList)); 
      this.tenants = StorageService.GetTenant(); 
    });
  }
  constructor(private registerService: RegisterService,public navCtrl: NavController, public navParams: NavParams) {
  }
  OnChange(){
    var ischangePassword:boolean=true;
    this.navCtrl.push(EnterOTPPage,{'ischangePassword':ischangePassword});
  }
  OnLogOut(){
StorageService.RemoveRecordsForLogout();
this.navCtrl.push(LoginPage);
  }
}
