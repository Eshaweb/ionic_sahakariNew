import { Injectable } from '@angular/core';


@Injectable()
export class UIHelperService{
    readonly rootUrl = 'http://localhost:55394';
    //readonly baseUrl='https://sahakari.azurewebsites.net/api';
    readonly baseUrl='http://localhost:55394/api';

    readonly rootUrl1 = 'http://localhost:55394/token';

    CallWebAPIUrl(api_action_name:any){
        return this.rootUrl+api_action_name;
}
CallWebAPIUrlNew(api_action:any){
    return this.baseUrl+api_action;
}
CallWebAPIUrl1(){
    return this.rootUrl;
}
}
