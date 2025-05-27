import { getScoreboard, getTablist, removeUnicode } from "./utils"

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
}
