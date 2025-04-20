import { CurrencyCode } from "./@0charliecat/currency-code-enum";

export type PayMeSupportedVersions = "1";
export interface PayMeParams {
	V: PayMeSupportedVersions;	// Version
	IBAN: string;				// IBAN (Account Number)
	AM: number;					// Amount
	CC: CurrencyCode;			// Currency Code // In version 1 is only “EUR” valid currency code.
	DT?: string;				// Due Date
	PI?: string;				// Payment Identifier
	MSG?: string;				// Message for beneficiary
	CN?: string;				// Creditor Name
}