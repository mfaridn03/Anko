import settings from "../../config/settings"
import location from "../../utils/location"


register(net.minecraftforge.event.entity.living.LivingEvent.LivingUpdateEvent, (event) => {
    if (!settings.hidePlayers || settings.debug ? false : !location.inStillgore()) return
    if (!(event.entity instanceof net.minecraft.entity.player.EntityPlayer) || event.entity == Client.getMinecraft().field_71439_g) return

    const e = new Entity(event.entity)
    if (e.getUUID().version() === 2) return

    if (e.distanceTo(Player.asPlayerMP()) <= settings.hideDistance) {
        e.setPosition(e.getX(), e.getY() + 999999, e.getZ())
        cancel(event)
        if (settings.debug) ChatLib.chat(`§8debug:§r hidden ${e.getName()}`)
    }
})