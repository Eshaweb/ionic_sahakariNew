export class PlanResponse{
    Data:string;
    ResCode:string;
    ResText:string;
    PlanDets:PlanDet;
}

export class PlanDet{
    Amount:string;
    Detail:string;
    Validity:string;
    Talktime:string;   
}