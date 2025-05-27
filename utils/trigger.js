const triggers = []

export const registerWhen = (trig, cond) => {
    triggers.push({
        t: trig,
        c: cond
    })
}

register("tick", () => {
    for (let trigger of triggers) {
        if (trigger.c())
            trigger.t.register()
        else trigger.t.unregister()
    }
})
