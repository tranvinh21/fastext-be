import { type TokenPayload } from "../service/auth";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}
