/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var ObjectAssign = __webpack_require__(7);
	var Comics_sf = __webpack_require__(1);
	var Comics_8 = __webpack_require__(2);
	var Comics_dm5 = __webpack_require__(3);
	var collected = {
		collected: []
	};

	var readed = {
		readed: []
	};

	var update = {
		update: []
	};

	var redirectLocal = function redirectLocal(tabId, changeInfo, tab) {
		if (Comics_8.regex.test(tab.url) && changeInfo.status === 'loading') {
			console.log('8 comics fired');
			var chapter = Comics_8.regex.exec(tab.url)[1];
			chrome.tabs.update(tab.id, { url: chrome.extension.getURL('reader.html') + '#/site/comics8/chapter/' + chapter });
			ga('send', 'event', '8comics view');
		} else if (Comics_sf.regex.test(tab.url) && changeInfo.status === 'loading') {
			console.log('sf fired');
			var chapter = Comics_sf.regex.exec(tab.url)[1];
			chrome.tabs.update(tab.id, { url: chrome.extension.getURL('reader.html') + '#/site/sf/chapter/' + chapter });
			ga('send', 'event', 'sf view');
		} else if ((Comics_dm5.regex.test(tab.url) || Comics_dm5.dm5regex.test(tab.url)) && changeInfo.status === 'loading') {
			console.log('dm5 fired');
			var chapter = '';
			if (Comics_dm5.dm5regex.test(tab.url)) {
				chapter = Comics_dm5.dm5regex.exec(tab.url)[2];
			} else {
				chapter = Comics_dm5.regex.exec(tab.url)[1];
			}
			chrome.tabs.update(tab.id, { url: chrome.extension.getURL('reader.html') + '#/site/dm5/chapter/' + chapter });
			ga('send', 'event', 'dm5 view');
		}
	};

	chrome.notifications.onClicked.addListener(function (id) {
		chrome.tabs.create({ url: id });
	});

	var comicsQuery = function comicsQuery() {
		chrome.storage.local.get('collected', function (items) {
			for (var k = 0; k < items.collected.length; ++k) {
				var indexURL = items.collected[k].url;
				var chapters = items.collected[k].menuItems;
				var req = new XMLHttpRequest();
				req.open('GET', indexURL);
				req.responseType = 'document';
				if (items.collected[k].site === 'sf') {
					req.onload = (function (indexURL, chapters, req, items, k, Comics_sf) {
						return function () {
							Comics_sf.backgroundOnload(indexURL, chapters, req, items, k);
						};
					})(indexURL, chapters, req, items, k, Comics_sf);
				} else if (items.collected[k].site === 'comics8') {
					req.onload = (function (indexURL, chapters, req, items, k, Comics_8) {
						return function () {
							Comics_8.backgroundOnload(indexURL, chapters, req, items, k);
						};
					})(indexURL, chapters, req, items, k, Comics_8);
				} else if (items.collected[k].site === 'dm5') {
					req.onload = (function (indexURL, chapters, req, items, k, Comics_dm5) {
						return function () {
							Comics_dm5.backgroundOnload(indexURL, chapters, req, items, k);
						};
					})(indexURL, chapters, req, items, k, Comics_dm5);
				}
				req.send();
			}
		});
	};

	chrome.tabs.onUpdated.addListener(redirectLocal);

	chrome.storage.local.get('readed', function (items) {
		var readedItem = ObjectAssign(readed, items);
		chrome.storage.local.set(readedItem);
	});

	chrome.storage.local.get('update', function (items) {
		var updateItem = ObjectAssign(update, items);
		chrome.storage.local.set(updateItem);
	});

	chrome.storage.local.get('collected', function (items) {
		var collectedItem = ObjectAssign(collected, items);
		// console.log(collectedItem);
		chrome.storage.local.set(collectedItem, function () {
			// comicsQuery();
			setInterval(function () {
				comicsQuery();
			}, 60000);
		});
	});

	(function (i, s, o, g, r, a, m) {
		i['GoogleAnalyticsObject'] = r;i[r] = i[r] || function () {
			(i[r].q = i[r].q || []).push(arguments);
		}, i[r].l = 1 * new Date();a = s.createElement(o), m = s.getElementsByTagName(o)[0];a.alocal = 1;a.src = g;m.parentNode.insertBefore(a, m);
	})(window, document, 'script', 'https://ssl.google-analytics.com/analytics.js', 'ga');
	ga('create', 'UA-59728771-1', 'auto');
	ga('set', 'checkProtocolTask', null);
	ga('send', 'pageview');

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var ObjectAssign = __webpack_require__(7);
	var comics = {
		regex: /http\:\/\/comic\.sfacg\.com\/(HTML\/[^\/]+\/.+)$/,

		baseURL: "http://comic.sfacg.com/",

		handleUrlHash: function handleUrlHash() {
			var params_str = window.location.hash;
			this.site = /site\/(\w*)\//.exec(params_str)[1];
			this.pageURL = /chapter\/(HTML\/[^\/]+\/)/.exec(params_str)[1];
			this.chapterURL = this.baseURL + /chapter\/(.*)$/.exec(params_str)[1];
			this.indexURL = this.baseURL + this.pageURL;
			console.log("chapterURL", this.chapterURL);
			if (!/#$/.test(params_str)) {
				console.log("page back");
				document.getElementById("comics_panel").innerHTML = "";
				var index = -1;
				for (var i = 0; i < this.state.menuItems.length; ++i) {
					if (this.state.menuItems[i].payload === this.chapterURL && index === -1) {
						index = i;
						this.lastIndex = index;
						this._getImage(index, this.chapterURL);
						this.setState({ selectedIndex: index, chapter: this.state.menuItems[index].text, pageratio: "" }, (function () {
							this._saveStoreReaded();
						}).bind(this));
						break;
					}
				}
			} else {
				this.chapterURL = this.baseURL + /chapter\/(.*\/)#$/.exec(params_str)[1];
				window.history.replaceState("", document.title, "#/site/sf/chapter/" + /chapter\/(.*\/)#$/.exec(params_str)[1]);
			}
		},

		getChapter: function getChapter(doc) {
			var nl = doc.querySelectorAll(".serialise_list>li>a");
			return nl;
		},

		getTitleName: function getTitleName(doc) {
			return doc.querySelector("body > table:nth-child(8) > tbody > tr > td:nth-child(1) > table:nth-child(2) > tbody > tr > td > h1 > b").textContent;
		},

		getCoverImg: function getCoverImg(doc) {
			return doc.querySelector(".comic_cover>img").src;
		},

		setImages: function setImages(index, xhr) {
			eval(xhr.response);
			var name = "picHost=";
			var picHost = hosts[0];
			var img = [];
			this.pageMax = picCount;
			for (var i = 0; i < this.pageMax; i++) {
				img[i] = picHost + picAy[i];
			}
			this.images = img;
			this.appendImage(index);
		},
		backgroundOnload: function backgroundOnload(indexURL, chapters, req, items, k) {
			var doc = req.response;
			var nl = this.getChapter(doc);
			var title = this.getTitleName(doc);
			var imgUrl = this.getCoverImg(doc);
			var array = [];
			var obj = {};
			// chapters.pop();
			for (var i = 0; i < nl.length; ++i) {
				var item = {};
				item.payload = nl[i].href;
				item.text = nl[i].textContent;
				array.push(item);
				var urlInChapter = false;
				for (var j = 0; j < chapters.length; ++j) {
					if (chapters[j].payload === item.payload) {
						urlInChapter = true;
						break;
					}
				}
				if (!urlInChapter && chapters.length > 0) {
					ObjectAssign(obj, {
						url: indexURL,
						title: title,
						site: "sf",
						iconUrl: imgUrl,
						lastReaded: item
					});
					chrome.notifications.create(item.payload, {
						type: "image",
						iconUrl: "img/comics-64.png",
						title: "Comics Update",
						message: title + "  " + obj.lastReaded.text,
						imageUrl: imgUrl
					});
					chrome.storage.local.get("update", (function (items) {
						items.update.push(this);
						var num = items.update.length.toString();
						chrome.browserAction.setBadgeText({ text: num });
						chrome.storage.local.set(items);
					}).bind(obj));
				}
			}
			items.collected[k].menuItems = array;
			chrome.storage.local.set(items);
		}
	};

	module.exports = comics;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var ObjectAssign = __webpack_require__(7);
	var comics = {
		regex: /http\:\/\/new\.comicvip\.com\/show\/(.*-\d*.html\?ch=\d*)/,

		baseURL: "http://new.comicvip.com/show/",

		comicspageURL: "http://www.comicvip.com/html/",

		handleUrlHash: function handleUrlHash() {
			var params_str = window.location.hash;
			this.site = /site\/(\w*)/.exec(params_str)[1];
			this.pageURL = /chapter\/.*-(\d*\.html)\?/.exec(params_str)[1];
			this.chapterNum = /chapter\/.*\?ch\=(\d*)/.exec(params_str)[1];
			this.prefixURL = /chapter\/(.*\?ch\=)\d*/.exec(params_str)[1];;
			this.indexURL = this.comicspageURL + this.pageURL;
			if (!/#$/.test(params_str)) {
				console.log("page back");
				document.getElementById("comics_panel").innerHTML = "";
				var index = -1;
				for (var i = 0; i < this.state.menuItems.length; ++i) {
					if (this.state.menuItems[i].payload === this.baseURL + this.prefixURL + this.chapterNum && index === -1) {
						index = i;
						this.lastIndex = index;
						this._getImage(index, this.chapterNum);
						this.setState({ selectedIndex: index, chapter: this.state.menuItems[index].text, pageratio: "" }, (function () {
							this._saveStoreReaded();
						}).bind(this));
						break;
					}
				}
			} else {
				// console.log("replace with","#/site/comics8/chapter/"+(/chapter\/(.*)#$/.exec(params_str)[1]));	
				window.history.replaceState("", document.title, "#/site/comics8/chapter/" + /chapter\/(.*)#$/.exec(params_str)[1]);
			}
		},

		getChapter: function getChapter(doc) {
			return doc.querySelectorAll(".Vol , .ch , #lch");
		},

		getChapterUrl: function getChapterUrl(str) {
			var p_array = /cview\(\'(.*-\d*\.html)\',(\d*)/.exec(str);
			var catid = p_array[2];
			var url = p_array[1];
			var baseurl = "";
			if (catid == 4 || catid == 6 || catid == 12 || catid == 22) baseurl = "http://new.comicvip.com/show/cool-";
			if (catid == 1 || catid == 17 || catid == 19 || catid == 21) baseurl = "http://new.comicvip.com/show/cool-";
			if (catid == 2 || catid == 5 || catid == 7 || catid == 9) baseurl = "http://new.comicvip.com/show/cool-";
			if (catid == 10 || catid == 11 || catid == 13 || catid == 14) baseurl = "http://new.comicvip.com/show/best-manga-";
			if (catid == 3 || catid == 8 || catid == 15 || catid == 16 || catid == 18 || catid == 20) baseurl = "http://new.comicvip.com/show/best-manga-";
			url = url.replace(".html", "").replace("-", ".html?ch=");
			return baseurl + url;
		},

		getTitleName: function getTitleName(doc) {
			return doc.querySelector("body > table:nth-child(7) > tbody > tr > td > table > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(1) > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(2) > font").textContent;
		},

		getCoverImg: function getCoverImg(doc) {
			return doc.querySelector("body > table:nth-child(7) > tbody > tr > td > table > tbody > tr:nth-child(1) > td:nth-child(1) > img").src;
		},

		setImages: function setImages(index, doc) {
			var script = doc.evaluate("//*[@id=\"Form1\"]/script/text()", doc, null, XPathResult.ANY_TYPE, null).iterateNext().textContent.split("eval")[0];
			eval(script);
			var ch = /.*ch\=(.*)/.exec(doc.URL)[1];
			if (ch.indexOf("#") > 0) ch = ch.split("#")[0];
			var p = 1;
			var f = 50;
			if (ch.indexOf("-") > 0) {
				p = parseInt(ch.split("-")[1]);
				ch = ch.split("-")[0];
			}
			if (ch == "") ch = 1;else ch = parseInt(ch);
			var ss = function ss(a, b, c, d) {
				var e = a.substring(b, b + c);
				return d == null ? e.replace(/[a-z]*/gi, "") : e;
			};
			var nn = function nn(n) {
				return n < 10 ? "00" + n : n < 100 ? "0" + n : n;
			};
			var mm = function mm(p) {
				return parseInt((p - 1) / 10) % 10 + (p - 1) % 10 * 3;
			};
			var c = "";
			var cc = cs.length;
			for (var j = 0; j < cc / f; j++) {
				if (ss(cs, j * f, 4) == ch) {
					c = ss(cs, j * f, f, f);
					ci = j;
					break;
				}
			}
			if (c == "") {
				c = ss(cs, cc - f, f);
				ch = c;
			}
			ps = ss(c, 7, 3);
			this.pageMax = ps;
			var img = [];
			for (var i = 0; i < this.pageMax; ++i) {
				var c = "";
				var cc = cs.length;
				for (var j = 0; j < cc / f; j++) {
					if (ss(cs, j * f, 4) == ch) {
						c = ss(cs, j * f, f, f);
						ci = j;
						break;
					}
				}
				if (c == "") {
					c = ss(cs, cc - f, f);
					ch = chs;
				}
				img[i] = "http://img" + ss(c, 4, 2) + ".8comic.com/" + ss(c, 6, 1) + "/" + ti + "/" + ss(c, 0, 4) + "/" + nn(i + 1) + "_" + ss(c, mm(i + 1) + 10, 3, f) + ".jpg";
			}
			this.images = img;
			this.appendImage(index);
		},
		backgroundOnload: function backgroundOnload(indexURL, chapters, req, items, k) {
			var doc = req.response;
			var nl = this.getChapter(doc);
			var title = this.getTitleName(doc);
			var imgUrl = this.getCoverImg(doc);
			var array = [];
			var obj = {};
			var item = {};
			item.payload = Comics_8.getChapterUrl(nl[nl.length - 2].getAttribute("onclick"));
			item.text = nl[nl.length - 1].textContent;
			array.push(item);
			var urlInChapter = false;
			for (var j = 0; j < chapters.length; ++j) {
				if (chapters[j].payload === item.payload) {
					urlInChapter = true;
					break;
				}
			}
			if (urlInChapter === false && chapters.length > 0) {
				ObjectAssign(obj, {
					url: indexURL,
					title: title,
					site: "comics8",
					iconUrl: imgUrl,
					lastReaded: item
				});
				chrome.notifications.create(item.payload, {
					type: "image",
					iconUrl: "img/comics-64.png",
					title: "Comics Update",
					message: title + "  " + obj.lastReaded.text,
					imageUrl: imgUrl
				});
				chrome.storage.local.get("update", (function (items) {
					items.update.push(this);
					var num = items.update.length.toString();
					chrome.browserAction.setBadgeText({ text: num });
					chrome.storage.local.set(items);
				}).bind(obj));
			}
			for (var i = nl.length - 3; i >= 0; --i) {
				var item = {};
				item.payload = Comics_8.getChapterUrl(nl[i].getAttribute("onclick"));
				item.text = nl[i].textContent.trim();
				array.push(item);
				var obj = {};
				var urlInChapter = false;
				for (var j = 0; j < chapters.length; ++j) {
					if (chapters[j].payload === item.payload) {
						urlInChapter = true;
						break;
					}
				}
				if (urlInChapter === false && chapters.length > 0) {
					ObjectAssign(obj, {
						url: indexURL,
						title: title,
						site: "comics8",
						iconUrl: imgUrl,
						lastReaded: item
					});
					chrome.notifications.create(item.payload, {
						type: "image",
						iconUrl: "img/comics-64.png",
						title: "Comics Update",
						message: title + "  " + obj.lastReaded.text,
						imageUrl: imgUrl
					});
					chrome.storage.local.get("update", (function (items) {
						items.update.push(this);
						var num = items.update.length.toString();
						chrome.browserAction.setBadgeText({ text: num });
						chrome.storage.local.set(items);
					}).bind(obj));
				}
			}
			items["collected"][k].menuItems = array;
			chrome.storage.local.set(items);
		}
	};

	module.exports = comics;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var comics = {
		regex: /http\:\/\/www\.manben\.com\/(m\d*\/)/,

		dm5regex: /http\:\/\/(tel||www)\.dm5\.com\/(m\d*\/)/,

		baseURL: "http://www.manben.com/",

		handleUrlHash: function handleUrlHash() {
			var params_str = window.location.hash;
			this.site = /site\/(.*)/.exec(params_str)[1];
			this.chapterURL = this.baseURL + /chapter\/(.*\/)/.exec(params_str)[1];
			if (!/#$/.test(params_str)) {
				document.getElementById("comics_panel").innerHTML = "";
				var index = -1;
				for (var i = 0; i < this.state.menuItems.length; ++i) {
					if (this.state.menuItems[i].payload === this.chapterURL && index === -1) {
						index = i;
						this.lastIndex = index;
						this._getImage(index, this.chapterURL);
						this.setState({ selectedIndex: index, chapter: this.state.menuItems[index].text, pageratio: "" }, (function () {
							this._saveStoreReaded();
						}).bind(this));
						break;
					}
				}
			} else {
				window.history.replaceState("", document.title, "#/site/dm5/chapter/" + /chapter\/(.*\/)/.exec(params_str)[1]);
			}
		},

		getChapter: function getChapter(doc) {
			var nl = doc.querySelectorAll(".nr6.lan2>li>.tg");
			return nl;
		},

		getTitleName: function getTitleName(doc) {
			return doc.querySelector(".inbt_title_h2").textContent;
		},

		getCoverImg: function getCoverImg(doc) {
			return doc.querySelector(".innr91>img").src;
		},

		setImages: function setImages(index, xhr) {
			var doc = xhr.response;
			var script1 = /<script type\=\"text\/javascript\">(.*)reseturl/.exec(doc.head.innerHTML)[1];
			eval(script1);
			this.pageMax = DM5_IMAGE_COUNT;
			var img = [];
			for (var i = 0; i < this.pageMax; ++i) {
				img[i] = doc.URL + "chapterfun.ashx?cid=" + DM5_CID.toString() + "&page=" + (i + 1) + "&key=&language=1";
			}
			this.images = img;
			this.appendImage(index);
		},
		backgroundOnload: function backgroundOnload(indexURL, chapters, req, items, k) {
			var doc = req.response;
			var nl = this.getChapter(doc);
			var title = this.getTitleName(doc);
			var imgUrl = this.getCoverImg(doc);
			var array = [];
			var obj = {};
			for (var i = 0; i < nl.length; ++i) {
				var item = {};
				item.payload = nl[i].href;
				item.text = nl[i].textContent;
				array.push(item);
				var urlInChapter = false;
				for (var j = 0; j < chapters.length; ++j) {
					if (chapters[j].payload === item.payload) {
						urlInChapter = true;
						break;
					}
				}
				if (urlInChapter === false && chapters.length > 0) {
					ObjectAssign(obj, {
						url: indexURL,
						title: title,
						site: "dm5",
						iconUrl: imgUrl,
						lastReaded: item
					});
					chrome.notifications.create(item.payload, {
						type: "image",
						iconUrl: "img/comics-64.png",
						title: "Comics Update",
						message: title + "  " + obj.lastReaded.text,
						imageUrl: imgUrl
					});
					chrome.storage.local.get("update", (function (items) {
						items.update.push(this);
						var num = items.update.length.toString();
						chrome.browserAction.setBadgeText({ text: num });
						chrome.storage.local.set(items);
					}).bind(obj));
				}
			}
			items["collected"][k].menuItems = array;
			chrome.storage.local.set(items);
		}
	};

	module.exports = comics;

/***/ },
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function ToObject(val) {
		if (val == null) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	module.exports = Object.assign || function (target, source) {
		var from;
		var keys;
		var to = ToObject(target);

		for (var s = 1; s < arguments.length; s++) {
			from = arguments[s];
			keys = Object.keys(Object(from));

			for (var i = 0; i < keys.length; i++) {
				to[keys[i]] = from[keys[i]];
			}
		}

		return to;
	};

/***/ }
/******/ ]);