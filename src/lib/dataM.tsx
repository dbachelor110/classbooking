import users from "../data/users.json";
import bookingdata from "../data/booking.json";
import classdata from "../data/class.json";

const getBookingData = ()=>{
    return bookingdata;
};

const getUsersData = ()=>{
    return users;
};

const getClassdata = ()=>{
    return classdata;
}

export default {getBookingData, getUsersData, getClassdata};