import { Injectable } from '@angular/core';
import { TokenParams } from '../View Models/TokenParams';
import { Tenant } from '../LocalStorageTables/Tenant';
import { DigiParty } from '../LocalStorageTables/DigiParty';
import { SelfCareAc } from '../LocalStorageTables/SelfCareAc';
import { User } from '../LocalStorageTables/User';
import { OS } from '../View Models/OS';
//import { OS } from '../LocalStorageTables/OS';


@Injectable()
export class StorageService {
    static SelfCareAcsBasedOnTenantID: SelfCareAc;
    static SelfCareACs: SelfCareAc;
    static digipartyname:string;
    static digiparty: DigiParty;
    static DigiParties: DigiParty;
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
    static GetActiveBankName():string {
        var ActiveTenantId =this.GetUser().ActiveTenantId;
        this.Tenants = this.GetTenant();
        //let x=Object.assign({},this.Tenants);
        this.Tenant = this.Tenants.find(function (obj:Tenant) { return obj.Id === ActiveTenantId; });
        return this.Tenant.Name;
    }
    static Getdigipartyname():string{
        var ActiveTenantId =this.GetUser().ActiveTenantId;
        this.DigiParties=StorageService.GetDigiParty();
          this.digiparty = this.DigiParties.find(function (obj) { return obj.TenantId === ActiveTenantId; });
         return this.digipartyname = this.digiparty.Name;
    }
    
    static GetSelfCareAcsBasedOnTenantID():SelfCareAc{
        var ActiveTenantId =this.GetUser().ActiveTenantId;
        this.SelfCareACs=this.GetSelfCareAc(); 
        return this.SelfCareAcsBasedOnTenantID=this.SelfCareACs.filter(function (obj) { return obj.TenantId === ActiveTenantId; })
    }
    static GetDigiPartyID():string{
        var ActiveTenantId =this.GetUser().ActiveTenantId;
        this.DigiParties=StorageService.GetDigiParty();
           this.digiparty=this.DigiParties.find(function (obj) { return obj.TenantId === ActiveTenantId; });
           return this.digiparty.DigiPartyId;
      }
    
    static GetUser():User {
        return JSON.parse(localStorage.getItem("User")) as User;
    }
    static GetTenant() :Tenant{
        return JSON.parse(localStorage.getItem("Tenant")) as Tenant;
    }
    static GetDigiParty():DigiParty {
        return JSON.parse(localStorage.getItem("DigiParty")) as DigiParty;
    }
    static GetOS() :OS{
        return JSON.parse(localStorage.getItem("OS")) as OS;
    }
    static GetSelfCareAc():SelfCareAc {
        return JSON.parse(localStorage.getItem("SelfCareAc")) as SelfCareAc;
    }


    
    static SetUser(param) {
        localStorage.setItem("User",param);
    }
    static SetTenant(param) {
        localStorage.setItem("Tenant",param);
    }
    static SetDigiParty(param) {
        localStorage.setItem("DigiParty",param);
    }
    static SetOS(param) {
        localStorage.setItem("OS",param);
    }
    static SetSelfCareAc(param) {
        localStorage.setItem("SelfCareAc",param);
    }

    static RemoveRecordsForLogout(){
        localStorage.removeItem("OS");
        this.RemoveItem("Tenant");
        this.RemoveItem("DigiParty");
        this.RemoveItem("SelfCareAc");
        this.RemoveItem("userToken");
// for(i=0;i<8;i++){

// }
// for(j=0;j<8;j++){

// }
    }
}