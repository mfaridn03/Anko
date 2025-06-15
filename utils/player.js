export const getInventoryItems = () => {
    return Player.getInventory().getItems().filter(i => i !== null)
}

export const countInventoryItems = (itemId) => {
    const items = getInventoryItems()
    return items.filter(i => getItemID(i) === itemId).map(it => it.getNBT()?.getInteger("Count") ?? 0).reduce((prev, current) => prev + current, 0)
}

export const getItemID = (item) => {
    if (item instanceof Item)
        return item.getNBT()?.getCompoundTag("tag")?.getCompoundTag("ExtraAttributes")?.getString("id") ?? null

    return null
}

/*
{
  "id": "minecraft:bow",
  "Count": 1,
  "tag": {
    "ench": [],
    "Unbreakable": 1,
    "HideFlags": 254,
    "display": {
      "Lore": ["..."],
      "Name": "§5Dragon Shortbow"
    },
    "ExtraAttributes": {
      "id": "DRAGON_SHORTBOW",
      "enchantments": {
        "impaling": 3,
        "chance": 3,
        "piercing": 1,
        "infinite_quiver": 10,
        "power": 5,
        "snipe": 3,
        "flame": 2,
        "aiming": 5,
        "cubism": 5
      },
      "uuid": "bcd40249-cce0-43f6-a0e0-9ce930577155",
      "donated_museum": 1,
      "timestamp": 1741100647405
    }
  },
  "Damage": 0
}*/