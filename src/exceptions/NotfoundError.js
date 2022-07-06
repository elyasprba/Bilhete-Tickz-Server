const ClientError = require("./ClientError");

class NotfoundError extends ClientError {
  constructor(message, statusCode) {
    super(message);
    this.name = "NotfoundError";
    this.statusCode = statusCode;
  }
}

module.exports = NotfoundError;
