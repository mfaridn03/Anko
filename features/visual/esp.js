import settings from "../../config/settings"
import LocationUtils from "../../utils/location"
import { registerWhen } from "../../utils/trigger"
import { drawLines } from "../../utils/render"
import RenderLib from "../../../RenderLibV2J"

const EntityOtherPlayerMP = Java.type("net.minecraft.client.entity.EntityOtherPlayerMP")
let currentBoss = null
let invisStart = null
let spectreCoords = []

register("attackEntity", (entity, _) => {
    if (entity.getEntity() instanceof EntityOtherPlayerMP && entity.getName().includes("Bloodfiend")) {
        currentBoss = entity
    }
})

registerWhen(
    register("tick", () => {
        if (currentBoss && !currentBoss.isDead()) {
            if (currentBoss.isInvisible() && !invisStart) {
                invisStart = { x: currentBoss.getX(), y: currentBoss.getY(), z: currentBoss.getZ() }
            }

            else if (currentBoss.isInvisible() && invisStart) {
                spectreCoords.push({
                    x: currentBoss.getRenderX(),
                    y: currentBoss.getRenderY(),
                    z: currentBoss.getRenderZ()
                })
            }

            else if (!currentBoss.isInvisible() && invisStart) {
                invisStart = null
                spectreCoords = []
            }
        }
        else if (currentBoss && currentBoss.isDead()) {
            currentBoss = null
        }
    }),
    () => LocationUtils.getLocation() === "Stillgore Chteau" && (settings.mobESP || settings.vampireESP)
)

registerWhen(
    register("renderWorld", () => {
        if (currentBoss) {
            if (invisStart && settings.spectrePath !== 0) {
                // RenderLib.drawLine(
                //     invisStart.x, invisStart.y, invisStart.z,
                //     currentBoss.getRenderX(), invisStart.y, currentBoss.getRenderZ(),
                //     1, 1, 1, 0.8, true, 10
                // )

                switch (settings.spectrePath) {
                    case 1:
                        RenderLib.drawLine(
                            invisStart.x, invisStart.y, invisStart.z,
                            currentBoss.getRenderX(), invisStart.y, currentBoss.getRenderZ(),
                            1, 1, 1, 0.8, true, 4
                        )
                        break;

                    case 2: // 3d
                        drawLines(spectreCoords, 1, 1, 1, 0.8, true, 4)

                    default:
                        break;
                }
            }

            if (settings.vampireESP) {
                const colour = Player.asPlayerMP().distanceTo(currentBoss) <= 3 ? settings.bossCloseColour : settings.bossFarColour
                const r = colour.getRed() / 255
                const g = colour.getGreen() / 255
                const b = colour.getBlue() / 255
                const a = colour.getAlpha() / 255

                RenderLib.drawEspBoxV2(
                    currentBoss.getRenderX(), currentBoss.getRenderY(), currentBoss.getRenderZ(),
                    currentBoss.getWidth() + 0.1, currentBoss.getHeight() + 0.1, currentBoss.getWidth() + 0.1,
                    r, g, b, a, true, 2
                )

                RenderLib.drawInnerEspBoxV2(
                    currentBoss.getRenderX(), currentBoss.getRenderY(), currentBoss.getRenderZ(),
                    currentBoss.getWidth() + 0.1, currentBoss.getHeight() + 0.1, currentBoss.getWidth() + 0.1,
                    r, g, b, a * 0.2, true
                )
            }
        }
    }),
    () => LocationUtils.getLocation() === "Stillgore Chteau" && (settings.mobESP || settings.vampireESP || settings.spectrePath)
)