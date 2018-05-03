import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { StorageService } from '../services/Storage_Service';
import { ConstantService } from '../services/Constants';
import { RegisterService } from '../services/app-data.service';
import { UserClaim } from '../View Models/userclaim';
import { Tenant } from '../LocalStorageTables/Tenant';
import { RequestForDigiParty } from '../View Models/RequestForDigiParty';
import { NgForm } from '@angular/forms';
import { DigiParty } from '../LocalStorageTables/DigiParty';
import { DigiCustWithOTPRefNo } from '../View Models/DigiCustWithOTPRefNo';
import { Idle } from 'idlejs/dist';
import { LoginPage } from '../login/login';
import { AutoLogoutService } from '../services/AutoLogOutService';

  const idle = new Idle()
  .whenNotInteractive()
  .within(5,1000)
  //.do(() => console.log('IDLE'))
  .do(() => LoginPage)  //Need to call LoginPage
  .start();



@Component({
  selector: 'page-change-bank',
  templateUrl: 'change-bank.html'
})
export class ChangeBankPage implements OnInit{
  existingentries: Tenant;
  //store: DigiCustWithOTPRefNo;
  digiParty: DigiParty;
  tenant: Tenant;
  mobno: any;
  reqForDigiParty:RequestForDigiParty;
  Active: number;
  filtereduserClaims: UserClaim;
  userClaims: UserClaim;
  userClaim: UserClaim;
  Tenants:Tenant;
  ActiveBankName: any;
  showHide:boolean;
  showIcon:boolean;

  // constructor(private autoLogoutService: AutoLogoutService,private regService : RegisterService,public constant:ConstantService,public navCtrl: NavController) {
    constructor(private regService : RegisterService,public constant:ConstantService,public navCtrl: NavController) {

  }
  
  ngOnInit(){
    this.resetForm();
    var ActiveTenantId=JSON.parse(StorageService.GetItem(this.constant.DB.DigiParty)).TenantId;
    this.Active=+ActiveTenantId;
    this.ActiveBankName=JSON.parse(StorageService.GetItem(this.constant.DB.User)).ActiveTenantName;
    var mobno=JSON.parse(StorageService.GetItem(this.constant.DB.DigiParty)).MobileNo;
    
    //StorageService.SetItem('lastAction', Date.now().toString());

    
    //   this.regService.sendMobileNo(mobno).subscribe((data : any)=>{
  //     this.userClaims = data;
  //      //this.userClaims=this.userClaims.filter((data)=>data[0].Id===ActiveTenantId);
  //     this.userClaims.Id=data[1].Id;
  //     if(this.userClaims.Id==ActiveTenantId){
  //       this.showIcon=true;
  //     }
  // });
   this.Tenants=JSON.parse(StorageService.GetItem(this.constant.DB.Tenant));
   //var Tenantlist=JSON.stringify(this.Tenants);
  //  if(){
  //   Tenantlist.push()

  //  }


   // this.regService.sendMobileNo(mobno).map(function(obj){
//   this.userClaims = obj;
//   return this.userClaims.filter(e => {e.Id==ActiveTenantId});
//  //return this.userClaims.Id==ActiveTenantId;

// });
}
filterByString(userClaims, ActiveTenantId) {
  return userClaims.filter(e => e.Id==ActiveTenantId);
}

OnClick(){
  this.mobno=JSON.parse(StorageService.GetItem(this.constant.DB.User)).UserName;
  this.showHide=true;   
  this.regService.sendMobileNo(this.mobno).subscribe((data : any)=>{
    this.userClaims = data;    //got tenantlist from server
    this.userClaims.Id=data[0].Id;
    // for(var i = 0; i <data.length; i++){
    //   for(var j = 0; j <this.Tenants.length; j++){
    //     if (data[i].Id === this.Tenants[i].TenantId) {
    //       this.userClaims =null;
    //   }
    // }}

    this.userClaims.filter(o => this.Tenants.find(o2 => o.Id === o2.TenantId));
    //this.userClaims.filter(function(obj){ return obj.Id === this.Tenants.TenantId; });

    // if(this.Tenants.TenantId==data.Id){
    //   this.userClaims =null;
    // }
    // else{
    //   this.userClaims = data;    //got tenantlist from server
    //   this.userClaims.Id=data[0].Id;
    // }
    
  });
}

// OnSubmit(MobileRecharegeform){
//   this.mobno=JSON.parse(StorageService.GetItem(this.constant.DB.User)).UserName;
  
//   this.OTPreq={
//     TenantId:this.OTPreq.TenantId,
//     MobileNo:this.mobno
//   }
//   this.tenant={
//     Id:'',
//     TenantId:this.tenant.TenantId,
//     Name:this.tenant.Name,
//     Address:this.tenant.Address,
//     Logo:this.tenant.Logo
//   }
//   var existing=JSON.parse(StorageService.GetItem(this.constant.DB.Tenant));
//   this.tenant=existing.push(this.tenant);
//   StorageService.SetItem(this.constant.DB.Tenant,JSON.stringify(this.tenant));  //Works, But not as of reqment
// }


OnSubmit(Id){
  this.mobno=JSON.parse(StorageService.GetItem(this.constant.DB.User)).UserName;
  this.userClaim=this.userClaims.filter(function (obj) { return obj.Id === Id; });
  
  this.tenant={
    Id:'',
    TenantId:Id,
    Name:this.userClaim[0].Name,
    Address:this.userClaim[0].Address,
    Logo:this.userClaim[0].IconHtml
  }
  var existing=JSON.parse(StorageService.GetItem(this.constant.DB.Tenant));
  this.existingentries=existing.filter(function (obj) { return obj.TenantId === Id; });
  if(this.existingentries[0]==null){
    existing.push(this.tenant);
    StorageService.SetItem(this.constant.DB.Tenant,JSON.stringify(existing));  
  } 
  else if(this.existingentries[0].TenantId==Id){
    StorageService.SetItem(this.constant.DB.Tenant,JSON.stringify(existing));  
  }
  this.Tenants=JSON.parse(StorageService.GetItem(this.constant.DB.Tenant));
}
OnPress(order){
  this.reqForDigiParty={
    TenantId:order.TenantId,
    MobileNo:this.mobno
  }
  this.regService.requestingDigiParty(this.reqForDigiParty).subscribe((data:any)=>{
    this.digiParty={
      Id:data.DigiPartyId,
      DigiPartyId:data.DigiPartyId,
      PartyMastId:data.PartyMastId,
      MobileNo:data.MobileNo,
      TenantId:data.TenantId,  //ActiveTenantId
      Name:data.Name
    }
  });
}

resetForm(form?: NgForm) {
  if (form != null)
    form.reset();
this.reqForDigiParty = {
  TenantId: '',
  MobileNo: ''
}
this.tenant={
  Id:'',
  TenantId:'',
  Name:'',
  Address:'',
  Logo:''
}
}

}
