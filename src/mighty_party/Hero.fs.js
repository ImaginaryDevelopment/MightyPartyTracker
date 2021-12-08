import mightypartyheroes from "./mightypartyheroes.json?module";
import { map, sortBy } from "../fable_modules/fable-library.3.6.3/Array.js";
import { TrackedHero_Clone_3D5B87CD, Hero_Clone_2B7B77A3 } from "./Schema.fs.js";
import { comparePrimitives } from "../fable_modules/fable-library.3.6.3/Util.js";
import { toSeq, empty, ofSeq } from "../fable_modules/fable-library.3.6.3/Map.js";
import { map as map_1 } from "../fable_modules/fable-library.3.6.3/Seq.js";
import { makeStorageProp } from "../JsHelpers.fs.js";
import { map as map_2, defaultArg } from "../fable_modules/fable-library.3.6.3/Option.js";

export const doClone = true;

export const heroes = (() => {
    const jsonObj = mightypartyheroes;
    return sortBy((hero) => hero.Name, doClone ? map((x) => {
        const mock = x;
        return Hero_Clone_2B7B77A3(mock);
    }, jsonObj) : Array.from(jsonObj), {
        Compare: (x_1, y) => comparePrimitives(x_1, y),
    });
})();

export const HeroMap = ofSeq(map_1((x) => [x.ID, x], heroes));

export function makeOwnedProp(serializer) {
    const patternInput = makeStorageProp("Hero.OwnedHeroes", (arg00) => serializer.Serialize(arg00), (arg) => map((arg00_2) => TrackedHero_Clone_3D5B87CD(arg00_2), serializer.Deserialize(arg)));
    const setOwned = patternInput[1];
    const getOwned = patternInput[0];
    const getOwned_1 = () => defaultArg(map_2((arg_1) => ofSeq(map_1((x) => [x.ID, x], arg_1)), getOwned()), empty());
    const setOwned_1 = (v) => {
        setOwned(map_2((arg_3) => Array.from(map_1((tuple) => tuple[1], toSeq(arg_3))), v));
    };
    return [getOwned_1, setOwned_1];
}

