const ClientError = require("./ClientError");

class NotfoundError extends ClientError {
  constructor(message) {
    super(message);
    this.name = "NotfoundError";
    this.statusCode = 404;
  }
}

module.exports = NotfoundError;
