import { Routes } from '@angular/router';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { DetailsformComponent } from './detailsform/detailsform.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    { path:'', redirectTo:'login', pathMatch: 'full'},
    { path: 'login', component:LoginpageComponent},
    { path: 'detailsform', component:DetailsformComponent,canActivate:[authGuard]},
    { path: 'dashboard', component:DashboardComponent, canActivate: [authGuard] },
    { path: 'edit-user/:id', component: EditUserComponent }

];



