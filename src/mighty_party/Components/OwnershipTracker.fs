namespace App.MightyParty.Components.OwnershipTracker

open App.MightyParty.Schema

type OwnershipDatum = TrackedHero

type Props = {
    GetOwned: unit -> App.MightyParty.Schema.TrackedHeroCollection
    SetOwned: App.MightyParty.Schema.TrackedHeroCollection option -> unit
}

type State ={
    HeroesOwned: App.MightyParty.Schema.TrackedHeroCollection
}

type Msg =
    | OwnedClicked of int

module OwnTracking =
    open Elmish
    open Feliz
    let heroes = App.MightyParty.Hero.heroes

    let changeOwned (owned:TrackedHeroCollection,i) =
        match owned |> Map.tryFind i, heroes |> Seq.tryFind(fun h -> h.ID = i) with
        | Some x, _ -> owned |> Map.add i {x with Owned= not owned.[i].Owned}
        | None, Some h -> owned |> Map.add i {Owned = true; ID=i; Level=1;BindLevel=0;Name=h.Name}
        | None, None ->
            eprintfn "Failed to find hero ID %i to changeOwned" i
            owned

    let init(serializer) =
        let getOwned,setOwned = App.MightyParty.Hero.makeOwnedProp serializer
        let owned = getOwned()
        let props = {
            GetOwned = getOwned
            SetOwned = setOwned
        }
        let state = {
            HeroesOwned = owned
        }
        props,state,Cmd.none

    let update (props,state) (msg: Msg) =
        match msg with
        | OwnedClicked(x) ->
            let nextOwned = changeOwned (state.HeroesOwned,x)
            props.SetOwned (Some nextOwned)
            { state with HeroesOwned = nextOwned }, Cmd.none


    let view (_,state) dispatch =
        let findOwnStatus id =
                let result = state.HeroesOwned |> Map.tryFind id
                result
        heroes
        |> Array.map(fun hero ->
            let ht = state.HeroesOwned |> Map.tryFind hero.ID
            let isOwned = ht |> Option.map(fun ht -> ht.Owned) |> Option.defaultValue false
            Html.li[
                prop.onClick (fun _ -> dispatch (OwnedClicked hero.ID))
                prop.custom("data-owned", string isOwned)
                prop.children [
                    // not sure if this a referrer or http/https or some other issue
                    // Html.img [
                    //     let img = sprintf "http%s" hero.Image.[5..]
                    //     prop.src img
                    // ]
                    Html.input[
                        prop.type' "checkbox"
                        prop.isChecked isOwned
                    ]
                    Html.span[
                        prop.text hero.Name
                    ]
                ]
            ]
        )