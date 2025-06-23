import settings from "../../config/settings"
import { clientSay } from "../../utils/consts"
import Events from "../../utils/events"
import location from "../../utils/location"
import vampire from "../../utils/vampire"

// !help
Events.addPartyChatListener(
    () => {
        const pf = settings.commandPrefix
        clientSay(`Commands: ${pf}help, ${pf}boss, ${pf}kills, ${pf}tps`)
    },
    (cmd) => cmd === "help"
)

// !boss
Events.addPartyChatListener(
    () => {
        if (!location.inStillgore())
            clientSay("Not in rift")

        else if (!vampire.spawnedByStand || !vampire.entity)
            clientSay("Boss not spawned")

        else {
            const coords = vampire.entityLocation(false)
            clientSay(`Boss at x: ${coords.x}, y: ${coords.y}, z: ${coords.z} | Health: ${(new EntityLivingBase(vampire.entity.getEntity())).getHP()}`)
        }
    },
    (cmd) => cmd === "boss" && settings.pcBoss
)

// !kills in announce.js