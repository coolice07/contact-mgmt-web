import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';

import { Contact } from '../contact';
import { ContactService } from '../contact.service';

@Component({
    templateUrl: './contact-detail.component.html',
    styleUrls: ['./contact-detail.component.css'],
    providers: [MessageService]
})
export class ContactDetailComponent implements OnInit {
    pageTitle = "Contact Detail";
    contact: Contact;
    contactId: number;
    errorMessage: string;
    
    // form
    displayDialog: boolean = false;
    submitted: boolean = false;
    contactForm: FormGroup;
    genderOptions: Gender[];

    constructor(private route: ActivatedRoute,
                private router: Router,
                private fb: FormBuilder,
                private messageService: MessageService,
                private contactService: ContactService) { 
                    this.contact = null;
    }

    ngOnInit(): void {
        // Get the contact ID from contact list
        const id = this.route.snapshot.paramMap.get('id');
        this.contactId = id != null ? +id : 0;

        // Get contact details
        this.getContactDetails();

        // define the form group and apply any validators
        this.contactForm = this.fb.group({
            'firstName': new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
            'lastName': new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
            'dateOfBirth': new FormControl('', [Validators.required]),
            'gender' : new FormControl(''),
            'title' : new FormControl('')
        });

        // populate the gender options
        this.genderOptions = [
            { name: "", code: "" },
            { name: "Female", code: "F" },
            { name: "Male", code: "M" }
        ];
    }

    // Get selected contact's details from api
    getContactDetails(): void {
        // Subscribe to the observable in ContactService to get the contact details from an api via http call
        this.contactService.getContactDetails(this.contactId).subscribe({
            next: contact => {
                this.contact = contact;
            },
            error: err => this.errorMessage = err
        });
    }

    edit(): void {
        this.contactForm.controls['firstName'].setValue(this.contact.firstName);
        this.contactForm.controls['lastName'].setValue(this.contact.lastName);
        this.contactForm.controls['gender'].setValue(this.contact.gender);
        this.contactForm.controls['title'].setValue(this.contact.title);
        this.contactForm.controls['dateOfBirth'].setValue(new Date(moment(this.contact.dateOfBirth).format('YYYY-MM-DD HH:mm').toString()));
        this.displayDialog = true;
    }

    save(formValue: any) {
        // translate form values to Contact object. apply any formatting needed
        let updatedContact: Contact = {
            contactId: this.contactId,
            firstName: formValue.firstName,
            lastName: formValue.lastName,
            dateOfBirth: moment(formValue.dateOfBirth).format('YYYY-MM-DD').toString(),
            gender: formValue.gender,
            title: formValue.title
        };
        console.log(updatedContact);
        // call contactService to edit the contact
        this.contactService.editContact(updatedContact).subscribe({
            next: contact => {
                this.contact = contact;
                this.messageService.add({severity:'info', summary:'Success', detail:'Contact updated.', sticky: true});
            },
            error: err => {
                this.errorMessage = err;
                this.messageService.add({severity:'error', summary:'Failed', detail:'Failed to update contact.', sticky: true});
            }
        });

        this.displayDialog = false;
    }

    delete() {
        // call contactService to edit the contact
        this.contactService.deleteContact(this.contactId).subscribe({
            next: () => this.router.navigate([`/contacts`]),
            error: err => {
                this.errorMessage = err;
                this.messageService.add({severity:'error', summary:'Failed', detail:'Failed to delete contact.', sticky: true});
            }
        });
    }

    back(): void {
        this.router.navigate([`/contacts`]);
    }

}

// **************************
// object for form
// **************************

interface Gender {
    name: string,
    code: string
}