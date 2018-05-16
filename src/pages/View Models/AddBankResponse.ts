import { Tenant } from "../LocalStorageTables/Tenant";
import { SelfCareAc } from "../LocalStorageTables/SelfCareAc";

export class AddBankResponse{
    Tenant:Tenant;
    SelfCareAcs:SelfCareAc;
    DigiPartyId:string;
    MobileNo:string;
    TenantId:string;
    Name:string;
    PartyMastId:string
}