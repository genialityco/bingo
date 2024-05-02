function sendResponse(res, statusCode, data, message) {
  let statusMessage;
  switch (statusCode) {
    case 200:
      statusMessage = "Success";
      break;
    case 400:
      statusMessage = "Bad Request";
      break;
    case 404:
      statusMessage = "Not Found";
      break;
    case 500:
      statusMessage = "Internal Server Error";
      break;
    default:
      statusMessage = "Unknown Status";
  }

  res.status(statusCode).json({
    status: statusMessage,
    data: data,
    message: message || statusMessage,
  });
}

export default sendResponse;
