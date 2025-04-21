# payme-generate

A generator of payme.sk payment links

```javascript
let fromUrl = new PayMeLink("https://payme.sk/?V=1&IBAN=SK9181800000007000155733&AM=0.01&CC=EUR&DT=20250421&PI=%2FVS0123456789%2FSS0123456789%2FKS1234&MSG=DO+NOT+SEND+ANY+MONEY+HERE")

let fromParsedParams = new PayMeLink({
	V: '1',
	IBAN: 'SK9181800000007000155733',
	AM: 0.01,
	CC: 'EUR',
	DT: '2025-04-21',
	PI: '/VS0123456789/SS0123456789/KS1234',
	MSG: 'DO NOT SEND ANY MONEY HERE',
	CN: null
})

let empty = new PayMeLink()
console.log(empty.setIBAN('SK9181800000007000155733').setAmount(0.01).setMessage('DO NOT SEND ANY MONEY HERE').getLink())
```

For full documentation of the format, please refer to: https://www.payme.sk/docs/PaymentLinkStandard_v1_2.pdf

> [!WARNING]
> Really don't send any money to this bank account (`SK9181800000007000155733`)
> This bank account is only used as a preview. Please replace with your own Bank Account

## Documentation

### Constructor Overloads
1. **`constructor(input: PayMeParams)`**
   - Creates a `PayMeLink` instance from an object containing the link parameters.
   - **Parameters**:
     - `input` *(PayMeParams)*: Object containing the payment parameters.
   - **Example**:
     ```typescript
     const payMeLink = new PayMeLink({
       V: "1",
       IBAN: "SK9181800000007000155733",
       AM: 100,
       CC: "EUR",
     });
     ```

2. **`constructor(input: string | URL)`**
   - Creates a `PayMeLink` instance from a URL string or `URL` object.
   - **Parameters**:
     - `input` *(string | URL)*: URL containing the payment parameters.
   - **Example**:
     ```typescript
     const payMeLink = new PayMeLink("https://payme.sk/?V=1&IBAN=SK9181800000007000155733&AM=100&CC=EUR");
     ```

3. **`constructor()`**
   - Creates a clean `PayMeLink` instance with default values.
   - **Example**:
     ```typescript
     const payMeLink = new PayMeLink();
     ```


### Methods

1. **`get params(): PayMeParams`**
   - Retrieves the current parameters of the `PayMeLink` instance.
   - **Returns**:
     - *(PayMeParams)*: Object containing the payment parameters.
   - **Example**:
     ```typescript
     const params = payMeLink.params;
     ```

2. **`setVersion(version: PayMeSupportedVersions): PayMeLink`**
   - Sets the version of the PayMe link.
   - **Parameters**:
     - `version` *(PayMeSupportedVersions)*: The version to set.
   - **Returns**:
     - *(PayMeLink)*: The updated `PayMeLink` instance.
   - **Example**:
     ```typescript
     payMeLink.setVersion("1");
     ```

3. **`setIBAN(iban: string): PayMeLink`**
   - Sets the IBAN (account number) for the PayMe link.
   - **Parameters**:
     - `iban` *(string)*: The IBAN to set.
   - **Returns**:
     - *(PayMeLink)*: The updated `PayMeLink` instance.
   - **Example**:
     ```typescript
     payMeLink.setIBAN("SK9181800000007000155733");
     ```

4. **`setAmount(amount: number): PayMeLink`**
   - Sets the amount for the PayMe link.
   - **Parameters**:
     - `amount` *(number)*: The amount to set (must be positive and less than 9,999,999).
   - **Returns**:
     - *(PayMeLink)*: The updated `PayMeLink` instance.
   - **Example**:
     ```typescript
     payMeLink.setAmount(100);
     ```

5. **`setCurrency(currency: CurrencyCode): PayMeLink`**
   - Sets the currency for the PayMe link.
   - **Parameters**:
     - `currency` *(CurrencyCode)*: The currency code to set.
   - **Returns**:
     - *(PayMeLink)*: The updated `PayMeLink` instance.
   - **Example**:
     ```typescript
     payMeLink.setCurrency("EUR");
     ```

6. **`setDueDate(dueDate: string): PayMeLink`**
   - Sets the due date for the PayMe link.
   - **Parameters**:
     - `dueDate` *(string)*: The due date in ISO format (e.g., "2025-04-21").
   - **Returns**:
     - *(PayMeLink)*: The updated `PayMeLink` instance.
   - **Example**:
     ```typescript
     payMeLink.setDueDate("2025-04-21");
     ```

7. **`setPaymentIdentifier(paymentIdentifier: string): PayMeLink`**
   - Sets the payment identifier for the PayMe link.
   - **Parameters**:
     - `paymentIdentifier` *(string)*: The payment identifier (max 35 characters).
   - **Returns**:
     - *(PayMeLink)*: The updated `PayMeLink` instance.
   - **Example**:
     ```typescript
     payMeLink.setPaymentIdentifier("/VS12345/SS67890/KS1234");
     ```

8. **`setMessage(message: string): PayMeLink`**
   - Sets the message for the PayMe link.
   - **Parameters**:
     - `message` *(string)*: The message for the beneficiary (max 140 characters).
   - **Returns**:
     - *(PayMeLink)*: The updated `PayMeLink` instance.
   - **Example**:
     ```typescript
     payMeLink.setMessage("Payment for invoice #123");
     ```

9. **`setCreditorName(creditorName: string): PayMeLink`**
   - Sets the creditor name for the PayMe link.
   - **Parameters**:
     - `creditorName` *(string)*: The creditor name (max 70 characters).
   - **Returns**:
     - *(PayMeLink)*: The updated `PayMeLink` instance.
   - **Example**:
     ```typescript
     payMeLink.setCreditorName("John Doe");
     ```

10. **`getLink(): string`**
    - Generates the PayMe link as a URL string.
    - **Returns**:
      - *(string)*: The PayMe link URL.
    - **Example**:
      ```typescript
      const link = payMeLink.getLink();
      ```

11. **`getPayBySquare(): string`**
    - Generates the contents of a Pay BySquare QR code.
    - **Returns**:
      - *(string)*: The QR code content.
    - **Example**:
      ```typescript
      const qrCodeContent = payMeLink.getPayBySquare();
      ```

12. **`toString(): string`**
    - Converts the `PayMeLink` instance to a URL string.
    - **Returns**:
      - *(string)*: The PayMe link URL.
    - **Example**:
      ```typescript
      const linkString = payMeLink.toString();
     ```

