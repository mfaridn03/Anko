import Events from "../../utils/events"
import location from "../../utils/location"
import vampire from "../../utils/vampire"

// !help
Events.addPartyChatListener(
    () => ChatLib.command("pc Commands: !help, !boss, !kills"),
    (msg) => msg === "!help"
)

// !boss
Events.addPartyChatListener(
    () => {
        if (!location.getLocation() === "Stillgore Chteau")
            ChatLib.command("pc Not in rift")

        else if (!vampire.spawnedByStand || !vampire.entity)
            ChatLib.command("pc Boss not spawned")

        else {
            const coords = vampire.entityLocation(false, true)
            ChatLib.command(`pc Boss at x: ${coords.x}, y: ${coords.y}, z: ${coords.z} | Health: ${(new EntityLivingBase(vampire.entity)).getHP()}`)
        }
    },
    (msg) => msg === "!boss"
)

// !kills
Events.addPartyChatListener(
    () => {
        if (!location.getLocation() === "Stillgore Chteau")
            ChatLib.command("pc Not in rift")

        else
            ChatLib.command("pc Command still in development")
    },
    (msg) => msg === "!kills"
)