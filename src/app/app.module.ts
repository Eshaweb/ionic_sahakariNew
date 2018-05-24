import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { Toast } from '@ionic-native/toast';
import { ServiceWorkerModule } from '@angular/service-worker';
//import { environment } from '../environments/environment';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SettingPage } from '../pages/setting/setting';
import { ChangeBankPage } from '../pages/change-bank/change-bank';
import { BankingPage } from '../pages/banking/banking';
import { PagePage } from '../pages/page/page';
import { LoginPage } from '../pages/login/login';
import { RechargePage } from '../pages/recharge/recharge';
import { FavouritesPage } from '../pages/favourites/favourites';
import { MiniStatementPage } from '../pages/mini-statement/mini-statement';
import { MobileRechargePage } from '../pages/mobile-recharge/mobile-recharge';
import { ConfirmPagePage } from '../pages/confirm-page/confirm-page';
import { RechargeSuccessfulPage } from '../pages/recharge-successful/recharge-successful';
import { RegisterPage } from '../pages/register/register';
import { BankListPage } from '../pages/bank-list/bank-list';
import { EnterOTPPage } from '../pages/enter-otp/enter-otp';
import { SelectOperatorPage } from '../pages/select-operator/select-operator';
import { HttpClient,HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { AuthGuard } from '../pages/auth/auth.guard';
import { AutoCompleteModule } from 'ionic2-auto-complete';



import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import{ RegisterService } from '../pages/services/app-data.service';
import { UIHelperService } from '../pages/UIHelperClasses/UIHelperService';
import { AuthInterceptor } from '../pages/auth/auth.interceptor';
import { RouterModule } from '@angular/router';
import { appRoutes } from './routes';
import { StorageService } from '../pages/services/Storage_Service';
//import { IonicPageModule } from 'ionic-angular';
import { ConstantService } from '../pages/services/Constants';
import { AutoLogoutService } from '../pages/services/AutoLogOutService';
import { FundTransferPage } from '../pages/fund-transfer/fund-transfer';
import { BalanceEnquiryPage } from '../pages/balance-enquiry/balance-enquiry';
import { BasicPage as TabBasicPage, TabBasicContentPage1,TabBasicContentPage2,TabBasicContentPage3, TabBasicContentPage4, TabBasicContentPage5, TabBasicContentPage6 } from '../pages/ViewPlans_Tabs/ViewPlans_Tabs';
import { RechargeReportPage } from '../pages/recharge-report/recharge-report';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SettingPage,
    ChangeBankPage,
    BankingPage,
    PagePage,
    LoginPage,
    RechargePage,
    FavouritesPage,
    MiniStatementPage,
    MobileRechargePage,
    ConfirmPagePage,
    RechargeSuccessfulPage,
    RegisterPage,
    BankListPage,
    EnterOTPPage,
    SelectOperatorPage,
    FundTransferPage,
    BalanceEnquiryPage,
<<<<<<< HEAD
=======
    TabBasicPage,
    TabBasicContentPage1,
    TabBasicContentPage2,
    TabBasicContentPage3,
    TabBasicContentPage4,
    TabBasicContentPage5,
    TabBasicContentPage6,
    RechargeReportPage
>>>>>>> b45d7f21c26b6cc733bf6f65d8583a2fcd60e1f5
  ],
  imports: [HttpModule,HttpClientModule,BrowserAnimationsModule,
    BrowserModule,
    AutoCompleteModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      //positionClass: 'toast-bottom-center',
      positionClass: 'toast-center-center',
      preventDuplicates: true,
    }),
    IonicModule.forRoot(MyApp),
    RouterModule.forRoot(appRoutes),
    //environment.production ? ServiceWorkerModule.register('ngsw-worker.js') : []
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SettingPage,
    ChangeBankPage,
    BankingPage,
    PagePage,
    LoginPage,
    RechargePage,
    FavouritesPage,
    MiniStatementPage,
    MobileRechargePage,
    ConfirmPagePage,
    RechargeSuccessfulPage,
    RegisterPage,
    BankListPage,
    EnterOTPPage,
    SelectOperatorPage,
    FundTransferPage,
    BalanceEnquiryPage,
    TabBasicPage,
    TabBasicContentPage1,
    TabBasicContentPage2,
    TabBasicContentPage3,
    TabBasicContentPage4,
    TabBasicContentPage5,
    TabBasicContentPage6,
    RechargeReportPage
  ],
  providers: [AuthGuard,Toast, {
    provide : HTTP_INTERCEPTORS,
    useClass : AuthInterceptor,
    multi : true
  },
    RegisterService,
    UIHelperService,
    StorageService,
    ConstantService,
    AutoLogoutService,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}