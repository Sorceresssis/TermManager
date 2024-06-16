class Result {
    code: number;
    message: string;
    data?: any;

    constructor(code: number, message: string, data?: any) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    static success(data?: any) {
        return new Result(0, 'success', data);
    }

    static fail(code: number, message: string) {
        return new Result(code, message);
    }

    static failWithMessage(message: string) {
        return new Result(1, message);
    }
}



export default Result;