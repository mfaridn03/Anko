import settings from "../../config/settings";
import Events from "../../utils/events";
import { ExpiringArray } from "../../utils/misc";

const WAIT = 10_000
const packets = new ExpiringArray(200, WAIT)


register("packetReceived", (packet, _event) => {
    if (packet.func_148890_d() <= 0 && settings.pcTps) packets.add('a')
}).setFilteredClass(net.minecraft.network.play.server.S32PacketConfirmTransaction)

register("worldLoad", () => packets.clear())

Events.addPartyChatListener(
    () => {
        const diff = Date.now() - packets.lastReset

        // if less than 10s, error
        if (diff < WAIT)
            ChatLib.command(`pc TPS still loading, ${((WAIT - diff) / 1000).toFixed(1)}s remaining`)
        else
            ChatLib.command(`pc TPS: ${(packets.size() / 10).toFixed(1)}`)
    },
    (cmd) => cmd === "tps" && settings.partyCommands && settings.pcTps
)
