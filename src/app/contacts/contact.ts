import { Address } from './address';
import { Communication } from './communication';

export interface Contact {
    contactId?: number;
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    gender?: string;
    title?: string;
    addresses?: Address[];
    communications?: Communication[];
}