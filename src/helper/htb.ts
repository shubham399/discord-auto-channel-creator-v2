import { htbBase, htbToken } from "../config/constant"
import axios from "axios";

const getBoxes = async () => {
    try {
        let url = `${htbBase}/machines/get/all?api_token=${htbToken}`
        let response = await axios.get(url)
        return response.data.filter((x: any) => x.retired == false)
    }
    catch (e: any) {
        console.error("getBoxes Error", e.message)
    }

}
//
// curl --location --request GET 'https://www.hackthebox.eu/api/startingpoint/machines' \
const getStartingPointBox = async () => {
    try {
        let url = `${htbBase}/startingpoint/machines`
        let headers = {
            "Authorization": `Bearer ${htbToken}`
        }
        let response = await axios.get(url, { headers })
        return response.data
    }
    catch (e: any) {
        console.error("getStartingPointBox Error", e.message)
    }

}


export { getBoxes, getStartingPointBox }
