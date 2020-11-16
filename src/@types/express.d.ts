export {};

declare global {
  namespace Express {
    interface Request {
      auth: {
        /** dimigo user id */
        oid: number;
      };
    }
  }
}
