import settings from "../config/settings"
import modSettings from "../config/settings"
import { ForgeEvents, Packets } from "./consts"
import { getScoreboard, removeUnicode } from "./interface"
import LocationUtils from "./location"
import { registerWhen } from "./trigger"

export default new class Vampire {
    constructor() {
        this.settings = modSettings

        this.timerStand = null
        this.spawnedByStand = null
        this.entity = null

        this.startTime = null
        this.ticks = 2

        this.fighting = false
        this.mania = 0
        this.maniaCd = false

        register("chat", () => this.reset()).setCriteria("&r  &r&c&lSLAYER QUEST FAILED!&r")/* aaaaaaagh */.setContains()

        register("chat", () => this.reset()).setCriteria("&r&aYour Slayer Quest has been cancelled!&r").setContains()

        register("worldLoad", () => {
            this.reset()
        })

        register(ForgeEvents.EntityJoinWorldEvent, (event) => {
            if (!LocationUtils.inStillgore() || this.spawnedByStand) return

            Client.scheduleTask(2, () => {
                const e = new Entity(event.entity)
                const m = e.getName().removeFormatting().match(/^Spawned by: (.+)$/)

                if (m[1] === Player.getName()) {
                    const spawnedId = event.entity.func_145782_y()
                    this.timerStand = new Entity(World.getWorld().func_73045_a(spawnedId - 1))
                    // let bossTag = World.getWorld().func_73045_a(spawnedId - 2)  // boss name + hp
                    this.entity = new Entity(World.getWorld().func_73045_a(spawnedId - 3))

                    this.spawnedByStand = e
                    this.startTime = Date.now()

                    if (modSettings.announceSpawn) {
                        ChatLib.command(`pc Boss Spawned @ x: ${Math.round(this.spawnedByStand.getX())}, y: ${Math.round(this.spawnedByStand.getY())}, z: ${Math.round(this.spawnedByStand.getZ())}`)
                    }
                }
            })
        })

        register("entityDeath", (entity) => {
            if (this.entity && entity.getUUID().equals(this.entity.getUUID())) {
                const time = Math.round((Date.now() - this.startTime) / 1000) + 0.1 // + 2 ticks

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
            // counting server ticks
            if (packet.func_148890_d() > 0) return
            if (this.entity) this.ticks++

        }).setFilteredClass(Packets.S32PacketConfirmTransaction)

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

            let broken = false

            for (let l of scoreboard) {
                let line = removeUnicode(l)
                if (line.includes("Slay the boss!")) {
                    this.fighting = true
                    broken = true
                    break
                }

                else if (line.includes("Combat XP") || line.includes(" Kills")) {
                    if (this.fighting) this.reset()
                    broken = true
                    break
                }
            }

            if (!broken && this.fighting) /* */ this.reset()
        })

        registerWhen(
            register("renderOverlay", () => {
                Renderer.drawString(
                    `timerStand: ${this.timerStand?.getName() ?? "null"}§r\n\nspawnedByStand: ${this.spawnedByStand?.getName() ?? "null"}§r\n\nentity: ${this.entity?.getName() ?? "null"}§r\n\nmania: ${this.mania}§r\n\nfighting: ${this.fighting}§r\n\nmaniaCd: ${this.maniaCd}`,
                    604,
                    24,
                    true
                )
            }),
            () => settings.debug && LocationUtils.inStillgore()
        )
    }

    reset() {
        if (settings.debug) ChatLib.chat("§8debug:§r reset")
        this.timerStand = null
        this.startTime = null
        this.spawnedByStand = null
        this.entity = null
        this.mania = 0
        this.ticks = 2
        this.maniaCd = false
        this.fighting = false
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