import settings from "./config/settings"

register("command", () => {
    settings.openGUI()
}).setName("anko")