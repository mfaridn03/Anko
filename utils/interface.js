export const getScoreboard = (removeFormatting = false) => {
    if (!World.getWorld()) return null

    const sb = Scoreboard.getLines()
    const lines = []
    for (let i = 0; i < sb.length; i++) {
        lines.push(removeFormatting ? ChatLib.removeFormatting(sb[i].getName()) : sb[i].getName())
    }

    return lines
}

export const removeUnicode = (str) => {
    return str.replace(/[^\x00-\x7F]/g, "")
}

export const getTablist = (removeFormatting = false) => {
    if (!World.getWorld()) return null

    const tabList = TabList.getNames()
    const lines = []
    for (let i = 0; i < tabList.length; i++) {
        lines.push(removeFormatting ? ChatLib.removeFormatting(tabList[i]) : tabList[i])
    }

    return lines
}
