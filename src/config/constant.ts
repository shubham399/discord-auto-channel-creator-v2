

const discordBase: string = "https://discord.com/api/v8"
const discordAuth = {
    "Authorization": `Bot ${process.env.BOT_TOKEN}`
}
const jsonContent = {
    'Content-Type': 'application/json'
}
const discordGuid: string = process.env.GUILD_ID || "notset";
const maxRetryCount: number = parseInt(process.env.MAX_RETRY || "3") || 3


const htbBase = "https://www.hackthebox.eu/api"
const htbToken = process.env.HTB_TOKEN || ""

export { discordBase, discordAuth, jsonContent, discordGuid, maxRetryCount, htbBase, htbToken }