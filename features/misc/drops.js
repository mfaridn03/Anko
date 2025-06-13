import settings from "../../config/settings"
import LocationUtils from "../../utils/location"

const ToolKit = Java.type("java.awt.Toolkit")
const StringSelection = Java.type("java.awt.datatransfer.StringSelection")

register("chat", (rarity, drop, mf, event) => {
    if (LocationUtils.getLocation() !== "Stillgore Chteau") return
    if (!settings.bundleDropMessage && !settings.copyRNGDrops) return

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
        ChatLib.chat("§8Copied to clipboard!")
    }

}).setCriteria(/^(VERY|CRAZY) RARE DROP\! \((Enchanted Book Bundle|Unfanged Vampire Part|McGrubber's Burger)\) \(\+(\d+)% ✯ Magic Find\)$/)
// ^§r§9§lVERY RARE DROP! §r§7(§r§f§r§6Enchanted Book Bundle§r§7) §r§b(+41% §r§b✯ Magic Find§r§b)§r

register("chat", (player, dyeName, end, event) => {
    if (!settings.copyRNGDrops) return

    let name = player
    if (player.includes("] "))
        name = player.split(" ")[1]

    if (name === Player.getName()) {
        const selection = new StringSelection(`WOW! ${player} found ${dyeName} Dye${end}`)
        const clipboard = ToolKit.getDefaultToolkit().getSystemClipboard()
        clipboard.setContents(selection, null)
        ChatLib.chat("§8Copied to clipboard!")
    }

}).setCriteria(/^WOW\! (.+) found (.+) Dye(.+\!|\!)/)

// TODO: rng drop title
// WOW! [VIP] derankerrrr found Sangria Dye #44!
// ^WOW\! (.+) found (.+) Dye(.+\!|\!)

