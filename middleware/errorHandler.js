import AppError from "../utils/AppError.js";

export const errorHandler = (error, req, res, next) => {
    if (error.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            type:"ValidationError",
            details: error.details,
        })
    }

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message
        });
    }

    return res.status(500).json({
        success:false,
        message:"Internal server error"
    })
    
    // const statusCode = error.statusCode || 500;
    // const message = error.message || "Internal server error";

    // console.error('Error: ', err.message);

    // res.status(statusCode).json({
    //     success: false,
    //     message,
    //     ...(process.env.NODE_ENV === 'development' && {stack:err.stack}),
    // });
}