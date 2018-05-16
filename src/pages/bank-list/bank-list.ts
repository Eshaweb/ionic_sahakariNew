import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EnterOTPPage } from '../enter-otp/enter-otp';
import { HomePage } from '../home/home';
import { MobileRechargePage } from '../mobile-recharge/mobile-recharge';
import { BankingPage } from '../banking/banking';

@Component({
  selector: 'page-bank-list',
  templateUrl: 'bank-list.html'
})
export class BankListPage {

  constructor(public navCtrl: NavController) {
  }
  goToEnterOTP(params){
    if (!params) params = {};
    this.navCtrl.push(EnterOTPPage);
  }goToHome(params){
    if (!params) params = {};
    this.navCtrl.push(HomePage);
  }goToMobileRecharge(params){
    if (!params) params = {};
    this.navCtrl.push(MobileRechargePage);
  }goToBanking(params){
    if (!params) params = {};
    this.navCtrl.push(BankingPage);
  }
}

// export class ShuklaDay{
//   static Sun:number[]=[2,3,1,4,5];
//   static Mon:number[]=[5,2,3,1,4];
//   static Tue:number[]=[2,3,1,4,5];
//   static Wed:number[]=[5,2,3,1,4];
//   static Thu:number[]=[4,5,2,3,1];
//   static Fri:number[]=[1,4,5,2,3];
//   static Sat:number[]=[3,1,4,5,2];
// }
// export class ShuklaNight{
//   static Sun:number[]=[5,3,4,2,1];
//   static Mon:number[]=[3,4,2,1,5];
//   static Tue:number[]=[5,3,4,2,1];
//   static Wed:number[]=[3,4,2,1,5];
//   static Thu:number[]=[4,2,1,5,3];
//   static Fri:number[]=[2,1,5,3,4];
//   static Sat:number[]=[1,5,3,4,2];
// }
// export class KrishnaDay{
//   static Sun:number[]=[3,2,5,4,1];
//   static Mon:number[]=[4,1,3,2,5];
//   static Tue:number[]=[3,2,5,4,1];
//   static Wed:number[]=[5,4,1,3,2];
//   static Thu:number[]=[1,3,2,5,4];
//   static Fri:number[]=[2,5,4,1,3];
//   static Sat:number[]=[4,1,3,2,5];
// }

// export class KrishnaNight{
//   static Sun:number[]=[2,4,3,5,1];
//   static Mon:number[]=[5,1,2,4,3];
//   static Tue:number[]=[2,4,3,5,1];
//   static Wed:number[]=[4,3,5,1,2];
//   static Thu:number[]=[3,5,1,2,4];
//   static Fri:number[]=[1,2,4,3,5];
//   static Sat:number[]=[5,1,2,4,3];
// }



// export class xxxxx{
//  static Paksha:number[]=[1,2];
//  static DayNight:number[]=[1,2];
//  static Vara:number[]=[1,2,3,4,5,6,7];
//  static Activities:number[]=[1,2,3,4,5];
// }

// if(xxxxx.Paksha[0]==1&&xxxxx.DayNight[0]==1&&xxxxx.Vara[0]==1&&xxxxx.Activities[0]==1){

  
// }

// if(xxxxx.Paksha[0]==1&&xxxxx.DayNight[0]==1&&xxxxx.Vara[0]==1){
  
//   switch(xxxxx.Activities){
//     case [0]:var y=3;
//     break;
//     case [1]:
//     break;
//     default:
//     break;

//   }
// }

// if(xxxxx.Paksha[0]==1&&xxxxx.DayNight[0]==1&&xxxxx.Activities[0]==1){
  
//   switch(xxxxx.Vara){
//     case [0]:var y=3;
//     break;
//     case [1]:
//     break;
//     default:
//     break;

//   }
// }
// xxxxx.Paksha
