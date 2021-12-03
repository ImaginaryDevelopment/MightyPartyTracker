import { Record } from "../fable_modules/fable-library.3.6.3/Types.js";
import { record_type, int32_type, list_type, string_type } from "../fable_modules/fable-library.3.6.3/Reflection.js";

export class Soulbind extends Record {
    constructor(Requirements, ReqLvl) {
        super();
        this.Requirements = Requirements;
        this.ReqLvl = (ReqLvl | 0);
    }
}

export function Soulbind$reflection() {
    return record_type("App.MightyParty.Schema.Soulbind", [], Soulbind, () => [["Requirements", list_type(string_type)], ["ReqLvl", int32_type]]);
}

export class Hero extends Record {
    constructor(Image, ID, Name, Rarity, Alignment, Gender, Type, Soulbinds) {
        super();
        this.Image = Image;
        this.ID = (ID | 0);
        this.Name = Name;
        this.Rarity = Rarity;
        this.Alignment = Alignment;
        this.Gender = Gender;
        this.Type = Type;
        this.Soulbinds = Soulbinds;
    }
}

export function Hero$reflection() {
    return record_type("App.MightyParty.Schema.Hero", [], Hero, () => [["Image", string_type], ["ID", int32_type], ["Name", string_type], ["Rarity", string_type], ["Alignment", string_type], ["Gender", string_type], ["Type", string_type], ["Soulbinds", list_type(Soulbind$reflection())]]);
}

