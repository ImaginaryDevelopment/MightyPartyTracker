import { Union, Record } from "./fable_modules/fable-library.3.6.3/Types.js";
import { OwnTracking_view, OwnTracking_update, OwnTracking_init, Msg$reflection as Msg$reflection_1, State$reflection as State$reflection_1, Props$reflection } from "./mighty_party/Components/OwnershipTracker.fs.js";
import { union_type, record_type, tuple_type } from "./fable_modules/fable-library.3.6.3/Reflection.js";
import { view, update as update_1, init as init_1, Msg$reflection as Msg$reflection_2, State$reflection as State$reflection_2 } from "./JsonGen.fs.js";
import { Cmd_none, Cmd_map } from "./fable_modules/Fable.Elmish.3.1.0/cmd.fs.js";
import { ofArray, append } from "./fable_modules/fable-library.3.6.3/List.js";
import { createElement } from "react";
import { Interop_reactApi } from "./fable_modules/Feliz.1.53.0/Interop.fs.js";
import { singleton, delay, toList } from "./fable_modules/fable-library.3.6.3/Seq.js";
import { printf, toFail } from "./fable_modules/fable-library.3.6.3/String.js";
import { ProgramModule_mkProgram, ProgramModule_withConsoleTrace, ProgramModule_run } from "./fable_modules/Fable.Elmish.3.1.0/program.fs.js";
import { Program_withReactBatched } from "./fable_modules/Fable.Elmish.React.3.0.1/react.fs.js";

export class ChildState extends Record {
    constructor(OwnershipTrackerData, JsonJenData) {
        super();
        this.OwnershipTrackerData = OwnershipTrackerData;
        this.JsonJenData = JsonJenData;
    }
}

export function ChildState$reflection() {
    return record_type("Program.ChildState", [], ChildState, () => [["OwnershipTrackerData", tuple_type(Props$reflection(), State$reflection_1())], ["JsonJenData", State$reflection_2()]]);
}

export class ChildPage extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["OwnTracker", "JsonJen"];
    }
}

export function ChildPage$reflection() {
    return union_type("Program.ChildPage", [], ChildPage, () => [[], []]);
}

export class State extends Record {
    constructor(ChildState, ChildPage) {
        super();
        this.ChildState = ChildState;
        this.ChildPage = ChildPage;
    }
}

export function State$reflection() {
    return record_type("Program.State", [], State, () => [["ChildState", ChildState$reflection()], ["ChildPage", ChildPage$reflection()]]);
}

export class ChildMsg extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["OwnershipTracker", "JsonJenMsg"];
    }
}

export function ChildMsg$reflection() {
    return union_type("Program.ChildMsg", [], ChildMsg, () => [[["Item", Msg$reflection_1()]], [["Item", Msg$reflection_2()]]]);
}

export class Msg extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["ChildMsg", "PageChange"];
    }
}

export function Msg$reflection() {
    return union_type("Program.Msg", [], Msg, () => [[["Item", ChildMsg$reflection()]], [["Item", ChildPage$reflection()]]]);
}

export function init(serializer) {
    const patternInput = OwnTracking_init(serializer);
    const cmd_2 = Cmd_map((arg) => (new Msg(0, new ChildMsg(0, arg))), patternInput[2]);
    const patternInput_1 = init_1();
    return [new State(new ChildState([patternInput[0], patternInput[1]], patternInput_1[0]), new ChildPage(0)), append(cmd_2, Cmd_map((arg_1) => (new Msg(0, new ChildMsg(1, arg_1))), patternInput_1[1]))];
}

export function update(msg, state) {
    if (msg.tag === 1) {
        return [new State(state.ChildState, msg.fields[0]), Cmd_none()];
    }
    else if (msg.fields[0].tag === 1) {
        const patternInput_1 = update_1(msg.fields[0].fields[0], state.ChildState.JsonJenData);
        return [new State(new ChildState(state.ChildState.OwnershipTrackerData, patternInput_1[0]), state.ChildPage), Cmd_map((arg_1) => (new Msg(0, new ChildMsg(1, arg_1))), patternInput_1[1])];
    }
    else {
        let patternInput;
        const tupledArg = state.ChildState.OwnershipTrackerData;
        patternInput = OwnTracking_update(tupledArg[0], tupledArg[1], msg.fields[0].fields[0]);
        return [new State(new ChildState([state.ChildState.OwnershipTrackerData[0], patternInput[0]], state.ChildState.JsonJenData), state.ChildPage), Cmd_map((arg) => (new Msg(0, new ChildMsg(0, arg))), patternInput[1])];
    }
}

export function render(state, dispatch) {
    let children_2;
    const children_4 = ofArray([createElement("nav", {
        className: "navbar",
        children: Interop_reactApi.Children.toArray([createElement("div", {
            className: "navbar-menu",
            children: Interop_reactApi.Children.toArray([createElement("div", {
                className: "navbar-start",
                children: Interop_reactApi.Children.toArray([createElement("a", {
                    className: "navbar-item",
                    children: "MightyTracker",
                    onClick: (_arg1) => {
                        dispatch(new Msg(1, new ChildPage(0)));
                    },
                }), createElement("a", {
                    className: "navbar-item",
                    children: "Json-Jen",
                    onClick: (_arg2) => {
                        dispatch(new Msg(1, new ChildPage(1)));
                    },
                })]),
            })]),
        })]),
    }), (children_2 = toList(delay(() => {
        let children;
        if (state.ChildPage.tag === 1) {
            return singleton(view(state.ChildState.JsonJenData, (arg_3) => {
                dispatch(new Msg(0, new ChildMsg(1, arg_3)));
            }));
        }
        else {
            let lis;
            const tupledArg = state.ChildState.OwnershipTrackerData;
            lis = OwnTracking_view(tupledArg[0], tupledArg[1], (arg_1) => {
                dispatch(new Msg(0, new ChildMsg(0, arg_1)));
            });
            return singleton((children = toList(delay(() => lis)), createElement("ul", {
                children: Interop_reactApi.Children.toArray(Array.from(children)),
            })));
        }
    })), createElement("div", {
        children: Interop_reactApi.Children.toArray(Array.from(children_2)),
    }))]);
    return createElement("div", {
        children: Interop_reactApi.Children.toArray(Array.from(children_4)),
    });
}

export const s = {
    Serialize(x) {
        return JSON.stringify(x);
    },
    Deserialize(x_2) {
        const x_3 = x_2;
        try {
            return JSON.parse(x_3);
        }
        catch (ex) {
            const arg10 = ex.message;
            return toFail(printf("Failed to deserialize: \u0027%s\u0027 from \u0027%s\u0027"))(arg10)(x_3);
        }
    },
};

ProgramModule_run(ProgramModule_withConsoleTrace(Program_withReactBatched("feliz-app", ProgramModule_mkProgram(() => init(s), (msg, state) => update(msg, state), (state_1, dispatch) => render(state_1, dispatch)))));

