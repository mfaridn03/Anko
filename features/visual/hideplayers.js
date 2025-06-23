import settings from "../../config/settings"
import location from "../../utils/location"
import { registerWhen } from "../../utils/trigger"
import RenderLib from "../../../RenderLibV2J"
import vampire from "../../utils/vampire"
import { clientDebug, EntityPlayer, ForgeEvents } from "../../utils/consts"

let hiddenPlayers = new Map()
const Color = Java.type("java.awt.Color")

register(ForgeEvents.LivingUpdateEvent, (event) => {
    // module check
    if (!settings.hidePlayers || (!location.inStillgore() && !settings.debug) || (!vampire.fighting && settings.hidePlayersBossOnly)) {
        if (hiddenPlayers.size !== 0) hiddenPlayers.clear()
        return
    }
    // entity check
    if (!(event.entity instanceof EntityPlayer) || event.entity == Client.getMinecraft().field_71439_g) return
    if (event.entity.func_110124_au().version() === 2) return

    const e = new Entity(event.entity)
    if (e.distanceTo(Player.asPlayerMP()) <= settings.hideDistance && !hiddenPlayers.has(e.getUUID().toString())) {
        if (settings.debug)
            clientDebug(`hidden ${e.getName()}, added to set, size=${hiddenPlayers.size}`)

        hiddenPlayers.set(e.getUUID().toString(), new PlayerMP(event.entity))
    }
    else if (hiddenPlayers.has(e.getUUID().toString()) && Player.asPlayerMP().distanceTo(e) > settings.hideDistance) {
        hiddenPlayers.delete(e.getUUID().toString())
        if (settings.debug) clientDebug(`removed ${event.entity.func_70005_c_()} from set`)
    }
})

registerWhen(
    register("renderWorld", () => {
        const toDelete = []

        hiddenPlayers.forEach((v, k, _m) => {
            if (v instanceof PlayerMP) {
                if (!World.getWorld().func_152378_a(v.getUUID()))
                    toDelete.push(k)

                else {
                    RenderLib.drawInnerEspBoxV2(
                        v.getRenderX(), v.getRenderY() + 0.02, v.getRenderZ(),
                        v.getWidth(), v.getHeight(), v.getWidth(),
                        settings.hiddenPlayerColour.getRed() / 255, settings.hiddenPlayerColour.getGreen() / 255, settings.hiddenPlayerColour.getBlue() / 255, settings.hiddenPlayerColour.getAlpha() / 255,
                        false
                    )

                    if (Player.asPlayerMP().canSeeEntity(v)) {  // no x ray!
                        try {
                            Tessellator.drawString(
                                v?.getDisplayName()?.getText() ?? v.getName(),
                                v.getRenderX(), v.getRenderY() + 0.4 + v.getHeight(), v.getRenderZ(),
                                Color.WHITE.getRGB(),
                                true,
                                0.03,
                                false
                            )
                        } catch (e) {
                            // i have no idea why it randomly throws null pointer exception error (rendering is still fine)
                        }
                    }
                }
            }
        })

        toDelete.forEach(uuid => hiddenPlayers.delete(uuid))
    }),
    () => settings.hidePlayers && settings.highlightHiddenPlayers && (settings.hidePlayersBossOnly ? vampire.fighting : true)
)

register("renderEntity", (entity, _pos, _pt, event) => {
    if (settings.hidePlayers && (settings.hidePlayersBossOnly ? vampire.fighting : true))
        if (hiddenPlayers.has(entity.getUUID().toString()) && settings.hidePlayers)
            cancel(event)
})

register("worldLoad", () => hiddenPlayers.clear())
