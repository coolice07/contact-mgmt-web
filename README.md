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




