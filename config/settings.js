import {
    @SwitchProperty,
    @ColorProperty,
    @SelectorProperty,
    Color,
    @Vigilant
} from "../../Vigilance"

@Vigilant("Anko")
class Settings {
    constructor() {
        this.initialize(this);
        this.addDependency("Boss Colour - Close", "Vampire ESP");
        this.addDependency("Boss Colour - Far", "Vampire ESP");
        this.addDependency("Thrall Colour", "Mob ESP");
        this.addDependency("Fledgling Colour", "Mob ESP");
        this.addDependency("Spectre Path", "Vampire ESP");
    }

    @SwitchProperty({
        name: "Debug",
        description: "debug stuff",
        category: "Misc"
    })
    debug = false;

    @SwitchProperty({
        name: "Vampire ESP",
        description: "Draw boxes around vampire bosses, colour changing depending on whether it's in attack range or not",
        category: "Visual"
    })
    vampireESP = false;

    @ColorProperty({
        name: "Boss Colour - Close",
        category: "Visual",
    })
    bossCloseColour = new Color(1, 0, 0, 1);

    @ColorProperty({
        name: "Boss Colour - Far",
        category: "Visual",
    })
    bossFarColour = new Color(0, 1, 0, 1);

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

    @SelectorProperty({
        name: "Spectre Path",
        description: "Draws a line following the path of the boss during spectre phase",
        category: "Visual",
        options: ["Off", "2D", "3D"]
    })
    spectrePath = 0;

    @SwitchProperty({
        name: "Ichor Helper",
        description: "(Disabled) Draws a line on the ground from ichor to the boss and beyond",
        category: "Visual"
    })
    ichorHelper = false;

}

export default new Settings;
