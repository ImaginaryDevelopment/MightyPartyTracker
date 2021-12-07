import { Union, Record } from "./fable_modules/fable-library.3.6.3/Types.js";
import { float64_type, array_type, obj_type, union_type, record_type, string_type } from "./fable_modules/fable-library.3.6.3/Reflection.js";
import { createObj, equals } from "./fable_modules/fable-library.3.6.3/Util.js";
import { tryHead, map, toArray } from "./fable_modules/fable-library.3.6.3/Seq.js";
import { toFail, toText, join, printf, toConsole } from "./fable_modules/fable-library.3.6.3/String.js";
import { Object_getItem } from "./JsHelpers.fs.js";
import { value as value_18, map as map_1, defaultArg } from "./fable_modules/fable-library.3.6.3/Option.js";
import { Cmd_none } from "./fable_modules/Fable.Elmish.3.1.0/cmd.fs.js";
import { FSharpResult$2 } from "./fable_modules/fable-library.3.6.3/Choice.js";
import { createElement } from "react";
import { Interop_reactApi } from "./fable_modules/Feliz.1.53.0/Interop.fs.js";
import { $007CValueString$007C_$007C } from "./BHelpers.fs.js";
import { singleton } from "./fable_modules/fable-library.3.6.3/List.js";

export class State extends Record {
    constructor(Text$) {
        super();
        this.Text = Text$;
    }
}

export function State$reflection() {
    return record_type("App.JsonGen.State", [], State, () => [["Text", string_type]]);
}

export class Msg extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["Textchange"];
    }
}

export function Msg$reflection() {
    return union_type("App.JsonGen.Msg", [], Msg, () => [[["Item", string_type]]]);
}

export class Reflection_MappedType extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["Arr", "Obj", "Str", "Num"];
    }
}

export function Reflection_MappedType$reflection() {
    return union_type("App.JsonGen.Reflection.MappedType", [], Reflection_MappedType, () => [[["Item", array_type(obj_type)]], [["Item1", obj_type], ["Item2", array_type(string_type)]], [["Item", string_type]], [["Item", float64_type]]]);
}

export function Reflection_getType(x) {
    let s, i, f, tupledArg;
    if (equals(x, null)) {
        return void 0;
    }
    else {
        return Array.isArray(x) ? (new Reflection_MappedType(0, x)) : (equals(x, string_type) ? (new Reflection_MappedType(2, x)) : (((typeof x) === "string") ? ((s = x, new Reflection_MappedType(2, s))) : (((typeof x) === "number") ? ((i = x, new Reflection_MappedType(3, i))) : (((typeof x) === "number") ? ((f = x, new Reflection_MappedType(3, f))) : ((tupledArg = [x, toArray(Object.keys(x))], new Reflection_MappedType(1, tupledArg[0], tupledArg[1])))))));
    }
}

export function Reflection_generateFs(x) {
    const gen = (x_1) => {
        let option_1, clo1_1;
        toConsole(printf("Genning %A"))(x_1);
        switch (x_1.tag) {
            case 1: {
                const o = x_1.fields[0];
                const keys = x_1.fields[1];
                toConsole(printf("Getting keys"));
                toConsole(printf("Keys are %A"))(keys);
                const arg10_7 = join("\r\n", map((k) => {
                    let option_4, clo2_2;
                    const value_1 = Object_getItem(k, o);
                    const arg30 = JSON.stringify(value_1);
                    toConsole(printf("Value of %s[%A] = %s"))(k)(value_1)(arg30);
                    const kt = Reflection_getType(value_1);
                    toConsole(printf("Found prop %s has type %A"))(k)(kt);
                    return defaultArg((option_4 = map_1(gen, kt), map_1((clo2_2 = toText(printf("%s: %s"))(k), (arg20_2) => clo2_2(arg20_2)), option_4)), toText(printf("%s:obj"))(k));
                }, keys));
                return toText(printf("{ %s }"))(arg10_7);
            }
            case 3: {
                return "float";
            }
            case 2: {
                return "string";
            }
            default: {
                const items = x_1.fields[0];
                const _arg1 = tryHead(items);
                if (_arg1 == null) {
                    return "obj[]";
                }
                else {
                    const h = value_18(_arg1);
                    return defaultArg((option_1 = map_1(gen, Reflection_getType(h)), map_1((clo1_1 = toText(printf("%s[]")), (arg10_1) => clo1_1(arg10_1)), option_1)), "obj[]");
                }
            }
        }
    };
    return gen(x);
}

export function init() {
    return [new State(null), Cmd_none()];
}

export function update(msg, state) {
    const x = msg.fields[0];
    return [new State(x), Cmd_none()];
}

export function generate(text) {
    let x;
    try {
        return new FSharpResult$2(0, (x = text, (() => {
            try {
                return JSON.parse(x);
            }
            catch (ex) {
                const arg20 = ex.message;
                return toFail(printf("Failed to deserialize: %s (\u0027%s\u0027) from \u0027%s\u0027"))("Object")(arg20)(x);
            }
        })()));
    }
    catch (ex_1) {
        return new FSharpResult$2(1, ex_1.message);
    }
}

export function view(state, dispatch) {
    let _arg1, activePatternResult25784, x, msg, x_1;
    return createElement("div", {
        children: Interop_reactApi.Children.toArray([createElement("h1", {
            children: ["Json Jen"],
        }), createElement("div", {
            children: Interop_reactApi.Children.toArray([createElement("textarea", {
                defaultValue: state.Text,
                style: {
                    minHeight: 100,
                    minWidth: 200,
                },
                onChange: (ev) => {
                    dispatch(new Msg(0, ev.target.value));
                },
            }), createElement("div", createObj(singleton((_arg1 = ((activePatternResult25784 = $007CValueString$007C_$007C(state.Text), (activePatternResult25784 != null) ? ((x = activePatternResult25784, generate(x))) : (new FSharpResult$2(0, null)))), (_arg1.tag === 1) ? ((msg = _arg1.fields[0], ["children", msg])) : (equals(_arg1.fields[0], null) ? ["children", null] : ((x_1 = _arg1.fields[0], ["children", defaultArg(map_1((x_2) => Reflection_generateFs(x_2), Reflection_getType(x_1)), "?")])))))))]),
        })]),
    });
}

