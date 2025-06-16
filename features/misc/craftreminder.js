// HEMOVIBE
// VAMPIRIC_MELON
import settings from "../../config/settings"
import location from "../../utils/location"
import { countInventoryItems } from "../../utils/player"

let lastHemovibes = 0
let lastMelons = 0

register("tick", () => {
    if (!settings.craftingReminder || !location.inStillgore()) return

    const hemovibes = countInventoryItems("HEMOVIBE")
    const melons = countInventoryItems("VAMPIRIC_MELON")

    if (hemovibes >= settings.countThreshold && lastHemovibes < settings.countThreshold) {
        lastHemovibes = hemovibes
        Client.showTitle("Craft Hemoglass", "", 0, 30, 2)
        World.playSound("note.pling", 1, 2)
    }
    else if (hemovibes < lastHemovibes)
        lastHemovibes = 0

    if (melons >= settings.countThreshold && lastMelons < settings.countThreshold) {
        lastMelons = melons
        Client.showTitle("Craft Enchanted Melons", "", 0, 30, 2)
        World.playSound("note.pling", 1, 2)
    }
    else if (melons < lastMelons)
        lastMelons = 0
})