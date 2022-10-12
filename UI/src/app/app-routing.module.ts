import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { UserFormComponent } from './user/user-form/user-form.component';
import { UsersListComponent } from './user/users-list/users-list.component';

const routes: Routes = [
  {path:'', component: LoginComponent },
  {path: 'admin/user/new', component: UserFormComponent},
  {path: 'admin/user/:userId', component: UserFormComponent},
  {path: 'user-list', component: UsersListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
