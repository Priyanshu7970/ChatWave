
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    console.error(err.stack); 
    console.error(`Error: ${err.message}`); // Log the error message

    res.status(statusCode).json({
        message: err.message, 
        stack: process.env.NODE_ENV === 'development' ? err.stack : null,
    });
};

export default errorHandler;