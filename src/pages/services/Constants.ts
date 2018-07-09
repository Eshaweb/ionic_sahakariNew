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
import { StorageService } from './Storage_Service';

@Injectable()
export class ConstantService {
  favouriteBasedOnParentId: FavouriteBasedOnParentId;

  osBasedOnParentId: OSBasedOnParentId;

  constructor() {

    this.favouriteBasedOnParentId = {
      Favourite_S1: "Favourite(S1)",
      Favourite_S2: "Favourite(S2)",
      Favourite_S3: "Favourite(S3)",
      Favourite_S4: "Favourite(S4)",
      Favourite_S5: "Favourite(S5)",
      Favourite_S6: "Favourite(S6)",
      Favourite_S7: "Favourite(S7)"
    }

    this.osBasedOnParentId = {
      OS_S1: "OS(S1)",
      OS_S2: "OS(S2)",
      OS_S3: "OS(S3)",
      OS_S4: "OS(S4)",
      OS_S5: "OS(S5)",
      OS_S6: "OS(S6)",
      OS_S7: "OS(S7)"
    }
  }
}