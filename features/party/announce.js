import settings from "../../config/settings"
import { getScoreboard, removeUnicode } from "../../utils/interface"
import LocationUtils from "../../utils/location"

let announced = false

register("tick", () => {
    if (settings.nearSpawnAnnouncement === 62 || LocationUtils.getLocation() !== "Stillgore Chteau") return
    const scoreboard = getScoreboard(true)
    if (!scoreboard) return

    for (let i = 0; i < scoreboard.length; i++) {
        let line = removeUnicode(scoreboard[i])
        if (!line) return

        //  (177/900) Combat XP
        let numerator = 0
        let denominator = 1

        if (line.includes("Combat XP")) {
            let m = line.match(/\((\d+)\/(\d+)\) Combat XP/)
            if (m) {
                numerator = parseInt(m[1])
                denominator = parseInt(m[2])
            }
        }

        //  16/19 Kills
        else if (line.includes(" Kills")) {
            let m2 = line.match(/(\d+)\/(\d+) Kills/)
            if (m2) {
                numerator = parseInt(m2[1])
                denominator = parseInt(m2[2])
            }
        }

        // fighting boss
        else if (line.includes("Slay the boss!")) {
            announced = true
        }

        else
            continue

        if (denominator === 0) continue
        if (numerator / denominator * 100 >= settings.nearSpawnAnnouncement && !announced) {
            ChatLib.command(`pc Spawning soon (${numerator}/${denominator} - ${Math.round((numerator / denominator) * 100)}%)`)
            announced = true
        }
    }
})
