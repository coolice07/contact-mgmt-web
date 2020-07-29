# Contact Management Web

## Tech Stack:

* Angular
* Node.js
* PrimeNG
* Bootstrap

# Installation and Running Instructions

## Pre-requisite

* Visual Studio Code (VSCode)
* Angular
* Node.js
* A running instance of **Contact Management API** (for details, refer to [https://github.com/coolice07/contact-mgmt-api.git](https://github.com/coolice07/contact-mgmt-api.git))

Github Location: [https://github.com/coolice07/contact-mgmt-web.git](https://github.com/coolice07/contact-mgmt-web.git)

## Steps

1. Clone the repository above.

2. Open VSCode and open the folder of the cloned repository.

3. In VSCode, open a terminal and run `npm install` to install the dependencies.

4. Once `npm install` is complete, run `npm start` to run the dev server. This should open a tab in the web browser and navigate to [`http://localhost:4200/`](http://localhost:4200/).

5. Make sure API (http://localhost:8090/contactmanagement/v1/health) is running to be able to see data.

# Documentation

This is a Minimum Viable Product (MVP) to demonstrate a web application that can consume an API. PrimeNG is used as UI library for my own education and to speed up the UI development. Below are a list of available features and yet-to-be implemented features.

## Features

### Contact List

* Display list of contacts
* Pagination if contacts exceed 10 rows
* Sort and filter contacts
* Add a new contact
* Select a contact to view a contact's details

### Contact Detail

* Display contact's details along with list of addresses and communications
* Edit contact's details
* Delete the contact

### Address

* Display list of addresses for a given contact
* Pagination if addresses exceed 5 rows
* Add an address
* Edit an address
* Delete an address

### Communication

* Display list of communications for a given contact
* Pagination if addresses exceed 5 rows
* Add a communication
* Edit a communication
* Delete a communication


## TO-DO's

These are future features that can be implemented.

### Contacts
* Confirm delete before deleting record.
* Make `Gender` dropdown if expecting only certain values.

### Addresses
* Confirm delete before deleting record. 
* Make `Address Type` dropdown if expecting only certain values.
* Make `City` and `State` a lookup.

### Communications
* Confirm delete before deleting record. 
* Put validations (regex?) for Communication Value depending on Communication Type (e.g., if email, should follow format a@a.aaa, etc.).

### Others
* Apply server-side pagination, sort and filter.
* Fix styling.
* Login and authentication.
* Apply CI/CD.
* Containerize and deploy in Nginx.



