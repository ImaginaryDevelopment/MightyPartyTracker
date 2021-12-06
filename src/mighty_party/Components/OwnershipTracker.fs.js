import { toString, Union, Record } from "../../fable_modules/fable-library.3.6.3/Types.js";
import { union_type, record_type, option_type, lambda_type, class_type, int32_type, unit_type } from "../../fable_modules/fable-library.3.6.3/Reflection.js";
import { TrackedHero, TrackedHero$reflection } from "../Schema.fs.js";
import { makeOwnedProp, heroes } from "../Hero.fs.js";
import { FSharpMap__get_Item, add, tryFind } from "../../fable_modules/fable-library.3.6.3/Map.js";
import { tryFind as tryFind_1 } from "../../fable_modules/fable-library.3.6.3/Seq.js";
import { printf, toConsoleError } from "../../fable_modules/fable-library.3.6.3/String.js";
import { Cmd_none } from "../../fable_modules/Fable.Elmish.3.1.0/cmd.fs.js";
import { map } from "../../fable_modules/fable-library.3.6.3/Array.js";
import { map as map_1, defaultArg } from "../../fable_modules/fable-library.3.6.3/Option.js";
import { createElement } from "react";
import { Interop_reactApi } from "../../fable_modules/Feliz.1.53.0/Interop.fs.js";

export class Props extends Record {
    constructor(GetOwned, SetOwned) {
        super();
        this.GetOwned = GetOwned;
        this.SetOwned = SetOwned;
    }
}

export function Props$reflection() {
    return record_type("App.MightyParty.Components.OwnershipTracker.Props", [], Props, () => [["GetOwned", lambda_type(unit_type, class_type("Microsoft.FSharp.Collections.FSharpMap`2", [int32_type, TrackedHero$reflection()]))], ["SetOwned", lambda_type(option_type(class_type("Microsoft.FSharp.Collections.FSharpMap`2", [int32_type, TrackedHero$reflection()])), unit_type)]]);
}

export class State extends Record {
    constructor(HeroesOwned) {
        super();
        this.HeroesOwned = HeroesOwned;
    }
}

export function State$reflection() {
    return record_type("App.MightyParty.Components.OwnershipTracker.State", [], State, () => [["HeroesOwned", class_type("Microsoft.FSharp.Collections.FSharpMap`2", [int32_type, TrackedHero$reflection()])]]);
}

export class Msg extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["OwnedClicked"];
    }
}

export function Msg$reflection() {
    return union_type("App.MightyParty.Components.OwnershipTracker.Msg", [], Msg, () => [[["Item", int32_type]]]);
}

export const OwnTracking_heroes = heroes;

export function OwnTracking_changeOwned(owned, i) {
    const matchValue = [tryFind(i, owned), tryFind_1((h) => (h.ID === i), OwnTracking_heroes)];
    if (matchValue[0] == null) {
        if (matchValue[1] == null) {
            toConsoleError(printf("Failed to find hero ID %i to changeOwned"))(i);
            return owned;
        }
        else {
            const h_1 = matchValue[1];
            return add(i, new TrackedHero(i, true, 1, 0, h_1.Name), owned);
        }
    }
    else {
        const x = matchValue[0];
        return add(i, new TrackedHero(x.ID, !FSharpMap__get_Item(owned, i).Owned, x.Level, x.BindLevel, x.Name), owned);
    }
}

export function OwnTracking_init(serializer) {
    const patternInput = makeOwnedProp(serializer);
    const setOwned = patternInput[1];
    const getOwned = patternInput[0];
    const owned = getOwned();
    const props = new Props(getOwned, setOwned);
    const state = new State(owned);
    return [props, state, Cmd_none()];
}

export function OwnTracking_update(props, state, msg) {
    const x = msg.fields[0] | 0;
    const nextOwned = OwnTracking_changeOwned(state.HeroesOwned, x);
    props.SetOwned(nextOwned);
    return [new State(nextOwned), Cmd_none()];
}

export function OwnTracking_view(_arg1, state, dispatch) {
    const findOwnStatus = (id) => {
        const result = tryFind(id, state.HeroesOwned);
        return result;
    };
    return map((hero) => {
        const ht = tryFind(hero.ID, state.HeroesOwned);
        const isOwned = defaultArg(map_1((ht_1) => ht_1.Owned, ht), false);
        return createElement("li", {
            onClick: (_arg1_1) => {
                dispatch(new Msg(0, hero.ID));
            },
            ["data-owned"]: toString(isOwned),
            children: Interop_reactApi.Children.toArray([createElement("input", {
                type: "checkbox",
                checked: isOwned,
            }), createElement("span", {
                children: hero.Name,
            })]),
        });
    }, OwnTracking_heroes);
}

