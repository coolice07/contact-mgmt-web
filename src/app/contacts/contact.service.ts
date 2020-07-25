import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
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

    editContact(contactId: number, contact: Contact): Observable<Contact | undefined> {
        const url = this.contactUrl + "/" + contactId;
        return this.http.put<Contact>(url, contact).pipe(
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

    // ********************
    // Communications
    // ********************

    getCommunications(contactId: number): Observable<Communication[] | undefined> {
        const url = this.contactUrl + "/" + contactId + this.communicationUrl;
        return this.http.get<Communication[]>(url).pipe(
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
