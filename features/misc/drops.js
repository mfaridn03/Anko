import settings from "../../config/settings"
import { clientChat } from "../../utils/consts"
import location from "../../utils/location"

const ToolKit = Java.type("java.awt.Toolkit")
const StringSelection = Java.type("java.awt.datatransfer.StringSelection")

register("chat", (rarity, drop, mf, event) => {
    if (!location.inStillgore()) return
    if (!settings.bundleDropMessage && !settings.copyRNGDrops && !settings.rngDropTitle) return

    let message = ChatLib.getChatMessage(event, true)
    if (message.includes("Enchanted Book Bundle") && !message.includes("&6Enchanted Book Bundle")) return // leg rarity

    if (settings.bundleDropMessage) {
        cancel(event)
        message = message.replace("&6Enchanted Book Bundle", "§6The One IV Bundle")
        ChatLib.chat(message)
    }

    if (settings.copyRNGDrops) {
        const selection = new StringSelection(ChatLib.removeFormatting(message) + (rarity === "CRAZY" ? "[Lootshare]" : ""))
        const clipboard = ToolKit.getDefaultToolkit().getSystemClipboard()
        clipboard.setContents(selection, null)
        clientChat("§8Copied to clipboard!")
    }

    if (settings.rngDropTitle) {
        let msg = ""
        if (drop === "McGrubber's Burger")
            msg = "§5BURGER"

        else if (drop === "Enchanted Book Bundle")
            msg = "§6 §k  §k  §k  §r  §6BUNDLE  §6§k  §k  §k  "

        else
            msg = "§c §k  §k  §k  §r  §cUNFANGED  §c§k  §k  §k  "

        Client.showTitle(msg, `§b${mf} mf`, 0, 40, 0)
        // TODO: custom sound
        World.playSound("mob.ghast.affectionate_scream", 2.0, 1.1)
    }

}).setCriteria(/^(VERY|CRAZY) RARE DROP\! \((Enchanted Book Bundle|Unfanged Vampire Part|McGrubber's Burger)\) \(\+(\d+)% ✯ Magic Find\)$/)
// §r§9§lVERY RARE DROP! §r§7(§r§f§r§6Enchanted Book Bundle§r§7) §r§b(+41% §r§b✯ Magic Find§r§b)§r

register("chat", (player, dyeName, end, event) => {
    if (!settings.copyRNGDrops && !settings.rngDropTitle) return

    let name = player
    if (player.includes("] "))
        name = player.split(" ")[1]

    if (name === Player.getName()) {
        const selection = new StringSelection(`WOW! ${player} found ${dyeName} Dye${end}`)
        const clipboard = ToolKit.getDefaultToolkit().getSystemClipboard()
        clipboard.setContents(selection, null)
        ChatLib.chat("§8Copied to clipboard!")

        if (settings.rngDropTitle) {
            Client.showTitle(` §k §k §k §cD§aY§9E§r§k §k §k `, `§4${dyeName} Dye`, 0, 60, 0)
            World.playSound("mob.ghast.affectionate_scream", 2.0, 1.1)
        }
    }

}).setCriteria(/^WOW\! (.+) found (.+) Dye(.+\!|\!)/)

// WOW! [VIP] derankerrrr found Sangria Dye #44!
// ^WOW\! (.+) found (.+) Dye(.+\!|\!)

