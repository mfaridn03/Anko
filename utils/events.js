export default new class Events {
    constructor() {
        this.partyChatEventListeners = []

        register("chat", (_player, msg, _event) => {
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
