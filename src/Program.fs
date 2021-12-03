module Program

open Feliz
open Elmish

let stringify (x:obj) = Fable.Core.JS.JSON.stringify x
type State = { HeroesOwned: Set<int*string>}

type Msg =
    | OwnedClicked of int * string

let init() = { HeroesOwned = Set.empty }, Cmd.none

let update (msg: Msg) (state: State) =
    match msg with
    | OwnedClicked(id,name) ->
        { state with HeroesOwned = state.HeroesOwned |> Set.add (id,name)}, Cmd.none

let render (state: State) (dispatch: Msg -> unit) =
    let h = App.MightyParty.Hero.heroes
    let lis =
        h
        |> Array.map(fun hero ->
            Html.li[
                prop.onClick (fun _ -> dispatch (OwnedClicked(hero.ID, hero.Name)))
                prop.children [
                    // not sure if this a referrer or http/https or some other issue
                    // Html.img [
                    //     let img = sprintf "http%s" hero.Image.[5..]
                    //     prop.src img
                    // ]
                    Html.input[
                        prop.type' "checkbox"
                    ]
                    Html.span[
                        prop.text hero.Name
                    ]
                ]
            ]
        )

    Html.div [
        // Html.button [
        //     prop.onClick (fun _ -> dispatch Increment)
        //     prop.text "Increment"
        // ]

        // Html.button [
        //     prop.onClick (fun _ -> dispatch Decrement)
        //     prop.text "Decrement"
        // ]

        // Html.h1 state.Count
        Html.div [
            Html.ul [
               yield! lis
            ]
        ]
    ]

open Elmish.React
Program.mkProgram init update render
|> Program.withReactBatched "feliz-app"
|> Program.withConsoleTrace
|> Elmish.Program.run

// open Browser.Dom
// ReactDOM.render(Counter(), document.getElementById "feliz-app")