//import { NavController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, Response, Headers } from "@angular/http";
//import { RegisterPage } from '../pages/register/register';
//import { LoginPage } from '../pages/login/login';
import { UIHelperService } from '../UIHelperClasses/UIHelperService';
import 'rxjs/add/operator/map';
//import { RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { UserClaim } from '../View Models/userclaim';
import { OTPRequest } from '../View Models/OTPrequest.vm';
import { DigiCustWithOTPRefNo } from '../View Models/DigiCustWithOTPRefNo';
import { PostOPT } from '../View Models/PostOPT';
import { UserPost } from '../View Models/UserPost';
import { UserResult } from '../View Models/UserResult';
import{ StorageService } from './Storage_Service';
import { TokenParams } from '../View Models/TokenParams';
import { OS } from '../View Models/OS';
//import { Loading } from 'ionic-angular';
import { SCRequest } from '../View Models/SCRequest';
import { OSRequest } from '../View Models/OSRequest';
import { OSResponse } from '../View Models/OSResponse';
import { RechargeModel } from '../View Models/RechargeModel';
import { TranResponse } from '../View Models/TranResponse';
import { RequestForDigiParty } from '../View Models/RequestForDigiParty';
import { DigiParty } from '../LocalStorageTables/DigiParty';
import { FundTransferRequest } from '../View Models/FundTransferRequest';
import { DoFundTransfer } from '../View Models/DoFundTransfer';
import { StatementRequest } from '../View Models/StatementRequest';
//import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class RegisterService {
    Logo: any;
    userresult: UserResult;
    userClaims:UserClaim ;

    //userClaims: any=[];
    user:OTPRequest;
    mobno:any;
    store: DigiCustWithOTPRefNo;
    postingOTP:PostOPT;
    userposting:UserPost;
    local:StorageService;
    SCReq:SCRequest;
    userToken:any;
   //constructor(private sqlite: SQLite,private httpclient:HttpClient,private locals:StorageService,private uihelper: UIHelperService,private http: Http) {
    constructor(private httpclient:HttpClient,private uihelper: UIHelperService,private http: Http) {

  
    }
    
    sendMobileNo(mobno:any) {
        var data = "MobileNo=" + mobno;
        var url=this.uihelper.CallWebAPIUrlNew("/Tenant/GetTenantsByMobile") + "?" + data;
       return this.http.get(url).map((response: Response) => {
            
             var datanew = response.json();
             this.Logo=datanew[0].IconHtml;
             this.userClaims=datanew;
             return response.json();
             

        }).catch(this.handleErrors);
          
      }
    requestingOTP(user : OTPRequest){
        // this.user={
        //     TenantId:this.userClaims.Id,
        //     MobileNo:this.mobno
        //   } 
        const body: OTPRequest = {
          TenantId: user.TenantId,
          MobileNo: user.MobileNo
          
        }
        var reqHeader = new Headers({'No-Auth':'True'});
        //return this.http.post(this.rootUrl + '/api/User/Register', body,{headers : reqHeader});
        return this.http.post(this.uihelper.CallWebAPIUrlNew("/User/RequestOTP"), body,{headers : reqHeader}).map((response: Response) =>{

            var datanew = response.json();
            this.store=datanew;
            return response.json();
        });
         //this.navCtrl.push(HomeComponent,{item:user});
      }

      requestingDigiParty(reqForDigiParty:RequestForDigiParty){
        const body: RequestForDigiParty = {
            TenantId: reqForDigiParty.TenantId,
            MobileNo: reqForDigiParty.MobileNo
            
          }
        return this.httpclient.post<DigiParty>(this.uihelper.CallWebAPIUrlNew("/xxxxxx/xxxxxxxxx"),body);
      
      }

      ValidatingOTP(postingOTP:PostOPT){
        const post: PostOPT = {
            TenantId: postingOTP.TenantId,
            PartyMastId: postingOTP.PartyMastId,
            OTPRef:postingOTP.OTPRef,
            OTP:postingOTP.OTP
          }
          var reqHeader = new Headers({'No-Auth':'True'});
          return this.http.post(this.uihelper.CallWebAPIUrlNew("/User/ValidateOTP"), post,{headers : reqHeader});
      }
      
      SaveMPin(userposting:UserPost){
       const userpost: UserPost = {
        DigiPartyId: userposting.DigiPartyId,
        TenantId: userposting.TenantId,
        PIN:userposting.PIN,
        PartyMastId: userposting.PartyMastId,
        UniqueId:userposting.UniqueId,
        OTPRef:userposting.OTPRef,
        OTP:userposting.OTP,
        MobileNo: userposting.MobileNo
      }

    var reqHeader = new Headers({'No-Auth':'True'});
    return this.http.post(this.uihelper.CallWebAPIUrlNew("/User/SaveMPin"), userpost,{headers : reqHeader}).map((response: Response) =>{
        var resultdata = response.json();
        this.userresult=resultdata;
        return response.json();
    });
    
}

    //   userAuthentication(userName,password,unique){   
    //     var data = "username=" + userName + "&password=" + password +"&unique="+unique+ "&grant_type=password";
    //     var reqHeader = new Headers({ 'Content-Type': 'application/x-www-urlencoded','No-Auth':'True' });
    //     return this.http.post(this.uihelper.CallWebAPIUrl("/token"), data, { headers: reqHeader }).map((response: Response) =>{
    //         var tokendata=response.json();
    //         var param1="userToken";
    //         LocalStorageService.SetItem(param1,tokendata.access_token);
    //         response.json();

    //     }); 
    // }
    userAuthentication(userName,password,unique):Observable<TokenParams>{   
        var data = "username=" + userName + "&password=" + password +"&unique="+unique+ "&grant_type=password";
        var reqHeader = new Headers({ 'Content-Type': 'application/x-www-urlencoded','No-Auth':'True' });
        return this.http.post(this.uihelper.CallWebAPIUrl("/token"), data, { headers: reqHeader }).map((res=>res.json()));   
    }


    loginbyHttpClient(userName,password,unique):Observable<TokenParams>{
        var data = "username=" + userName + "&password=" + password +"&unique="+unique+ "&grant_type=password";
        return this.httpclient.post<TokenParams>(this.uihelper.CallWebAPIUrl("/token"),data);
// this.sqlite.create({
//     name: 'data.db',
//     location: 'default'
//   })
//     .then((db: SQLiteObject) => {
  
  
//       db.executeSql('create table danceMoves(name VARCHAR(32))', {})
//         .then(() => console.log('Executed SQL'))
//         .catch(e => console.log(e));
  
  
//     })
//     .catch(e => console.log(e));
}

    getUserClaims(){
        return  this.http.get(this.uihelper.CallWebAPIUrl("/api/GetUserClaims"));    
        //return this.http.get(this.uihelper.CallWebAPIUrlNew("/Tenant/GetTenantsByMobile?MobileNo=8129750780"));

    }

    getservicesByHttpclient():Observable<OS[]>{
        return this.httpclient.get<OS[]>(this.uihelper.CallWebAPIUrlNew("/Operator/GetServices"));
     }


    getservices(){
           return this.http.get(this.uihelper.CallWebAPIUrlNew("/Operator/GetServices")).map((response: Response) => {
          return response.json();
        });
             }
    getAccountsbyHttpClient(SCReq:SCRequest){
    const scr: SCRequest = {
        PartyMastId: SCReq.PartyMastId,
        TenantId: SCReq.TenantId
      }  
    return this.httpclient.post<TokenParams>(this.uihelper.CallWebAPIUrlNew("/Banking/GetAccounts"),scr);
    }
    getAccounts(SCReq:SCRequest){
        const scr: SCRequest = {
            PartyMastId: SCReq.PartyMastId,
            TenantId: SCReq.TenantId
          }  
        return this.http.post(this.uihelper.CallWebAPIUrlNew("/Banking/GetAccounts"),scr).map((response: Response) => {
        return response.json();
        });
        }
   
    GetOperators(OSReq:OSRequest){

    const osr: OSRequest = {
        Starts:OSReq.Starts,
        PerentId: OSReq.PerentId,
        TenantId: OSReq.TenantId
      }  
    return this.httpclient.post<OSResponse>(this.uihelper.CallWebAPIUrlNew("/Operator/GetOperators"),osr);

    //return this.httpclient.get<OS[]>(this.uihelper.CallWebAPIUrlNew("/Operator/GetOperators"));

  } 

    PostRecharge(Recharge:RechargeModel){
      const rech: RechargeModel = {
        TenantId: Recharge.TenantId,
        DigiPartyId: Recharge.DigiPartyId,
        PartyMastId:Recharge.PartyMastId,
        AcMastId:Recharge.AcMastId,
        AcSubId:Recharge.AcSubId,
        Amount:Recharge.Amount,
        OperatorId:Recharge.OperatorId,
        SubscriptionId:Recharge.SubscriptionId,
        LocId:Recharge.LocId
      } 
      return this.httpclient.post<TranResponse>(this.uihelper.CallWebAPIUrlNew("/Recharge/PostRecharge"),rech);
      
  }
   
    SearchReceiverAccount(fundTransferRequest:FundTransferRequest){
      const FTReq: FundTransferRequest = {
        TenantId: fundTransferRequest.TenantId,
        MobileNo: fundTransferRequest.MobileNo
      } 
    return this.httpclient.post<TranResponse>(this.uihelper.CallWebAPIUrlNew("/Banking/GetFTAccount"),FTReq);

   }

    FundTransfer(doFundTransfer:DoFundTransfer){
      const DFT: DoFundTransfer = {
        TenantId: doFundTransfer.TenantId,
        DigiPartyId: doFundTransfer.DigiPartyId,
        FromAcMastId:doFundTransfer.FromAcMastId,
        FromAcSubId:doFundTransfer.FromAcSubId,
        FromLocId:doFundTransfer.FromLocId,
        ToAcMastId:doFundTransfer.ToAcMastId,
        ToAcSubId:doFundTransfer.ToAcSubId,
        ToLocId:doFundTransfer.ToLocId,
        Amount:doFundTransfer.Amount,
        ToAcNo:doFundTransfer.ToAcNo
      } 
    return this.httpclient.post<TranResponse>(this.uihelper.CallWebAPIUrlNew("/Banking/FundTransfer"),DFT);

   }

    GetBalance(statementRequest:StatementRequest){
      const StmntReq: StatementRequest = {
        AcMastId:statementRequest.AcMastId,
        AcSubId:statementRequest.AcMastId,
        TenantId: statementRequest.TenantId
        
      } 
      return this.httpclient.post<StatementRequest>(this.uihelper.CallWebAPIUrlNew("/Banking/GetAccountBalance"),StmntReq);
   }

    GetStatement(statementRequest:StatementRequest){
      const StmntReq: StatementRequest = {
        AcMastId:statementRequest.AcMastId,
        AcSubId:statementRequest.AcMastId,
        TenantId: statementRequest.TenantId
        
      } 
      return this.httpclient.post<StatementRequest>(this.uihelper.CallWebAPIUrlNew("/Banking/GetStatement"),StmntReq);
   }
    //     private ExtractData(res: Response) {

    //     let body = res.json();
    //     return body || [];

    // }

    private handleErrors(error: any): Observable<any> {
        let errors: string[] = [];
        switch (error.status) {
            case 400:
                let err = error.json();
                if (err.modelState) {
                    let valErrors = error.json.modelStae;
                    for (var key in valErrors) {
                        for (var i = 0; i < valErrors[key].length; i++) {
                            errors.push(valErrors[key][i])
                        }
                    }

                }
                else if (err.message) {
                    error.push(err.message);
                }
                else {
                    error.push("an unknown error occured")
                }
                break;
            case 404:
                error.push("No Product data is available")
                break;
            case 500:
                error.push(error.json().exceptionMessage)
                break;
            default:
                error.push("status:", +error.status + "" + error.statusText)
                break;
        };
        console.error("an error occured", errors);
        return Observable.throw(errors);
    }

}