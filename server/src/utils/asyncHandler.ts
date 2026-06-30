import type { NextFunction, Request, Response } from "express";
import type { ParamsDictionary, Query } from "express-serve-static-core";

type AsyncController<
  Params extends ParamsDictionary = ParamsDictionary,
  ResponseBody = unknown,
  RequestBody = unknown,
  RequestQuery extends Query = Query,
> = (
  req: Request<Params, ResponseBody, RequestBody, RequestQuery>,
  res: Response<ResponseBody>,
  next: NextFunction,
) => Promise<unknown>;

export const asyncHandler = <
  Params extends ParamsDictionary = ParamsDictionary,
  ResponseBody = unknown,
  RequestBody = unknown,
  RequestQuery extends Query = Query,
>(
  handler: AsyncController<Params, ResponseBody, RequestBody, RequestQuery>,
) => {
  return (
    req: Request<Params, ResponseBody, RequestBody, RequestQuery>,
    res: Response<ResponseBody>,
    next: NextFunction,
  ) => {
    void handler(req, res, next).catch(next);
  };
};
