import settings from "../../config/settings"
import LocationUtils from "../../utils/location"

const ToolKit = Java.type("java.awt.Toolkit")
const StringSelection = Java.type("java.awt.datatransfer.StringSelection")

register("chat", (event) => {
    if (LocationUtils.getLocation() !== "Stillgore Chteau") return
    if (!settings.bundleDropMessage || !settings.copyRNGDrops) return

    let message = ChatLib.getChatMessage(event, true)
    if (!message.includes("§6Enchanted Book Bundle")) return // leg rarity

    cancel(event)

    if (settings.bundleDropMessage) {
        message = message.replace("§6Enchanted Book Bundle", "§6The One IV Bundle")
        ChatLib.chat(message)
    }

    if (settings.copyRNGDrops) {
        const selection = new StringSelection(ChatLib.removeFormatting(message))
        const clipboard = ToolKit.getDefaultToolkit().getSystemClipboard()
        clipboard.setContents(selection, null)
    }


}).setCriteria(/^(VERY|CRAZY) RARE DROP\! \((Enchanted Book Bundle|Unfanged Vampire Part)\) \(\+(\d+)% ✯ Magic Find\)$/)
// ^§r§9§lVERY RARE DROP! §r§7(§r§f§r§6Enchanted Book Bundle§r§7) §r§b(+41% §r§b✯ Magic Find§r§b)§r
