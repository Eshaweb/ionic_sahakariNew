import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/do';
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { StorageService } from '../services/Storage_Service';
import { NavController, Events } from "ionic-angular";
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private event: Events,private router: Router, private localstorageService:StorageService) { 


    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log("Hi, I'm interceptor");
        console.log(req);
        if (req.headers.get('No-Auth') == "True"){
            return next.handle(req.clone());
        }
        
            if(req.url.indexOf("/token")>0){
            var headersforTokenAPI= new HttpHeaders({'Content-Type': 'application/x-www-urlencoded'})
            return next.handle(req);
        }
        
        // if(req.method=="POST"){

        // }
        // if(req.method=="GET"){
            
        // }


        if (localStorage.getItem('userToken') != null) {
            const clonedreq = req.clone({
                headers: req.headers.set("Authorization", "Bearer " + localStorage.getItem('userToken'))
            });
            return next.handle(clonedreq)
                .do(
                succ => { },
                err => {
                    if (err.status === 401)
                    //this.router.navigateByUrl('/login');
                    // this.navCtrl.push(LoginPage);  
                    this.event.publish('UNAUTHORIZED');           
                    }
                );
        }
        else if(localStorage.getItem('User')==null&&localStorage.getItem('userToken')== null){
            const clonedreq = req.clone({
                headers: req.headers.set("Authorization", "Bearer ")
            });
            return next.handle(clonedreq)
                .do(
                succ => { },
                err => {
                    if (err.status === 401)
                    //this.router.navigateByUrl('/login');
                    // this.navCtrl.push(LoginPage);  
                    this.event.publish('UNAUTHORIZED');           
                    }
                );
        } 
        else {
            this.router.navigateByUrl('/login');
            // this.navCtrl.push(LoginPage); 
        }
    }
}