import { Device } from '@ionic-native/device';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { Toast } from '@ionic-native/toast';
import { ServiceWorkerModule } from '@angular/service-worker';
import {TranslateService} from '@ngx-translate/core';
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
import { EnterOTPPage, FormatTimePipe } from '../pages/enter-otp/enter-otp';
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

import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
//import { IonicPageModule } from 'ionic-angular';
import { ConstantService } from '../pages/services/Constants';
import { AutoLogoutService } from '../pages/services/AutoLogOutService';
import { FundTransferPage } from '../pages/fund-transfer/fund-transfer';
import { BalanceEnquiryPage } from '../pages/balance-enquiry/balance-enquiry';
import { BasicPage } from '../pages/ViewPlans_Tabs/ViewPlans_Tabs';
import { RechargeReportPage } from '../pages/recharge-report/recharge-report';
import { PrepaidConfirmPage } from '../pages/prepaid-confirm/prepaid-confirm';
import { UISercice } from '../pages/services/UIService';
import { MyProfilePage } from '../pages/my-profile/my-profile';

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
    FundTransferPage,
    BalanceEnquiryPage,
    BasicPage,
    RechargeReportPage,
    PrepaidConfirmPage,
    FormatTimePipe,
    MyProfilePage
  ],
  imports: [HttpModule,HttpClientModule,BrowserAnimationsModule,
    BrowserModule,
    AutoCompleteModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      //positionClass: 'toast-bottom-center',
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    }),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: (HttpLoaderFactory),
          deps: [HttpClient]
      }
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
    FundTransferPage,
    BalanceEnquiryPage,
    BasicPage,
    RechargeReportPage,
    PrepaidConfirmPage,
    MyProfilePage
  ],
  providers: [AuthGuard,Toast,Device, {
    provide : HTTP_INTERCEPTORS,
    useClass : AuthInterceptor,
    multi : true
  },
    RegisterService,
    UIHelperService,
    StorageService,
    ConstantService,
    AutoLogoutService,
    UISercice,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}