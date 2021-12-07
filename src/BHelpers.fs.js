import { isNullOrWhiteSpace } from "./fable_modules/fable-library.3.6.3/String.js";

export function $007CValueString$007C_$007C(_arg1) {
    if (_arg1 === null) {
        return void 0;
    }
    else if (_arg1 === "") {
        return void 0;
    }
    else if (isNullOrWhiteSpace(_arg1)) {
        return void 0;
    }
    else {
        return _arg1;
    }
}

