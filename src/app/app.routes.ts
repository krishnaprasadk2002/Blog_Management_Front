import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/components/dashboard/dashboard.component';
import { LoginComponent } from './pages/components/login/login.component';
import { RegisterComponent } from './pages/components/register/register.component';
import { UserProfileComponent } from './pages/components/user-profile/user-profile.component';
import { authGuard } from './core/guards/auth.guard';
import { userAuthGuard } from './core/guards/auth-log.guard';


export const routes: Routes = [
    {
        path:'',
        redirectTo:'login',
        pathMatch:'full'
    },
    {
        path: 'home',
        component: DashboardComponent,
        canActivate: [authGuard] 
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [userAuthGuard] 
    },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [userAuthGuard] 
    },
    {
        path: 'user-profile',
        component: UserProfileComponent,
        canActivate: [authGuard]
    }
];
