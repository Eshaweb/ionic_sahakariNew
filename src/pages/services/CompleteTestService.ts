import {AutoCompleteService} from 'ionic2-auto-complete';
import { Http } from '@angular/http';
import {Injectable} from "@angular/core";
import 'rxjs/add/operator/map'
import { HttpClient } from '@angular/common/http';
import { OSRequest } from '../View Models/OSRequest';
import { OSResponse } from '../View Models/OSResponse';
import { UIHelperService } from '../UIHelperClasses/UIHelperService';

@Injectable()
export class CompleteTestService implements AutoCompleteService {
  labelAttribute = "name";

  constructor(private http:Http,private httpclient:HttpClient,private uihelper: UIHelperService) {

  }
  getResults(keyword:string) {
    return this.http.get("https://restcountries.eu/rest/v1/name/"+keyword)
      .map(
        result =>
        {
          return result.json()
            .filter(item => item.name.toLowerCase().startsWith(keyword.toLowerCase()) )
        });
  }

  GetOperators(OSReq:OSRequest){

    const osr: OSRequest = {
        Starts:OSReq.Starts,
        PerentId: OSReq.PerentId,
        TenantId: OSReq.TenantId
      }  
    return this.httpclient.post<OSResponse>(this.uihelper.CallWebAPIUrlNew("/Operator/GetOperators"),osr);

    //return this.httpclient.get<OS[]>(this.uihelper.CallWebAPIUrlNew("/Operator/GetOperators"));

  } 
   
   
}

