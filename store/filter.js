// filter.js



const store = {
	namespaced: true,
	// #ifndef VUE3
	state: {
		filter_data: {
			minPrice: "5",
			maxPrice: "200",
			keyWords: "",
			exterior: "",
			quality: "",
			rarity: "",
			type: ""
		}

	},
	// #endif
	// #ifdef VUE3
	state() {
		return {
			filter_data: {
				minPrice: "5",
				maxPrice: "200",
				keyWords: "",
				exterior: "",
				quality: "",
				rarity: "",
				type: ""
			}
		}
	},
	// #endif

	actions: {
		setFilter({
			commit,
			state,
			dispatch
		}, params) {
			state.filter_data = params
		}

	},
	getters: {
		getFilter(state) {
			return state.filter_data
		}
	},

}
export default store