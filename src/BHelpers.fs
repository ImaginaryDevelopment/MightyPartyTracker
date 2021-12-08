module BHelpers

open System

type ISerializer =
    abstract member Serialize<'t> : 't -> string
    abstract member Deserialize<'t> : string -> 't

let (|ValueString|_|) =
    function
    | null -> None
    | "" -> None
    | x when String.IsNullOrWhiteSpace x -> None
    | x -> Some x

let inline failNullOrEmpty title pname x =
    if String.IsNullOrEmpty x then
        failwithf "%s: Bad %s" title pname

let (|After|_|) delimiter =
    failNullOrEmpty "After" "delimiter" delimiter
    function
    | ValueString x ->
        match x.IndexOf(delimiter) with
        | i when i < 0 -> None
        | i ->
            x.[i + delimiter.Length ..]
            |> Some
    | _ -> None

let (|Before|_|) delimiter =
    failNullOrEmpty "Before" "delimiter" delimiter
    function
    | ValueString x ->
        match x.IndexOf(delimiter) with
        | i when i < 0 -> None
        | i ->
            x.[0 .. i - 1]
            |> Some
    | _ -> None

let (|StartsWith|_|) delimiter =
    failNullOrEmpty "StartsWith" "delimiter" delimiter
    function
    | ValueString x -> if x.StartsWith(delimiter) then Some() else None
    | _ -> None

let pascal =
    function
    | ValueString x ->
        ((List.empty,false),x.ToCharArray())
        ||> Array.fold(fun (v,foundLetter) c ->
            if foundLetter then
                (c::v,true)
            else
                if Char.IsLetter c then
                    (Char.ToUpper c :: v, true)
                else (c::v,false)
        )
        |> fst
        |> List.rev
        |> Array.ofList
        |> String
    | x -> x