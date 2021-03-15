import { readFileSync } from "fs"
import log from "loglevel"

let fileJsonContents: any = null

try
{
    const fileStringContents = readFileSync("local-settings.json", { encoding: "utf8" })
    fileJsonContents = JSON.parse(fileStringContents)
}
catch {
    log.warn("No settings.json file found")
}

export const settings = {
    janusServerUrl: (fileJsonContents?.janusServerUrl || process.env.GIKO2_JANUS_SERVER_URL) as string,
    janusApiSecret: (fileJsonContents?.janusApiSecret || process.env.GIKO2_JANUS_API_SECRET) as string,
    janusRoomNamePrefix: (fileJsonContents?.janusRoomNamePrefix || process.env.GIKO2_JANUS_ROOM_NAME_PREFIX) as string,
    janusRoomNameIntPrefix: (fileJsonContents?.janusRoomNameIntPrefix || Number.parseInt(process.env.GIKO2_JANUS_ROOM_NAME_INT_PREFIX!)) as number,
    isBehindProxy: fileJsonContents?.isBehindProxy == undefined ? true : fileJsonContents.isBehindProxy,
    restrictLoginByIp: fileJsonContents?.restrictLoginByIp == undefined ? true : fileJsonContents.restrictLoginByIp,
}

let fileScriptContents: any = null

try
{
    const fileJsContents = readFileSync("static/scripts/lang.js", { encoding: "utf8" })

    const tempArray = fileJsContents.split(/\r?\n/)
    const messagesIndex = tempArray.findIndex((v: string) => v.match(/ja:/)) + 1
    fileScriptContents = tempArray.slice(messagesIndex)
}
catch {
    log.warn("No lang.js file found")
}

    export const messages = fileScriptContents 