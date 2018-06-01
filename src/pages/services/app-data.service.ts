import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UIHelperService } from '../UIHelperClasses/UIHelperService';
import { Observable } from 'rxjs/Observable';
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
import { FundTransferRequest } from '../View Models/FundTransferRequest';
import { DoFundTransfer } from '../View Models/DoFundTransfer';
import { StatementRequest } from '../View Models/StatementRequest';
import { AddBankRequest } from '../View Models/AddBankRequest';
import { TenantList } from '../View Models/TenantList';
import { PlanRequest } from '../View Models/PlanRequest';
import { PlanResponse } from '../View Models/PlanResponse';
import { RRRequest } from '../View Models/RRRequest';
import { OperaterCircleQuery } from '../View Models/OperaterCircleQuery';

@Injectable()
export class RegisterService {
    TenantId: string;
    MobileNo: string;
    Logo: string;
    userresult: UserResult;
    tenantlist: TenantList;
    user: OTPRequest;
    mobno: any;
    digiCustWithOTPRefNo: DigiCustWithOTPRefNo;
    postOPT: PostOPT;
    userPost: UserPost;
    local: StorageService;
    sCRequest: SCRequest;
    userToken: any;
    //constructor(private sqlite: SQLite,private httpclient:HttpClient,private locals:StorageService,private uihelper: UIHelperService,private http: Http) {
    constructor(private httpclient: HttpClient, private uIHelperService: UIHelperService) {


    }

    GetTenantsByMobile(mobno: any) {
        this.MobileNo = mobno;
        var data = "MobileNo=" + mobno;
        var url = this.uIHelperService.CallWebAPIUrlNew("/Tenant/GetTenantsByMobile") + "?" + data;
        return this.httpclient.get<TenantList>(url);
    }
    RequestOTP(oTPRequest: OTPRequest) {

        const body: OTPRequest = {
            TenantId: oTPRequest.TenantId,
            MobileNo: oTPRequest.MobileNo

        }
        this.TenantId = oTPRequest.TenantId;
        return this.httpclient.post<DigiCustWithOTPRefNo>(this.uIHelperService.CallWebAPIUrlNew("/User/RequestOTP"), body);
    }

    ValidateOTP(postOPT: PostOPT) {
        const body: PostOPT = {
            TenantId: postOPT.TenantId,
            MobileNo: postOPT.MobileNo,
            OTPRef: postOPT.OTPRef,
            OTP: postOPT.OTP
        }
        return this.httpclient.post(this.uIHelperService.CallWebAPIUrlNew("/User/ValidateOTP"), body);
    }

    SaveMPin(userPost: UserPost) {
        const body: UserPost = {
            TenantId: userPost.TenantId,
            PIN: userPost.PIN,
            UniqueId: userPost.UniqueId,
            OTPRef: userPost.OTPRef,
            OTP: userPost.OTP,
            MobileNo: userPost.MobileNo
        }
        return this.httpclient.post<UserResult>(this.uIHelperService.CallWebAPIUrlNew("/User/SaveMPin"), body);
    }

    loginbyHttpClient(userName, password, unique): Observable<TokenParams> {
        var data = "username=" + userName + "&password=" + password + "&unique=" + unique + "&grant_type=password";
        return this.httpclient.post<TokenParams>(this.uIHelperService.CallWebAPIUrl("/token"), data);

    }

    GetServices(): Observable<OS[]> {
        return this.httpclient.get<OS[]>(this.uIHelperService.CallWebAPIUrlNew("/Operator/GetServices"));
    }

    GetAccounts(sCRequest: SCRequest) {
        const body: SCRequest = {
            PartyMastId: sCRequest.PartyMastId,
            TenantId: sCRequest.TenantId
        }
        return this.httpclient.post<TokenParams>(this.uIHelperService.CallWebAPIUrlNew("/Banking/GetAccounts"), body);
    }

    AddBank(addBankRequest: AddBankRequest) {
        const body: AddBankRequest = {
            TenantId: addBankRequest.TenantId,
            MobileNo: addBankRequest.MobileNo

        }
        return this.httpclient.post<AddBankRequest>(this.uIHelperService.CallWebAPIUrlNew("/Banking/AddBank"), body);
    }
    GetOperators(oSRequest: OSRequest) {

        const body: OSRequest = {
            Starts: oSRequest.Starts,
            PerentId: oSRequest.PerentId,
            TenantId: oSRequest.TenantId
        }
        return this.httpclient.post<OSResponse>(this.uIHelperService.CallWebAPIUrlNew("/Operator/GetOperators"), body);

    }
    GetPlans(planRequest: PlanRequest) {
        const body: PlanRequest = {
            OSId: planRequest.OSId,
            CircleId: planRequest.CircleId,
            PlanType: planRequest.PlanType,
            TenantId: planRequest.TenantId
        }
        return this.httpclient.post<PlanResponse>(this.uIHelperService.CallWebAPIUrlNew("/Operator/GetPlansX"), body);

    }
    PostRecharge(rechargeModel: RechargeModel) {
        const body: RechargeModel = {
            TenantId: rechargeModel.TenantId,
            DigiPartyId: rechargeModel.DigiPartyId,
            PartyMastId: rechargeModel.PartyMastId,
            AcMastId: rechargeModel.AcMastId,
            AcSubId: rechargeModel.AcSubId,
            Amount: rechargeModel.Amount,
            OperatorId: rechargeModel.OperatorId,
            SubscriptionId: rechargeModel.SubscriptionId,
            LocId: rechargeModel.LocId
        }
        return this.httpclient.post<TranResponse>(this.uIHelperService.CallWebAPIUrlNew("/Recharge/PostRecharge"), body);

    }

    GetFTAccount(fundTransferRequest: FundTransferRequest) {
        const body: FundTransferRequest = {
            TenantId: fundTransferRequest.TenantId,
            MobileNo: fundTransferRequest.MobileNo
        }
        return this.httpclient.post<TranResponse>(this.uIHelperService.CallWebAPIUrlNew("/Banking/GetFTAccount"), body);

    }

    FundTransfer(doFundTransfer: DoFundTransfer) {
        const body: DoFundTransfer = {
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
        return this.httpclient.post<TranResponse>(this.uIHelperService.CallWebAPIUrlNew("/Banking/FundTransfer"), body);

    }

    GetAccountBalance(statementRequest: StatementRequest) {
        const body: StatementRequest = {
            AcMastId: statementRequest.AcMastId,
            AcSubId: statementRequest.AcMastId,
            TenantId: statementRequest.TenantId

        }
        return this.httpclient.post<StatementRequest>(this.uIHelperService.CallWebAPIUrlNew("/Banking/GetAccountBalance"), body);
    }

    GetStatement(statementRequest: StatementRequest) {
        const body: StatementRequest = {
            AcMastId: statementRequest.AcMastId,
            AcSubId: statementRequest.AcSubId,
            TenantId: statementRequest.TenantId

        }
        return this.httpclient.post<StatementRequest>(this.uIHelperService.CallWebAPIUrlNew("/Banking/GetStatement"), body);
    }

    GetOperaterCircle(operaterCircleQuery: OperaterCircleQuery) {
        const body: OperaterCircleQuery = {
            Mobile: operaterCircleQuery.Mobile
        }
        return this.httpclient.post<OperaterCircleQuery>(this.uIHelperService.CallWebAPIUrlNew("/Operator/GetOperaterCircle"), body);

    }
    GetRechargeReport(rRRequest: RRRequest) {
        const body: RRRequest = {
            TenantId: rRRequest.TenantId,
            DigiPartyId: rRRequest.DigiPartyId,
            SelectedType: rRRequest.SelectedType,
            Number: rRRequest.Number
        }
        return this.httpclient.post<StatementRequest>(this.uIHelperService.CallWebAPIUrlNew("/Recharge/GetRechargeReport"), body);
    }
    private ExtractData(res: Response) {

        let body = res.json();
        return body || [];

    }

}
