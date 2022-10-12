class AuthorizationError extends Error {
  constructor(status, message) {
    super();
    this.name = 'AuthorizationError';
    this.status = status;
    this.message = message;
  }
}

class InternalServerError extends Error {
  constructor(status, message) {
    super();
    this.name = 'InternalServerError';
    this.status = status;
    this.message = message;
  }
}

class ValidationError extends Error {
  constructor(status, message) {
    super();
    this.name = 'ValidationError';
    this.status = status;
    this.message = message;
  }
}

class ForbiddenError extends Error {
  constructor(status, message) {
    super();
    this.name = 'ForbiddenError';
    this.status = status;
    this.message = message;
  }
}

export {
  AuthorizationError,
  InternalServerError,
  ValidationError,
  ForbiddenError
}
