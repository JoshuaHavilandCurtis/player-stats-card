"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkplayer_stats_card"] = self["webpackChunkplayer_stats_card"] || []).push([["main"],{

/***/ "./src/assets/scss/main.scss":
/*!***********************************!*\
  !*** ./src/assets/scss/main.scss ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://player-stats-card/./src/assets/scss/main.scss?");

/***/ }),

/***/ "./src/assets/ts/components/common/custom-selectors.ts":
/*!*************************************************************!*\
  !*** ./src/assets/ts/components/common/custom-selectors.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.CustomSelector = void 0;\r\nexports[\"default\"] = () => {\r\n    const customSelectorElmts = document.querySelectorAll(\"[data-custom-selector]\");\r\n    for (const customSelectorElmt of customSelectorElmts)\r\n        new CustomSelector(customSelectorElmt);\r\n};\r\n/**\r\n * A custom selectbox that styles better than the standard one.\r\n *\r\n * Underneath, it still uses a standard selectbox which gets updated alongside this\r\n * one, so formdata still works.\r\n * */\r\nclass CustomSelector {\r\n    originalSelect;\r\n    opened = false;\r\n    options;\r\n    selectedOption = null;\r\n    elmt;\r\n    selectedOptionElmt;\r\n    optionListElmt;\r\n    transitionDuration = 0;\r\n    constructor(originalSelect) {\r\n        this.originalSelect = originalSelect;\r\n        this.elmt = this.generate.elmt();\r\n        //put attributes currently on the selectbox onto the containing elmt\r\n        for (const attribute of this.originalSelect.attributes) {\r\n            this.elmt.setAttribute(attribute.name, attribute.value);\r\n            this.originalSelect.removeAttribute(attribute.name);\r\n        }\r\n        //and then replace the selectbox with this containing elmt\r\n        this.originalSelect.replaceWith(this.elmt);\r\n        this.elmt.appendChild(this.originalSelect);\r\n        //generate the custom elements\r\n        this.optionListElmt = this.generate.optionList();\r\n        this.selectedOptionElmt = this.generate.selectedBox();\r\n        //generate the custom option elements using the original options\r\n        this.options = [];\r\n        const originalOptions = Array.from(this.originalSelect.options);\r\n        for (const option of originalOptions.map(originalOption => this.generate.option(originalOption)))\r\n            this.addOption(option);\r\n        //if it exists, select the originally selected option\r\n        const originalSelectedOption = this.options.find(option => originalOptions.find(originalOption => originalOption.value === option.value && originalOption.selected));\r\n        if (originalSelectedOption !== undefined)\r\n            this.selectOption(originalSelectedOption);\r\n        //custom elements are ready: add them to the DOM now\r\n        this.elmt.appendChild(this.selectedOptionElmt);\r\n        this.elmt.appendChild(this.optionListElmt);\r\n        //get the calculated transition duration for the options menu after adding to the DOM\r\n        this.transitionDuration = parseFloat(getComputedStyle(this.optionListElmt).transitionDuration) * 1000;\r\n        //close when clicking off\r\n        window.addEventListener(\"click\", ev => {\r\n            const target = ev.target;\r\n            if (target === this.selectedOptionElmt || !this.opened || this.elmt.contains(target))\r\n                return;\r\n            this.close();\r\n        });\r\n    }\r\n    open() {\r\n        this.opened = true;\r\n        this.elmt.classList.add(\"opened\");\r\n    }\r\n    close() {\r\n        this.opened = false;\r\n        this.elmt.classList.remove(\"opened\");\r\n    }\r\n    toggle() {\r\n        if (this.opened) {\r\n            this.close();\r\n        }\r\n        else {\r\n            this.open();\r\n        }\r\n    }\r\n    addOption(option) {\r\n        this.options.push(option);\r\n        this.optionListElmt.appendChild(option.elmt);\r\n    }\r\n    removeOption(option) {\r\n        this.options.splice(this.options.indexOf(option), 1);\r\n        this.optionListElmt.removeChild(option.elmt);\r\n    }\r\n    selectOption(option) {\r\n        //add new option text to the selected option box\r\n        this.selectedOptionElmt.textContent = option.elmt.textContent;\r\n        //update original select box\r\n        this.originalSelect.selectedIndex = -1;\r\n        option.originalElmt.selected = true;\r\n        this.originalSelect.dispatchEvent(new Event(\"change\"));\r\n        //update the selected option\r\n        const previouslySelectedOption = this.selectedOption;\r\n        this.selectedOption = option;\r\n        this.close();\r\n        setTimeout(() => {\r\n            //show previous option to the list, and hide the new one\r\n            if (this.selectedOption === null)\r\n                return;\r\n            this.selectedOption.elmt.classList.add(\"selected\");\r\n            if (previouslySelectedOption !== null)\r\n                previouslySelectedOption.elmt.classList.remove(\"selected\");\r\n        }, this.transitionDuration);\r\n    }\r\n    generate = {\r\n        elmt: () => {\r\n            const elmt = document.createElement(\"div\");\r\n            return elmt;\r\n        },\r\n        selectedBox: () => {\r\n            const selectedBox = document.createElement(\"span\");\r\n            selectedBox.classList.add(\"selected-option\");\r\n            selectedBox.textContent = \"Please select...\";\r\n            selectedBox.addEventListener(\"click\", () => this.toggle());\r\n            return selectedBox;\r\n        },\r\n        optionList: () => {\r\n            const optionList = document.createElement(\"ul\");\r\n            optionList.classList.add(\"options\");\r\n            return optionList;\r\n        },\r\n        option: (originalElmt) => {\r\n            const elmt = document.createElement(\"li\");\r\n            elmt.textContent = originalElmt.textContent;\r\n            elmt.classList.add(\"option\");\r\n            const option = { elmt, originalElmt, value: originalElmt.value };\r\n            option.elmt.addEventListener(\"click\", () => this.selectOption(option));\r\n            return option;\r\n        }\r\n    };\r\n}\r\nexports.CustomSelector = CustomSelector;\r\n\n\n//# sourceURL=webpack://player-stats-card/./src/assets/ts/components/common/custom-selectors.ts?");

/***/ }),

/***/ "./src/assets/ts/components/player-card.ts":
/*!*************************************************!*\
  !*** ./src/assets/ts/components/player-card.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nconst custom_selectors_1 = __webpack_require__(/*! ./common/custom-selectors */ \"./src/assets/ts/components/common/custom-selectors.ts\");\r\nexports[\"default\"] = () => {\r\n    const entryPoint = document.getElementById(\"player-card-entrypoint\");\r\n    if (entryPoint === null)\r\n        throw new Error(\"Failed to find player card entry point!\");\r\n    handlePlayerCard(entryPoint);\r\n};\r\nlet players = null;\r\nlet entryPoints = null;\r\nconst handlePlayerCard = async (mainEntryPoint) => {\r\n    entryPoints = {\r\n        selector: generateEntryPoint.selector(),\r\n        card: generateEntryPoint.card()\r\n    };\r\n    mainEntryPoint.appendChild(entryPoints.selector);\r\n    mainEntryPoint.appendChild(entryPoints.card);\r\n    //read player data from json\r\n    const data = await getPlayerData();\r\n    players = new Map();\r\n    for (const player of data.players)\r\n        players.set(player.player.id, player);\r\n    //When we render the player selector, a selectbox is generated.\r\n    //Selectboxes by default set the first item to be the selected one.\r\n    //As a result, the first player is rendered when the page loads.\r\n    render.playerSelector(Array.from(players.values()));\r\n};\r\nconst getPlayerData = async () => {\r\n    const res = await fetch(\"/static/data/player-stats.json\").catch(e => {\r\n        throw new Error(`Failed to retrieve player data! - ${e}`);\r\n    });\r\n    return await res.json();\r\n};\r\nconst render = {\r\n    loader() {\r\n        if (entryPoints === null)\r\n            throw new Error(\"Entry points not set!\");\r\n        const entryPoint = entryPoints.card;\r\n        entryPoint.innerHTML = ``;\r\n    },\r\n    playerSelector(players) {\r\n        if (entryPoints === null)\r\n            throw new Error(\"Entry points not set!\");\r\n        const entryPoint = entryPoints.selector;\r\n        entryPoint.innerHTML = `\r\n\t\t<select class=\"selector\">\r\n\t\t\t${players.map(player => `<option value=\"${player.player.id}\">${player.player.name.first} ${player.player.name.last}</option>`).join(\"\")}\r\n\t\t</select>\r\n\t\t`;\r\n        const selector = entryPoint.querySelector(\".selector\");\r\n        if (selector === null)\r\n            throw new Error(\"Failed to find generated selector element!\");\r\n        //whenever selector changes, render the newly selected player\r\n        selector.addEventListener(\"change\", () => {\r\n            //get the selected option\r\n            const selectedPlayer = selector.selectedOptions[0];\r\n            if (selectedPlayer === undefined)\r\n                return;\r\n            //find the corresponding player\r\n            const playerId = selectedPlayer.value;\r\n            if (players === null)\r\n                throw new Error(\"Players not set!\");\r\n            const player = players.find(player => player.player.id === parseInt(playerId));\r\n            if (player === undefined)\r\n                throw new Error(\"Failed to find a player for the provided id!\");\r\n            //display this player\r\n            render.player(player);\r\n        });\r\n        new custom_selectors_1.CustomSelector(selector);\r\n    },\r\n    player(player) {\r\n        if (entryPoints === null)\r\n            throw new Error(\"Entry points not set!\");\r\n        const entryPoint = entryPoints.card;\r\n        const getStat = (statName) => player.stats.find(stat => stat.name === statName)?.value ?? null;\r\n        const renderStat = (stat) => stat === null ? \"Unknown\" : stat;\r\n        //read / calculate stats\r\n        const goals = getStat(\"goals\");\r\n        const appearances = getStat(\"appearances\");\r\n        const assists = getStat(\"goal_assist\");\r\n        const goalsPerMatch = goals === null || appearances === null ? null : (goals / appearances).toFixed(2);\r\n        const fwdPasses = getStat(\"fwd_pass\");\r\n        const backwardPasses = getStat(\"backward_pass\");\r\n        const minsPlayed = getStat(\"mins_played\");\r\n        const passesPerMinute = fwdPasses === null || backwardPasses === null || minsPlayed === null ? null : ((fwdPasses + backwardPasses) / minsPlayed).toFixed(2);\r\n        entryPoint.innerHTML = `\r\n\t\t<div class=\"player-card\">\r\n\r\n\t\t\t<div class=\"player-card__header\">\r\n\t\t\t\t<img src=\"/static/img/p${player.player.id}.png\">\r\n\t\t\t</div>\r\n\r\n\t\t\t<div class=\"player-card__details\">\r\n\t\t\t\t<div class=\"player-card__image\"></div>\r\n\r\n\t\t\t\t<div class=\"player-card-headings\">\r\n\t\t\t\t\t<h1 class=\"player-card__heading\">${player.player.name.first} ${player.player.name.last}</h1>\r\n\t\t\t\t\t<h2 class=\"player-card__subtitle\">${player.player.info.positionInfo}</h2>\r\n\t\t\t\t</div>\r\n\r\n\t\t\t\t<ul class=\"player-card__table\">\r\n\t\t\t\t\t<li>Appearances <span>${renderStat(appearances)}</span></li>\r\n\t\t\t\t\t<li>Goals <span>${renderStat(goals)}</span></li>\r\n\t\t\t\t\t<li>Assists <span>${renderStat(assists)}</span></li>\r\n\t\t\t\t\t<li>Goals per match <span>${renderStat(goalsPerMatch)}</span></li>\r\n\t\t\t\t\t<li>Passes per minute <span>${renderStat(passesPerMinute)}</span></li>\r\n\t\t\t\t</ul>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t`;\r\n    }\r\n};\r\nconst generateEntryPoint = {\r\n    selector() {\r\n        const selectorContainer = document.createElement(\"div\");\r\n        selectorContainer.classList.add(\"player-selector-container\");\r\n        return selectorContainer;\r\n    },\r\n    card() {\r\n        const cardContainer = document.createElement(\"div\");\r\n        cardContainer.classList.add(\"player-card-container\");\r\n        return cardContainer;\r\n    }\r\n};\r\n\n\n//# sourceURL=webpack://player-stats-card/./src/assets/ts/components/player-card.ts?");

/***/ }),

/***/ "./src/assets/ts/lib/waitForDOM.ts":
/*!*****************************************!*\
  !*** ./src/assets/ts/lib/waitForDOM.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports[\"default\"] = async () => new Promise(resolve => {\r\n    if (document.readyState === \"interactive\" || document.readyState === \"complete\")\r\n        return resolve();\r\n    document.addEventListener(\"DOMContentLoaded\", function domLoadedCallback() {\r\n        document.removeEventListener(\"DOMContentLoaded\", domLoadedCallback);\r\n        return resolve();\r\n    });\r\n});\r\n\n\n//# sourceURL=webpack://player-stats-card/./src/assets/ts/lib/waitForDOM.ts?");

/***/ }),

/***/ "./src/assets/ts/main.ts":
/*!*******************************!*\
  !*** ./src/assets/ts/main.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nconst custom_selectors_1 = __importDefault(__webpack_require__(/*! ./components/common/custom-selectors */ \"./src/assets/ts/components/common/custom-selectors.ts\"));\r\nconst player_card_1 = __importDefault(__webpack_require__(/*! ./components/player-card */ \"./src/assets/ts/components/player-card.ts\"));\r\nconst waitForDOM_1 = __importDefault(__webpack_require__(/*! ./lib/waitForDOM */ \"./src/assets/ts/lib/waitForDOM.ts\"));\r\n(0, waitForDOM_1.default)().then(() => {\r\n    //common\r\n    (0, custom_selectors_1.default)();\r\n    //non-reusable\r\n    (0, player_card_1.default)();\r\n});\r\n\n\n//# sourceURL=webpack://player-stats-card/./src/assets/ts/main.ts?");

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./src/assets/ts/main.ts"), __webpack_exec__("./src/assets/scss/main.scss"));
/******/ }
]);