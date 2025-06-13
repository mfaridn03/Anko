import settings from "../config/settings"
import LocationUtils from "./location"

export default new class Vampire {
    constructor() {
        this.timerStand = null
        this.startTime = null
        this.spawnedByStand = null
        this.entity = null
        this.mania = 0
        this.ticks = 2

        this.maniaCd = false

        register("worldLoad", () => {
            this.reset()
        })

        register("chat", (event) => {
            this.reset()
        }).setCriteria("§r§aYour Slayer Quest has been cancelled!§r")

        register(net.minecraftforge.event.entity.EntityJoinWorldEvent, (event) => {
            if (LocationUtils.getLocation() !== "Stillgore Chteau") return

            const e = new Entity(event.entity)
            Client.scheduleTask(2, () => {
                if (e.getName().removeFormatting().includes("03:59") && !this.timerStand) {
                    // can trigger from other people's bosses
                    // stop triggering if spawnedByStand is set, last timer stand spawn is almost always the one before the
                    // correct spawnedby stand (hopefully)
                    if (this.spawnedByStand) return
                    this.timerStand = e
                }

                if (e.getName().removeFormatting().includes("Spawned by") && e.getName().includes(Player.getName())) {
                    this.spawnedByStand = e
                    this.startTime = Date.now()

                    if (settings.announceSpawn) {
                        ChatLib.command(`pc Boss Spawned @ x: ${Math.round(this.spawnedByStand.getX())}, y: ${Math.round(this.spawnedByStand.getY())}, z: ${Math.round(this.spawnedByStand.getZ())}`)
                    }
                }
            })
        })

        register("attackEntity", (entity, _event) => {
            if (!this.entity && this.spawnedByStand && LocationUtils.entityDistance2d(entity, this.spawnedByStand) < 1) {
                this.entity = entity
            }
        })

        register("entityDeath", (entity) => {
            if (this.entity && entity.getUUID().equals(this.entity.getUUID())) {

                switch (settings.announceDeath) {
                    case 1: // Time
                        const time = Math.round((Date.now() - this.startTime) / 1000)
                        ChatLib.command(`pc Boss took ${time.toFixed(2) + 0.01} seconds (${this.ticks} ticks) to kill`)
                        break

                    case 2: // Time + Death
                        const deathMessage = `Boss Killed in ${Math.round((Date.now() - this.startTime) / 1000)} seconds`
                        ChatLib.command(`pc ${deathMessage}`)
                        break

                    default:
                        break
                }

                this.reset()
            }
        })

        register("packetReceived", (packet, event) => {
            if (packet.func_148890_d() > 0) return
            if (this.spawnedByStand) this.ticks++

        }).setFilteredClass(net.minecraft.network.play.server.S32PacketConfirmTransaction)

        register("tick", () => {
            if (!this.timerStand) return
            // mania stuff
            if (ChatLib.removeFormatting(this.timerStand.getName()).includes("MANIA 25.") && !this.maniaCd) {
                this.maniaCd = true
                this.mania++

                if (settings.announceMania)
                    ChatLib.command(`pc Mania Phase ${this.mania} started`)

                setTimeout(() => {
                    this.maniaCd = false
                }, 1000 * 5)
            }
        })
    }

    reset() {
        this.timerStand = null
        this.startTime = null
        this.spawnedByStand = null
        this.entity = null
        this.mania = 0
        this.ticks = 2
        this.maniaCd = false
    }

    location(ent, render = false, round = false) {
        if (!(ent instanceof Entity)) return null

        if (render)
            return {
                x: round ? Math.round(ent.getRenderX()) : ent.getRenderX(),
                y: round ? Math.round(ent.getRenderY()) : ent.getRenderY(),
                z: round ? Math.round(ent.getRenderZ()) : ent.getRenderZ()
            }

        else
            return {
                x: round ? Math.round(ent.getX()) : ent.getX(),
                y: round ? Math.round(ent.getY()) : ent.getY(),
                z: round ? Math.round(ent.getZ()) : ent.getZ()
            }
    }

    timerStandLocation(render = false, round = false) {
        return this.location(this.timerStand, render, round)
    }

    spawnedByStandLocation(render = false, round = false) {
        return this.location(this.spawnedByStand, render, round)
    }

    entityLocation(render = false, round = false) {
        return this.location(this.entity, render, round)
    }
}