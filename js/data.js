const _FACTIONS = {
  MARQUISE_DE_CAT: {
    name: "Marquise de Cat",
    reach: 10,
    iconFileName: "faction-marquise.png"
  },
  UNDERGROUND_DUCHY: {
    name: "The Underground Duchy",
    reach: 8,
    iconFileName: "faction-duchy.png"
  },
  EYRIE_DYNASTIES: {
    name: "The Eyrie Dynasties",
    reach: 7,
    iconFileName: "faction-eyrie.png"
  },
  VAGABOND_1: {
    name: "The Vagabond",
    reach: 5,
    iconFileName: "faction-vagabond.png"
  },
  RIVERFOLK_COMPANY: {
    name: "The Riverfolk Company",
    reach: 5,
    iconFileName: "faction-riverfolk.png"
  },
  WOODLAND_ALLIANCE: {
    name: "The Woodland Alliance",
    reach: 3,
    iconFileName: "faction-woodland.png"
  },
  CORVID_CONSPIRACY: {
    name: "The Corvid Conspiracy",
    reach: 3,
    iconFileName: "faction-corvid.png"
  },
  VAGABOND_2: {
    name: "The Vagabond, Jr.",
    reach: 2,
    iconFileName: "faction-vagabond-2.png",
    onlyPresentWith: ["VAGABOND_1"]
  },
  LIZARD_CULT: {
    name: "The Lizard Cult",
    reach: 2,
    iconFileName: "faction-cult.png"
  }
}

const _MAPS = {
  WOODLAND: {
    name: "Fall",
    alt: "The Fall Root map.",
    imageFileName: "fall.png",
    numClearings: 12
  },
  WINTER: {
    name: "Winter",
    alt: "The Winter Root map.",
    imageFileName: "winter.png",
    numClearings: 12
  },
  LAKE: {
    name: "Lake",
    alt: "The Lake Root map.",
    imageFileName: "lake.png",
    numClearings: 12
  },
  MOUNTAIN: {
    name: "Mountain",
    alt: "The Mountain Root map.",
    imageFileName: "mountain.png",
    numClearings: 12
  }
}

const _CLEARING_TYPES = {
  FOX: {
    name: "Fox",
    iconFileName: "card-fox.png"
  },
  MOUSE: {
    name: "Mouse",
    iconFileName: "card-mouse.png"
  },
  RABBIT: {
    name: "Rabbit",
    iconFileName: "card-bunny.png"
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
