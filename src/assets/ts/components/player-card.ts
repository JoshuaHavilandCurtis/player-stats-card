import { Player, PlayerData } from "../models/player-card.models";

export default () => {
	const playerSelectorElmt = document.querySelector<HTMLSelectElement>("#player-selector > select");
	if (playerSelectorElmt === null) throw new Error("Failed to find player selector!");

	const playerCardElmt = document.querySelector<HTMLElement>("#player-card");
	if (playerCardElmt === null) throw new Error("Failed to find player card!");

	new PlayerCard(playerSelectorElmt, playerCardElmt);
}

class PlayerCard {
	endpoint = "/static/data/player-stats.json";
	players: Map<number, Player> | null = null;

	constructor(
		public selectBox: HTMLSelectElement,
		public cardElmt: HTMLElement
	) {
		this.loadPlayerData();
	}

	async loadPlayerData() {
		//read player data from json
		const data = await this.getPlayerData();

		//set the players
		this.players = new Map();
		for (const player of data.players) this.players.set(player.player.id, player);

		//add in select box options for each player
		for (const player of this.players.values()) this.selectBox.appendChild(this.generate.playerSelectorOption(player));

		//dispatch selectbox change event (to select the first player on the custom selector)
		this.selectBox.dispatchEvent(new Event("change"));

		//whenever selector changes, render the newly selected player
		this.selectBox.addEventListener("change", () => {
			//get the selected option
			const selectedPlayer = this.selectBox.selectedOptions[0];
			if (selectedPlayer === undefined) return;

			//find the corresponding player
			const playerId = selectedPlayer.value;
			if (this.players === null) throw new Error("Failed to retrieve players!");
			const player = this.players.get(parseInt(playerId));
			if (player === undefined) throw new Error("Failed to find a player for the provided id!");

			//display this player
			this.renderPlayer(player);
		});
	}

	renderPlayer(player: Player) {
		const getStat = (statName: string) => player.stats.find(stat => stat.name === statName)?.value;
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

		this.cardElmt.innerHTML = `
		<div id="player-card" class="player-card">

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

	renderPlayerSelector() {

	}

	private async getPlayerData(): Promise<PlayerData> {
		const res = await fetch(this.endpoint).catch(e => {
			throw new Error(`Failed to retrieve player data! - ${e}`);
		});

		return await res.json();
	}

	private generate = {
		playerSelectorOption: (player: Player): HTMLOptionElement => {
			const option = document.createElement("option");
			option.value = player.player.id.toString();
			option.textContent = `${player.player.name.first} ${player.player.name.last}`;
			return option;
		}
	}

}