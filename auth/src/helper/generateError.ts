export const generateError = (statusCode: number, message: string) => {
  return {
    statusCode,
    message,
  };
};
