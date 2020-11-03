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

function randomizeFactions() {
  const availableFactions = Array.from(DATA.FACTION_LIST_BY_REACH);
  const minReach = DATA.REACH_BY_PLAYER_COUNT;

  return [
    {
      playerName: "",
      factionId: ""
    }
  ]
}

function randomizeMap() {
  const map = DATA.MAP_LIST[Math.floor(Math.random() * DATA.MAP_LIST.length)];
  return {
    id: map,
    clearings: []
  }
}

function randomizeSeats() {
  return {
    tableSize: 5,
    positions: [ "playerName1", "playerName2", "playerName3", "playerName4", "playerName5" ]
  }
}

function generateGame(event) {
  event.preventDefault();
  console.log("generate game. event: " + JSON.stringify(event));
  const output = {
    players: randomizeFactions(),
    map: randomizeMap(),
    table: randomizeSeats()
  }
  console.log(JSON.stringify(output)); 
}

loadState();