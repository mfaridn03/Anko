import settings from "./config/settings"
import "./test/test"
import "./features/visual/esp"
// import "./features/ichor"
import "./features/misc/drops"
import "./features/party/announce"

register("command", () => {
    settings.openGUI()
}).setName("anko")