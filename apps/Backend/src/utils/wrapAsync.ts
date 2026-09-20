import { RequestHandler } from "express";

const wrapAsync = (handler: RequestHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};

export default wrapAsync;