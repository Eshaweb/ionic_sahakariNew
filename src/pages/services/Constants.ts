import { Injectable } from '@angular/core';
import { User } from '../LocalStorageTables/User';
import { Tenant } from '../LocalStorageTables/Tenant';
import { DigiParty } from '../LocalStorageTables/DigiParty';
import { OS } from '../LocalStorageTables/OS';
import { Favourites } from '../LocalStorageTables/Favourites';
import { SelfCareAc } from '../LocalStorageTables/SelfCareAc';
import { DB } from '../LocalStorageTables/DB';
import { FavouriteBasedOnParentId } from '../LocalStorageTables/FavouriteBasedOnParentId';
import { OSBasedOnParentId } from '../LocalStorageTables/OSBasedOnParentId';

@Injectable()
export class ConstantService{
  favouriteBasedOnParentId:FavouriteBasedOnParentId;
  Favourite_S1="Favourite(S1)";
  Favourite_S2="Favourite(S2)";
  Favourite_S3="Favourite(S3)";
  Favourite_S4="Favourite(S4)";
  Favourite_S5="Favourite(S5)";
  Favourite_S6="Favourite(S6)";
  Favourite_S7="Favourite(S7)";

  osBasedOnParentId:OSBasedOnParentId;
  OS_S1="OS(S1)";
  OS_S2="OS(S2)";
  OS_S3="OS(S3)";
  OS_S4="OS(S4)";
  OS_S5="OS(S5)";
  OS_S6="OS(S6)";
  OS_S7="OS(S7)";

DB:DB;
  SetUser="User";
  GetUser: User;

    UserId="UserId";
    ActiveTenant="ActiveTenant";
    UserName="UserName";
    UniqueKey="UniqueKey";

    SetTenant="Tenant";
    GetTenant:Tenant
    TId="Id";
    //TenantId="TenantId";
    Name="Name";
    Address="Address";
    IconHtml="IconHtml";

    SetDigiParty="DigiParty";
    DigiParty:DigiParty;
    DId="Id";
    DigiPartyId="DigiPartyId";
    PartyMastId="PartyMastId";
    MobileNo="MobileNo";
    DTenantId="TenantId";
    DName="Name";  

    SetOS="OS";
    GetOS:OS;
    OId="Id";
    Operator="Operator";
    Type="Type";
    ParentId="ParentId";
    Remarks="Remarks";

    SetFavourite="Favourite";
    Favourite:Favourites;
    FId="Id";
    NickName="NickName";
    OperatorId="OperatorId";
    FParentId="ParentId";
    SubscriptionId="SubscriptionId";

    SetSelfCareAc="SelfCareAc";
    GetSelfCareAc:SelfCareAc;
    SCId="Id";
    AcActId="AcActId";
    HeadName="HeadName";
    AcHeadId="AcHeadId";
    AcSubId="AcSubId";
    AcNo="AcNo";
    LocId="LocId";
    SCTenantId="TenantId";

      constructor(){
        this.favouriteBasedOnParentId={
          Favourite_S1:this.Favourite_S1,
          Favourite_S2:this.Favourite_S2,
          Favourite_S3:this.Favourite_S3,
          Favourite_S4:this.Favourite_S4,
          Favourite_S5:this.Favourite_S5,
          Favourite_S6:this.Favourite_S6,
          Favourite_S7:this.Favourite_S7
        }
        this.osBasedOnParentId={
          OS_S1:this.OS_S1,
          OS_S2:this.OS_S2,
          OS_S3:this.OS_S3,
          OS_S4:this.OS_S4,
          OS_S5:this.OS_S5,
          OS_S6:this.OS_S6,
          OS_S7:this.OS_S7
        }
         this.DB={
          User:this.SetUser,
          Tenant:this.SetTenant,
          DigiParty:this.SetDigiParty,
          OS:this.SetOS,
          Favourite:this.SetFavourite,
          SelfCareAc:this.SetSelfCareAc
         }
        
        this.GetUser=JSON.parse(localStorage.getItem("User"));
          const TenantKey:Tenant={
            Id:this.TId,
            //TenantId:this.TenantId,
            Name:this.Name,
            Address:this.Address,
            IconHtml:this.IconHtml
          }

          this.DigiParty={
            Id:this.DId,
            DigiPartyId:this.DigiPartyId,
            PartyMastId:this.PartyMastId,
            MobileNo:this.MobileNo,
            TenantId:this.DTenantId,
            Name:this.DName
          }

          this.GetOS={
            Id:this.OId,
            Operator:this.Operator,
            Type:this.Type,
            ParentId:this.ParentId,
            Remarks:this.Remarks
          }

          this.Favourite={
            Id:this.FId,
            NickName:this.NickName,
            OperatorId:this.OperatorId,
            ParentId:this.FParentId,
            SubscriptionId:this.SubscriptionId
          }

          this.GetSelfCareAc={
            Id:this.SCId,
            AcActId:this.AcActId,
            HeadName:this.HeadName,
            AcHeadId:this.AcHeadId,
            AcSubId:this.AcSubId,
            AcNo:this.AcNo,
            LocId:this.LocId,
            TenantId:this.SCTenantId
          }
      }
}