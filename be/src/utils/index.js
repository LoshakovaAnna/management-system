/*
* Transform mongoose's queries to js object in format suitable for FE
* (remove _id, __v fields, and add id field)
* */
const transformToSendFormat = (employeeDB) => {
    const newObj = {...employeeDB.toObject(), id: employeeDB._id} ;
    delete newObj._id;
    delete newObj.__v;
    return newObj;
};

module.exports =   {
    transformToSendFormat
}