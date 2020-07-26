import { Component, OnInit, Input } from '@angular/core';

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

    edit(event: Event, address: Address) {
        this.selectedAddress = address;
        this.displayDialog = true;
        event.preventDefault();
    }

    save() {
        // call contactService to edit the address
        this.contactService.editAddress(this.selectedAddress).subscribe({
            next: address => {
                this.selectedAddress = address;
            },
            error: err => this.errorMessage = err
        });

        this.displayDialog = false;
    }

    delete() {
        const contactId = this.selectedAddress.contactId;
        const addressId = this.selectedAddress.addressId;
        
        // call contactService to delete the address
        this.contactService.deleteAddress(contactId, addressId).subscribe({
            error: err => this.errorMessage = err
        });

        // refresh the address list
        this.getAddresses();

        this.displayDialog = false;
    }
}
