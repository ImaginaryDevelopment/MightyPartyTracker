module App.JsHelpers
open Fable.Import

open BHelpers

module Object =
    open Fable.Core.JsInterop
    open Fable.Core.Util
    [<Fable.Core.Emit("$0[$1]")>]
    let private item parent name : obj= jsNative

    let getItem (name:string) (x:obj):obj option =
        match x with
        | null -> None
        | _ -> item x name |> Some

// mate the call so key is DRY
[<RequiresExplicitTypeArguments>]
let makeStorageProp<'t>(key:string) serializer deserializer =
    let getLocal deserializer (key:string) : 't option =
        match Browser.WebStorage.localStorage.[key] with
        | ValueString x ->
            printfn "Attempting to deserialize '%s' -> '%s'" key x
            Some (deserializer x)
        | _ -> None

    let setLocal serializer (key:string) (value:'t option) =
        match value with
        | None -> Browser.WebStorage.localStorage.removeItem key
        | Some v -> Browser.WebStorage.localStorage.setItem(key,serializer v)
    (fun () -> getLocal deserializer key), setLocal serializer key

[<RequiresExplicitTypeArguments>]
let makeStorageFromGeneric<'t> (serializer:ISerializer) (key) =
    makeStorageProp<'t> key serializer.Serialize serializer.Deserialize

module JsSerialization =
    open Fable.Core.JS
    let inline serialize(x:obj) =
        JSON.stringify x
    [<RequiresExplicitTypeArguments>]
    let inline deserialize<'t>(x) =
        try
            JSON.parse(x) :?> 't
        with ex ->
        #if DEBUG
            failwithf "Failed to deserialize: %s ('%s') from '%s'" typeof<'t>.Name ex.Message x
        #else
            failwithf "Failed to deserialize: '%s' from '%s'" ex.Message x
        #endif