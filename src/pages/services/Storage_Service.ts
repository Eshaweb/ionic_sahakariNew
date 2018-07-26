import { Injectable } from '@angular/core';
import { TokenParams } from '../View Models/TokenParams';
import { Tenant } from '../LocalStorageTables/Tenant';
import { DigiParty } from '../LocalStorageTables/DigiParty';
import { SelfCareAc } from '../LocalStorageTables/SelfCareAc';
import { User } from '../LocalStorageTables/User';
import { OS } from '../View Models/OS';
import { ConstantService } from './Constants';
import { OSResponse } from '../View Models/OSResponse';
import { FavouriteItem } from '../LocalStorageTables/FavouriteItem';
import { Favourites } from '../LocalStorageTables/Favourites';
//import { OS } from '../LocalStorageTables/OS';


@Injectable()
export class StorageService {
    constructor(public constant: ConstantService) {

    }
    // static SelfCareAcsBasedOnTenantID: SelfCareAc;
    // static SelfCareACs: SelfCareAc;
    // static digipartyname: string;
    // //digiparty: DigiParty;
    // static DigiParties: DigiParty;
    Tenant: Tenant;
    // static Tenants: Tenant;
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
     GetActiveBankName(): string {
        var ActiveTenantId = this.GetUser().ActiveTenantId;
        var Tenants = this.GetTenant();
        //let x=Object.assign({},this.Tenants);
        this.Tenant = Tenants.find(function (obj: Tenant) { return obj.Id === ActiveTenantId; });
        return this.Tenant.Name;
    }
    GetDigipartyBasedOnActiveTenantId(): DigiParty {
        var ActiveTenantId = this.GetUser().ActiveTenantId;
        var DigiParties = this.GetDigiParty();
        return DigiParties.find(function (obj) { return obj.TenantId === ActiveTenantId; });
    }
    
    // static GetOSBasedOnParentID(param): OS {
    //     var GetOSBasedOnParentID=localStorage.getItem("OS("+param+")");
    //     return this.SelfCareAcsBasedOnTenantID = SelfCareACs.filter(function (obj) { return obj.TenantId === ActiveTenantId; })
    // }
    
     GetSelfCareAcsBasedOnTenantID(): SelfCareAc {
        var ActiveTenantId = this.GetUser().ActiveTenantId;
        var SelfCareACs = this.GetSelfCareAc();
        return SelfCareACs.filter(function (obj) { return obj.TenantId === ActiveTenantId; });
    }
    
    GetUser(): User {
        return JSON.parse(localStorage.getItem("User")) as User;
    }
    // static GetUser(): User {
    //     return JSON.parse(localStorage.getItem("User")) as User;
    // }
    GetTenant(): Tenant {
        return JSON.parse(localStorage.getItem("Tenant")) as Tenant;
    }
    // static GetDigiParty(): DigiParty {
    //     return JSON.parse(localStorage.getItem("DigiParty")) as DigiParty;
    // }
    GetDigiParty(): DigiParty {
        return JSON.parse(localStorage.getItem("DigiParty")) as DigiParty;
    }
    GetOS(): OS {
        return JSON.parse(localStorage.getItem("OS")) as OS;
    }
     GetSelfCareAc(): SelfCareAc {
        return JSON.parse(localStorage.getItem("SelfCareAc")) as SelfCareAc;
    }
    GetOSResponse(): OSResponse {
        return JSON.parse(localStorage.getItem("OSResponse")) as OSResponse;
    }
    // GetFavourite(): FavouriteItem {
    //     return JSON.parse(localStorage.getItem("Favourite")) as FavouriteItem;
    // }
    GetFavourite(): Favourites {
        return JSON.parse(localStorage.getItem("Favourite")) as Favourites;
    }
    SetUser(param) {
        localStorage.setItem("User", param);
    }
    SetTenant(param) {
        localStorage.setItem("Tenant", param);
    }
    SetDigiParty(param) {
        localStorage.setItem("DigiParty", param);
    }
    SetOS(param) {
        localStorage.setItem("OS", param);
    }
    SetSelfCareAc(param) {
        localStorage.setItem("SelfCareAc", param);
    }
    SetOSResponse(param) {
        localStorage.setItem("OSResponse", param);
    }
    SetFavourite(param) {
        localStorage.setItem("Favourite", param);
    }
    RemoveRecordsForLogout() {
        localStorage.removeItem("OS");
        localStorage.removeItem("Tenant");
        localStorage.removeItem("DigiParty");
        StorageService.RemoveItem("SelfCareAc");

        //localStorage.removeItem(this.constant.favouriteBasedOnParentId.Favourite_S1);
        // StorageService.RemoveItem(this.constant.favouriteBasedOnParentId.Favourite_S2);
        // StorageService.RemoveItem(this.constant.favouriteBasedOnParentId.Favourite_S3);
        // StorageService.RemoveItem(this.constant.favouriteBasedOnParentId.Favourite_S4);
        // StorageService.RemoveItem(this.constant.favouriteBasedOnParentId.Favourite_S5);
        // StorageService.RemoveItem(this.constant.favouriteBasedOnParentId.Favourite_S6);
        // StorageService.RemoveItem(this.constant.favouriteBasedOnParentId.Favourite_S7);

    }
}