import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactListComponent } from './contacts/contact-list/contact-list.component';
import { ContactDetailComponent } from './contacts/contact-detail/contact-detail.component';

const routes: Routes = [
    { path: 'contacts', component: ContactListComponent },
    { path: 'contacts/:id', 
        component: ContactDetailComponent, 
        pathMatch: 'full' },
    { path: '', redirectTo: 'contacts', pathMatch: 'full' },
    { path: '**', redirectTo: 'contacts', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
