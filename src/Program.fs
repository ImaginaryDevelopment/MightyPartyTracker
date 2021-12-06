module Program

open Feliz
open Elmish
open App.JsHelpers

open App.MightyParty.Schema

type OwnershipDatum = TrackedHero

type ChildState = {
    OwnershipTrackerData: App.MightyParty.Components.OwnershipTracker.Props * App.MightyParty.Components.OwnershipTracker.State
}
type State = {
    ChildState: ChildState
}
type ChildMsg =
    | OwnershipTracker of App.MightyParty.Components.OwnershipTracker.Msg

type Msg =
    | ChildMsg of ChildMsg

let init(serializer) =
    let props,ots,cmd = App.MightyParty.Components.OwnershipTracker.OwnTracking.init serializer
    let state = {
        ChildState = {
            OwnershipTrackerData = props,ots
        }
    }
    state, cmd |> Cmd.map Msg.ChildMsg

let update (msg: Msg) (state: State) =
    match msg with
    | ChildMsg(ChildMsg.OwnershipTracker msg) ->
        let next,cmd = App.MightyParty.Components.OwnershipTracker.OwnTracking.update state.ChildState.OwnershipTrackerData msg
        { state
            with ChildState = {
                    state.ChildState
                        with OwnershipTrackerData = fst state.ChildState.OwnershipTrackerData, next
                }
        }, Cmd.none

let render (state: State) (dispatch: Msg -> unit) =

    let lis = App.MightyParty.Components.OwnershipTracker.OwnTracking.view state.ChildState.OwnershipTrackerData (ChildMsg.OwnershipTracker >> Msg.ChildMsg >> dispatch)
    Html.div [
        Html.div [
            Html.ul [
               yield! lis
            ]
        ]
    ]

open Elmish.React
let s = {
    new BHelpers.ISerializer with
        member _.Serialize<'t> (x:'t) : string = JsSerialization.serialize x
        member _.Deserialize<'t>(x:string) : 't = JsSerialization.deserialize x
}
Program.mkProgram (fun () -> init s) update render
|> Program.withReactBatched "feliz-app"
|> Program.withConsoleTrace
|> Elmish.Program.run

// open Browser.Dom
// ReactDOM.render(Counter(), document.getElementById "feliz-app")