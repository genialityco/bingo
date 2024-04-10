function sendResponse(res, statusCode, data, message) {
    res.status(statusCode).json({
      status: "success",
      data: data,
      message: message,
    });
  }
  
  export default sendResponse;
  