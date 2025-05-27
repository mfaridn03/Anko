import {
    @SwitchProperty,
    @ColorProperty,
    Color,
    @Vigilant
} from "../../Vigilance"

@Vigilant("Anko")
class Settings {
    constructor() {
        this.initialize(this);
        this.addDependency("Boss Colour", "Vampire ESP");
        this.addDependency("Thrall Colour", "Mob ESP");
        this.addDependency("Fledgling Colour", "Mob ESP");
    }

    @SwitchProperty({
        name: "Vampire ESP",
        description: "Draw boxes around vampire bosses",
        category: "Visual"
    })
    vampireESP = false;

    @ColorProperty({
        name: "Boss Colour",
        category: "Visual",
    })
    bossEspColour = new Color(1, 1, 1, 1);

    @SwitchProperty({
        name: "Mob ESP",
        description: "Draw boxes around Thralls and Fledglings",
        category: "Visual"
    })
    mobESP = false;

    @ColorProperty({
        name: "Thrall Colour",
        category: "Visual",
    })
    thrallColour = new Color(0, 1, 0, 1);

    @ColorProperty({
        name: "Fledgling Colour",
        category: "Visual",
    })
    fledglingColour = new Color(0, 1, 1, 1);
}

export default new Settings;
