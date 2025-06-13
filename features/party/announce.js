import settings from "../../config/settings"
import LocationUtils from "../../utils/location"
import vampire from "../../utils/vampire"

let lastStatus = false

register("tick", () => {
    //if (!settings.announceSpawn && !settings.announceMania) return
    //if (LocationUtils.getLocation() !== "Stillgore Chteau") return
    //
    //if (vampire.spawnedByStand && !lastStatus && settings.announceSpawn) {
    //    lastStatus = true
    //    const loc = vampire.spawnedByStandLocation(false, true)
    //    ChatLib.command(`pc Boss Spawned`)
    //    Client.scheduleTask(3, () => { ChatLib.command(`pc x: ${loc.x}, y: ${loc.y}, z: ${loc.z}`) })
    //}
})