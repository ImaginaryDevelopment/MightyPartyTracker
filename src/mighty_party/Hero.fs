module App.MightyParty.Hero
open Fable.Core.JsInterop

open App.MightyParty.Schema

let JSON = Fable.Core.JS.JSON

let heroes =
    let jsonObj: obj[] = importDefault "./mightypartyheroes.json?module"
    printfn "maybe?"
    printfn "Found some json? %A" jsonObj
    jsonObj |> Array.map(fun x ->
        // I don't trust that all functionality like {x with ... }
        // works if we don't construct this ourselves
        let mock = x :?> App.MightyParty.Schema.Hero
        {
            Image = mock.Image
            ID= mock.ID
            Name = mock.Name
            Rarity = mock.Rarity
            Alignment = mock.Alignment
            Gender = mock.Gender
            Type = mock.Type
            Soulbinds =
                mock.Soulbinds
                |> Seq.map(fun mock -> {Requirements = List.ofSeq mock.Requirements; ReqLvl = mock.ReqLvl})
                |> List.ofSeq
        }
    )
    |> Array.sortBy(fun hero -> hero.Name)

let makeOwnedProp () =
    let ser (items:(int*string)[]) =
        JSON.stringify items
    let de (text:string) = JSON.parse text :?> (int*string)[]

    App.JsHelpers.makeStorageProp<_> "Hero.OwnedHeroes" ser de