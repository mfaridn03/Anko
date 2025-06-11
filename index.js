import settings from "./config/settings"
import "./test/test"
import "./features/visual/esp"
// import "./features/ichor"
import "./features/misc/drops"

register("command", () => {
    settings.openGUI()
}).setName("anko")