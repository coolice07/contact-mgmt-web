import { Component, OnInit, Input } from '@angular/core';

import { Contact } from '../../contact';
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

    showAddForm() {

    }

    add() {
        // call contactService to add the communication
        this.contactService.addCommunication(this.selectedCommunication).subscribe({
            next: communication => {
                this.selectedCommunication = communication;
            },
            error: err => this.errorMessage = err
        });

        this.displayDialog = false;
    }

    edit(event: Event, communication: Communication) {
        this.selectedCommunication = communication;
        this.displayDialog = true;
        event.preventDefault();
    }

    save() {
        // call contactService to edit the communication
        this.contactService.editCommunication(this.selectedCommunication).subscribe({
            next: communication => {
                this.selectedCommunication = communication;
            },
            error: err => this.errorMessage = err
        });

        this.displayDialog = false;
    }

    delete() {
        const contactId = this.selectedCommunication.contactId;
        const communicationId = this.selectedCommunication.communicationId;
        
        // call contactService to delete the communication
        this.contactService.deleteCommunication(contactId, communicationId).subscribe({
            error: err => this.errorMessage = err
        });

        // refresh the address list
        this.getCommunications();

        this.displayDialog = false;
    }
}
