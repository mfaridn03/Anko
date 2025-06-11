import settings from "./config/settings"
import "./test/test"
import "./features/visual/esp"
// import "./features/ichor"

register("command", () => {
    settings.openGUI()
}).setName("anko")