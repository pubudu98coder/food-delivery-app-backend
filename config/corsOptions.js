import alloweOrigins from "./allowedOrigins.js";

const corsOptions = {
    origin: (origin, callBack) => {
        if (alloweOrigins.indexOf(origin) !== -1 || !origin) {
            callBack(null, true);
        } else {
            callBack(new Error('Not allowebd by CORS'));
        }
    },
    optionSuccessStatus: 200,
}

export default corsOptions;