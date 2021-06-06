const _FACTIONS = {
  MARQUISE_DE_CAT: {
    name: "Marquise de Cat",
    reach: 10,
    iconName: "faction-marquise"
  },
  UNDERGROUND_DUCHY: {
    name: "The Underground Duchy",
    reach: 8,
    iconName: "faction-duchy"
  },
  EYRIE_DYNASTIES: {
    name: "The Eyrie Dynasties",
    reach: 7,
    iconName: "faction-eyrie"
  },
  VAGABOND_1: {
    name: "The Vagabond",
    reach: 5,
    iconName: "faction-vagabond"
  },
  RIVERFOLK_COMPANY: {
    name: "The Riverfolk Company",
    reach: 5,
    iconName: "faction-riverfolk"
  },
  WOODLAND_ALLIANCE: {
    name: "The Woodland Alliance",
    reach: 3,
    iconName: "faction-woodland"
  },
  CORVID_CONSPIRACY: {
    name: "The Corvid Conspiracy",
    reach: 3,
    iconName: "faction-corvid"
  },
  VAGABOND_2: {
    name: "The Vagabond, Jr.",
    reach: 2,
    iconName: "faction-vagabond-2",
    onlyPresentWith: ["VAGABOND_1"]
  },
  LIZARD_CULT: {
    name: "The Lizard Cult",
    reach: 2,
    iconName: "faction-cult"
  }
}

const _MAPS = {
  WOODLAND: {
    name: "Woodland",
    numClearings: 12
  },
  WINTER: {
    name: "Winter",
    numClearings: 12
  },
  LAKE: {
    name: "Lake",
    numClearings: 12
  },
  MOUNTAIN: {
    name: "Mountain",
    numClearings: 12
  }
}

const _CLEARING_TYPES = {
  FOX: {
    name: "Fox",
    color: "#FF0000"
  },
  MOUSE: {
    name: "Mouse",
    color: "#FF8C00"
  },
  RABBIT: {
    name: "Rabbit",
    color: "#FFCC00"
  }
}

const DATA = {
  FACTIONS: _FACTIONS,
  FACTION_LIST_BY_REACH: Object.keys(_FACTIONS).map(factionKey => _FACTIONS[factionKey]).sort((a, b) => a.reach - b.reach),
  REACH_BY_PLAYER_COUNT: {
    2: 17,
    3: 18,
    4: 21,
    5: 25,
    6: 28,
    7: 28,
    8: 28,
    9: 28
  },
  MAPS: _MAPS,
  MAP_LIST: Object.keys(_MAPS).map(mapKey => _MAPS[mapKey]),
  CLEARING_TYPES: _CLEARING_TYPES,
  CLEARING_TYPES_LIST: Object.keys(_CLEARING_TYPES).map(clearingTypeKey => _CLEARING_TYPES[clearingTypeKey])
}

console.log("-- DATA --")
console.log(JSON.stringify(DATA));