import settings from "../config/settings"
import LocationUtils from "../utils/location"
import { registerWhen } from "../utils/trigger"
import RenderLib from "../../RenderLibV2J"

const EntityOtherPlayerMP = Java.type("net.minecraft.client.entity.EntityOtherPlayerMP")
let currentBoss = null
let invisStart = null
let predictedLand = null
let invisTicks = 0

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
            else if (invisStart && currentBoss.isInvisible()) {
                invisTicks++
                const currentPos = { x: currentBoss.getX(), y: currentBoss.getY(), z: currentBoss.getZ() }
                if (invisTicks === 6) {
                    // after 6 ticks boss will travel ~3.3x the 2d distance he did in the first 6 ticks
                    predictedLand = {
                        x: invisStart.x + (currentPos.x - invisStart.x) * 3.3,
                        y: invisStart.y,
                        z: invisStart.z + (currentPos.z - invisStart.z) * 3.3
                    }
                }
            }
            else if (invisStart && !currentBoss.isInvisible()) {
                invisStart = null
                invisTicks = 0
                predictedLand = null
            }
            return
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
            if (invisStart) {
                RenderLib.drawLine(
                    invisStart.x, invisStart.y, invisStart.z,
                    currentBoss.getRenderX(), invisStart.y, currentBoss.getRenderZ(),
                    1, 1, 1, 0.7, true, 10
                )
            }

            RenderLib.drawEspBoxV2(
                currentBoss.getRenderX(), currentBoss.getRenderY(), currentBoss.getRenderZ(),
                currentBoss.getWidth() + 0.1, currentBoss.getHeight() + 0.1, currentBoss.getWidth() + 0.1,
                0, 1, 1, 1, true, 2
            )
        }

        if (predictedLand) {
            RenderLib.drawInnerEspBoxV2(
                predictedLand.x - 1, invisStart.y - 1, predictedLand.z - 1,
                2, 2, 2,
                1, 0, 1,
                0.3, false
            )
        }
    }),
    () => LocationUtils.getLocation() === "Stillgore Chteau" && (settings.mobESP || settings.vampireESP)
)