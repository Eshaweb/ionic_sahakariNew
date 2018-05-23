import { Injectable } from '@angular/core';


@Injectable()
export class UIHelperService {
    // readonly rootUrl = 'https://sahakari.azurewebsites.net';
    // readonly baseUrl = 'https://sahakari.azurewebsites.net/api';
    // readonly rootUrl1 = 'https://sahakari.azurewebsites.net/token';

    readonly rootUrl = 'http://localhost:55394';
    readonly baseUrl='http://localhost:55394/api';
    readonly rootUrl1 = 'http://localhost:55394/token';

    CallWebAPIUrl(api_action_name: any) {
        return this.rootUrl + api_action_name;
    }
    CallWebAPIUrlNew(api_action: any) {
        return this.baseUrl + api_action;
    }
    CallWebAPIUrl1() {
        return this.rootUrl;
    }
}
