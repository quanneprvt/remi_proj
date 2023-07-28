import { Response as ExpressResponse } from "express";
import { User } from "./models/user.model";
import { DocumentType } from "@typegoose/typegoose";

export class BaseClass {
  _id: string;
}

export interface Response extends ExpressResponse {
  locals: {
    user: DocumentType<User>;
  };
}

export enum Status {
  FAIL = "FAIL",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  TOKEN_INVALID = "TOKEN_INVALID",
}
