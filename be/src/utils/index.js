/*
* Transform mongoose's queries to js object in format suitable for FE
* (remove _id, __v fields, and add id field)
* */
const transformToSendFormat = (dbResp) => {
    let v = dbResp;
    try {
        v = dbResp.toObject();
    } catch (e) {
        //console.log(e)
    }
    const newObj = {...v, id: dbResp._id};
    delete newObj._id;
    delete newObj.__v;
    return newObj;
};

module.exports = {
    transformToSendFormat
}