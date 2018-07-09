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
//import { TenantList } from '../View Models/TenantList';
import { PlanRequest } from '../View Models/PlanRequest';
import { PlanResponse } from '../View Models/PlanResponse';
import { RRRequest } from '../View Models/RRRequest';
import { OperaterCircleQuery } from '../View Models/OperaterCircleQuery';
import { Tenant } from '../LocalStorageTables/Tenant';
import { ChangePassword } from '../View Models/ChangePassword';
import { ChangePasswordResult } from '../View Models/ChangePasswordResult';

@Injectable()
export class RegisterService {
    TenantId: string;
    MobileNo: string;
    userToken:string;
    tenantlist: Tenant;
    //constructor(private sqlite: SQLite,private httpclient:HttpClient,private locals:StorageService,private uihelper: UIHelperService,private http: Http) {
    constructor(private httpclient: HttpClient, private uIHelperService: UIHelperService) {


    }

    GetTenantsByMobile(mobno: any) {
        this.MobileNo = mobno;
        var data = "MobileNo=" + mobno;
        var url = this.uIHelperService.CallWebAPIUrlNew("/Tenant/GetTenantsByMobile") + "?" + data;
        return this.httpclient.get<Tenant>(url);
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
        return this.httpclient.post(this.uIHelperService.CallWebAPIUrlNew("/User/ValidateOTP"), postOPT);
    }

    SaveMPin(userPost: UserPost) {
        return this.httpclient.post<UserResult>(this.uIHelperService.CallWebAPIUrlNew("/User/SaveMPin"), userPost);
    }

    ChangePassword(changePassword:ChangePassword){
        return this.httpclient.post<ChangePasswordResult>(this.uIHelperService.CallWebAPIUrlNew("/User/ChangePassword"), changePassword);
    }
    loginbyHttpClient(userName, password, unique): Observable<TokenParams> {
        var data = "username=" + userName + "&password=" + password + "&unique=" + unique + "&grant_type=password";
        return this.httpclient.post<TokenParams>(this.uIHelperService.CallWebAPIUrl("/token"), data);

    }

    GetServices(): Observable<OS[]> {
        return this.httpclient.get<OS[]>(this.uIHelperService.CallWebAPIUrlNew("/Operator/GetServices"));
    }

    GetAccounts(sCRequest: SCRequest) {
        return this.httpclient.post<TokenParams>(this.uIHelperService.CallWebAPIUrlNew("/Banking/GetAccounts"), sCRequest);
    }

    AddBank(addBankRequest: AddBankRequest) {
        return this.httpclient.post<AddBankRequest>(this.uIHelperService.CallWebAPIUrlNew("/Banking/AddBank"), addBankRequest);
    }
    GetOperators(oSRequest: OSRequest) {
        return this.httpclient.post<OSResponse>(this.uIHelperService.CallWebAPIUrlNew("/Operator/GetOperators"), oSRequest);

    }
    GetPlans(planRequest: PlanRequest) {
       
        return this.httpclient.post<PlanResponse>(this.uIHelperService.CallWebAPIUrlNew("/Operator/GetPlans"), planRequest);
        // return this.httpclient.post<PlanResponse>(this.uIHelperService.CallWebAPIUrlNew("/Operator/GetPlans"), body);

    }
    PostRecharge(rechargeModel: RechargeModel) {
        
        return this.httpclient.post<TranResponse>(this.uIHelperService.CallWebAPIUrlNew("/Recharge/PostRecharge"), rechargeModel);

    }

    GetFTAccount(fundTransferRequest: FundTransferRequest) {
       
        return this.httpclient.post<TranResponse>(this.uIHelperService.CallWebAPIUrlNew("/Banking/GetFTAccount"), fundTransferRequest);

    }

    FundTransfer(doFundTransfer: DoFundTransfer) {
       
        return this.httpclient.post<TranResponse>(this.uIHelperService.CallWebAPIUrlNew("/Banking/FundTransfer"), doFundTransfer);

    }

    GetAccountBalance(statementRequest: StatementRequest) {
       
        return this.httpclient.post<StatementRequest>(this.uIHelperService.CallWebAPIUrlNew("/Banking/GetAccountBalance"), statementRequest);
    }

    GetStatement(statementRequest: StatementRequest) {
        
        return this.httpclient.post<StatementRequest>(this.uIHelperService.CallWebAPIUrlNew("/Banking/GetStatement"), statementRequest);
    }

    GetOperaterCircle(operaterCircleQuery: OperaterCircleQuery) {
        
        return this.httpclient.post<OperaterCircleQuery>(this.uIHelperService.CallWebAPIUrlNew("/Operator/GetOperaterCircle"), operaterCircleQuery);

    }
    GetRechargeReport(rRRequest: RRRequest) {
       
        return this.httpclient.post<StatementRequest>(this.uIHelperService.CallWebAPIUrlNew("/Recharge/GetRechargeReport"), rRRequest);
    }
    countDown;
    //counter = 30*60;
    counter = 60;
    tick = 1000;
    getCounter() {
        return Observable.timer(0, this.tick)
          .take(this.counter)
          .map(() => --this.counter)
      }
    private ExtractData(res: Response) {

        let body = res.json();
        return body || [];

    }

}
