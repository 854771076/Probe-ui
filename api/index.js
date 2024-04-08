import CryptoJS from 'crypto-js'
const baseUrl = 'https://probe.fiang.fun'
const api = {
	login: baseUrl + '/api/auth/login/',
	refresh: baseUrl + '/api/token/refresh/',
	emailcode: baseUrl + '/api/code/emailcode',
	imgcode: baseUrl + '/api/code/imgcode',
	signup: baseUrl + '/api/auth/signup/',
	userinfo: baseUrl + '/api/auth/userinfo/getinfo/',
	foreget: baseUrl + '/api/auth/foreget/',
	uploadphoto: baseUrl + '/api/auth/userinfo/uploadPhoto/',
	updateSex(store, data, success, fail) {
		uni.showLoading()
		store.dispatch('auth/requestWithToken', {
			url: baseUrl + '/api/auth/userinfo/updateSex/',
			data: {
				genderTranslation: data.genderTranslation,
				genderCode: data.genderCode
			},
			method: "POST",
			success: (res) => {
				uni.hideLoading()
				success && success(res.data)

			},
			fail: (err) => {
				uni.hideLoading()
				fail && fail(err.data)

			}
		})

	},
	logout(store) {
		store.dispatch('auth/logout')

		uni.$tui.href('/pages/home/home', true)
		uni.$tui.toast('退出成功')
	},
	updateBirth(store, data, success, fail) {
		uni.showLoading()
		store.dispatch('auth/requestWithToken', {
			url: baseUrl + '/api/auth/userinfo/updateBirth/',
			data: {
				birth: data.birth

			},
			method: "POST",
			success: (res) => {
				uni.hideLoading()
				success && success(res.data)

			},
			fail: (err) => {
				uni.hideLoading()
				fail && fail(err.data)

			}
		})

	},
	updateSteamUrl(store, data= {
		steam_url: 'https://steamcommunity.com/id/123236598445/'
	}, success, fail) {
		uni.showLoading()
		store.dispatch('auth/requestWithToken', {
			url: baseUrl + '/api/auth/userinfo/updateSteamUrl/',
			data: data,
			method: "POST",
			success: (res) => {
				uni.hideLoading()
				success && success(res.data)

			},
			fail: (err) => {
				uni.hideLoading()
				fail && fail(err.data)

			}
		})

	},
	updateName(store, data, success, fail) {
		uni.showLoading()
		store.dispatch('auth/requestWithToken', {
			url: baseUrl + '/api/auth/userinfo/updateName/',
			data: {
				name: data.name

			},
			method: "POST",
			success: (res) => {
				uni.hideLoading()
				success && success(res.data)

			},
			fail: (err) => {
				uni.hideLoading()
				fail && fail(err.data)

			}
		})

	},
	getAnnouncements(success, fail) {
		uni.showLoading()
		uni.request({
			url: baseUrl + '/api/announcement/getannouncementlist',
			method: "GET",
			success: (res) => {
				uni.hideLoading()
				success && success(res.data)

			},
			fail: (err) => {
				uni.hideLoading()
				fail && fail(err.data)

			}
		})

	},
	getGoodsDetail(store, item_id, success, fail) {
		uni.showLoading()
		const sign = api.Sign('/api/goods/detail/' + item_id)

		if (store.getters['auth/getLoginStatus']) {
			store.dispatch('auth/requestWithToken2', {
				url: baseUrl + '/api/goods/detail/' + item_id,
				header: {
					"sign": sign
				},
				method: "GET",
				success: (res) => {
					let data = api.decryptData(res.data)
					uni.hideLoading();
					if (data.code == "200") {
						success && success(data)
					} else {
						fail && fail(data)

					}
				},
				fail: (err) => {
					uni.hideLoading();
					fail && fail(err.data)

				},
			})
		} else {

			uni.request({
				url: baseUrl + '/api/goods/detail/' + item_id,
				method: "GET",
				header: {
					"sign": sign
				},
				success: (res) => {

					let data = api.decryptData(res.data)
					uni.hideLoading()
					if (data.code == "200") {
						success && success(data)
					} else {
						fail && fail(data)

					}


				},

				fail: (err) => {
					uni.hideLoading();
					fail && fail(err.data)
				},
			})
		}


	},
	getParamsString(params) {
		if (Object.keys(params).length === 0) {
			return ''
		}
		let s = [];
		for (let [k, v] of Object.entries(params)) {
			s.push(`${k}=${v}`);
		}
		return '?' + s.join('&');
	},

	Sign(url, data = {}) {
		let d = url + api.getParamsString(data)

		const sign = CryptoJS.MD5(d).toString();
		return sign;
	},
	decryptData(encryptedData) {
		let key = '0123456789abcdef'
		const keyHex = CryptoJS.enc.Utf8.parse(key);
		const decryptedData = CryptoJS.AES.decrypt({
				ciphertext: CryptoJS.enc.Base64.parse(encryptedData)
			},
			keyHex, {
				mode: CryptoJS.mode.CBC,
				padding: CryptoJS.pad.Pkcs7,
				iv: keyHex
			}
		);
		return JSON.parse(decryptedData.toString(CryptoJS.enc.Latin1).substring(16))
	},
	getGoodsList(store, col, data = {
		name: null,
		page: null,
		exterior: null,
		pagesize: null,
		quality: null,
		type: null,
		rarity: null,
		price_gte: null,
		price_lte: null,
		sort: 0
	}, success, fail) {
		uni.showLoading();
		const sign = api.Sign('/api/goods/list/' + col, data)

		if (store.getters['auth/getLoginStatus']) {
			store.dispatch('auth/requestWithToken2', {
				url: baseUrl + '/api/goods/list/' + col,
				header: {
					"sign": sign
				},
				data: data,
				method: "GET",
				success: (res) => {

					let data = api.decryptData(res.data)
					console.log(data)
					if (data.code == "200") {
						success && success(data)

					} else if (data.code != "200") {
						fail && fail(data)
					}
					uni.hideLoading()

				},
				fail: (err) => {

					uni.hideLoading();
					fail && fail(err)
				},
			})
		} else {
			uni.request({
				url: baseUrl + '/api/goods/list/' + col,
				method: "GET",
				header: {
					"sign": sign
				},
				data: data,
				success: (res) => {

					let data = api.decryptData(res.data)
					uni.hideLoading()
					if (data.code == "200") {
						success && success(data)
					} else if (data.code != "200") {
						fail && fail(data)
					}
				},

				fail: (err) => {

					uni.hideLoading();
					fail && fail(err)
				},
			})
		}
	},
	getGoodsHistoryList(data = {
		item_id: null,
		days: 7
	}, success, fail) {
		uni.showLoading();
		const sign = api.Sign('/api/goods/goods_history_price', data)
		uni.request({
			url: baseUrl + '/api/goods/goods_history_price',
			method: "GET",
			header: {
				"sign": sign
			},
			data: data,
			success: (res) => {

				let data = api.decryptData(res.data)
				uni.hideLoading()
				if (data.code == "200") {
					success && success(data)
				} else if (data.code != "200") {
					fail && fail(data)
				}
			},

			fail: (err) => {

				uni.hideLoading();
				fail && fail(err)
			},
		})

	},
	getGoodsLeaksList(store, col, data = {
		name: null,
		page: null,
		exterior: null,
		pagesize: null,
		quality: null,
		type: null,
		rarity: null,
		price_gte: null,
		price_lte: null,
		sort: 0
	}, success, fail) {
		uni.showLoading();
		const sign = api.Sign('/api/goods/list_leaks/' + col, data)

		if (store.getters['auth/getLoginStatus']) {
			store.dispatch('auth/requestWithToken2', {
				url: baseUrl + '/api/goods/list_leaks/' + col,
				header: {
					"sign": sign
				},
				data: data,
				method: "GET",
				success: (res) => {
					if (res.statusCode==200 &&!res.data.code) {
						let data = api.decryptData(res.data)
						uni.hideLoading()
						if (data.code == "200") {
							success && success(data)
						} else if (data.code != "200") {
							fail && fail(data)
						}else{
							console.error(data)
						}
					}else{
						uni.hideLoading()
						fail && fail(res.data.msg)
					}

				},

				fail: (err) => {
					uni.hideLoading();
					fail && fail(err)

				},
			})
		} else {

			uni.hideLoading();
			fail && fail("请登录")
		}
	},


	getGoodsDownloadList(store, col, data = {
		name: null,
		page: null,
		exterior: null,
		pagesize: null,
		quality: null,
		type: null,
		rarity: null,
		price_gte: null,
		price_lte: null,
		sort: 0
	}, success, fail) {


		if (store.getters['auth/getLoginStatus']) {
			uni.showLoading();
			const sign = api.Sign('/api/goods/list_download/' + col, data)
			store.dispatch('auth/requestWithToken2', {
				url: baseUrl + '/api/goods/list_download/' + col,
				header: {
					'sign': sign
				},
				data: data,
				// #ifdef H5
				responseType: 'arraybuffer',
				// #endif
				success: (res) => {

					if (res.statusCode != 200) {
						uni.hideLoading()
						fail && fail({
							msg: 'vip到期,或等级不足vip8'
						})

					} else if (res.statusCode == 200 && res.data.code != "200" && res.data.code!=undefined) {
						uni.hideLoading()

						fail && fail({
							msg:'vip到期,或等级不足vip8'
						})

					} else {
						// #ifdef H5
						const blob = new Blob([res.data], {
							type: 'application/csv'
						});
						uni.arr
						const url = window.URL.createObjectURL(blob);

						// 创建一个<a>标签
						const link = document.createElement('a');
						link.href = url;
						link.target = '_blank'; // 在新标签页打开链接
						console.log(res.header['Content-Disposition'])
						link.download = col + uni.$tui.getDateTimeString(new Date()).replace(
							" ",
							'_') + '.csv'; // 下载的文件名

						// 模拟点击链接，触发文件下载
						document.body.appendChild(link);
						link.click();

						// 清理
						window.URL.revokeObjectURL(url);
						document.body.removeChild(link);
						uni.hideLoading()
						success && success({
							msg: '下载成功'
						})
						// #endif
						// #ifndef H5
						const fsm = uni.getFileSystemManager();
						const fileName = col + '.csv'
						const path = `${uni.env.USER_DATA_PATH}/TanZheng`
						try {
							fsm.mkdirSync(
								path,
								true // 递归创建父目录
							)
						} catch (e) {

						}
						f = fsm.openSync({
							filePath: `${path}/${fileName}`,
							flags: 'w',
							flag: 'w',
						})
						fsm.writeSync({
							fd: f,
							data: res.data
						})
						uni.hideLoading()
						console.log(`下载成功，路径：${path}/${fileName}`)
						success && success({
							msg: `下载成功，路径：${path}/${fileName}`
						})
						// #endif
					}



				},
				fail: (err) => {
					// 下载失败
					console.error('下载文件失败', err);
					uni.hideLoading();
					fail && fail({
						msg: '下载失败'
					})

				}
			});
		} else {
			fail && fail({
				msg: '请登录'
			})
		}



	},
	associatedWords(keywords, success, fail) {

		uni.request({
			url: baseUrl + '/api/goods/associated_words',
			data: {
				keywords: keywords
			},
			success: (res) => {
				if (res.data.code == "200") {

					success && success(res.data)
				} else if (res.data.code != "200") {
					fail && fail(res.data)
				}
			},
			fail: (err) => {

				fail && fail(res.data)
			}
		})

	},
	updateComment(store, id, data = {
		content: null
	}, success, fail) {
		uni.showLoading();
		store.dispatch('auth/requestWithToken', {
			url: baseUrl + `/api/goods/comments/${id}/`,
			data: data,
			method: "PUT",
			success: (res) => {
				uni.hideLoading()
				success && success(res.data)

			},
			fail: (err) => {
				uni.hideLoading()
				fail && fail(err.data)

			}
		})

	},
	commentsList(store, data = {
		email: null,
		item_id: null,
		page: null,
		ordering: '-last_update,-create_time'
	}, success, fail) {
		uni.showLoading();
		if (store.getters['auth/getLoginStatus']) {
			store.dispatch('auth/requestWithToken2', {
				url: baseUrl + '/api/goods/comments/',
				data: data,
				method: "GET",
				success: (res) => {
					uni.hideLoading();
					success && success(res.data)


				},

				fail: (err) => {
					uni.hideLoading();
					fail && fail(err)

				},
			})
		} else {
			uni.request({
				url: baseUrl + `/api/goods/comments/`,
				data: data,
				method: "GET",
				success: (res) => {
					uni.hideLoading()
					success && success(res.data)

				},
				fail: (err) => {
					uni.hideLoading()
					fail && fail(err.data)

				}
			})
		}
	},
	sendComment(store, data = {
		content: null,
		item_id: null
	}, success, fail) {
		uni.showLoading();
		store.dispatch('auth/requestWithToken', {
			url: baseUrl + `/api/goods/comments/`,
			data: data,
			method: "POST",
			success: (res) => {
				uni.hideLoading()
				success && success(res.data)

			},
			fail: (err) => {
				uni.hideLoading()
				fail && fail(err.data)

			}
		})

	},
	deleteCommentById(store, id, success, fail) {
		uni.showLoading();
		store.dispatch('auth/requestWithToken', {
			url: baseUrl + `/api/goods/comments/${id}/`,
			method: "DELETE",
			success: (res) => {
				uni.hideLoading()
				success && success(res.data)

			},
			fail: (err) => {
				uni.hideLoading()
				fail && fail(err.data)

			}
		})

	},
	deleteComment(store, data, success, fail) {
		uni.showLoading();
		store.dispatch('auth/requestWithToken', {
			url: baseUrl + `/api/goods/comments/delete_many/`,
			method: "DELETE",
			data: data,
			success: (res) => {
				uni.hideLoading()
				success && success(res.data)

			},
			fail: (err) => {
				uni.hideLoading()
				fail && fail(err.data)

			}
		})

	},
	starsList(store, data = {
		page: null,
		ordering: '-last_update,-create_time'
	}, success, fail) {
		uni.showLoading();
		store.dispatch('auth/requestWithToken', {
			url: baseUrl + `/api/goods/stars/`,
			data: data,
			method: "GET",
			success: (res) => {
				uni.hideLoading()
				success && success(res.data)

			},
			fail: (err) => {
				uni.hideLoading()
				fail && fail(err.data)

			}
		})
	},
	MyGoodsList(store, success, fail) {
		uni.showLoading();
		if (store.getters['auth/getUserSteamUrl']) {
		store.dispatch('auth/requestWithToken', {
			url: baseUrl + `/api/goods/my_goods`,
			method: "GET",
			success: (res) => {
				uni.hideLoading()
				success && success(res.data)
	
			},
			fail: (err) => {
				uni.hideLoading()
				fail && fail(err.data)
	
			}
		})
		}
		else{
			uni.hideLoading()
			uni.$tui.href('/pages/userinfo/userinfo')
			uni.showToast({
				title: '请先补充steam_url',
				icon: 'succee'
			});
		}
	},
	addStar(store, item_id, success, fail) {
		uni.showLoading();
		store.dispatch('auth/requestWithToken', {
			url: baseUrl + `/api/goods/stars/${item_id}/addStar/`,
			method: "POST",
			success: (res) => {
				uni.hideLoading()
				success && success(res.data)

			},
			fail: (err) => {
				uni.hideLoading()
				fail && fail(err.data)

			}
		})

	},
	deleteStar(store, data, success, fail) {
		uni.showLoading();
		store.dispatch('auth/requestWithToken', {
			url: baseUrl + `/api/goods/stars/delete_many/`,
			data: data,
			method: "DELETE",
			success: (res) => {
				uni.hideLoading()
				success && success(res.data)

			},
			fail: (err) => {
				uni.hideLoading()
				fail && fail(err.data)

			}
		})

	},
	historysList(store, data = {
		page: null,
		ordering: '-last_update,-create_time'
	}, success, fail) {
		uni.showLoading();
		store.dispatch('auth/requestWithToken', {
			url: baseUrl + `/api/goods/history/`,
			data: data,
			method: "GET",
			success: (res) => {
				uni.hideLoading()
				success && success(res.data)

			},
			fail: (err) => {
				uni.hideLoading()
				fail && fail(err.data)

			}
		})
	},
	addHistory(store, item_id, success, fail) {

		store.dispatch('auth/requestWithToken', {
			url: baseUrl + `/api/goods/history/${item_id}/addClick/`,
			method: "POST",
			isLogin: false,
			success: (res) => {

				success && success(res.data)

			},
			fail: (err) => {

				fail && fail(err.data)

			}
		})

	},
	deleteHistory(store, data, success, fail) {
		uni.showLoading();
		store.dispatch('auth/requestWithToken', {
			url: baseUrl + `/api/goods/history/delete_many/`,
			method: "DELETE",
			data: data,
			success: (res) => {
				uni.hideLoading()
				success && success(res.data)

			},
			fail: (err) => {
				uni.hideLoading()
				fail && fail(err.data)

			}
		})

	},
	feedBack(store, data = {
		question: null,
		title: null
	}, success, fail) {
		uni.showLoading();
		store.dispatch('auth/requestWithToken', {
			url: baseUrl + `/api/feedback/send`,
			method: "POST",
			data: data,
			success: (res) => {
				uni.hideLoading()
				success && success(res.data)

			},
			fail: (err) => {
				uni.hideLoading()
				fail && fail(err.data)

			}
		})

	},
	checkInList(store, data = {
		year: null,
		month: null
	}, success, fail) {
		uni.showLoading();
		const sign = api.Sign('/api/auth/checkin-list/', data)
		store.dispatch('auth/requestWithToken2', {
			url: baseUrl + `/api/auth/checkin-list/`,
			method: "POST",
			data: data,
			header: {
				'sign': sign
			},
			success: (res) => {
				uni.hideLoading()
				success && success(res.data)

			},
			fail: (err) => {
				uni.hideLoading()
				fail && fail(err.data)

			}
		})

	},
	async checkIn(store, data = {
		date: null
	}, success, fail) {
		uni.showLoading();
		const sign = api.Sign('/api/auth/checkin/', data)
		await store.dispatch('auth/requestWithToken2', {
			url: baseUrl + `/api/auth/checkin/`,
			method: "POST",
			data: data,
			header: {
				'sign': sign
			},
			success: (res) => {
				uni.hideLoading()

				success && success(res.data)


			},
			fail: (err) => {
				uni.hideLoading()

				fail && fail(err.data)

			}
		})

	},
	async invitedList(store, data = {
		page: 1,
		pagesize: 20
	}, success, fail) {
		uni.showLoading();
		const sign = api.Sign('/api/auth/invited-list/', data)
		await store.dispatch('auth/requestWithToken2', {
			url: baseUrl + `/api/auth/invited-list/`,
			method: "GET",
			data: data,
			header: {
				'sign': sign
			},
			success: (res) => {
				uni.hideLoading()
				success && success(res.data)

			},
			fail: (err) => {
				uni.hideLoading()
				fail && fail(err.data)

			}
		})

	},
	async pointsList(store, data = {
		page: 1,
		pagesize: 20,
		type: 0
	}, success, fail) {
		uni.showLoading();
		const sign = api.Sign('/api/auth/points-list/', data)
		await store.dispatch('auth/requestWithToken2', {
			url: baseUrl + `/api/auth/points-list/`,
			method: "GET",
			data: data,
			header: {
				'sign': sign
			},
			success: (res) => {
				uni.hideLoading()
				success && success(res.data)

			},
			fail: (err) => {
				uni.hideLoading()
				fail && fail(err.data)

			}
		})

	},

	getExteriorColor: {
		"崭新出厂": "#397439",
		"略有磨损": "#488B48",
		"久经沙场": "#F1AD4D",
		"破损不堪": "#B7625F",
		"战痕累累": "#B7625F",
		null: "#000"
	},
	getRarityColor: {
		"普通级": "#b3c2d7",
		"消费级": "#5168f6",
		"高级": "#5168f6",
		"工业级": "#6a96d3",
		"军规级": "#7f49f5",
		"卓越": "#7f49f5",
		"保密": "#c13dde",
		"非凡": "#c13dde",
		"隐秘": "#d85752",
		"大师": "#d85752",
		"违禁": "#F1AD4D",
		"奇异": "#c13dde",
		"受限": "#7f49f5",
		null: "#000"
	},
	getQualityColor: {
		"普通": "#b3c2d7",
		"★ StatTrak™": "#7f49f5",
		"★": "#7f49f5",
		"StatTrak™": "#956cbb",
		"纪念品": "#aea058",
		null: "#000"
	}

}
export default api