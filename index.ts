import { simplePayment } from "bysquare"
import { CurrencyCode } from "./@0charliecat/currency-code-enum";
import { PayMeParams, PayMeSupportedVersions } from "./types";

// Source of truth - https://www.payme.sk/docs/PaymentLinkStandard_v1_2.pdf

const IBAN_REGEX = /^[A-Z]{2,2}[0-9]{2,2}[a-zA-Z0-9]{1,30}$/;
const PI_REGEX = /^\/VS[a-zA-Z0-9]{0,10}\/SS[a-zA-Z0-9]{0,10}\/KS[a-zA-Z0-9]{0,4}$/;

export class PayMeLink {
	version: PayMeSupportedVersions;
	IBAN: string;
	amount: number;
	currency: CurrencyCode;
	dueDate?: Date;
	paymentIdentifier?: string;
	message?: string;
	creditorName?: string;

	// Overload signatures
	/**
	 * Creates a PayMe link Class from an object of the link parameters
	 * @param {PayMeParams} input 
	 * @see https://www.payme.sk/docs/PaymentLinkStandard_v1_2.pdf
	 */
	constructor(input: PayMeParams);
	/**
	 * Creates a PayMe link Class from a the url
	 * @param {string | URL} input 
	 * @see https://www.payme.sk/docs/PaymentLinkStandard_v1_2.pdf
	 */
	constructor(input: string | URL);
	/**
	 * Creates a clean PayMe link Class
	 * @param {PayMeParams} input 
	 * @see https://www.payme.sk/docs/PaymentLinkStandard_v1_2.pdf
	 */
	constructor();
	
	// Implementation
	constructor(input?: PayMeParams | string | URL) {
		let paramsObject: PayMeParams;

		if (!input) {
			paramsObject = {
				V: "1",
				IBAN: "",
				AM: 0,
				CC: "EUR",
			}
		} else if (typeof input === "string" || input! instanceof URL) {
			const url = new URL(input.toString());
			paramsObject = {
				V: url.searchParams.get("V") as PayMeSupportedVersions,
				IBAN: url.searchParams.get("IBAN")!,
				AM: parseFloat(url.searchParams.get("AM")!),
				CC: url.searchParams.get("CC") as CurrencyCode,
				DT: url.searchParams.get("DT")!,
				PI: url.searchParams.get("PI")!,
				MSG: url.searchParams.get("MSG")!,
				CN: url.searchParams.get("CN")!,
			};
		} else if (typeof input === "object") {
			paramsObject = input;
		} else {
			throw new Error("Invalid input type");
		}

		if (!IBAN_REGEX.test(paramsObject.IBAN || "") && input) {
			throw new Error("Invalid IBAN format");
		}

		this.version = paramsObject.V;
		this.IBAN = paramsObject.IBAN;
		this.amount = paramsObject.AM;

		if (this.version === "1" && paramsObject.CC !== "EUR") {
			throw new Error("Invalid currency code for version 1");
		}
		this.currency = paramsObject.CC;

		this.dueDate = paramsObject.DT ? new Date(PayMeLink.dateConverterISO2JS(paramsObject.DT)) : undefined;

		this.paymentIdentifier = paramsObject.PI;
		if (this.paymentIdentifier && this.paymentIdentifier!.length > 35) {
			throw new Error("Payment identifier is too long, maximum length is 35 characters");
		} else if (this.paymentIdentifier && !PI_REGEX.test(this.paymentIdentifier)) {
			throw new Error("Invalid payment identifier format. Please use the following format “/VS{0,10}/SS{0,10}/KS{0,4}”");
		}

		this.message = paramsObject.MSG;
		if (this.message && this.message.length > 140) {
			throw new Error("Message is too long, maximum length is 140 characters");
		}

		this.creditorName = paramsObject.CN;
		if (this.creditorName && this.creditorName.length > 70) {
			throw new Error("Creditor name is too long, maximum length is 70 characters");
		}
	}


	/**
	 * Get the parameters for the PayMe link
	 * @returns {PayMeParams} The parameters for the PayMe link
	 */
	public get params() : PayMeParams {
		let params: PayMeParams = {
			V: this.version,
			IBAN: this.IBAN,
			AM: this.amount,
			CC: this.currency,
		}

		if (this.dueDate)
			params.DT = this.dueDate.toISOString().split("T")[0];
		if (this.paymentIdentifier)
			params.PI = this.paymentIdentifier;
		if (this.message)
			params.MSG = this.message;
		if (this.creditorName)
			params.CN = this.creditorName;

		return params
	}

	/**
	 * Set the version of the PayMe link
	 * @param {PayMeParams} params The parameters for the PayMe link
	 * @returns {PayMeLink} The PayMeLink instance
	 */
	public setVersion(version: PayMeSupportedVersions) {
		this.version = version;
		return this
	}

	/**
	 * Set the IBAN of the PayMe link
	 * @param {string} iban IBAN (Account Number)
	 * @returns {PayMeLink} The PayMeLink instance
	 */
	public setIBAN(iban: string) {
		if (!IBAN_REGEX.test(iban)) {
			throw new Error("Invalid IBAN format");
		}
		this.IBAN = iban;
		return this
	}

	/**
	 * Set the amount of the PayMe link
	 * @param {number} amount Amount
	 * @returns {PayMeLink} The PayMeLink instance
	 */
	public setAmount(amount: number) {
		if (amount < 0) {
			throw new Error("Amount must be a positive number");
		} else if (amount > 9999999) {
			throw new Error("Amount is too large, maximum amount is 9999999");
		}
		this.amount = amount;
		return this
	}

	/**
	 * Set the currency of the PayMe link
	 * @param {CurrencyCode} currency Currency Code
	 * @returns {PayMeLink} The PayMeLink instance
	 */
	public setCurrency(currency: CurrencyCode) {
		if (this.version === "1" && currency !== "EUR") {
			throw new Error("Invalid currency code for version 1");
		}
		this.currency = currency;
		return this
	}

	/**
	 * Set the due date of the PayMe link
	 * @param {string} dueDate Due Date
	 * @returns {PayMeLink} The PayMeLink instance
	 */
	public setDueDate(dueDate: string) {
		this.dueDate = new Date(dueDate);
		if (this.dueDate.toString() === "Invalid Date") {
			throw new Error("Invalid date format");
		}
		return this
	}

	/**
	 * Set the payment identifier of the PayMe link
	 * @param {string} paymentIdentifier Payment Identifier
	 * @returns {PayMeLink} The PayMeLink instance
	 */
	public setPaymentIdentifier(paymentIdentifier: string) {
		if (paymentIdentifier.length > 35) {
			throw new Error("Payment identifier is too long, maximum length is 35 characters");
		}
		this.paymentIdentifier = paymentIdentifier;
		return this
	}

	/**
	 * Set the message of the PayMe link
	 * @param {string} message Message for beneficiary
	 * @returns {PayMeLink} The PayMeLink instance
	 */
	public setMessage(message: string) {
		if (message.length > 140) {
			throw new Error("Message is too long, maximum length is 140 characters");
		}
		this.message = message;
		return this
	}

	/**
	 * Set the creditor name of the PayMe link
	 * @param {string} creditorName Creditor Name
	 * @returns {PayMeLink} The PayMeLink instance
	 */
	public setCreditorName(creditorName: string) {
		if (creditorName.length > 70) {
			throw new Error("Creditor name is too long, maximum length is 70 characters");
		}
		this.creditorName = creditorName;
		return this
	}

	/**
	 * Get the parameters for the PayMe link
	 * @returns {string} Returns the PayMe link as a string
	 */
	public getLink() {
		return this.toString();
	}

	/**
	 * Get the parameters for the PayMe link
	 * @returns {string} Returns the contents of Pay BySquare QR code
	 * @see https://bysquare.com/pay-by-square/
	 * @see https://www.npmjs.com/package/bysquare
	 */
	public getPayBySquare() {
		let [_symbol, variableSymbol, specificSymbol, constantSymbol] = 
			this.paymentIdentifier?.split("/").map(_value => _value.match(/\d/g)?.join("")) || 
			Array(4).fill("");

		return simplePayment({
			iban: this.IBAN,
			amount: this.amount,
			currencyCode: this.currency,
			variableSymbol,
			//@ts-ignore
			specificSymbol,
			constantSymbol,
			paymentNote: this.message,
		});
	}

	toString(): string {
		const queryString = new URLSearchParams({ ...this.params } as any).toString();
		return `https://payme.sk/?${queryString}`;
	}

	/**
	 * Converts a date string in the format YYYYMMDD to a Date object
	 * @param {string} date The date string in the format YYYYMMDD
	 * @returns {Date} The Date object
	 */
	private static dateConverterISO2JS(date: string): Date {
		const [_, year, month, day] = date.match(/(\d{4})(\d{2})(\d{2})/) || [];
		if (!year || !month || !day) {
			throw new Error("Invalid date format");
		}
		return new Date(`${year}-${month}-${day}`);
	}

}
