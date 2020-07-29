import { Component, OnInit, Input } from '@angular/core';
import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
import { MessageService } from 'primeng/api';

import { ContactService } from '../../contact.service';
import { Communication } from '../../communication';

@Component({
  selector: 'app-communication-list',
  templateUrl: './communication-list.component.html',
  styleUrls: ['./communication-list.component.css'],
  providers: [MessageService]
})
export class CommunicationListComponent implements OnInit {
    @Input() contactId: number;
    communications: Communication[];
    errorMessage: string;
    
    // primeng dataview
    selectedCommunication: Communication;
    isNewCommunication: boolean = false;

    // for add communication form
    displayDialog: boolean;
    commTypeOptions: CommunicationType[];
    communicationForm: FormGroup;
    
    constructor(private fb: FormBuilder,
                private messageService: MessageService,
                private contactService: ContactService) { }

    ngOnInit(): void { 
         // fetch the communication list
        this.getCommunications();

        // populate the communication type options
        this.commTypeOptions = [
            { name: "Phone", code: "Phone" },
            { name: "Fax", code: "Fax" },
            { name: "Pager", code: "Pager" },
            { name: "Email", code: "Email" },
        ];

        // define the form group and apply any validators
        this.communicationForm = this.fb.group({
            'communicationType': new FormControl('', [Validators.required, Validators.maxLength(10)]),
            'communicationValue': new FormControl('', [Validators.required, Validators.maxLength(100)]),
            'preferred' : new FormControl('',  Validators.maxLength(1))
        });
    }

    // Get selected contact's details from api
    getCommunications(): void {
        // Subscribe to the observable in ContactService to get the contact details from an api via http call
        this.contactService.getCommunications(this.contactId).subscribe({
            next: communications => {
                this.communications = communications;
            },
            error: err => this.errorMessage = err
        });
    }

    add() {
        this.selectedCommunication = {};
        this.communicationForm.reset();
        this.isNewCommunication = true;
        this.displayDialog = true;
    }

    edit(communication: Communication) {
        this.selectedCommunication = communication;
        this.communicationForm.controls['communicationType'].setValue(communication.communicationType);
        this.communicationForm.controls['communicationValue'].setValue(communication.communicationValue);
        this.communicationForm.controls['preferred'].setValue(communication.preferred == 'Y' ? true : false);

        this.isNewCommunication = false;
        this.displayDialog = true;
    }

    save(formValue: any) {

        // TODO need elegant way to translate form values to comm object
        
        if (this.isNewCommunication) {
            // translate form values to Communication object
            let newCommunication: Communication = {
                communicationType: formValue.communicationType,
                communicationValue: formValue.communicationValue,
                preferred: formValue.preferred ? 'Y' : 'N'
            };

            // call contactService to add the communication
            this.contactService.addCommunication(this.contactId, newCommunication).subscribe({
                next: communication => {
                    this.selectedCommunication = communication;
                    // refresh the communication list
                    this.getCommunications();
                    this.messageService.add({severity:'info', summary:'Success', detail:'New communication added.', sticky: true});
                },
                error: err => {
                    this.errorMessage = err;
                    this.messageService.add({severity:'error', summary:'Failed', detail:'Failed to add communication.', sticky: true});
                }
            });
        }
        else {
            console.log(formValue);
            // translate form values to Communication object
            this.selectedCommunication = {
                communicationType: formValue.communicationType,
                communicationValue: formValue.communicationValue,
                preferred: formValue.preferred ? 'Y' : 'N',
                communicationId: this.selectedCommunication.communicationId,
                contactId: this.selectedCommunication.contactId
            };

            // call contactService to edit the communication
            this.contactService.editCommunication(this.selectedCommunication).subscribe({
                next: communication => {
                    this.selectedCommunication = communication;
                    // refresh the communication list
                    this.getCommunications();
                    this.messageService.add({severity:'info', summary:'Success', detail:'Communication updated.', sticky: true});
                },
                error: err => {
                    this.errorMessage = err;
                    this.messageService.add({severity:'error', summary:'Failed', detail:'Failed to update communication.', sticky: true});
                }
            });
        }

        this.displayDialog = false;
        event.preventDefault();
    }

    delete(communication: Communication) {
        const contactId = communication.contactId;
        const communicationId = communication.communicationId;
        
        // call contactService to delete the communication
        this.contactService.deleteCommunication(contactId, communicationId).subscribe({
            next: () => {
                // refresh the communication list
                this.getCommunications();
                this.messageService.add({severity:'info', summary:'Success', detail:'Communication deleted.', sticky: true});
            },
            error: err => {
                this.errorMessage = err;
                this.messageService.add({severity:'error', summary:'Failed', detail:'Failed to delete communication.', sticky: true});
            }            
        });

        this.displayDialog = false;
    }
}

// **************************
// object for form
// **************************

interface CommunicationType {
    name: string,
    code: string
}
