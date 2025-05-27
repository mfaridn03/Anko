import settings from "./config/settings"
import "./test/test"

register("command", () => {
    settings.openGUI()
}).setName("anko")