const PLAYER_LIST_STORAGE_KEY = "playerList";

const State = {
  playerList: []
}

function loadState(){
  const playerListStoredString = window.localStorage.getItem(PLAYER_LIST_STORAGE_KEY);
  State.playerList = playerListStoredString ? JSON.parse(playerListStoredString) : [];
  populatePlayerListHtml();
}

function savePlayersLocally() {
  window.localStorage.setItem(PLAYER_LIST_STORAGE_KEY, JSON.stringify(State.playerList));
}

function populatePlayerListHtml() {
  const playerList = document.getElementById("playerList");
  while(playerList.firstChild) {
    playerList.removeChild(playerList.firstChild);
  }
  State.playerList.forEach(playerName => {    
    const newPlayerListItem = document.createElement("li");
    newPlayerListItem.appendChild(document.createTextNode(playerName));
    playerList.appendChild(newPlayerListItem);
  });
}

function addPlayer(event) {
  event.preventDefault();

  const playerName = document.getElementById("playerNameInput").value;
  State.playerList.push(playerName);
  savePlayersLocally();

  populatePlayerListHtml();
}

function canFactionBePicked(faction, selectedFactions) {
  if (faction.onlyPresentWith && faction.onlyPresentWith.length > 0) {
    const requiredFactions = faction.onlyPresentWith.map(presentWith => DATA.FACTIONS[presentWith] || console.error(`Invalid faction in onlyPresentWith for ${faction.name}: ${presentWith}`));
    if (requiredFactions.filter(requiredFaction => selectedFactions.indexOf(requiredFaction) === -1).length > 0) {
      return false;
    }
  }
  return true;
}

function randomizeFactions() {
  const availableFactions = Array.from(DATA.FACTION_LIST_BY_REACH);
  const numPlayers = State.playerList.length;
  const players = Array.from(State.playerList);
  const minReach = DATA.REACH_BY_PLAYER_COUNT[numPlayers];
  var currentReach = 0;
  const selectedFactions = [];

  if(numPlayers > availableFactions.length) {
    throw "Not enough available factions for this player count.";
  }

  for(var i = 0; i < numPlayers; i++) {
    // Calculate the minimum reach a faction can have to still be considered. We do this by summing the X biggest factions, where X is remaining players - 1, then
    //  determining the minimum reach that the last faction could have to still hit the target reach value.
    const biggestCombinationStartIndex = availableFactions.length - (numPlayers - 1 - selectedFactions.length);
    const minimumFactionReach = minReach - currentReach - availableFactions.slice(biggestCombinationStartIndex).map(faction => faction.reach).reduce((total, reach) => total += reach, 0);
    // Drop any factions from the list that would no longer allow us to hit the target reach
    while (availableFactions.length > 0 && availableFactions[0].reach < minimumFactionReach) {
      availableFactions.splice(0, 1);
    }
    if (availableFactions.length == 0) {
      throw "There is no combination of available factions which hits the target reach.";
    }
    // Pluck random faction
    const pickableFactions = availableFactions.filter(faction => canFactionBePicked(faction, selectedFactions));
    const pickableFactionIndex = Math.floor(Math.random() * pickableFactions.length);
    const faction = pickableFactions[pickableFactionIndex];
    selectedFactions.push(faction);
    const availableFactionsIndex = availableFactions.indexOf(faction);
    availableFactions.splice(availableFactionsIndex, 1);
    currentReach += faction.reach;
  }

  return selectedFactions;
}

function randomizeMap() {
  const map = DATA.MAP_LIST[Math.floor(Math.random() * DATA.MAP_LIST.length)];
  return {
    id: map,
    clearings: []
  }
}

function randomizePlayerSetup() {
  const players = Array.from(State.playerList);
  const factions = randomizeFactions();
  // randomly assign factions to players
  return players.map(player => {
    return {
      player: player,
      faction: factions.splice(Math.floor(Math.random() * factions.length), 1),

    }
  });
}

function randomizeGame() {
  const playerSetups = randomizePlayerSetup();
  return {
    tableSize: playerSetups.length,
    seats: playerSetups.sort(() => Math.random() - 0.5),
    map: randomizeMap()
  }
}

function generateGame(event) {
  event.preventDefault();
  console.log("generate game. event: " + JSON.stringify(event));
  const game = randomizeGame();
  console.log(JSON.stringify(game, null, 1)); 
}

loadState();