import settings from "../config/settings"

export default new class Events {
    constructor() {
        this.partyChatEventListeners = []

        register("chat", (_player, msg, _event) => {
            if (!settings.partyCommands) return

            if (msg.startsWith(settings.commandPrefix))
                msg = msg.slice(settings.commandPrefix.length)

            this.partyChatEventListeners.forEach(li => {
                if (li.condition(msg))
                    li.action()
            })
        }).setCriteria(/^&r&9Party &8> (.+?)&f: &r(.+?)&r$/)
    }

    addPartyChatListener(actionFunc, conditionFunc) {
        this.partyChatEventListeners.push({ action: actionFunc, condition: conditionFunc });
    }
}
