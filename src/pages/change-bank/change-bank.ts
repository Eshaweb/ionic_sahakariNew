import { Component, OnInit } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { StorageService } from '../services/Storage_Service';
import { ConstantService } from '../services/Constants';
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
  Options: boolean;
  NoOptions: boolean;
  newselectlist: TenantList;
  selectboxoptions: Tenant;
  user: User;
  addedTenantRecord: Tenant;
  addbankresponse: AddBankResponse;
  addbankreq: AddBankRequest;
  Tenant: Tenant;
  existingentries: Tenant;
  //store: DigiCustWithOTPRefNo;
  digiParty: DigiParty;
  tenant: Tenant;
  mobno: any;
  reqForDigiParty:RequestForDigiParty;
  Active: number;
  filtereduserClaims: TenantList;
  tenantList: TenantList;
  singletenant: TenantList;
  Tenants:Tenant;
  ActiveBankName: any;
  showHide:boolean;
  showIcon:boolean;

  // constructor(private autoLogoutService: AutoLogoutService,private regService : RegisterService,public constant:ConstantService,public navCtrl: NavController) {
    constructor(private events: Events,private regService : RegisterService,public constant:ConstantService,public navCtrl: NavController) {

  }
  
  ngOnInit(){
    this.resetForm();
    var ActiveTenantId=JSON.parse(StorageService.GetItem(this.constant.DB.User)).ActiveTenantId;
    this.Active=+ActiveTenantId;
    var mobno=JSON.parse(StorageService.GetItem(this.constant.DB.DigiParty)).MobileNo;
    
    //StorageService.SetItem('lastAction', Date.now().toString());

   this.Tenants=JSON.parse(StorageService.GetItem(this.constant.DB.Tenant));
   this.Tenant=this.Tenants.find(function (obj) { return obj.Id === ActiveTenantId; });
   this.ActiveBankName=this.Tenant.Name;
}

filterByString(tenantlist, ActiveTenantId) {
  return this.tenantList.filter(e => e.Id==ActiveTenantId);
}

OnAddBank(){
  this.mobno=JSON.parse(StorageService.GetItem(this.constant.DB.User)).UserName;
  this.showHide=true;   
  this.regService.GetTenantsByMobile(this.mobno).subscribe((data : any)=>{
    this.addedTenantRecord=JSON.parse(StorageService.GetItem(this.constant.DB.Tenant));
    this.tenantList = data;    //got tenantlist from server
    this.tenantList.Id=data[0].Id;
    this.selectboxoptions={
      Id:"",
      Name:"",
      Address:"",
      IconHtml:""
    };

    this.selectboxoptions=this.tenantList.filter(o=>!this.addedTenantRecord.find(o2=>o.Id===o2.Id));
    this.Options=true;
    if(this.selectboxoptions.length==0){
      this.Options=false;
      this.NoOptions=true;
    }
    else{
      this.NoOptions=false;
    }
  });
}


OnAddBankSelection(Id){
  this.mobno=JSON.parse(StorageService.GetItem(this.constant.DB.User)).UserName;
  this.singletenant=this.tenantList.filter(function (obj) { return obj.Id === Id; });
  this.addbankreq={
    TenantId:Id,
    MobileNo:JSON.parse(StorageService.GetItem(this.constant.DB.User)).UserName
  }
  this.regService.AddBank(this.addbankreq).subscribe((data:any)=>{
    this.addbankresponse=data;
    this.tenant={
      Id:this.addbankresponse.Tenant.Id,
      //TenantId:this.addbankresponse.Tenant.TenantId,   //ActiveTenantId
      Name:this.addbankresponse.Tenant.Name,
      Address:this.addbankresponse.Tenant.Address,
      IconHtml:this.addbankresponse.Tenant.IconHtml
    }
    var existingTenant=JSON.parse(StorageService.GetItem(this.constant.DB.Tenant));
    existingTenant.push(this.tenant);
    StorageService.SetItem(this.constant.DB.Tenant,JSON.stringify(existingTenant));  
    this.Tenants=JSON.parse(StorageService.GetItem(this.constant.DB.Tenant));

    this.digiParty={
      Id:this.addbankresponse.DigiPartyId,
      DigiPartyId:this.addbankresponse.DigiPartyId,
      PartyMastId:this.addbankresponse.PartyMastId,
      MobileNo:this.addbankresponse.MobileNo,
      TenantId:this.addbankresponse.TenantId,  //ActiveTenantId
      Name:this.addbankresponse.Name
    }
    var existingDigiParty=JSON.parse(StorageService.GetItem(this.constant.DB.DigiParty));
    existingDigiParty.push(this.digiParty);
    StorageService.SetItem(this.constant.DB.DigiParty,JSON.stringify(existingDigiParty));  


    var existingSelfCareAcs=JSON.parse(StorageService.GetItem(this.constant.DB.SelfCareAc));
    existingSelfCareAcs.push(this.addbankresponse.SelfCareAcs);
    StorageService.SetItem(this.constant.DB.SelfCareAc,JSON.stringify(existingSelfCareAcs))
    this.user=JSON.parse(StorageService.GetItem(this.constant.DB.User));
    this.user.ActiveTenantId= this.tenant.Id;
    StorageService.SetItem(this.constant.DB.User,JSON.stringify(this.user)); 
    var ActiveTenantId=JSON.parse(StorageService.GetItem(this.constant.DB.User)).ActiveTenantId;
    this.Active=+ActiveTenantId;  
    this.Tenants=JSON.parse(StorageService.GetItem(this.constant.DB.Tenant));
    this.Tenant=this.Tenants.find(function (obj) { return obj.Id === ActiveTenantId; });
    this.ActiveBankName=this.Tenant.Name;
    this.OnAddBank();
  });
  
}

OnSelect(order){
  this.mobno=JSON.parse(StorageService.GetItem(this.constant.DB.User)).UserName;
  this.user=JSON.parse(StorageService.GetItem(this.constant.DB.User));
  this.user.ActiveTenantId= order.Id;
  StorageService.SetItem(this.constant.DB.User,JSON.stringify(this.user)); 
  var ActiveTenantId=JSON.parse(StorageService.GetItem(this.constant.DB.User)).ActiveTenantId;
  this.Active=+ActiveTenantId;  
  this.Tenants=JSON.parse(StorageService.GetItem(this.constant.DB.Tenant));
  this.Tenant=this.Tenants.find(function (obj) { return obj.Id === ActiveTenantId; });
  this.ActiveBankName=this.Tenant.Name;
  this.navCtrl.setRoot(PagePage);
  this.events.publish('Refresh DigiPartyName');

}

OnRemove(Id){
this.Tenants=JSON.parse(StorageService.GetItem(this.constant.DB.Tenant));
this.Tenants=this.Tenants.filter(function( obj ) {
  return obj.Id !== Id;
});
StorageService.SetItem(this.constant.DB.Tenant,JSON.stringify(this.Tenants));  

var existingDigiParty=JSON.parse(StorageService.GetItem(this.constant.DB.DigiParty));
existingDigiParty=existingDigiParty.filter(function( obj ) {
  return obj.TenantId !== Id;
});
StorageService.SetItem(this.constant.DB.DigiParty,JSON.stringify(existingDigiParty));  

var existingSelfCareAcs=JSON.parse(StorageService.GetItem(this.constant.DB.SelfCareAc));
existingSelfCareAcs=existingSelfCareAcs.filter(function( obj ) {
  return obj.TenantId !== Id;
});
StorageService.SetItem(this.constant.DB.SelfCareAc,JSON.stringify(existingSelfCareAcs))
this.OnAddBank();
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
  //TenantId:'',
  Name:'',
  Address:'',
  IconHtml:''
}
}

}
