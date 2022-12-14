import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { PreventUnsavedChangesGuard } from './_guards/prevent-unsaved-changes.guard';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './_guards/auth.guard';
import { TestErrorsComponent } from './errors/test-errors/test-errors.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { AdminGuard } from './_guards/admin.guard';
import { MessageDetailedResolver } from './_resolvers/message-detailed.resolver';

// in order to enable routing inside of the angular application
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'members', component: MemberListComponent, canActivate: [AuthGuard] }, // apply one route guard
  { path: 'errors', component: TestErrorsComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      // in order to apply 1 route guard to many paths
      {
        path: 'members/:username',
        component: MemberDetailComponent,
        resolve: { member: MessageDetailedResolver },
      },
      {
        path: 'member/:edit',
        component: MemberEditComponent,
        canDeactivate: [PreventUnsavedChangesGuard],
      },
      { path: 'lists', component: ListsComponent },
      { path: 'messages', component: MessagesComponent },
      {
        path: 'admin',
        component: AdminPanelComponent,
        canActivate: [AdminGuard],
      },
    ],
  },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'server-error', component: ServerErrorComponent },
  { path: '**', component: NotFoundComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
