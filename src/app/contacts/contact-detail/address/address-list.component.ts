import { Component, OnInit, Input } from '@angular/core';
import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
import { MessageService } from 'primeng/api';

import { Address } from '../../address';
import { ContactService } from '../../contact.service';

@Component({
    selector: 'app-address-list',
    templateUrl: './address-list.component.html',
    styleUrls: ['./address-list.component.css'],
    providers: [MessageService]
})
export class AddressListComponent implements OnInit {
    @Input() contactId: number;
    addresses: Address[] = [];
    errorMessage: string;
    
    // primeng dataview
    selectedAddress: Address;
    isNewAddress: boolean = false;

    // form
    displayDialog: boolean = false;
    addressForm: FormGroup;
    
    constructor(private fb: FormBuilder,
        private messageService: MessageService,
        private contactService: ContactService) { }

    ngOnInit(): void { 
        // fetch the addresses
        this.getAddresses();

        // define the form group and apply any validators
        this.addressForm = this.fb.group({
            'addressType': new FormControl('', [Validators.required, Validators.maxLength(10)]),
            'streetNumber': new FormControl('', [Validators.maxLength(5)]),
            'streetName': new FormControl('', [Validators.maxLength(100)]),
            'unit': new FormControl('', [Validators.maxLength(5)]),
            'city' : new FormControl('', [Validators.required, Validators.maxLength(20)]),
            'state' : new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]),
            'zipCode' : new FormControl('', [Validators.required, Validators.maxLength(5)]),
        });
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

    add() {
        this.displayDialog = true;
        this.selectedAddress = {};
        this.addressForm.reset();
        this.isNewAddress = true;
    }

    edit(address: Address) {
        this.selectedAddress = address;
        this.addressForm.controls['addressType'].setValue(address.addressType);
        this.addressForm.controls['streetNumber'].setValue(address.streetNumber);
        this.addressForm.controls['streetName'].setValue(address.streetName);
        this.addressForm.controls['unit'].setValue(address.unit);
        this.addressForm.controls['city'].setValue(address.city);
        this.addressForm.controls['state'].setValue(address.state);
        this.addressForm.controls['zipCode'].setValue(address.zipCode);

        this.isNewAddress = false;
        this.displayDialog = true;
    }

    save(formValue: any) {
        if (this.isNewAddress) {
            // translate form values to address object
            let newAddress: Address = {
                addressType: formValue.addressType,
                streetNumber: formValue.streetNumber,
                streetName: formValue.streetName,
                unit: formValue.unit,
                city: formValue.city,
                state: formValue.state,
                zipCode: formValue.zipCode
            };

            // call contactService to add the new address
            this.contactService.addAddress(this.contactId, newAddress).subscribe({
                next: address => {
                    this.selectedAddress = address;
                    // refresh the address list
                    this.getAddresses();
                    this.messageService.add({severity:'info', summary:'Success', detail:'New address added.', sticky: true});
                },
                error: err => this.errorMessage = err
            });
        }
        else {
            // translate form values to address object
            this.selectedAddress = {
                addressType: formValue.addressType,
                streetNumber: formValue.streetNumber,
                streetName: formValue.streetName,
                unit: formValue.unit,
                city: formValue.city,
                state: formValue.state,
                zipCode: formValue.zipCode,
                addressId: this.selectedAddress.addressId,
                contactId: this.selectedAddress.contactId
            };
            
            // call contactService to edit the address
            this.contactService.editAddress(this.selectedAddress).subscribe({
                next: address => {
                    this.selectedAddress = address;
                    // refresh the address list
                    this.getAddresses();
                    this.messageService.add({severity:'info', summary:'Success', detail:'Address updated.', sticky: true});
                },
                error: err => this.errorMessage = err
            });
        }

        this.displayDialog = false;
    }

    delete(address: Address) {
        const contactId = address.contactId;
        const addressId = address.addressId;
        
        // call contactService to delete the address
        this.contactService.deleteAddress(contactId, addressId).subscribe({
            next: () => {
                // refresh the address list
                this.getAddresses();
                this.messageService.add({severity:'info', summary:'Success', detail:'Address deleted.', sticky: true});
            },
            error: err => this.errorMessage = err
        });

        this.displayDialog = false;
    }
}
