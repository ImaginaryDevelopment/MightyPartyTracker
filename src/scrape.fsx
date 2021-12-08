#r "nuget: Newtonsoft.Json"

open System.IO
open Newtonsoft.Json
open Newtonsoft.Json.Linq


let sp = __SOURCE_DIRECTORY__
let heroPath =
    Path.Combine(sp,"mighty_party", "mightypartyheroes.json")
    |> Path.GetFullPath
let mkImagePath =
    // needs to be updated to target dist folder
    let imgBase = Path.Combine(sp, "mighty_party","images")
    if not <| Directory.Exists imgBase then Directory.CreateDirectory imgBase |> ignore
    fun i ->
        Path.Combine(imgBase, sprintf "%i.png" i)
printfn "Hero file: %s" heroPath
File.Exists(heroPath)
|> printfn "Found hero file: %b"
let jt =
    File.ReadAllText heroPath
    |> Newtonsoft.Json.JsonConvert.DeserializeObject<JArray>
jt.Count
|> printfn "Found %i heroes"
let images =
    jt
    |> Seq.map(fun h ->
        h.Value<int> "ID",
        h.Value<string> "Image"
    )
    |> List.ofSeq
let downloadFile  =
    let hc = new System.Net.Http.HttpClient()
    fun (id,url:string) ->
        let data = hc.GetByteArrayAsync(url) |> Async.AwaitTask |> Async.RunSynchronously
        id,data

images
|> Seq.map downloadFile
|> Seq.iter(fun (id,data) ->
    let path = mkImagePath(id)
    File.WriteAllBytes(path,data)
    printfn "Wrote file to %s" path
)