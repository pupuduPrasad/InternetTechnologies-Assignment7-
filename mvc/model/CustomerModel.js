// model/CustomerModel.js
export default class CustomerModel {
    constructor(customerId, fullName, address, email, contactNumber) {
        this.customerId = customerId;
        this.fullName = fullName;
        this.address = address;
        this.email = email;
        this.contactNumber = contactNumber;
    }
}
