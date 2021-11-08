
import * as dotenv from "dotenv";
dotenv.config();
import { getCategory, getChannelsInCategory, createChannel, deleteChannel, updateChannel } from "./helper/discord";
import { getBoxes, getStartingPointBox } from "./helper/htb";


const createChannelsWithHint = async (category: any, name: string) => {
    let hintChannel = await createChannel(`${name}-hints`, category.id)
    console.log("Channel Created:", hintChannel.name);
    let discussionChannel = await createChannel(`${name}-discussion`, category.id)
    console.log("Channel Created:", discussionChannel.name);
}
const archiveChannels = async (permission: any, channel: any, parentId: string) => {
    let archiveChannel = await updateChannel(channel.id, parentId, permission)
    console.log("Archived Created:", archiveChannel.name);
}

async function main() {
    try {
        let boxes = await getBoxes();
        let category = await getCategory("box");
        let channels = await getChannelsInCategory(category.id);
        let channelsName = channels.map((x: any) => x.name.toLowerCase()).map((x: any) => x.split('-')[0]).filter((x: any) => x != 'request')
        //@ts-ignore
        let uniqueChannels = [...new Set([...channelsName])];
        let boxNames = boxes.map((x: any) => x.name.toLowerCase())
        let filterBoxName = boxNames.map((x: any) => uniqueChannels.filter(y => x == y)).flat()
        let notPresentBox = uniqueChannels.filter(function (obj) { return boxNames.indexOf(obj) == -1; });
        let archiveCategory = await getCategory('archive')
        let archedChannels = await getChannelsInCategory(archiveCategory.id);
        let deteteableChannel = archedChannels.slice(0, 2);
        deteteableChannel.map(deleteChannel);
        let archivingChannel = notPresentBox.map(x => channels.filter((y: any) => y.name.includes(x))).flat()
        let archivePermission = archiveCategory.permission_overwrites
        archivingChannel.map(channel => archiveChannels(archivePermission, channel, archiveCategory.id))
        boxNames.map((name: string) => createChannelsWithHint(category, name))
        // // Create StartingPoint
        // let startingpointCategory = await getCategory('StartingPoint')
        // let startingpoint = await getStartingPointBox();
        // let startingpointNames = startingpoint.map((x: any) => x.name.toLowerCase())
        // startingpointNames.map((name: string) => createChannel(startingpointCategory, name))
    }
    catch (e: any) {
        console.error(e.message)
    }
}

main()