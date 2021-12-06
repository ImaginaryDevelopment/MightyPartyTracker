import { Union, Record } from "./fable_modules/fable-library.3.6.3/Types.js";
import { OwnTracking_view, OwnTracking_update, OwnTracking_init, Msg$reflection as Msg$reflection_1, State$reflection as State$reflection_1, Props$reflection } from "./mighty_party/Components/OwnershipTracker.fs.js";
import { union_type, record_type, tuple_type } from "./fable_modules/fable-library.3.6.3/Reflection.js";
import { Cmd_none, Cmd_map } from "./fable_modules/Fable.Elmish.3.1.0/cmd.fs.js";
import { delay, toList } from "./fable_modules/fable-library.3.6.3/Seq.js";
import { createElement } from "react";
import { Interop_reactApi } from "./fable_modules/Feliz.1.53.0/Interop.fs.js";
import { singleton } from "./fable_modules/fable-library.3.6.3/List.js";
import { JsSerialization_deserialize, JsSerialization_serialize } from "./JsHelpers.fs.js";
import { ProgramModule_mkProgram, ProgramModule_withConsoleTrace, ProgramModule_run } from "./fable_modules/Fable.Elmish.3.1.0/program.fs.js";
import { Program_withReactBatched } from "./fable_modules/Fable.Elmish.React.3.0.1/react.fs.js";

export class ChildState extends Record {
    constructor(OwnershipTrackerData) {
        super();
        this.OwnershipTrackerData = OwnershipTrackerData;
    }
}

export function ChildState$reflection() {
    return record_type("Program.ChildState", [], ChildState, () => [["OwnershipTrackerData", tuple_type(Props$reflection(), State$reflection_1())]]);
}

export class State extends Record {
    constructor(ChildState) {
        super();
        this.ChildState = ChildState;
    }
}

export function State$reflection() {
    return record_type("Program.State", [], State, () => [["ChildState", ChildState$reflection()]]);
}

export class ChildMsg extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["OwnershipTracker"];
    }
}

export function ChildMsg$reflection() {
    return union_type("Program.ChildMsg", [], ChildMsg, () => [[["Item", Msg$reflection_1()]]]);
}

export class Msg extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["ChildMsg"];
    }
}

export function Msg$reflection() {
    return union_type("Program.Msg", [], Msg, () => [[["Item", ChildMsg$reflection()]]]);
}

export function init(serializer) {
    const patternInput = OwnTracking_init(serializer);
    const props = patternInput[0];
    const ots = patternInput[1];
    const cmd = patternInput[2];
    const state = new State(new ChildState([props, ots]));
    return [state, Cmd_map((arg0) => (new Msg(0, arg0)), cmd)];
}

export function update(msg, state) {
    const msg_1 = msg.fields[0].fields[0];
    let patternInput;
    const tupledArg = state.ChildState.OwnershipTrackerData;
    patternInput = OwnTracking_update(tupledArg[0], tupledArg[1], msg_1);
    const next = patternInput[0];
    const cmd = patternInput[1];
    return [new State(new ChildState([state.ChildState.OwnershipTrackerData[0], next])), Cmd_none()];
}

export function render(state, dispatch) {
    let children_2, children;
    let lis;
    const tupledArg = state.ChildState.OwnershipTrackerData;
    lis = OwnTracking_view(tupledArg[0], tupledArg[1], (arg_1) => {
        dispatch(new Msg(0, new ChildMsg(0, arg_1)));
    });
    const children_4 = singleton((children_2 = singleton((children = toList(delay(() => lis)), createElement("ul", {
        children: Interop_reactApi.Children.toArray(Array.from(children)),
    }))), createElement("div", {
        children: Interop_reactApi.Children.toArray(Array.from(children_2)),
    })));
    return createElement("div", {
        children: Interop_reactApi.Children.toArray(Array.from(children_4)),
    });
}

export const s = {
    Serialize(x) {
        return JsSerialization_serialize(x);
    },
    Deserialize(x_1) {
        return JsSerialization_deserialize(x_1);
    },
};

ProgramModule_run(ProgramModule_withConsoleTrace(Program_withReactBatched("feliz-app", ProgramModule_mkProgram(() => init(s), (msg, state) => update(msg, state), (state_1, dispatch) => render(state_1, dispatch)))));

