import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import {LoadingController, NavController, Form, NavParams } from 'ionic-angular';
import { HttpErrorResponse } from '@angular/common/http';
import { RegisterService } from '../services/app-data.service';
import { OSResponse } from '../View Models/OSResponse';
import { OSRequest } from '../View Models/OSRequest';
import { StorageService } from '../services/Storage_Service';
import isSubset from 'is-subset/module';
//import { CompleteTestService } from '../services/CompleteTestService';
@Component({
    selector: 'page-select-operator',
    templateUrl: 'select-operator.html'
  })


  export class SelectOperatorPage implements OnInit{
  CombinedResponse: any;
  OldOSResponseInString: string;
  OSResponseNew: OSResponse;
  NewOSResponseInString: string;
  Id: any;
  i:any;
  j:any;
  gender: string;
  osreq:OSRequest;
    OSResponseOld: OSResponse;
    starts: any;
    isLoginError: boolean;
    formgroup:FormGroup;
    selectoperator:AbstractControl;
    pets: Array<string>;

    constructor(public navParams: NavParams,private regService : RegisterService, public loadingController: LoadingController,public navCtrl: NavController, public formbuilder:FormBuilder) {
        this.formgroup = formbuilder.group({
            selectoperator:['',[Validators.required,Validators.minLength(2)]]
          });
          this.gender = 'f';
          this.selectoperator = this.formgroup.controls['selectoperator'];
    
        }
ngOnInit(){
  this.Id=this.navParams.get('Id');
  if(StorageService.GetItem("OSResponse")==null){
  this.OldOSResponseInString="";
  }
  else{
    this.OldOSResponseInString=StorageService.GetItem("OSResponse");
  }
  this.osreq={
    Starts:"",
    PerentId:this.Id,
    TenantId:localStorage.getItem('ActiveTenantId'),
  }
  this.regService.GetOperators(this.osreq).subscribe((data : any)=>{
    this.OSResponseNew = data;

  });
}

OnSubmit(operator){
    let loading = this.loadingController.create({
      content: 'Please wait till the screen loads'
    });

    loading.present();

    this.starts=operator;
    var param=JSON.parse(StorageService.GetOS());
    var par=param.Id;
    this.osreq={
      Starts:"",
      //PerentId:localStorage.getItem('OS.Id'),
      PerentId:this.Id,
      TenantId:localStorage.getItem('ActiveTenantId'),
    }
    this.regService.GetOperators(this.osreq).subscribe((data : any)=>{
    this.OSResponseOld = data;
    this.OSResponseNew=JSON.parse(StorageService.GetItem("OSResponse"));
    this.OldOSResponseInString=StorageService.GetItem("OSResponse"); 
    this.NewOSResponseInString=JSON.stringify(this.OSResponseOld);
    if(this.OldOSResponseInString==null){
      this.CombinedResponse=this.NewOSResponseInString;
    }
    //else if this.OldOSResponseInString.indexOf(this.NewOSResponseInString)==-1)
    //else if(isSubset()==true){
    //else if(this.OldOSResponseInString.includes(this.NewOSResponseInString)){
    else if(this.OldOSResponseInString.includes(this.NewOSResponseInString)){
      //else if(this.OldOSResponseInString.includes{

      //else if(this.OSResponseOld.Id==this.OSResponseNew.Id){
    this.CombinedResponse=this.OldOSResponseInString;
    }
    else{
      this.CombinedResponse=JSON.stringify(JSON.parse(this.OldOSResponseInString).concat(JSON.parse(this.NewOSResponseInString)));
    }

//this.completeTestService.GetOperators(this.osreq).subscribe((data:any)=>{         commented on 16th may
       //this.OSResponseOld = data;
//this.completeTestService=data;  commented on 16th may

    isSubset(this.OldOSResponseInString,this.NewOSResponseInString)
  //   for (this.i=0,this.j=0; this.i<this.OldOSResponseInString.length && this.j<this.NewOSResponseInString.length;) {
  //     if(this.OldOSResponseInString==null){
  //       this.CombinedResponse=this.NewOSResponseInString;
  //     }else if (this.OldOSResponseInString[this.i] == this.NewOSResponseInString[this.j]) {   
  //       this.CombinedResponse=this.OldOSResponseInString;
  //     } 
  //     else{
  //       this.CombinedResponse=JSON.stringify(JSON.parse(this.OldOSResponseInString).concat(JSON.parse(this.NewOSResponseInString)));
  //     }
  // }
  
    this.OSResponseNew=JSON.parse(this.CombinedResponse);
    StorageService.SetItem("OSResponse",this.CombinedResponse);
    
      setTimeout(() => {
        loading.dismiss();
      }, 3000); 
},
(err : HttpErrorResponse)=>{
  this.isLoginError = true;
});
    
}
  }
