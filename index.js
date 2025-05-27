import settings from "./config/settings"
import "./test/test"
import "./features/esp"

register("command", () => {
    settings.openGUI()
}).setName("anko")