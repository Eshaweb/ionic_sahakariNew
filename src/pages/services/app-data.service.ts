import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, Response, Headers } from "@angular/http";
import { UIHelperService } from '../UIHelperClasses/UIHelperService';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { OTPRequest } from '../View Models/OTPrequest.vm';
import { DigiCustWithOTPRefNo } from '../View Models/DigiCustWithOTPRefNo';
import { PostOPT } from '../View Models/PostOPT';
import { UserPost } from '../View Models/UserPost';
import { UserResult } from '../View Models/UserResult';
import { StorageService } from './Storage_Service';
import { TokenParams } from '../View Models/TokenParams';
import { OS } from '../View Models/OS';
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
import { AddBankRequest } from '../View Models/AddBankRequest';
import { TenantList } from '../View Models/TenantList';
import { ToastrService } from 'ngx-toastr';
import { PlanRequest } from '../View Models/PlanRequest';
import { PlanResponse } from '../View Models/PlanResponse';
import { RRRequest } from '../View Models/RRRequest';
//import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class RegisterService {
    TenantId: string;
    MobileNo: any;
    Logo: any;
    userresult: UserResult;
    tenantlist: TenantList;

    //userClaims: any=[];
    user: OTPRequest;
    mobno: any;
    store: DigiCustWithOTPRefNo;
    postingOTP: PostOPT;
    userposting: UserPost;
    local: StorageService;
    SCReq: SCRequest;
    userToken: any;
    //constructor(private sqlite: SQLite,private httpclient:HttpClient,private locals:StorageService,private uihelper: UIHelperService,private http: Http) {
    constructor(private toastr: ToastrService, private httpclient: HttpClient, private locals: StorageService, private uihelper: UIHelperService) {


    }

    GetTenantsByMobile(mobno: any) {
        this.MobileNo = mobno;
        var data = "MobileNo=" + mobno;
        var url = this.uihelper.CallWebAPIUrlNew("/Tenant/GetTenantsByMobile") + "?" + data;
        //    return this.http.get(url).map((response: Response) => {

        //          var datanew = response.json();
        //          this.Logo=datanew[0].IconHtml;
        //          this.tenantlist=datanew;
        //          return response.json();

        //         });
        return this.httpclient.get<TenantList>(url);
        // }).catch(this.handleErrors);

    }
    RequestOTP(user: OTPRequest) {

        const body: OTPRequest = {
            TenantId: user.TenantId,
            MobileNo: user.MobileNo

        }
        this.TenantId = user.TenantId;
        //var reqHeader = new Headers({'No-Auth':'True'});
        // return this.http.post(this.uihelper.CallWebAPIUrlNew("/User/RequestOTP"), body,{headers : reqHeader}).map((response: Response) =>{

        //     var datanew = response.json();
        //     this.store=datanew;
        //     return response.json();
        // });
        return this.httpclient.post<DigiCustWithOTPRefNo>(this.uihelper.CallWebAPIUrlNew("/User/RequestOTP"), body);
    }

    ValidateOTP(postingOTP: PostOPT) {
        const post: PostOPT = {
            TenantId: postingOTP.TenantId,
            MobileNo: postingOTP.MobileNo,
            OTPRef: postingOTP.OTPRef,
            OTP: postingOTP.OTP
        }
        //var reqHeader = new Headers({'No-Auth':'True'});
        //   return this.http.post(this.uihelper.CallWebAPIUrlNew("/User/ValidateOTP"), post,{headers : reqHeader});
        return this.httpclient.post(this.uihelper.CallWebAPIUrlNew("/User/ValidateOTP"), post);

    }

    SaveMPin(userposting: UserPost) {
        const userpost: UserPost = {
            TenantId: userposting.TenantId,
            PIN: userposting.PIN,
            UniqueId: userposting.UniqueId,
            OTPRef: userposting.OTPRef,
            OTP: userposting.OTP,
            MobileNo: userposting.MobileNo
        }
        return this.httpclient.post<UserResult>(this.uihelper.CallWebAPIUrlNew("/User/SaveMPin"), userpost);
    }

    // userAuthentication(userName, password, unique): Observable<TokenParams> {
    //     var data = "username=" + userName + "&password=" + password + "&unique=" + unique + "&grant_type=password";
    //     var reqHeader = new Headers({ 'Content-Type': 'application/x-www-urlencoded', 'No-Auth': 'True' });
    //     return this.http.post(this.uihelper.CallWebAPIUrl("/token"), data, { headers: reqHeader }).map((res => res.json()));
    // }


    loginbyHttpClient(userName, password, unique): Observable<TokenParams> {
        var data = "username=" + userName + "&password=" + password + "&unique=" + unique + "&grant_type=password";
        return this.httpclient.post<TokenParams>(this.uihelper.CallWebAPIUrl("/token"), data);

    }

    // GetUserClaims() {
    //     return this.http.get(this.uihelper.CallWebAPIUrl("/api/GetUserClaims"));
    //     //return this.http.get(this.uihelper.CallWebAPIUrlNew("/Tenant/GetTenantsByMobile?MobileNo=8129750780"));

    // }

    GetServices(): Observable<OS[]> {
        return this.httpclient.get<OS[]>(this.uihelper.CallWebAPIUrlNew("/Operator/GetServices"));
    }

    GetAccounts(SCReq: SCRequest) {
        const scr: SCRequest = {
            PartyMastId: SCReq.PartyMastId,
            TenantId: SCReq.TenantId
        }
        return this.httpclient.post<TokenParams>(this.uihelper.CallWebAPIUrlNew("/Banking/GetAccounts"), scr);
    }

    AddBank(addBankRequest: AddBankRequest) {
        const body: AddBankRequest = {
            TenantId: addBankRequest.TenantId,
            MobileNo: addBankRequest.MobileNo

        }
        return this.httpclient.post<AddBankRequest>(this.uihelper.CallWebAPIUrlNew("/Banking/AddBank"), body);
    }
    GetOperators(OSReq: OSRequest) {

        const osr: OSRequest = {
            Starts: OSReq.Starts,
            PerentId: OSReq.PerentId,
            TenantId: OSReq.TenantId
        }
        return this.httpclient.post<OSResponse>(this.uihelper.CallWebAPIUrlNew("/Operator/GetOperators"), osr);

        //return this.httpclient.get<OS[]>(this.uihelper.CallWebAPIUrlNew("/Operator/GetOperators"));

    }
    GetPlans(planRequest: PlanRequest) {
        const planreq: PlanRequest = {
            OSId: planRequest.OSId,
            CircleId: planRequest.CircleId,
            PlanType: planRequest.PlanType,
            TenantId: planRequest.TenantId
        }
        return this.httpclient.post<PlanResponse>(this.uihelper.CallWebAPIUrlNew("/Operator/GetPlans"), planreq);

    }
    PostRecharge(Recharge: RechargeModel) {
        const rech: RechargeModel = {
            TenantId: Recharge.TenantId,
            DigiPartyId: Recharge.DigiPartyId,
            PartyMastId: Recharge.PartyMastId,
            AcMastId: Recharge.AcMastId,
            AcSubId: Recharge.AcSubId,
            Amount: Recharge.Amount,
            OperatorId: Recharge.OperatorId,
            SubscriptionId: Recharge.SubscriptionId,
            LocId: Recharge.LocId
        }
        return this.httpclient.post<TranResponse>(this.uihelper.CallWebAPIUrlNew("/Recharge/PostRecharge"), rech);
        //   return this.httpclient.post<TranResponse>(this.uihelper.CallWebAPIUrlNew("/Recharge/PostRecharge"),rech).catch(this.handleErrors);

    }

    GetFTAccount(fundTransferRequest: FundTransferRequest) {
        const FTReq: FundTransferRequest = {
            TenantId: fundTransferRequest.TenantId,
            MobileNo: fundTransferRequest.MobileNo
        }
        return this.httpclient.post<TranResponse>(this.uihelper.CallWebAPIUrlNew("/Banking/GetFTAccount"), FTReq);

    }

    FundTransfer(doFundTransfer: DoFundTransfer) {
        const DFT: DoFundTransfer = {
            TenantId: doFundTransfer.TenantId,
            DigiPartyId: doFundTransfer.DigiPartyId,
            FromAcMastId: doFundTransfer.FromAcMastId,
            FromAcSubId: doFundTransfer.FromAcSubId,
            FromLocId: doFundTransfer.FromLocId,
            ToAcMastId: doFundTransfer.ToAcMastId,
            ToAcSubId: doFundTransfer.ToAcSubId,
            ToLocId: doFundTransfer.ToLocId,
            Amount: doFundTransfer.Amount,
            ToAcNo: doFundTransfer.ToAcNo
        }
        return this.httpclient.post<TranResponse>(this.uihelper.CallWebAPIUrlNew("/Banking/FundTransfer"), DFT);

    }

    GetAccountBalance(statementRequest: StatementRequest) {
        const StmntReq: StatementRequest = {
            AcMastId: statementRequest.AcMastId,
            AcSubId: statementRequest.AcMastId,
            TenantId: statementRequest.TenantId

        }
        return this.httpclient.post<StatementRequest>(this.uihelper.CallWebAPIUrlNew("/Banking/GetAccountBalance"), StmntReq);
    }

    GetStatement(statementRequest: StatementRequest) {
        const StmntReq: StatementRequest = {
            AcMastId: statementRequest.AcMastId,
            AcSubId: statementRequest.AcSubId,
            TenantId: statementRequest.TenantId

        }
        return this.httpclient.post<StatementRequest>(this.uihelper.CallWebAPIUrlNew("/Banking/GetStatement"), StmntReq);
    }


    GetRechargeReport(rRRequest: RRRequest) {
        const rrreq: RRRequest = {
            TenantId: rRRequest.TenantId,
            DigiPartyId: rRRequest.DigiPartyId,
            SelectedType: rRRequest.SelectedType,
            Number: rRRequest.Number
        }
        return this.httpclient.post<StatementRequest>(this.uihelper.CallWebAPIUrlNew("/Recharge/GetRechargeReport"), rrreq);
    }
    private ExtractData(res: Response) {

        let body = res.json();
        return body || [];

    }

    // private handleErrors(error: any): Observable<any> {
    //     let errors: string[] = [];
    //     switch (error.status) {
    //         case 400:
    //             let err = error.json();
    //             if (err.modelState) {
    //                 let valErrors = error.json.modelStae;
    //                 for (var key in valErrors) {
    //                     for (var i = 0; i < valErrors[key].length; i++) {
    //                         errors.push(valErrors[key][i])
    //                     }
    //                 }

    //             }
    //             else if (err.message) {
    //                 error.push(err.message);
    //             }
    //             else {
    //                 error.push("an unknown error occured");
    //             }
    //             break;
    //         case 404:
    //             error.push("No Product data is available");
    //             break;
    //         case 500:
    //         error.push(error.ExceptionMessage);
    //             //this.toastr.success(error.ExceptionMessage, 'Success!');
    //             //error.push("No Product data is available");  
    //             break;
    //         default:
    //             error.push("status:", +error.status + "" + error.statusText)
    //             break;
    //     };
    //     console.error("an error occured", error);
    //     return Observable.throw(error);
    // }

}
//test