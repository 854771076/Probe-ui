// auth.js



const store = {
	namespaced: true,
	// #ifndef VUE3
	state: {
		accessToken: uni.getStorageSync('access_token') || null,
		refreshToken: uni.getStorageSync('refresh_token') || null,
		isLogin: false,
		isRefresh: false,
		userinfo: {
			username: "请登录...",
			email: "请登录...",
			phone: "请登录...",
			vip: 0,
			steam_url:false,
			points: 0,
			notifications: 0,
			historys: 0,
			stars: 0,
			comments: 0,
			checkin:false,
			isVip: false,
			vipTime: "2024-02-30T09:53:22.212209"
		}

	},
	// #endif
	// #ifdef VUE3
	state() {
		return {
			accessToken: uni.getStorageSync('access_token') || null,
			refreshToken: uni.getStorageSync('refresh_token') || null,
			isLogin: uni.getStorageSync('refresh_token') ? true : false,
			isRefresh: false,
			userinfo: {
				username: "请登录...",
				email: "请登录...",
				phone: "请登录...",
				steam_url:false,
				vip: 0,
				points: 0,
				notifications: 0,
				comments: 0,
				historys: 0,
				stars: 0,
				isvip: false,
				checkin:false,
				vipTime: "2024-02-30T09:53:22.212209"

			}
		}
	},
	// #endif
	mutations: {
		SET_ACCESSTOKEN(state, accessToken) {
			state.accessToken = accessToken;
		},
		SET_REFRESHTOKEN(state, refreshToken) {
			state.refreshToken = refreshToken;
		},
		SET_ISLOGIN(state, isLogin) {
			state.isLogin = isLogin;
		},
	},
	actions: {
		logout({
			commit,
			state,
			dispatch
		}) {
			uni.clearStorageSync()
			state.accessToken = null
			state.refreshToken = null
			state.isLogin = false
			state.isRefresh = false
			state.userinfo = {
				username: "请登录...",
				email: "请登录...",
				phone: "请登录...",
				vip: 0,
				points: 0,
				notifications: 0,
				comments:0,
				historys: 0,
				stars: 0,
				isVip: false,
				vipTime: "2024-02-30T09:53:22.212209"
			}
		},
		setUserInfo({
			commit,
			state,
			dispatch
		}) {
			dispatch('requestWithToken', {
				url: uni.$api.userinfo,
				method: "GET",
				success: (res) => {
					state.userinfo = res.data.data

					console.log(res.data.data)
				},
				fail: (err) => {
					console.log(err)
				},
				isLogin: false,

			});
		},

		async refreshToken({
			commit,
			state,
			dispatch
		}, callback) {
			state.isRefresh = true
			await uni.request({
				url: uni.$apiServer + '/api/token/refresh/',
				data: {
					'refresh': state.refreshToken
				},
				method: "POST",
				// 其他请求参数配置
				success: function(res) {
					if (res.data.detail != "Token is invalid or expired" && res.statusCode != 400 &&
						res.statusCode != 401) {
						state.accessToken = res.data.access
						uni.setStorageSync('access_token', res.data.access)
						state.isRefresh = false
						state.isLogin = true
						if (callback) {
							dispatch(callback.name, callback.ploayd)
						}

					} else {
						state.accessToken = null
						state.refreshToken = null
						uni.removeStorageSync('access_token')
						uni.removeStorageSync('refresh_token')
						state.isLogin = false
						state.isRefresh = false
					}
				},
				fail: function(err) {
					console.log(err)
					state.accessToken = null
					state.refreshToken = null
					uni.removeStorageSync('access_token')
					uni.removeStorageSync('refresh_token')
					state.isLogin = false
					state.isRefresh = false

				},

			})
		},
		async login({
			commit,
			state,
			dispatch
		}, ploayd) {
			uni.showLoading({
				title: '加载中',
				mask: true // 是否显示透明蒙层，防止触摸穿透，默认为false
			});

			await uni.request({
				url: uni.$api.login,
				method: "POST",
				data: {
					account: ploayd.data.account,
					pwd: ploayd.data.pwd,
					code: ploayd.data.code
				},

				header: {
					// #ifndef H5
					'Cookie': ploayd.cookie,
					// #endif

				},

				// #ifdef H5
				withCredentials: true,
				// #endif
				// 其他请求参数配置
				success: async function(res) {
					if (res.data.code == 200) {

						state.accessToken = res.data.tokens.access_token
						state.refreshToken = res.data.tokens.refresh_token
						uni.setStorageSync('access_token', res.data.tokens.access_token)
						uni.setStorageSync('refresh_token', res.data.tokens.refresh_token)
						ploayd.success(res)
						state.isLogin = true
						dispatch('setUserInfo')
						uni.$tui.toast('登陆成功')

					} else {
						uni.$tui.toast(res.data.error)
						ploayd.fail(res)
					}

				},
				fail: async function(err) {
					uni.$tui.toast(res.data.error)
					ploayd.fail(res)
				}
			})
			// 隐藏加载提示框
			uni.hideLoading();
		},
		async requestWithToken2({
			commit,
			state,
			dispatch
		}, ploayd) {
			let header = {}
			if (ploayd.header) {
				header = ploayd.header
			}

			await uni.request({
				url: ploayd.url,
				header: {
					'Authorization': 'Bearer ' + state.accessToken, // 添加Bearer关键字以及Token
					...header
				},
				responseType: ploayd.responseType ? ploayd.responseType : 'text',
				method: ploayd.method ? ploayd.method : "GET",
				data: ploayd.data ? ploayd.data : {},
				// 其他请求参数配置
				success: async function(res) {
					
					if ((res.statusCode == 200 || res.statusCode == 201) ) {
						if (ploayd.success) {
							ploayd.success(res)
						}
					} else if (res.statusCode === 401 && state.refreshToken) {
						if (!state.isRefresh) {
							await dispatch('refreshToken', {
								name: 'requestWithToken2',
								ploayd: ploayd
							})
						}


					} 

					 else if (res.statusCode === 401 && !state.refreshToken) {

						if (ploayd.isLogin == undefined ? true : ploayd.isLogin) {
							uni.$tui.href('/pages/login/login')
						}
					} else {
						if (ploayd.fail) {
							ploayd.fail(res)
						}
					}
				},
				fail: async function(err) {
					if (ploayd.fail) {
						ploayd.fail(err)
					}
				}
			})
		},
		async requestWithToken({
			commit,
			state,
			dispatch
		}, ploayd) {
			
			await uni.request({
				url: ploayd.url,
				header: {
					'Authorization': 'Bearer ' + state.accessToken // 添加Bearer关键字以及Token
				},
				method: ploayd.method ? ploayd.method : "GET",
				data: ploayd.data ? ploayd.data : {},
				// 其他请求参数配置
				success: async function(res) {
					if ((res.statusCode == 200 || res.statusCode == 201) && res.data.code == "200") {
						if (ploayd.success) {
							ploayd.success(res)
						}
					} else if (res.statusCode === 401 && state.refreshToken) {
						if (!state.isRefresh) {
							await dispatch('refreshToken', {
								name: 'requestWithToken',
								ploayd: ploayd
							})
						}

					} else if ((res.statusCode == 200 || res.statusCode == 201) && res.data.code != "200") {
						if (ploayd.fail) {
							ploayd.fail(res)
						}
					} else if (res.statusCode === 401 && !state.refreshToken) {
						uni.hideLoading()
						if (ploayd.isLogin == undefined ? true : ploayd.isLogin) {
							uni.$tui.href('/pages/login/login')
						}
					} else {
						if (ploayd.fail) {
							ploayd.fail(res)
						}
					}

				},
				fail: async function(err) {
					if (ploayd.fail) {
						ploayd.fail(err)
					}
				}
			})
		}
	},
	getters: {
		getUserInfo(state) {
			return state.userinfo
		},
		getUserSteamUrl(state) {
			return state.userinfo.steam_url
		},
		getToken(state) {
			return state.accessToken
		},
		getLoginStatus(state) {
			return state.isLogin
		},
	},

}
export default store