import settings from "./config/settings"
import "./test"

register("command", () => {
    settings.openGUI()
}).setName("anko")