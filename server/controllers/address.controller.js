import AddressModel from "../models/address.model";

export const addAddressController = async (request, response)=>{
    const {address_line, city, state, pin_code, country, mobile, status, userId}= request.body

}