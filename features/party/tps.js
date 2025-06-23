import settings from "../../config/settings";
import Events from "../../utils/events";
import { ExpiringArray } from "../../utils/misc";
import { Packets } from "../../utils/consts";

const WAIT = 5000
const packets = new ExpiringArray(200, WAIT)


register("packetReceived", (packet, _event) => {
    if (packet.func_148890_d() <= 0 && settings.pcTps) packets.add('a')
}).setFilteredClass(Packets.S32PacketConfirmTransaction)

register("worldLoad", () => packets.clear())

Events.addPartyChatListener(
    () => {
        const diff = Date.now() - packets.lastReset

        // if less than 10s, warn
        if (diff < WAIT)
            ChatLib.command(`pc TPS still loading, ${((WAIT - diff) / 1000).toFixed(1)}s remaining`)
        else
            ChatLib.command(`pc TPS: ${(packets.size() / (WAIT / 1000)).toFixed(1)}`)
    },
    (cmd) => cmd === "tps" && settings.pcTps
)
