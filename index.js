import "./test/test"
import "./features/visual/esp"
// import "./features/ichor"
import "./features/misc/drops"
import "./features/misc/craftreminder"
import "./features/party/announce"
import "./features/party/partycommands"

import vampire from "./utils/vampire"

register("command", () => {
    vampire.settings()
}).setName("anko").setAliases(["ak"])