module App.MightyParty.Hero

open Fable.Core.JsInterop

open BHelpers
open App.MightyParty.Schema

let doClone = true // hero.ID failed to match anything without doing this
// let JSON = Fable.Core.JS.JSON

let heroes =
    let jsonObj: obj[] = importDefault "./mightypartyheroes.json?module"
    if doClone then
        jsonObj |> Array.map(fun x ->
            let mock = x :?> App.MightyParty.Schema.Hero
            Hero.Clone mock
        )
    else
        jsonObj |> Seq.cast<Schema.Hero> |> Array.ofSeq
    |> Array.sortBy(fun hero -> hero.Name)

let HeroMap = heroes |> Seq.map(fun x -> x.ID, x) |> Map.ofSeq


let makeOwnedProp (serializer:ISerializer) =
    let getOwned,setOwned =
        App.JsHelpers.makeStorageProp<HeroJS[]> "Hero.OwnedHeroes"
            serializer.Serialize
            (serializer.Deserialize>>Array.map TrackedHero.Clone)
    let getOwned () : TrackedHeroCollection = getOwned() |> Option.map (Seq.map(fun x -> x.ID, x) >> Map.ofSeq) |> Option.defaultValue Map.empty
    let setOwned (v: TrackedHeroCollection option) =
        v
        |> Option.map(
            Map.toSeq
            >> Seq.map snd
            >> Array.ofSeq
        )
        |> setOwned
    getOwned,setOwned