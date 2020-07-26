import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from './../../environments/environment';

import { Contact } from './contact';
import { Address } from './address';
import { Communication } from './communication';

@Injectable({
    providedIn: 'root'
})
export class ContactService {

    private contactUrl = environment.baseApiUrl + '/contacts';
    private addressUrl = "/addresses";
    private communicationUrl = "/communications";

    constructor(private http: HttpClient) { }

    // Return http response as observable so we can add more events if needed. In this case,
    // using pipe method, we can add more operators to do more stuff like logging and error handling

    // ********************
    // Contacts
    // ********************

    getContacts(): Observable<Contact[]> {
        return this.http.get<Contact[]>(this.contactUrl).pipe(
            tap(data => console.log('All: ' + JSON.stringify(data))),
            catchError(this.handleError)
        );
    }

    getContactDetails(contactId: number): Observable<Contact | undefined> {
        const url = this.contactUrl + "/" + contactId;
        return this.http.get<Contact>(url).pipe(
            catchError(this.handleError)
        );
    }

    addContact(contact: Contact): Observable<Contact | undefined> {
        return this.http.post<Contact>(this.contactUrl, contact).pipe(
            catchError(this.handleError)
        );
    }

    editContact(contact: Contact): Observable<Contact | undefined> {
        const url = this.contactUrl + "/" + contact.contactId;
        return this.http.put<Contact>(url, contact).pipe(
            catchError(this.handleError)
        );
    }

    deleteContact(contactId: number): Observable<any> {
        const url = this.contactUrl + "/" + contactId;
        return this.http.delete<any>(url).pipe(
            catchError(this.handleError)
        );
    }

    // ********************
    // Addresses
    // ********************

    getAddresses(contactId: number): Observable<Address[] | undefined> {
        const url = this.contactUrl + "/" + contactId + this.addressUrl;
        return this.http.get<Address[]>(url).pipe(
            catchError(this.handleError)
        );
    }

    addAddress(contactId: number, address: Address): Observable<Address | undefined> {
        const url = this.contactUrl + "/" + contactId + this.addressUrl;
        return this.http.post<Address>(url, address).pipe(
            catchError(this.handleError)
        );
    }

    editAddress(address: Address): Observable<Address | undefined> {
        const url = this.contactUrl + "/" + 
                address.contactId + this.addressUrl + "/" +
                address.addressId;
        return this.http.put<Address>(url, address).pipe(
            catchError(this.handleError)
        );
    }

    deleteAddress(contactId: number, addressId: number): Observable<any> {
        const url = this.contactUrl + "/" + 
                contactId + this.addressUrl + "/" +
                addressId;
        return this.http.delete<any>(url).pipe(
            catchError(this.handleError)
        );
    }

    // ********************
    // Communications
    // ********************

    getCommunications(contactId: number): Observable<Communication[] | undefined> {
        const url = this.contactUrl + "/" + contactId + this.communicationUrl;
        return this.http.get<Communication[]>(url).pipe(
            catchError(this.handleError)
        );
    }

    addCommunication(contactId: number, communication: Communication): Observable<Communication | undefined> {
        const url = this.contactUrl + "/" + contactId + this.communicationUrl;
        return this.http.post<Communication>(url, communication).pipe(
            catchError(this.handleError)
        );
    }

    editCommunication(communication: Communication): Observable<Communication | undefined> {
        const url = this.contactUrl + "/" + 
                communication.contactId + this.communicationUrl + "/" +
                communication.communicationId;
        return this.http.put<Communication>(url, communication).pipe(
            catchError(this.handleError)
        );
    }

    deleteCommunication(contactId: number, communicationId: number): Observable<any> {
        const url = this.contactUrl + "/" + 
                contactId + this.communicationUrl + "/" +
                communicationId;
        return this.http.delete<any>(url).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(err: HttpErrorResponse) {
        let errorMessage = '';
        if (err.error instanceof ErrorEvent) {
            errorMessage = `An error occurred: ${err.error.message}`;
        }
        else {
            errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
        }
        console.log(errorMessage);
        return throwError(errorMessage);
    }

}
