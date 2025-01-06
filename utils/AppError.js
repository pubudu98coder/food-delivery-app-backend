class AppError extends Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;

        //captue the stack trace
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;