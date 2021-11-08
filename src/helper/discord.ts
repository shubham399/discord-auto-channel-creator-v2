import axios from "axios";
import { discordAuth, discordBase, discordGuid, jsonContent, maxRetryCount } from "../config/constant";

var cache: string[] = [];
const sleepRequest = (millisecond: number, originalRequest: any) => {
    console.log(`Retry ${originalRequest["retry_count"]}, Delaying after ${millisecond} milliseconds`)
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(axios(originalRequest)), millisecond);
    });
};

axios.interceptors.response.use(response => {
    return response;
}, error => {
    const { config, response: { status, data } } = error;
    const originalRequest = config;
    const retry_after = Math.ceil(data.retry_after || 10) * 1000
    originalRequest["retry_count"] = originalRequest["retry_count"]++ || 1
    if (status === 429 && originalRequest["retry_count"] < maxRetryCount) {
        return sleepRequest(retry_after, originalRequest);
    } else {
        return Promise.reject(error);
    }
});

const getCategory = async (category: String) => {
    try {
        let url = `${discordBase}/guilds/${discordGuid}/channels`
        let response = await axios.get(url, {
            headers: discordAuth
        });
        return response.data.filter((x: any) => x.type == 4).find((c: any) => c.name.toLowerCase().includes(category.toLowerCase()))
    } catch (e: any) {
        console.error("getCategory Error", category, e.message, e.response.data)
        // return await handleRateLimit(e, () => { return getCategory(category) })
    }
}

const getChannelsInCategory = async (parentId: string) => {
    try {
        let url = `${discordBase}/guilds/${discordGuid}/channels`
        let response = await axios.get(url, {
            headers: discordAuth
        });
        let data = response.data.filter((c: any) => c.parent_id == parentId)
        cache = [...cache, ...data]
        return data
    }
    catch (e: any) {
        console.error("getChannelsInCategory Error", parentId, e.message, e.response.data)
    }
}

const channelExist = async (name: string, parentId: string) => {
    try {
        let url = `${discordBase}/guilds/${discordGuid}/channels`
        let found = cache.find((c: any) => c.name.toLowerCase().includes(name))
        if (found) {
            console.log(`Found from Cache ${name}`);
            return found;
        } else {
            let response = await getChannelsInCategory(parentId)
            console.log(`Found from API ${name}`);
            return response.find((c: any) => c.name.toLowerCase().includes(name))
        }
    }
    catch (e: any) {
        console.error("Channel Exist Error", e.message, e.response.data)
    }
}

const createChannel = async (name: string, parentId: string) => {
    try {
        name = name.replace(/\s/g, "-").toLowerCase();
        let isExist = await channelExist(name, parentId)
        if (!isExist) {
            let url = `${discordBase}/guilds/${discordGuid}/channels`
            let data = {
                "name": name,
                "type": 0,
                "parent_id": parentId,
                "lockPermissions": true
            }
            let headers = Object.assign(discordAuth, jsonContent)
            let response = await axios.post(url, JSON.stringify(data), {
                headers
            })
            return response.data
        } else {
            return isExist
        }
    }
    catch (e: any) {
        console.error("Create Channel Error", e.message, e.response.data)
    }
}

const deleteChannel = async (channelId: string) => {
    try {
        let url = `${discordBase}/channels/${channelId}`
        let headers = Object.assign(discordAuth, jsonContent)
        let response = await axios.delete(url, {
            headers
        })
        return response.data
    }
    catch (e: any) {
        console.error("deleteChannel Error", e.message, e.response.data)
    }
}

export { getCategory, getChannelsInCategory, createChannel, deleteChannel }