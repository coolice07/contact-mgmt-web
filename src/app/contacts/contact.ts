import { Address } from './address';
import { Communication } from './communication';

export interface Contact {
    contactId?: number;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: string;
    title?: string;
    addresses?: Address[];
    communications?: Communication[];
}