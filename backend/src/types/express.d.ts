import { TokenPayload } from "./auth.types";

declare global {
  namespace Express {
    export interface Request {
      user?: TokenPayload;
    }
  }
}
