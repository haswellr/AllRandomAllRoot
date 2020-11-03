const _FACTIONS = {
  MARQUISE_DE_CAT: {
    name: "Marquise de Cat",
    reach: 10
  },
  UNDERGROUND_DUCHY: {
    name: "Underground Duchy",
    reach: 8
  },
  EYRIE_DYNASTIES: {
    name: "Eyrie Dynasties",
    reach: 7
  },
  VAGABOND_1: {
    name: "Vagabond (first)",
    reach: 5
  },
  RIVERFOLK_COMPANY: {
    name: "Riverfolk Company",
    reach: 5
  },
  WOODLAND_ALLIANCE: {
    name: "Woodland Alliance",
    reach: 3
  },
  CORVID_CONSPIRACY: {
    name: "Corvid Conspiracy",
    reach: 3
  },
  VAGABOND_2: {
    name: "Vagabond (second)",
    reach: 2
  },
  LIZARD_CULT: {
    name: "Lizard Cult",
    reach: 2
  }
}

const _MAPS = {
  WOODLAND: {
    name: "Woodland",
    randomClearings: false
  },
  WINTER: {
    name: "Winter",
    randomClearings: true
  },
  LAKE: {
    name: "Lake",
    randomClearings: true
  },
  MOUNTAIN: {
    name: "Mountain",
    randomClearings: true
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
  MAP_LIST: Object.keys(_MAPS).map(mapKey => _MAPS[mapKey])
}

console.log("-- DATA --")
console.log(JSON.stringify(DATA));