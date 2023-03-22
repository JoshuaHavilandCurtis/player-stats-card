export type PlayerData = {
	players: Player[]
}

export type Player = {
	player: PlayerInfo,
	stats: PlayerStatistic[]
}

export type PlayerInfo = {
	info: {
		position: string,
		shirtNum: number,
		positionInfo: string
	},
	nationalTeam: {
		isoCode: string,
		country: string,
		demonym: string
	},
	age: string,
	name: {
		first: string,
		last: string
	},
	id: number,
	currentTeam: {
		name: string,
		teamType: string,
		shortName: string,
		id: number
	}
}

export type PlayerStatistic = {
	name: "goals" | "losses" | "wins" | "draws" | "fwd_pass" | "goal_assist" | "appearances" | "mins_played" | "backward_pass",
	value: number
}