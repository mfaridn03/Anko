import settings from "./config/settings"
import "./test/test"
import "./features/visual/esp"
// import "./features/ichor"
import "./features/misc/drops"
import "./features/party/announce"

import vampire from "./utils/vampire"

register("command", () => {
    vampire.settings()
}).setName("anko")