import { DateTime } from "ionic-angular";

export class RRResponse{
    Id:number;
    TranId:string;
    Date:DateTime;
    Amount:number;
    Status:string;
    StatusCode:number;
    SubStatus:string;
}