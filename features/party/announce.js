import settings from "../../config/settings"
import { getScoreboard, removeUnicode } from "../../utils/interface"
import LocationUtils from "../../utils/location"
import events from "../../utils/events"

let announced = false
let numerator = 0
let denominator = 1

register("tick", () => {
    if (settings.nearSpawnAnnouncement === 62 || LocationUtils.getLocation() !== "Stillgore Chteau") return
    const scoreboard = getScoreboard(true)
    if (!scoreboard) return

    for (let i = 0; i < scoreboard.length; i++) {
        let line = removeUnicode(scoreboard[i])
        if (!line) return

        if (line.includes("Combat XP") && !announced) {
            let m = line.match(/\((\d+)\/(\d+)\) Combat XP/)
            if (m) {
                numerator = parseInt(m[1])
                denominator = parseInt(m[2])
            }
        }

        //  16/19 Kills
        else if (line.includes(" Kills") && !announced) {
            let m2 = line.match(/(\d+)\/(\d+) Kills/)
            if (m2) {
                numerator = parseInt(m2[1])
                denominator = parseInt(m2[2])
            }
        }

        // fighting boss
        else if (line.includes("Slay the boss!")) {
            numerator = 0
            denominator = 1
            announced = false
        }

        else
            continue

        if (numerator / denominator === 0) continue
        if (numerator / denominator * 100 >= settings.nearSpawnAnnouncement && !announced) {
            ChatLib.command(`pc Spawning soon (${numerator}/${denominator})`)
            announced = true
        }
    }
})

events.addPartyChatListener(
    () => {
        if (LocationUtils.getLocation() !== "Stillgore Chteau")
            ChatLib.command("pc Not in rift")

        else if (!announced && numerator === 0 && denominator === 1)
            ChatLib.command("pc Boss already spawned")

        else
            ChatLib.command(`pc Kills: ${numerator}/${denominator} (${Math.round((numerator / denominator) * 100)}%)`)
    },
    (cmd) => cmd === "kills" && settings.partyCommands && settings.pcKills
)
