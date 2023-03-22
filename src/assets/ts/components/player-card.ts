import Component from "../lib/component.class";
import { Player, PlayerData, PlayerStatisticName } from "../models/player-card.models";
import { CustomSelector } from "./common/custom-selectors";

export default () => {
	const entryPoint = document.getElementById("player-card-entrypoint");
	if (entryPoint === null) throw new Error("Failed to find player card entry point!");

	handlePlayerCard(entryPoint);
}


/**
 * Handle loading in the player card:
 * - Fetch player data from API
 * - Render components using this player data
 */

const handlePlayerCard = async (entryPoint: HTMLElement) => {
	const loader = new LoaderComponent(entryPoint);
	const playerCardSelector = new PlayerCardSelectorComponent(entryPoint);

	//show the loader
	loader.render();

	//read player data from json
	const data = await getPlayerData();
	const players = new Map();
	for (const player of data.players) players.set(player.player.id, player);

	//remove the loader
	loader.unrender();

	//the first player is rendered when the page loads: selectboxes will select the first option by default
	playerCardSelector.render({ players: Array.from(players.values()) });
}


/**
 * Fetch player data from API
 * @returns Promise for a PlayerData object
 */

const getPlayerData = async (): Promise<PlayerData> => {
	const res = await fetch("/static/data/player-stats.json").catch(e => {
		throw new Error(`Failed to retrieve player data! - ${e}`);
	});
	return await res.json();
}


/**
 * A loading wheel that appears over the player card container while we wait for
 * promises to resolve
 */

class LoaderComponent extends Component {
	render() {
		this.replaceHtml(`<p>Loader</p>`);
	}
}


/**
 * A custom selectbox that switches the player card that's currently being
 * rendered when the value changes
 */

class PlayerCardSelectorComponent extends Component {
	playerCard = new PlayerCardComponent(this.entryPoint);

	render(props: { players: Player[] }) {
		this.replaceHtml(`
		<div class="player-card-selector__wrapper">
			<select class="player-card-selector selector">
				${props.players.map(player => `<option value="${player.player.id}">${player.player.name.first} ${player.player.name.last}</option>`).join("")}
			</select>
		</div>
		`);

		const selector = this.contentEntryPoint.querySelector<HTMLSelectElement>(".selector");
		if (selector === null) throw new Error("Failed to find generated selector element!");

		//whenever selector changes, render the newly selected player
		selector.addEventListener("change", () => {
			//get the selected option
			const selectedPlayer = selector.selectedOptions[0];
			if (selectedPlayer === undefined) return;

			//find the corresponding player
			const playerId = selectedPlayer.value;
			const player = props.players.find(player => player.player.id === parseInt(playerId));
			if (player === undefined) throw new Error("Failed to find a player for the provided id!");

			//display this player
			this.playerCard.render({ player });
		});

		new CustomSelector(selector);
	}
}

/**
 * A card that contains information about a player
 */

class PlayerCardComponent extends Component {
	render(props: { player: Player }) {
		const getStat = (statName: PlayerStatisticName) => props.player.stats.find(stat => stat.name === statName)?.value ?? null;
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

		this.replaceHtml(`
		<div class="player-card">
			<div class="player-card__header">
				<img src="/static/img/p${props.player.player.id}.png">
			</div>
			<div class="player-card__details">
				<div class="player-card__image ${props.player.player.currentTeam.shortName.toLowerCase().replace(" ", "-")}"></div>
				<div class="player-card-headings">
					<h1 class="player-card__heading">${props.player.player.name.first} ${props.player.player.name.last}</h1>
					<h2 class="player-card__subtitle">${props.player.player.info.positionInfo}</h2>
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
		`);
	}
}