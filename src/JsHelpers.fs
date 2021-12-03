module App.JsHelpers
open Fable.Import


// mate the call so key is DRY
let makeStorageProp<'t>(key:string) serializer deserializer =
    let getLocal deserializer (key:string) : 't option =
        match Browser.WebStorage.localStorage.[key] with
        | null -> None
        | x -> Some (deserializer x)

    let setLocal serializer (key:string) (value:'t option) =
        match value with
        | None -> Browser.WebStorage.localStorage.removeItem key
        | Some v -> Browser.WebStorage.localStorage.setItem(key,serializer v)
    (fun () -> getLocal deserializer key), setLocal serializer key