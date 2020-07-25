import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

import { Contact } from '../../contact';
import { Address } from '../../address';
import { ContactService } from '../../contact.service';

@Component({
    selector: 'app-address-list',
    templateUrl: './address-list.component.html',
    styleUrls: ['./address-list.component.css']
})
export class AddressListComponent implements OnInit {
    @Input() contactId: number;
    addresses: Address[] = [];
    errorMessage: string;
    
    // primeng dataview
    selectedAddress: Address;
    displayDialog: boolean;
    
    constructor(private contactService: ContactService) { }

    ngOnInit(): void { 
    }

    ngOnChanges(changes: SimpleChanges) {
        this.getAddresses();
    }

    // Get selected contact's details from api
    getAddresses(): void {
        // Subscribe to the observable in ContactService to get the contact details from an api via http call
        this.contactService.getAddresses(this.contactId).subscribe({
            next: addresses => {
                this.addresses = addresses;
            },
            error: err => this.errorMessage = err
        });
    }

    onEdit(event: Event, address: Address) {
        this.selectedAddress = address;
        this.displayDialog = true;
        console.log(this.selectedAddress);
        event.preventDefault();
    }

}
