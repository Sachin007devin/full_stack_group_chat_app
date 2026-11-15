const sendResponse = (res,dataObj)=>{
const statusCode = dataObj.statusCode
    const message = dataObj.message
    const data = dataObj?.data
    const token = dataObj?.token
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        token
    })
}


const errorResponse = (res, err) => {
    const statusCode = err.statusCode
    const error = err.error
    const message = err.message
   return res.status(statusCode).json({
        success: false,
        message,
        error
    })
}

module.exports = {
    sendResponse,
    errorResponse
}