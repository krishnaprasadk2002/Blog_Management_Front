import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/components/dashboard/dashboard.component';
import { LoginComponent } from './pages/components/login/login.component';
import { RegisterComponent } from './pages/components/register/register.component';
import { UserProfileComponent } from './pages/components/user-profile/user-profile.component';

export const routes: Routes = [
    {
        path:'home',
        component:DashboardComponent
    },
    {
        path:'login',
        component:LoginComponent
    },
    {
        path:'register',
        component:RegisterComponent
    },
    {
        path:'user-profile',
        component:UserProfileComponent
    }
];
