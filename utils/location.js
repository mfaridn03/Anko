import { getScoreboard, getTablist, removeUnicode } from "./interface"

export default new class LocationUtils {
    constructor() {
        this.area = undefined
        this.location = undefined

        register("tick", () => {
            if (!World.getWorld()) {
                this.area = null
                this.location = null
                return
            }

            // location
            const sb = getScoreboard(true)
            if (!sb) return

            for (let i = 0; i < sb.length; i++) {
                if (sb[i].includes("⏣") || sb[i].includes("ф")) {
                    this.location = removeUnicode(sb[i]).trim()
                }
            }
            // area
            const tabList = getTablist(true)
            if (!tabList) return

            for (let i = 0; i < tabList.length; i++) {
                if (tabList[i].startsWith("Area: ")) {
                    this.area = tabList[i].substring(6).trim()
                }
            }
        })
    }

    getArea() {
        return this.area
    }

    getLocation() {
        return this.location
    }

    entityDistance2d(entity1, entity2) {
        return Math.sqrt(Math.pow(entity1.getX() - entity2.getX(), 2) + Math.pow(entity1.getZ() - entity2.getZ(), 2))
    }

    inStillgore() {
        return this.location === "Stillgore Chteau"
    }
}
