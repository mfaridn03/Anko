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