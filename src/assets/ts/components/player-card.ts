import Component from "../lib/component.class";
import delay from "../lib/delay";
import { Player, PlayerData, PlayerStatisticName } from "../models/player-card.models";
import { CustomSelector } from "./common/custom-selectors";
import { LoaderComponent } from "./common/loader.component";

export default () => {
	const entryNode = document.getElementById("player-card-entry-node");
	if (entryNode === null) throw new Error("Failed to find player card entry point!");

	handlePlayerCard(entryNode);
}


/**
 * Handle loading in the player card:
 * - Create components
 * - Fetch player data from API
 * - Render components using this player data
 */

const handlePlayerCard = async (entryNode: HTMLElement) => {
	//define components
	const loader = new LoaderComponent(entryNode);
	const playerCardContainer = new PlayerCardContainer(entryNode);

	//render the loader
	loader.render();

	//read player data from json
	const data = await getPlayerData();
	const players = new Map();
	for (const player of data.players) players.set(player.player.id, player);

	//un-render the loader
	loader.unrender();

	//render the player card container
	//the first player is rendered when the page loads: selectboxes will select the first option by default
	playerCardContainer.render({ playerCardSelector: { players: Array.from(players.values()) } });
}


/**
 * Fetch player data from API
 * @returns Promise for a PlayerData object
 */

const getPlayerData = async (): Promise<PlayerData> => {
	const res = await fetch("/static/data/player-stats.json").catch(e => {
		throw new Error(`Failed to retrieve player data! - ${e}`);
	});
	await delay(4000);
	return await res.json();
}


/**
 * A container component for the card selector component, and for the card component
 */

class PlayerCardContainer extends Component {
	playerCardSelector: PlayerCardSelector | null = null;
	playerCard: PlayerCard | null = null;

	render(props: { playerCardSelector: { players: Player[] } }) {
		this.replaceHtml(`<div class="player-card-container"></div>`);

		const container = this.node.querySelector<HTMLElement>(".player-card-container");
		if (container === null) throw new Error("Failed to find generated player card container!");

		this.playerCard = new PlayerCard(container);
		this.playerCardSelector = new PlayerCardSelector(container, this.playerCard);
		this.playerCardSelector.render(props.playerCardSelector);
	}
}

/**
 * A custom selectbox that switches the player card that's currently being
 * rendered when the value changes
 */

class PlayerCardSelector extends Component {
	constructor(
		entryNode: HTMLElement,
		public playerCard: PlayerCard
	) {
		super(entryNode);
	}

	render(props: { players: Player[] }) {
		this.replaceHtml(`
			<div class="player-card-selector__wrapper">
				<select class="player-card-selector selector">
					${props.players.map(player => `<option value="${player.player.id}">${player.player.name.first} ${player.player.name.last}</option>`).join("")}
				</select>
			</div>
		`);

		const selector = this.node.querySelector<HTMLSelectElement>(".selector");
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

class PlayerCard extends Component {
	render(props: { player: Player }) {
		const getStat = (statName: PlayerStatisticName) => props.player.stats.find(stat => stat.name === statName)?.value ?? null;

		//read / calculate stats
		const goals = getStat("goals");
		const appearances = getStat("appearances");
		const assists = getStat("goal_assist");
		const goalsPerMatch = goals === null || appearances === null ? null : (goals / appearances).toFixed(2);
		const fwdPasses = getStat("fwd_pass");
		const backwardPasses = getStat("backward_pass");
		const minsPlayed = getStat("mins_played");
		const passesPerMinute = fwdPasses === null || backwardPasses === null || minsPlayed === null ? null : ((fwdPasses + backwardPasses) / minsPlayed).toFixed(2);

		const renderStat = (label: string, stat: string | number | null) => stat !== null ? `<li>${label} <span>${stat}</span></li>` : null;

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
						${renderStat("Appearances", appearances) ?? ""}
						${renderStat("Goals", goals) ?? ""}
						${renderStat("Assists", assists) ?? ""}
						${renderStat("Goals per match", goalsPerMatch) ?? ""}
						${renderStat("Passes per minute", passesPerMinute) ?? ""}
					</ul>
				</div>
			</div>
		`);
	}
}