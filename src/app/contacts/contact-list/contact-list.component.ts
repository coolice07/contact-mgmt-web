import { Component, OnInit } from '@angular/core';
import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';
import { FilterUtils } from 'primeng/utils';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';

import { Contact } from '../contact';
import { ContactService } from '../contact.service';


@Component({
    templateUrl: './contact-list.component.html',
    styleUrls: ['./contact-list.component.css'],
    providers: [MessageService]
})
export class ContactListComponent implements OnInit {
    pageTitle = "Contact Information";
    contacts: Contact[] = [];
    errorMessage: string;

    // primeng content and pagination
    cols: any[];
    first: number = 0;
    rows: number = 10;

    // row selection
    selectedContact: Contact;
    contactId: number;
    contactName: string;

    // for add contact form
    displayDialog: boolean = false;
    submitted: boolean = false;
    genderOptions: Gender[];
    contactForm: FormGroup;

    constructor(private router: Router, 
                private fb: FormBuilder,
                private messageService: MessageService,
                private contactService: ContactService) { 

    }

    ngOnInit(): void {

        // fetch the contact list
        this.getContactList();

        // set the column definition to be used by primeng
        this.cols = [
            { field: 'firstName', header: 'First Name' },
            { field: 'lastName', header: 'Last Name' },
            { field: 'dateOfBirth', header: 'Birth Date' },
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

        // populate the gender options
        this.genderOptions = [
            { name: "", code: "" },
            { name: "Female", code: "F" },
            { name: "Male", code: "M" }
        ];

        // define the form group and apply any validators
        this.contactForm = this.fb.group({
            'firstName': new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
            'lastName': new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
            'dateOfBirth': new FormControl('', [Validators.required]),
            'gender' : new FormControl(''),
            'title' : new FormControl('')
        });
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
        // toggle the dialog modal
        this.displayDialog = true;

        // reset form controls
        this.contactForm.reset();
        this.submitted = false;
    }

    save(formValue: any) {
        // translate form values to Contact object. apply any formatting needed
        let newContact: Contact = {
            firstName: formValue.firstName,
            lastName: formValue.lastName,
            dateOfBirth: moment(formValue.dateOfBirth).format('YYYY-MM-DD').toString(),
            gender: formValue.gender,
            title: formValue.title
        };

        // call contactService to add the new contact
        this.contactService.addContact(newContact).subscribe({
            next: address => {
                // refresh the contact list
                this.getContactList();
                this.submitted = true;
            },
            error: err => this.errorMessage = err
        });

        this.displayDialog = false;
        this.messageService.add({severity:'info', summary:'Success', detail:'New contact added.', sticky: true});
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
        this.router.navigate([`/contacts/${this.contactId}`]);
    }
}

// **************************
// object for form
// **************************

interface Gender {
    name: string,
    code: string
}
