import { Component, OnInit } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { StorageService } from '../services/Storage_Service';
import { RegisterService } from '../services/app-data.service';
import { Tenant } from '../LocalStorageTables/Tenant';
import { RequestForDigiParty } from '../View Models/RequestForDigiParty';
import { NgForm } from '@angular/forms';
import { DigiParty } from '../LocalStorageTables/DigiParty';
import { DigiCustWithOTPRefNo } from '../View Models/DigiCustWithOTPRefNo';
import { Idle } from 'idlejs/dist';
import { LoginPage } from '../login/login';
import { AutoLogoutService } from '../services/AutoLogOutService';
import { AddBankRequest } from '../View Models/AddBankRequest';
import { AddBankResponse } from '../View Models/AddBankResponse';
import { TenantList } from '../View Models/TenantList';
import { JsonpModule } from '@angular/http';
import { User } from '../LocalStorageTables/User';
import { PagePage } from '../page/page';
import { HomePage } from '../home/home';
import { MyApp } from '../../app/app.component';
import { ToastrService } from 'ngx-toastr';
import { SelfCareAc } from '../LocalStorageTables/SelfCareAc';


  const idle = new Idle()
  .whenNotInteractive()
  .within(5,1000)
  //.do(() => console.log('IDLE'))
  .do(()=>LoginPage)
  //.do(() => { this.navCtrl.setRoot(LoginPage);})  //Need to call LoginPage
  .start();



@Component({
  selector: 'page-change-bank',
  templateUrl: 'change-bank.html'
})
export class ChangeBankPage implements OnInit{
  
  singleDigiParty: DigiParty;
  tenants:Tenant;

  // constructor(private autoLogoutService: AutoLogoutService,private regService : RegisterService,public constant:ConstantService,public navCtrl: NavController) {
    constructor(private toastrService: ToastrService,private events: Events,private registerService : RegisterService, public navCtrl: NavController) {

  }
  tenant: Tenant;
  ActiveBankName: string;
  Active: number;
  ngOnInit(){
    this.resetForm();
    var ActiveTenantId=JSON.parse(StorageService.GetUser()).ActiveTenantId;
    this.Active=+ActiveTenantId;    
    //StorageService.SetItem('lastAction', Date.now().toString());
    this.mobno=JSON.parse(StorageService.GetUser()).UserName;
   this.tenants=JSON.parse(StorageService.GetTenant());
   this.tenant=this.tenants.find(function (obj) { return obj.Id === ActiveTenantId; });
   this.ActiveBankName=this.tenant.Name;
   
   this.registerService.GetTenantsByMobile(this.mobno).subscribe((data : any)=>{
    this.addedTenantRecord=JSON.parse(StorageService.GetTenant());
    this.tenantList = data;    //got tenantlist from server
    var tenlist=data;
    this.tenantList.Id=data[0].Id;
    StorageService.SetTenant(JSON.stringify(this.tenantList));  //Works, But not as of reqment
if(this.tenants.length<tenlist.length){
  for(var i=0;i<tenlist.length;i++){
    this.OnAddBankSelection(tenlist[i].Id);
  }
}
    
  });
  
}
tenantList: TenantList;
filterByString(tenantlist, ActiveTenantId) {
  return this.tenantList.filter(e => e.Id==ActiveTenantId);
}
mobno: string;
//showHide:boolean;
addedTenantRecord: Tenant;
//selectboxoptions: Tenant;
//Options: boolean;
//NoOptions: boolean;
// OnAddBank(){
//   this.mobno=JSON.parse(StorageService.GetUser()).UserName;
//   this.showHide=true;   
//   this.regService.GetTenantsByMobile(this.mobno).subscribe((data : any)=>{
//     this.addedTenantRecord=JSON.parse(StorageService.GetTenant());
//     this.tenantList = data;    //got tenantlist from server
//     this.tenantList.Id=data[0].Id;
//     this.selectboxoptions={
//       Id:"",
//       Name:"",
//       Address:"",
//       IconHtml:""
//     };

//     this.selectboxoptions=this.tenantList.filter(o=>!this.addedTenantRecord.find(o2=>o.Id===o2.Id));
//     this.Options=true;
//     if(this.selectboxoptions.length==0){
//       this.Options=false;
//       this.NoOptions=true;
//     }
//     else{
//       this.NoOptions=false;
//     }
//   },(error) => {this.toastr.error(error.message, 'Error!')

// });
// }
addBankRequest: AddBankRequest;
singletenant: TenantList;
addBankResponse: AddBankResponse;
user: User;
digiParty: DigiParty;
singleSelfCareAC:SelfCareAc;
OnAddBankSelection(Id){
  this.mobno=JSON.parse(StorageService.GetUser()).UserName;
  this.singletenant=this.tenantList.filter(function (obj) { return obj.Id === Id; });
  this.addBankRequest={
    TenantId:Id,
    MobileNo:JSON.parse(StorageService.GetUser()).UserName
  }
  this.registerService.AddBank(this.addBankRequest).subscribe((data:any)=>{
    this.addBankResponse=data;
    this.tenant={
      Id:this.addBankResponse.Tenant.Id,
      //TenantId:this.addbankresponse.Tenant.TenantId,   //ActiveTenantId
      Name:this.addBankResponse.Tenant.Name,
      Address:this.addBankResponse.Tenant.Address,
      IconHtml:this.addBankResponse.Tenant.IconHtml
    }
    // var existingTenant=JSON.parse(StorageService.GetTenant());
    // existingTenant.push(this.tenant);
    // StorageService.SetTenant(JSON.stringify(existingTenant));
    this.tenants=JSON.parse(StorageService.GetTenant());

    this.digiParty={
      Id:this.addBankResponse.DigiPartyId,
      DigiPartyId:this.addBankResponse.DigiPartyId,
      PartyMastId:this.addBankResponse.PartyMastId,
      MobileNo:this.addBankResponse.MobileNo,
      TenantId:this.addBankResponse.TenantId,  //ActiveTenantId
      Name:this.addBankResponse.Name
    }
    var existingDigiParty=JSON.parse(StorageService.GetDigiParty());
    var TenantId=this.tenant.Id;
    this.singleDigiParty=existingDigiParty.find(function (obj) { return obj.TenantId === TenantId; });
    if(this.singleDigiParty==null){
      existingDigiParty.push(this.digiParty);
      StorageService.SetDigiParty(JSON.stringify(existingDigiParty));
    }
    

    var existingSelfCareAcs=JSON.parse(StorageService.GetSelfCareAc());
    this.singleSelfCareAC=existingSelfCareAcs.find(function (obj) { return obj.TenantId === TenantId; }); 
    if(this.singleSelfCareAC==null){
      this.singleSelfCareAC={
        AcActId:this.addBankResponse.SelfCareAcs[0].AcActId,
        AcHeadId:this.addBankResponse.SelfCareAcs[0].AcHeadId,
        AcNo:this.addBankResponse.SelfCareAcs[0].AcNo,
        AcSubId:this.addBankResponse.SelfCareAcs[0].AcSubId,
        HeadName:this.addBankResponse.SelfCareAcs[0].HeadName,
        LocId:this.addBankResponse.SelfCareAcs[0].LocId,
        TenantId:this.addBankResponse.SelfCareAcs[0].TenantId
      }
      existingSelfCareAcs.push(this.singleSelfCareAC);
    //existingSelfCareAcs.push(this.addbankresponse.SelfCareAcs);
    StorageService.SetSelfCareAc(JSON.stringify(existingSelfCareAcs));
    }
    this.user=JSON.parse(StorageService.GetUser());
    this.user.ActiveTenantId= this.tenant.Id;
    StorageService.SetUser(JSON.stringify(this.user)); 
    var ActiveTenantId=JSON.parse(StorageService.GetUser()).ActiveTenantId;
    this.Active=+ActiveTenantId;  
    this.ActiveBankName=StorageService.GetActiveBankName();
    //this.OnAddBank();
    this.events.publish('REFRESH_DIGIPARTYNAME');
  },(error) => {this.toastrService.error(error.message, 'Error!')

});
  
}

OnSelect(order){
  this.mobno=JSON.parse(StorageService.GetUser()).UserName;
  this.user=JSON.parse(StorageService.GetUser());
  this.user.ActiveTenantId= order.Id;
  StorageService.SetUser(JSON.stringify(this.user)); 
  var ActiveTenantId=JSON.parse(StorageService.GetUser()).ActiveTenantId;
  this.Active=+ActiveTenantId;  
  this.ActiveBankName=StorageService.GetActiveBankName();
  this.navCtrl.setRoot(PagePage);
  this.events.publish('REFRESH_DIGIPARTYNAME');

}

// OnRemove(Id){
// this.Tenants=JSON.parse(StorageService.GetTenant());
// this.Tenants=this.Tenants.filter(function( obj ) {
//   return obj.Id !== Id;
// });
// StorageService.SetTenant(JSON.stringify(this.Tenants));  

// var existingDigiParty=JSON.parse(StorageService.GetDigiParty());
// existingDigiParty=existingDigiParty.filter(function( obj ) {
//   return obj.TenantId !== Id;
// });
// StorageService.SetDigiParty(JSON.stringify(existingDigiParty));  

// var existingSelfCareAcs=JSON.parse(StorageService.GetSelfCareAc());
// existingSelfCareAcs=existingSelfCareAcs.filter(function( obj ) {
//   return obj.TenantId !== Id;
// });
// StorageService.SetSelfCareAc(JSON.stringify(existingSelfCareAcs))
// //this.OnAddBank();
// }

reqForDigiParty:RequestForDigiParty;
resetForm(form?: NgForm) {
  if (form != null)
    form.reset();
this.reqForDigiParty = {
  TenantId: '',
  MobileNo: ''
}
this.tenant={
  Id:'',
  //TenantId:'',
  Name:'',
  Address:'',
  IconHtml:''
}
}

}
