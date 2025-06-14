import settings from "../config/settings"
import modSettings from "../config/settings"
import { getScoreboard, removeUnicode } from "./interface"
import LocationUtils from "./location"
import { registerWhen } from "./trigger"

export default new class Vampire {
    constructor() {
        this.timerStand = null
        this.startTime = null
        this.spawnedByStand = null
        this.entity = null
        this.mania = 0
        this.ticks = 2
        this.fighting = false

        this.maniaCd = false

        register("worldLoad", () => {
            this.reset()
        })

        register(net.minecraftforge.event.entity.EntityJoinWorldEvent, (event) => {
            if (LocationUtils.getLocation() !== "Stillgore Chteau") return

            const e = new Entity(event.entity)
            Client.scheduleTask(2, () => {
                if (e.getName().removeFormatting().includes("03:59") && !this.timerStand && this.fighting) {
                    // can trigger from other people's bosses
                    // stop triggering if spawnedByStand is set, last timer stand spawn is almost always the one before the
                    // correct spawnedby stand (hopefully)
                    if (this.spawnedByStand) return
                    this.timerStand = e
                }

                if (e.getName().removeFormatting().includes("Spawned by") && e.getName().includes(Player.getName())) {
                    this.spawnedByStand = e
                    this.startTime = Date.now()

                    if (modSettings.announceSpawn) {
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
                const time = Math.round((Date.now() - this.startTime) / 1000) + 0.01

                switch (modSettings.announceDeath) {
                    case 1: // Time
                        ChatLib.command(`pc Boss took ${time.toFixed(2)}s to kill`)
                        break

                    case 2: // Time + Ticks
                        ChatLib.command(`pc Boss took ${time.toFixed(2)}s (${this.ticks} ticks) to kill`)
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
            if (this.spawnedByStand && this.timerStand) {
                // mania stuff
                if (ChatLib.removeFormatting(this.timerStand.getName()).includes("MANIA 25.") && !this.maniaCd) {
                    this.maniaCd = true
                    this.mania++

                    if (modSettings.announceMania)
                        ChatLib.command(`pc Mania Phase ${this.mania} started`)

                    setTimeout(() => {
                        this.maniaCd = false
                    }, 1000 * 5)
                }
            }

            // fighting state
            const scoreboard = getScoreboard(true)
            if (!scoreboard) return

            for (let l of scoreboard) {
                let line = removeUnicode(l)
                if (line.includes("Slay the boss!")) {
                    this.fighting = true
                    break
                }

                else if (line.includes("Combat XP") || line.includes(" Kills")) {
                    this.fighting = false
                    break
                }

                else if (this.spawnedByStand && this.timerStand) {
                    this.reset()  // usually happens when player died mid boss fight
                }
            }
        })

        registerWhen(
            register("renderOverlay", () => {
                Renderer.drawString(
                    `timerStand: ${this.timerStand ? this.timerStand.getName() : "null"}§r\n\nspawnedByStand: ${this.spawnedByStand ? this.spawnedByStand.getName() : "null"}§r\n\nentity: ${this.entity ? this.entity.getName() : "null"}§r\n\nmania: ${this.mania}§r\n\nfighting: ${this.fighting}§r\n\nmaniaCd: ${this.maniaCd}`,
                    604,
                    24,
                    true
                )
            }),
            () => settings.debug && LocationUtils.getLocation() === "Stillgore Chteau"
        )
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

    settings() {
        modSettings.openGUI()
    }
}