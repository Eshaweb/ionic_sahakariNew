import { Injectable } from '@angular/core';
import { TokenParams } from '../View Models/TokenParams';
import { Tenant } from '../LocalStorageTables/Tenant';
import { DigiParty } from '../LocalStorageTables/DigiParty';
import { SelfCareAc } from '../LocalStorageTables/SelfCareAc';


@Injectable()
export class StorageService {
    static SelfCareAcsBasedOnTenantID: SelfCareAc;
    static SelfCareACs: SelfCareAc;
    static digipartyname:string;
    static digiparty: DigiParty;
    static DigiParties: DigiParty;
    static ActiveBankName: string;
    static Tenant: Tenant;
    static Tenants: Tenant;
    static SetAuthorizationData(auth: TokenParams): void {
        localStorage.setItem('userToken', JSON.stringify(auth));

    }
    static GetValueFromLocalStorage(): TokenParams {
        let tokendata = JSON.parse(localStorage.getItem('userToken'));
        return tokendata == null ? null : tokendata;
    }
    static SetItem(param1, param2: any) {

        localStorage.setItem(param1, param2);
    }
    static GetItem(param) {

        return localStorage.getItem(param);

    }
    static RemoveItem(param) {

        localStorage.removeItem(param);
    }
    static GetActiveBankName() {
        var ActiveTenantId = JSON.parse(StorageService.GetUser()).ActiveTenantId;
        this.Tenants = JSON.parse(StorageService.GetTenant());
        this.Tenant = this.Tenants.find(function (obj) { return obj.Id === ActiveTenantId; });
        this.ActiveBankName = this.Tenant.Name;
        return this.ActiveBankName;
    }
    static Getdigipartyname(){
        var ActiveTenantId = JSON.parse(StorageService.GetUser()).ActiveTenantId;
        this.DigiParties = JSON.parse(StorageService.GetDigiParty());
          this.digiparty = this.DigiParties.find(function (obj) { return obj.TenantId === ActiveTenantId; });
         return this.digipartyname = this.digiparty.Name;
    }
    static GetSelfCareAcsBasedOnTenantID(){
        var ActiveTenantId = JSON.parse(StorageService.GetUser()).ActiveTenantId;
        this.SelfCareACs=JSON.parse(StorageService.GetSelfCareAc()); 
        return this.SelfCareAcsBasedOnTenantID=this.SelfCareACs.filter(function (obj) { return obj.TenantId === ActiveTenantId; })
    }
    static GetDigiPartyID(){
        var ActiveTenantId=JSON.parse(StorageService.GetUser()).ActiveTenantId;
        this.DigiParties=JSON.parse(StorageService.GetDigiParty());
           this.digiparty=this.DigiParties.find(function (obj) { return obj.TenantId === ActiveTenantId; });
           return this.digiparty.DigiPartyId;
      }
    static GetUser() {
        return localStorage.getItem("User");
    }
    static SetUser(param) {
        localStorage.setItem("User",param);
    }
    static GetTenant() {
        return localStorage.getItem("Tenant");
    }
    static SetTenant(param) {
        localStorage.setItem("Tenant",param);
    }
    static GetDigiParty() {
        return localStorage.getItem("DigiParty");
    }
    static SetDigiParty(param) {
        localStorage.setItem("DigiParty",param);
    }
    static GetOS() {
        return localStorage.getItem("OS");
    }
    static SetOS(param) {
        localStorage.setItem("OS",param);
    }
    static GetSelfCareAc() {
        return localStorage.getItem("SelfCareAc");
    }
    static SetSelfCareAc(param) {
        localStorage.setItem("SelfCareAc",param);
    }
}