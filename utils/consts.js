// packets
export class Packets {
    static S32PacketConfirmTransaction = net.minecraft.network.play.server.S32PacketConfirmTransaction
}

// mc class
export const EntityPlayer = net.minecraft.entity.player.EntityPlayer
export const EntityOtherPlayerMP = net.minecraft.client.entity.EntityOtherPlayerMP

// forge events
export class ForgeEvents {
    static LivingUpdateEvent = net.minecraftforge.event.entity.living.LivingEvent.LivingUpdateEvent
    static EntityJoinWorldEvent = net.minecraftforge.event.entity.EntityJoinWorldEvent
}

// client chat stuff
const chatPrefix = "§d§lA §r§5»§7 "
const sayPrefix = "A » "
export const clientChat = (msg) => {
    ChatLib.chat(`${chatPrefix}${msg}`)
}
export const clientSay = (msg, party = true) => {
    if (party) ChatLib.command(`pc ${sayPrefix}${msg}`)
    else ChatLib.say(`${sayPrefix}${msg}`)
}
export const clientDebug = (msg) => {
    ChatLib.chat(`§d§lA §r§8[DEBUG] §5»§7§o ${msg}`)
}