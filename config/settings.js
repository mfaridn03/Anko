import {
    @SwitchProperty,
    @ColorProperty,
    @SelectorProperty,
    @SliderProperty,
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
        description: "Draw boxes around your last attacked vampire bosses, colour changing depending on whether it's in attack range or not",
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
        description: "(TODO) Draw boxes around Thralls and Fledglings",
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
        description: "(TODO) Draws a line on the ground from ichor to the boss and beyond",
        category: "Visual"
    })
    ichorHelper = false;

    @SwitchProperty({
        name: "Bundle Drop Message",
        description: "Replaces the default bundle drop message to 'The One IV Bundle'",
        category: "Misc",
    })
    bundleDropMessage = false;

    @SwitchProperty({
        name: "Copy RNG Drops",
        description: "Copy burger/bundle/fang/dye drops to clipboard",
        category: "Misc",
    })
    copyRNGDrops = false;

    @SwitchProperty({
        name: "RNG Drop Title",
        description: "Show a title when you get a burger/bundle/fang/dye drop",
        category: "Misc",
    })
    rngDropTitle = false;

    @SwitchProperty({
        name: "Announce Spawn",
        description: "Say in p chat when you spawn the boss",
        category: "Party",
        subcategory: "Announcement"
    })
    announceSpawn = false;
    // TODO: location names with coords range (e.g. Basement)

    @SwitchProperty({
        name: "Mania Phase",
        description: "Say when you start mania phases",
        category: "Party",
        subcategory: "Announcement"
    })
    announceMania = false;

    @SelectorProperty({
        name: "Boss Death",
        description: "Announce boss time to kill",
        category: "Party",
        subcategory: "Announcement",
        options: ["Off", "Time", "Time + Ticks"]
    })
    announceDeath = 0;

    // 63%-94%
    @SliderProperty({
        name: "Near Spawning Announcement",
        description: "(TODO) Say in p chat when you are close to spawning the boss (percentage). Change to minimum value to disable",
        category: "Party",
        subcategory: "Announcement",
        min: 62,
        max: 94
    })
    nearSpawnAnnouncement = 84;

    // TODO: craft melons/hemoglass reminder, !boss party chat command, !kills status command, stats command
}

export default new Settings;
