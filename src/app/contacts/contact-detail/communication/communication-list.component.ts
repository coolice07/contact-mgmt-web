import { Component, OnInit, Input } from '@angular/core';

import { ContactService } from '../../contact.service';
import { Communication } from '../../communication';

@Component({
  selector: 'app-communication-list',
  templateUrl: './communication-list.component.html',
  styleUrls: ['./communication-list.component.css']
})
export class CommunicationListComponent implements OnInit {
    @Input() contactId: number;
    communications: Communication[];
    errorMessage: string;
    
    // primeng dataview
    selectedCommunication: Communication;
    displayDialog: boolean;
    isNewCommunication: boolean = false;

    constructor(private contactService: ContactService) { }

    ngOnInit(): void { 
        this.getCommunications();
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
        this.displayDialog = true;
        this.selectedCommunication = {};
        this.isNewCommunication = true;
    }

    edit(communication: Communication) {
        this.selectedCommunication = communication;
        this.displayDialog = true;
        this.isNewCommunication = false;
    }

    save() {
        if (this.isNewCommunication) {
            // call contactService to add the communication
            this.contactService.addCommunication(this.contactId, this.selectedCommunication).subscribe({
                next: communication => {
                    this.selectedCommunication = communication;
                    // refresh the communication list
                    this.getCommunications();
                },
                error: err => this.errorMessage = err
            });
        }
        else {
            // call contactService to edit the communication
            this.contactService.editCommunication(this.selectedCommunication).subscribe({
                next: communication => {
                    this.selectedCommunication = communication;
                    // refresh the communication list
                    this.getCommunications();
                },
                error: err => this.errorMessage = err
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
            },
            error: err => this.errorMessage = err
        });

        this.displayDialog = false;
    }
}
