import settings from "../../config/settings"
import { getScoreboard, removeUnicode } from "../../utils/interface"
import events from "../../utils/events"
import location from "../../utils/location"

let announced = false
let numerator = 0
let denominator = 1

// TODO: combine this onto vampire.js

register("tick", () => {
    if (settings.nearSpawnAnnouncement === 62 || !location.inStillgore()) return
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

        else if (line.includes(" Kills") && !announced) {
            let m2 = line.match(/(\d+)\/(\d+) Kills/)
            if (m2) {
                numerator = parseInt(m2[1])
                denominator = parseInt(m2[2])
            }
        }

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
        if (!location.inStillgore())
            ChatLib.command("pc Not in rift")

        else if (!announced && numerator === 0 && denominator === 1)
            ChatLib.command("pc Boss already spawned")

        else
            ChatLib.command(`pc Kills: ${numerator}/${denominator} (${Math.round((numerator / denominator) * 100)}%)`)
    },
    (cmd) => cmd === "kills" && settings.pcKills
)
