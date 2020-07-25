import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Contact } from '../contact';
import { ContactService } from '../contact.service';

@Component({
    templateUrl: './contact-detail.component.html',
    styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent implements OnInit {
    pageTitle = "Contact Detail";
    contact: Contact;
    contactId: number;
    errorMessage: string;
    displayDialog: boolean = false;
    
    // form
    selectedGender: string = null;
    genderOptions: any[] = [
        {label: 'Male', value: 'M'},
        {label: 'Female', value: 'F'}
    ];

    constructor(private route: ActivatedRoute,
                private router: Router,
                private contactService: ContactService) { 
                    this.contact = null;
    }

    ngOnInit(): void {
        // Get the contact ID from contact list
        const id = this.route.snapshot.paramMap.get('id');
        this.contactId = id != null ? +id : 0;

        // Get contact details
        this.getContactDetails();
    }

    // Get selected contact's details from api
    getContactDetails(): void {
        // Subscribe to the observable in ContactService to get the contact details from an api via http call
        this.contactService.getContactDetails(this.contactId).subscribe({
            next: contact => {
                this.contact = contact;
                this.selectedGender = contact.gender;
            },
            error: err => this.errorMessage = err
        });
    }

    edit(event: Event): void {
        this.displayDialog = true;
        console.log(this.contact);
        event.preventDefault();
    }

    save() {
        console.log(this.contact);

        // call contactService to edit the contact
        this.contactService.editContact(this.contactId, this.contact).subscribe({
            next: contact => {
                this.contact = contact;
            },
            error: err => this.errorMessage = err
        });

        this.displayDialog = false;
    }

    delete() {

        this.displayDialog = false;
    }

    back(): void {
        this.router.navigate([`/contacts`]);
    }

}
