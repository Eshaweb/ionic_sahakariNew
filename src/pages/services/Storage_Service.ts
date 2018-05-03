

import { Injectable } from '@angular/core';
import { TokenParams } from '../View Models/TokenParams';


@Injectable()
export class StorageService{

    static SetAuthorizationData(auth:TokenParams):void{
        localStorage.setItem('userToken',JSON.stringify(auth));

    }
    static GetValueFromLocalStorage():TokenParams{
        let tokendata=JSON.parse(localStorage.getItem('userToken'));
        return tokendata==null?null:tokendata;
    }
static SetItem(param1,param2:any){

localStorage.setItem(param1,param2);
}
static GetItem(param){

return localStorage.getItem(param);

}
static RemoveItem(param){

    localStorage.removeItem(param);
}


}