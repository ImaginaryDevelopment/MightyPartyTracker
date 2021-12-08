import { Union, Record } from "./fable_modules/fable-library.3.6.3/Types.js";
import { list_type, float64_type, array_type, obj_type, union_type, record_type, string_type } from "./fable_modules/fable-library.3.6.3/Reflection.js";
import { Object_getItem } from "./JsHelpers.fs.js";
import { createObj, partialApply, uncurry, equals } from "./fable_modules/fable-library.3.6.3/Util.js";
import { singleton, append, delay, toList, tryHead, map, toArray } from "./fable_modules/fable-library.3.6.3/Seq.js";
import { toFail, toText, join, printf, toConsole } from "./fable_modules/fable-library.3.6.3/String.js";
import { bind, value as value_11, map as map_1, defaultArg, some } from "./fable_modules/fable-library.3.6.3/Option.js";
import { singleton as singleton_1, map as map_2, isEmpty, empty, ofSeq } from "./fable_modules/fable-library.3.6.3/List.js";
import { $007CValueString$007C_$007C, pascal } from "./BHelpers.fs.js";
import { Cmd_none } from "./fable_modules/Fable.Elmish.3.1.0/cmd.fs.js";
import { FSharpResult$2 } from "./fable_modules/fable-library.3.6.3/Choice.js";
import { createElement } from "react";
import { Interop_reactApi } from "./fable_modules/Feliz.1.53.0/Interop.fs.js";

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

export function Reflection_getKeyValue(o, k) {
    return Object_getItem(k, o);
}

export function Reflection_getType(x) {
    let tupledArg;
    if (equals(x, null)) {
        return void 0;
    }
    else {
        return Array.isArray(x) ? (new Reflection_MappedType(0, x)) : (equals(x, string_type) ? (new Reflection_MappedType(2, x)) : (((typeof x) === "string") ? (new Reflection_MappedType(2, x)) : (((typeof x) === "number") ? (new Reflection_MappedType(3, x)) : (((typeof x) === "number") ? (new Reflection_MappedType(3, x)) : ((tupledArg = [x, toArray(Object.keys(x))], new Reflection_MappedType(1, tupledArg[0], tupledArg[1])))))));
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
                    const kt = Reflection_getKeyValue(o, k);
                    const value_1 = Object_getItem(k, o);
                    const arg30 = JSON.stringify(value_1, uncurry(2, null), some(2));
                    toConsole(printf("Value of %s[%A] = %s"))(k)(value_1)(arg30);
                    const kt_1 = Reflection_getType(value_1);
                    toConsole(printf("Found prop %s has type %A"))(k)(kt_1);
                    return defaultArg((option_4 = map_1(gen, kt_1), map_1((clo2_2 = toText(printf("%s: %s"))(k), (arg20_2) => clo2_2(arg20_2)), option_4)), toText(printf("%s:obj"))(k));
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
                const _arg1 = tryHead(x_1.fields[0]);
                if (_arg1 == null) {
                    return "obj[]";
                }
                else {
                    return defaultArg((option_1 = map_1(gen, Reflection_getType(value_11(_arg1))), map_1((clo1_1 = toText(printf("%s[]")), (arg10_1) => clo1_1(arg10_1)), option_1)), "obj[]");
                }
            }
        }
    };
    return gen(x);
}

export class Reflection_GenResult extends Record {
    constructor(Name, Types, TypeName) {
        super();
        this.Name = Name;
        this.Types = Types;
        this.TypeName = TypeName;
    }
}

export function Reflection_GenResult$reflection() {
    return record_type("App.JsonGen.Reflection.GenResult", [], Reflection_GenResult, () => [["Name", string_type], ["Types", list_type(Reflection_GenResult$reflection())], ["TypeName", string_type]]);
}

export const Reflection_generateFs2 = (() => {
    const gen = (name, x) => {
        switch (x.tag) {
            case 1: {
                toConsole(printf("Object %s"))(name);
                return new Reflection_GenResult(name, ofSeq(map((k) => {
                    let option_4;
                    const value_1 = new Reflection_GenResult(k, empty(), "obj");
                    return defaultArg((option_4 = bind((x_3) => Reflection_getType(x_3), Reflection_getKeyValue(x.fields[0], k)), map_1(partialApply(1, gen, [k]), option_4)), value_1);
                }, x.fields[1])), pascal(name));
            }
            case 3: {
                return new Reflection_GenResult(name, empty(), "float");
            }
            case 2: {
                return new Reflection_GenResult(name, empty(), "string");
            }
            default: {
                toConsole(printf("Arr:%s"))(name);
                const value = new Reflection_GenResult(name, empty(), "obj[]");
                return defaultArg(map_1((arg) => {
                    const x_2 = gen(name, arg);
                    return new Reflection_GenResult(x_2.Name, x_2.Types, toText(printf("%s[]"))(x_2.TypeName));
                }, bind((x_1) => Reflection_getType(x_1), tryHead(x.fields[0]))), value);
            }
        }
    };
    return (x_4) => gen("Foo", x_4);
})();

export function Reflection_mapResult(_arg1) {
    const t = _arg1.Types;
    if (isEmpty(t)) {
        return "";
    }
    else {
        return join("\r\n", toList(delay(() => append(map_2((arg00$0040) => Reflection_mapResult(arg00$0040), t), delay(() => append(singleton(toText(printf("type %s = {"))(_arg1.Name)), delay(() => append(singleton(join("\r\n", map_2((x) => toText(printf("\t%s: %s"))(x.Name)(x.TypeName), t))), delay(() => singleton("}"))))))))));
    }
}

export function init() {
    return [new State(null), Cmd_none()];
}

export function update(msg, state) {
    return [new State(msg.fields[0]), Cmd_none()];
}

export function generate(text) {
    let x;
    try {
        return new FSharpResult$2(0, (x = text, (() => {
            try {
                return JSON.parse(x);
            }
            catch (ex) {
                const arg10 = ex.message;
                return toFail(printf("Failed to deserialize: \u0027%s\u0027 from \u0027%s\u0027"))(arg10)(x);
            }
        })()));
    }
    catch (ex_1) {
        return new FSharpResult$2(1, ex_1.message);
    }
}

export function generateView(f, oOpt) {
    let _arg1;
    return createElement("pre", createObj(singleton_1((_arg1 = oOpt, (_arg1.tag === 1) ? ["children", _arg1.fields[0]] : (equals(_arg1.fields[0], null) ? ["children", null] : ["children", defaultArg(map_1(f, Reflection_getType(_arg1.fields[0])), "?")])))));
}

export function view(state, dispatch) {
    return createElement("div", {
        children: Interop_reactApi.Children.toArray([createElement("h1", {
            children: ["Json Jen"],
        }), createElement("div", {
            children: Interop_reactApi.Children.toArray(Array.from(toList(delay(() => append(singleton(createElement("textarea", {
                defaultValue: state.Text,
                style: {
                    minHeight: 100,
                    minWidth: 200,
                },
                onChange: (ev) => {
                    dispatch(new Msg(0, ev.target.value));
                },
            })), delay(() => {
                let activePatternResult11160, x;
                const oOpt = (activePatternResult11160 = $007CValueString$007C_$007C(state.Text), (activePatternResult11160 != null) ? ((x = activePatternResult11160, generate(x))) : (new FSharpResult$2(0, null)));
                return append(singleton(generateView((arg_2) => {
                    let x_1, arg10;
                    return Reflection_mapResult((x_1 = Reflection_generateFs2(arg_2), ((arg10 = JSON.stringify(x_1, uncurry(2, null), some(2)), toConsole(printf("Generated as %s"))(arg10)), x_1)));
                }, oOpt)), delay(() => append(singleton(createElement("br", {})), delay(() => singleton(generateView((x_3) => Reflection_generateFs(x_3), oOpt))))));
            })))))),
        })]),
    });
}

