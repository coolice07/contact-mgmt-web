import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

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
    }

    ngOnChanges(changes: SimpleChanges) {
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

    onEdit(event: Event, communication: Communication) {
        this.selectedCommunication = communication;
        this.displayDialog = true;
        console.log(this.selectedCommunication);
        event.preventDefault();
    }

}
