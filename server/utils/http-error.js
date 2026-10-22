// 统一的 HTTP 错误：service 层只管抛，controller 不用 try/catch，最后交给 errorHandler
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

export const badRequest = (msg) => new HttpError(400, msg);
export const notFound = (msg) => new HttpError(404, msg);
export const conflict = (msg) => new HttpError(409, msg);
export const tooLarge = (msg) => new HttpError(413, msg);
