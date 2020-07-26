import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FilterUtils } from 'primeng/utils';

import { Contact } from '../contact';
import { ContactService } from '../contact.service';

@Component({
    templateUrl: './contact-list.component.html',
    styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
    pageTitle = "Contact Information";
    contacts: Contact[] = [];
    errorMessage: string;

    // for add contact form
    newContact: Contact;
    displayDialog: boolean = false;

    // primeng content and pagination
    cols: any[];
    first: number = 0;
    rows: number = 10;

    // row selection
    selectedContact: Contact;
    contactId: number;
    contactName: string;

    constructor(private router: Router,
                private contactService: ContactService) { }

    ngOnInit(): void {

        // fetch the contact list
        this.getContactList();

        // set the column definition to be used by primeng
        this.cols = [
            { field: 'firstName', header: 'First Name' },
            { field: 'lastName', header: 'Last Name' },
            { field: 'birthDate', header: 'Birth Date' },
            { field: 'gender', header: 'Gender' },
            { field: 'title', header: 'Title' }
        ];

        // primeng table global filter
        FilterUtils['custom'] = (value, filter): boolean => {
            if (filter === undefined || filter === null || filter.trim() === '') {
                return true;
            }
    
            if (value === undefined || value === null) {
                return false;
            }
            
            return parseInt(filter) > value;
        }
    }

    getContactList() {
        // Subscribe to the observable in ContactService to get the list of contacts from an api via http call
        this.contactService.getContacts().subscribe({
            next: contacts => {
                this.contacts = contacts;
            },
            error: err => this.errorMessage = err
        });
    }

    add() {
        this.newContact = {};
        this.displayDialog = true;
    }

    save() {
        // call contactService to add the new contact
        this.contactService.addContact(this.newContact).subscribe({
            next: address => {
                // refresh the contact list
                this.getContactList();
            },
            error: err => this.errorMessage = err
        });

        this.displayDialog = false;
    }

    // **************************
    // primeng table controls
    // **************************

    next() {
        this.first = this.first + this.rows;
    }

    prev() {
        this.first = this.first - this.rows;
    }

    reset() {
        this.first = 0;
    }

    isLastPage(): boolean {
        return this.first === (this.contacts.length - this.rows);
    }

    isFirstPage(): boolean {
        return this.first === 0;
    }

    onRowSelect(event) {
        this.contactId = event.data.contactId;
        // this.contactName = event.data.firstName + " " + event.data.lastName;
        this.router.navigate([`/contacts/${this.contactId}`]);
    }

}
