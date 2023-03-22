import { Player, PlayerData, PlayerStatisticName } from "../models/player-card.models";
import { CustomSelector } from "./common/custom-selectors";

export default () => {
	const entryPoint = document.getElementById("player-card-entrypoint");
	if (entryPoint === null) throw new Error("Failed to find player card entry point!");

	handlePlayerCard(entryPoint);
}


let players: Map<number, Player> | null = null;
let entryPoints: { selector: HTMLElement, card: HTMLElement } | null = null;


const handlePlayerCard = (mainEntryPoint: HTMLElement) => {
	entryPoints = {
		selector: generateEntryPoint.selector(),
		card: generateEntryPoint.card()
	}

	mainEntryPoint.appendChild(entryPoints.selector);
	mainEntryPoint.appendChild(entryPoints.card);

	loadPlayerData();
}


const loadPlayerData = async () => {
	//read player data from json
	const data = await getPlayerData();

	players = new Map();
	for (const player of data.players) players.set(player.player.id, player);

	//When we render the player selector, a selectbox is generated.
	//Selectboxes by default set the first item to be the selected one.
	//As a result, the first player is rendered when the page loads.
	render.playerSelector(Array.from(players.values()));
}


const getPlayerData = async (): Promise<PlayerData> => {
	const res = await fetch("/static/data/player-stats.json").catch(e => {
		throw new Error(`Failed to retrieve player data! - ${e}`);
	});
	return await res.json();
}


const render = {
	loader() {
		if (entryPoints === null) throw new Error("Entry points not set!");
		const entryPoint = entryPoints.card;

		entryPoint.innerHTML = ``;
	},
	playerSelector(players: Player[]) {
		if (entryPoints === null) throw new Error("Entry points not set!");
		const entryPoint = entryPoints.selector;

		entryPoint.innerHTML = `
		<select class="selector">
			${players.map(player => `<option value="${player.player.id}">${player.player.name.first} ${player.player.name.last}</option>`).join("")}
		</select>
		`;

		const selector = entryPoint.querySelector<HTMLSelectElement>(".selector");
		if (selector === null) throw new Error("Failed to find generated selector element!");

		//whenever selector changes, render the newly selected player
		selector.addEventListener("change", () => {
			//get the selected option
			const selectedPlayer = selector.selectedOptions[0];
			if (selectedPlayer === undefined) return;

			//find the corresponding player
			const playerId = selectedPlayer.value;
			if (players === null) throw new Error("Players not set!");
			const player = players.find(player => player.player.id === parseInt(playerId));
			if (player === undefined) throw new Error("Failed to find a player for the provided id!");

			//display this player
			render.player(player);
		});

		new CustomSelector(selector);
	},
	player(player: Player) {
		if (entryPoints === null) throw new Error("Entry points not set!");
		const entryPoint = entryPoints.card;

		const getStat = (statName: PlayerStatisticName) => player.stats.find(stat => stat.name === statName)?.value ?? null;
		const renderStat = (stat: number | string | null) => stat === null ? "Unknown" : stat;

		//read / calculate stats
		const goals = getStat("goals");
		const appearances = getStat("appearances");
		const assists = getStat("goal_assist");
		const goalsPerMatch = goals === null || appearances === null ? null : (goals / appearances).toFixed(2);
		const fwdPasses = getStat("fwd_pass");
		const backwardPasses = getStat("backward_pass");
		const minsPlayed = getStat("mins_played");
		const passesPerMinute = fwdPasses === null || backwardPasses === null || minsPlayed === null ? null : ((fwdPasses + backwardPasses) / minsPlayed).toFixed(2);

		entryPoint.innerHTML = `
		<div class="player-card">

			<div class="player-card__header">
				<img src="/static/img/p${player.player.id}.png">
			</div>

			<div class="player-card__details">
				<div class="player-card__image"></div>

				<div class="player-card-headings">
					<h1 class="player-card__heading">${player.player.name.first} ${player.player.name.last}</h1>
					<h2 class="player-card__subtitle">${player.player.info.positionInfo}</h2>
				</div>

				<ul class="player-card__table">
					<li>Appearances <span>${renderStat(appearances)}</span></li>
					<li>Goals <span>${renderStat(goals)}</span></li>
					<li>Assists <span>${renderStat(assists)}</span></li>
					<li>Goals per match <span>${renderStat(goalsPerMatch)}</span></li>
					<li>Passes per minute <span>${renderStat(passesPerMinute)}</span></li>
				</ul>
			</div>
		</div>
		`;
	}
}


const generateEntryPoint = {
	selector() {
		const selectorContainer = document.createElement("div");
		selectorContainer.classList.add("player-selector-container");
		return selectorContainer;
	},
	card() {
		const cardContainer = document.createElement("div");
		cardContainer.classList.add("player-card-container");
		return cardContainer;
	}
}