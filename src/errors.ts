/**
 * Custom error hierarchy for akshare-cb
 */
export class AkshareError extends Error {
  readonly code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = "AkshareError";
    this.code = code;
  }
}

export class NetworkError extends AkshareError {
  readonly statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message, "NETWORK_ERROR");
    this.name = "NetworkError";
    this.statusCode = statusCode;
  }
}

export class ParseError extends AkshareError {
  readonly raw?: string;

  constructor(message: string, raw?: string) {
    super(message, "PARSE_ERROR");
    this.name = "ParseError";
    this.raw = raw;
  }
}

export class ValidationError extends AkshareError {
  readonly field: string;

  constructor(message: string, field: string) {
    super(message, "VALIDATION_ERROR");
    this.name = "ValidationError";
    this.field = field;
  }
}

export class AuthenticationError extends AkshareError {
  constructor(message: string) {
    super(message, "AUTH_ERROR");
    this.name = "AuthenticationError";
  }
}
