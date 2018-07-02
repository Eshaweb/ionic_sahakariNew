import { Injectable } from '@angular/core';
import { TokenParams } from '../View Models/TokenParams';
import { Tenant } from '../LocalStorageTables/Tenant';
import { DigiParty } from '../LocalStorageTables/DigiParty';
import { SelfCareAc } from '../LocalStorageTables/SelfCareAc';
import { User } from '../LocalStorageTables/User';
import { OS } from '../View Models/OS';
import { ConstantService } from './Constants';
//import { OS } from '../LocalStorageTables/OS';


@Injectable()
export class StorageService {
    constructor(public constant: ConstantService) {

    }
    static SelfCareAcsBasedOnTenantID: SelfCareAc;
    static SelfCareACs: SelfCareAc;
    static digipartyname: string;
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
    static GetActiveBankName(): string {
        var ActiveTenantId = this.GetUser().ActiveTenantId;
        this.Tenants = this.GetTenant();
        //let x=Object.assign({},this.Tenants);
        this.Tenant = this.Tenants.find(function (obj: Tenant) { return obj.Id === ActiveTenantId; });
        return this.Tenant.Name;
    }
    static Getdigipartyname(): string {
        var ActiveTenantId = this.GetUser().ActiveTenantId;
        this.DigiParties = StorageService.GetDigiParty();
        this.digiparty = this.DigiParties.find(function (obj) { return obj.TenantId === ActiveTenantId; });
        return this.digipartyname = this.digiparty.Name;
    }

    static GetSelfCareAcsBasedOnTenantID(): SelfCareAc {
        var ActiveTenantId = this.GetUser().ActiveTenantId;
        this.SelfCareACs = this.GetSelfCareAc();
        return this.SelfCareAcsBasedOnTenantID = this.SelfCareACs.filter(function (obj) { return obj.TenantId === ActiveTenantId; })
    }
    static GetDigiPartyID(): string {
        var ActiveTenantId = this.GetUser().ActiveTenantId;
        this.DigiParties = StorageService.GetDigiParty();
        this.digiparty = this.DigiParties.find(function (obj) { return obj.TenantId === ActiveTenantId; });
        return this.digiparty.DigiPartyId;
    }

    static GetUser(): User {
        return JSON.parse(localStorage.getItem("User")) as User;
    }
    static GetTenant(): Tenant {
        return JSON.parse(localStorage.getItem("Tenant")) as Tenant;
    }
    static GetDigiParty(): DigiParty {
        return JSON.parse(localStorage.getItem("DigiParty")) as DigiParty;
    }
    static GetOS(): OS {
        return JSON.parse(localStorage.getItem("OS")) as OS;
    }
    static GetSelfCareAc(): SelfCareAc {
        return JSON.parse(localStorage.getItem("SelfCareAc")) as SelfCareAc;
    }



    static SetUser(param) {
        localStorage.setItem("User", param);
    }
    static SetTenant(param) {
        localStorage.setItem("Tenant", param);
    }
    static SetDigiParty(param) {
        localStorage.setItem("DigiParty", param);
    }
    static SetOS(param) {
        localStorage.setItem("OS", param);
    }
    static SetSelfCareAc(param) {
        localStorage.setItem("SelfCareAc", param);
    }

    RemoveRecordsForLogout() {
        localStorage.removeItem("OS");
        localStorage.removeItem("Tenant");
        localStorage.removeItem("DigiParty");
        StorageService.RemoveItem("SelfCareAc");
        localStorage.removeItem("userToken");

        localStorage.removeItem(this.constant.favouriteBasedOnParentId.Favourite_S1);
        StorageService.RemoveItem(this.constant.favouriteBasedOnParentId.Favourite_S2);
        StorageService.RemoveItem(this.constant.favouriteBasedOnParentId.Favourite_S3);
        StorageService.RemoveItem(this.constant.favouriteBasedOnParentId.Favourite_S4);
        StorageService.RemoveItem(this.constant.favouriteBasedOnParentId.Favourite_S5);
        StorageService.RemoveItem(this.constant.favouriteBasedOnParentId.Favourite_S6);
        StorageService.RemoveItem(this.constant.favouriteBasedOnParentId.Favourite_S7);

        StorageService.RemoveItem(this.constant.osBasedOnParentId.OS_S1);
        StorageService.RemoveItem(this.constant.osBasedOnParentId.OS_S2);
        StorageService.RemoveItem(this.constant.osBasedOnParentId.OS_S3);
        StorageService.RemoveItem(this.constant.osBasedOnParentId.OS_S4);
        StorageService.RemoveItem(this.constant.osBasedOnParentId.OS_S5);
        StorageService.RemoveItem(this.constant.osBasedOnParentId.OS_S6);
        StorageService.RemoveItem(this.constant.osBasedOnParentId.OS_S7);

    }
}