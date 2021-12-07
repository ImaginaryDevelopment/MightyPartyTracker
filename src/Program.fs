module Program

open Feliz
open Elmish
open App.JsHelpers

open App.MightyParty.Schema

type OwnershipDatum = TrackedHero

type ChildState = {
    OwnershipTrackerData: App.MightyParty.Components.OwnershipTracker.Props * App.MightyParty.Components.OwnershipTracker.State
    JsonJenData: App.JsonGen.State
}
type ChildPage =
    | OwnTracker
    | JsonJen
type State = {
    ChildState: ChildState
    ChildPage: ChildPage
}
type ChildMsg =
    | OwnershipTracker of App.MightyParty.Components.OwnershipTracker.Msg
    | JsonJenMsg of App.JsonGen.Msg

type Msg =
    | ChildMsg of ChildMsg
    | PageChange of ChildPage

let init(serializer) =
    let props,ots,cmd = App.MightyParty.Components.OwnershipTracker.OwnTracking.init serializer
    let cmd = cmd |> Cmd.map (ChildMsg.OwnershipTracker >> Msg.ChildMsg)
    let jstate,jcmd = App.JsonGen.init()
    let jcmd = jcmd |> Cmd.map (ChildMsg.JsonJenMsg >> Msg.ChildMsg)
    let cmd = cmd @ jcmd
    let state = {
        ChildPage = ChildPage.OwnTracker
        ChildState = {
            OwnershipTrackerData = props,ots
            JsonJenData = jstate
        }
    }
    state, cmd

let update (msg: Msg) (state: State): State * Cmd<Msg> =
    match msg with
    | ChildMsg(ChildMsg.OwnershipTracker msg) ->
        let next,cmd = App.MightyParty.Components.OwnershipTracker.OwnTracking.update state.ChildState.OwnershipTrackerData msg
        { state
            with ChildState = {
                    state.ChildState
                        with OwnershipTrackerData = fst state.ChildState.OwnershipTrackerData, next
                }
        }, cmd |> Cmd.map (ChildMsg.OwnershipTracker >> Msg.ChildMsg)
    | ChildMsg(ChildMsg.JsonJenMsg msg) ->
        let next,cmd = App.JsonGen.update msg state.ChildState.JsonJenData
        { state with ChildState = { state.ChildState with JsonJenData = next
        }}, cmd |> Cmd.map (ChildMsg.JsonJenMsg >> Msg.ChildMsg)
    | PageChange x ->
        {state with ChildPage = x}, Cmd.none

let render (state: State) (dispatch: Msg -> unit) =
    Html.div [
        Html.nav [
            prop.className "navbar"
            prop.children [
                Html.div [
                    prop.className "navbar-menu"
                    prop.children [
                        Html.div [
                            prop.className "navbar-start"
                            prop.children [
                                Html.a [
                                    prop.className "navbar-item"
                                    prop.text "MightyTracker"
                                    prop.onClick (fun _ -> dispatch <| Msg.PageChange ChildPage.OwnTracker)
                                ]
                                Html.a [
                                    prop.className "navbar-item"
                                    prop.text "Json-Jen"
                                    prop.onClick (fun _ -> dispatch <| Msg.PageChange ChildPage.JsonJen)
                                ]
                            ]
                        ]
                    ]
                ]

            ]
        ]
        Html.div [
            match state.ChildPage with
            | ChildPage.OwnTracker ->
                let lis = App.MightyParty.Components.OwnershipTracker.OwnTracking.view state.ChildState.OwnershipTrackerData (ChildMsg.OwnershipTracker >> Msg.ChildMsg >> dispatch)
                Html.ul [
                yield! lis
                ]
            | ChildPage.JsonJen ->
                let v = App.JsonGen.view state.ChildState.JsonJenData (ChildMsg.JsonJenMsg >> Msg.ChildMsg >> dispatch)
                v
        ]
    ]

open Elmish.React
let s = {
    new BHelpers.ISerializer with
        member _.Serialize<'t> (x:'t) : string = JsSerialization.serialize x
        member _.Deserialize<'t>(x:string) : 't = JsSerialization.deserialize<'t> x
}
Program.mkProgram (fun () -> init s) update render
|> Program.withReactBatched "feliz-app"
|> Program.withConsoleTrace
|> Elmish.Program.run

// open Browser.Dom
// ReactDOM.render(Counter(), document.getElementById "feliz-app")