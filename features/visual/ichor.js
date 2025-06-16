import settings from "../../config/settings"
import location from "../../utils/location"
import { registerWhen } from "../../utils/trigger"

let timerStand = null
let spawnedByStand = null
let bossEntity = null
let lastIchorTimer = null
let ichors = []

register(net.minecraftforge.event.entity.EntityJoinWorldEvent, (event) => {
    const entity = new Entity(event.entity)
    Client.scheduleTask(() => {
        if (entity.getName().removeFormatting().includes("03:59")) {
            // can trigger from other people's bosses
            // stop triggering if spawnedByStand is set, last timer stand spawn is almost always the one before the
            // correct spawnedby stand (hopefully)
            if (spawnedByStand) return
            timerStand = entity
        }

        else if (entity.getName().removeFormatting().includes("Spawned by") && entity.getName().includes(Player.getName()) && !spawnedByStand) {
            spawnedByStand = entity
            ChatLib.chat(`Found spawnedby stand: ${entity.getName().removeFormatting()}`)
            ChatLib.chat(`Timer stand: ${timerStand.getName()}`)
        }

        // ichor
        else if (entity instanceof net.minecraft.entity.item.EntityArmorStand && entity.getName().removeFormatting() === "24.9s" && entity.distanceTo(bossEntity) < 5) {
            ichors.push(entity)
            ChatLib.chat(`Found ichor timer: ${event.entity.getName()}`)
        }
    })
})

register("tick", () => {
    if (!spawnedByStand || !timerStand) return

    if (timerStand.getName().removeFormatting().includes("ICHOR 0.1s")) {
        lastIchorTimer = Date.now()
    }
})

register("entityDeath", (entity) => {
    if (bossEntity && entity.getUUID().equals(bossEntity.getUUID())) {
        ChatLib.chat(`Boss died`)
        bossEntity = null
        spawnedByStand = null
        timerStand = null
    }
})

register("attackEntity", (entity, event) => {
    if (!bossEntity && spawnedByStand && timerStand && location.entityDistance2d(entity, timerStand) < 1) {
        bossEntity = entity
        ChatLib.chat(`Found boss entity: ${entity.getName().removeFormatting()}`)
    }
})

registerWhen(
    register("renderOverlay", (event) => {
        Renderer.drawString("§lNearby Entities: ", 550, 6, true)
        const entities = World.getAllEntitiesOfType(net.minecraft.entity.item.EntityArmorStand.class).filter(e => e.distanceTo(Player.asPlayerMP()) < 5)
        let i = 1
        for (let e of entities) {
            Renderer.drawString(e.getName(), 560, 6 + 11 * i, true)
            i++
        }
    }),
    () => settings.debug && settings.ichorHelper && location.inStillgore()
)

registerWhen(
    register("renderWorld", () => { },
        () => settings.ichorHelper && location.inStillgore()
    ),
    () => settings.ichorHelper && location.inStillgore()
)