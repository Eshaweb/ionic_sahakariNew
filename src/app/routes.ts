import { RegisterPage } from '../pages/register/register';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { AuthGuard } from '../pages/auth/auth.guard';
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

export const appRoutes: Routes = [
    { path: 'home', component: HomePage,canActivate:[AuthGuard] },
    { path: 'register', component: RegisterPage,canActivate:[AuthGuard] },
    { path: 'login', component: LoginPage,canActivate:[AuthGuard] },

    // { path : '', redirectTo:'register', pathMatch : 'full'}
    
];

export const routing: ModuleWithProviders =
    RouterModule.forRoot(appRoutes);