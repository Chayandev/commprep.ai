//using promises
const asyncHandelr = (requestHandler) => {
    return (req, res, next) => {
      Promise.resolve(requestHandler(req, res, next)).catch((error) =>
        next(error),
      );
    };
  };
  
  export { asyncHandelr };