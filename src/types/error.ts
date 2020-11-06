interface IError extends Error {
  type?: string;
  status?: number;
  data?: any;
}
