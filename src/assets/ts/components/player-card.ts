import { Player, PlayerData, PlayerStatisticName } from "../models/player-card.models";
import { CustomSelector } from "./common/custom-selectors";

export default () => {
	const entry = document.getElementById("player-card-entrypoint");
	if (entry === null) throw new Error("Failed to find player card entry point!");

	new PlayerCard(entry);
}

class PlayerCard {
	endpoint = "/static/data/player-stats.json";
	players: Map<number, Player> | null = null;
	selectorContainer: HTMLElement;
	cardContainer: HTMLElement;

	constructor(
		public entryElmt: HTMLElement
	) {
		this.selectorContainer = this.generate.selectorContainer();
		this.cardContainer = this.generate.cardContainer();
		entryElmt.appendChild(this.selectorContainer);
		entryElmt.appendChild(this.cardContainer);

		this.loadPlayerData();
	}

	async loadPlayerData() {
		//read player data from json
		const data = await this.getPlayerData();

		//set the players
		this.players = new Map();
		for (const player of data.players) this.players.set(player.player.id, player);

		//When we render the player selector, a selectbox is generated.
		//Selectboxes by default set the first item to be the selected one.
		//As a result, the first player is rendered when the page loads.
		this.renderPlayerSelector(Array.from(this.players.values()));
	}

	renderPlayer(player: Player) {
		const getStat = (statName: PlayerStatisticName) => player.stats.find(stat => stat.name === statName)?.value;
		const renderStat = (stat: number | string | undefined) => stat === undefined ? "Unknown" : stat;

		//read / calculate stats
		const goals = getStat("goals");
		const appearances = getStat("appearances");
		const assists = getStat("goal_assist");
		const goalsPerMatch = goals === undefined || appearances === undefined ? undefined : (goals / appearances).toFixed(2);
		const fwdPasses = getStat("fwd_pass");
		const backwardPasses = getStat("backward_pass");
		const minsPlayed = getStat("mins_played");
		const passesPerMinute = fwdPasses === undefined || backwardPasses === undefined || minsPlayed === undefined ? undefined : ((fwdPasses + backwardPasses) / minsPlayed).toFixed(2);

		this.cardContainer.innerHTML = `
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

	renderPlayerSelector(players: Player[]) {
		this.selectorContainer.innerHTML = `
		<select class="selector">
			${players.map(player => `<option value="${player.player.id}">${player.player.name.first} ${player.player.name.last}</option>`)}
		</select>
		`;

		const selector = this.selectorContainer.querySelector<HTMLSelectElement>(".selector");
		if (selector === null) throw new Error("Failed to find generated selector element!");

		//whenever selector changes, render the newly selected player
		selector.addEventListener("change", () => {
			//get the selected option
			const selectedPlayer = selector.selectedOptions[0];
			if (selectedPlayer === undefined) return;

			//find the corresponding player
			const playerId = selectedPlayer.value;
			if (this.players === null) throw new Error("Failed to retrieve players!");
			const player = this.players.get(parseInt(playerId));
			if (player === undefined) throw new Error("Failed to find a player for the provided id!");

			//display this player
			this.renderPlayer(player);
		});

		new CustomSelector(selector);
	}

	private async getPlayerData(): Promise<PlayerData> {
		const res = await fetch(this.endpoint).catch(e => {
			throw new Error(`Failed to retrieve player data! - ${e}`);
		});
		return await res.json();
	}

	private generate = {
		selectorContainer: () => {
			const selectorContainer = document.createElement("div");
			selectorContainer.classList.add("player-selector-container");
			return selectorContainer;
		},
		cardContainer: () => {
			const cardContainer = document.createElement("div");
			cardContainer.classList.add("player-card-container");
			return cardContainer;
		}
	}

}