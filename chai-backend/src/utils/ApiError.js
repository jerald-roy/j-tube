class ApiError extends Error {
    constructor(
        statusCode,
        message= "Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors

        if (stack) {
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor) //this.constructor tell us that who is building the current object in this case it is ApiError
        }
        /*
        STACK - STACKTRACE
        ok when the error is throw it stop at a point where the error actually occured or the program actually stopped and not moving this is the first row in the stack that can seen above or first but actually this is our custom error class only because that is what abled to throw this error and thats the last thing that was executed so we dont want things actually this is of no use we want to show thing at first from where the error started to exit and the program stopped and by default Error class was internally doing that but since we are creating the child we make sure we inherit this property i should say if we dont pass our own stack and we do this using Error.captureStackTrace(this , this.constructor) the first value point out to the instace start from there instead of the second value that is this particular class itself we dont want this particular class to be added
        */

    }
}

export {ApiError}