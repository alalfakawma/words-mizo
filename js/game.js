// ------------ * INIT GLOBAL VARS * -------------
var level, touchDown = false, letters, resultWord = [], foundWords, maxLevel, hintPoints, hintedWords;

// Load saved data
loadGame();

document.addEventListener('touchend', function() {
	touchDown = false;

	if (resultWord.length > 0) {
		var resHol = document.querySelectorAll('.resultHolder');
		for(var i = 0; i < resHol.length; i++) {
			var pass = false;
			var word = resHol[i].getAttribute('data-word');
			if (resultWord.join('') == word) {
				pass = true;

				// ALREADY FOUND WORD DISPLAY
				if (foundWords.length == 0) {
					foundWords.push(word);
				} else {
					for(var x = 0; x < foundWords.length; x++) {
						if (resultWord.join('') == foundWords[x]) {
							var getInfo = document.querySelector('.infoDisplay');

							if (getInfo.innerText == '') {
								getInfo.innerText = "I tih tawh khi";
								getInfo.style.color = "#000";
								getInfo.style.background = "#fff";

								setTimeout(function () {
									getInfo.innerText = '';
								}, 1000);
							}
							break;
						} else if (x >= foundWords.length - 1) {
							foundWords.push(word);
							// Provide some hintpoints for use randomly
							if (Math.floor(Math.random() * 100) > 50) {
								hintPoints += Math.floor(Math.random() * 20);
							}
							break;
						}
					}
				}

				var inner = resHol[i].querySelectorAll('.alphaBox');

				for (var p = 0; p < inner.length; p++) {
					inner[p].classList.add('show-result');

					var getInfo = document.querySelector('.infoDisplay');

					if (getInfo.innerText == '') {
						getInfo.innerText = congrats[random(0, congrats.length - 1)];
						getInfo.style.background = "#2ecc71";
						getInfo.style.color = "#fff";

						setTimeout(function () {
							getInfo.innerText = '';
						}, 1000);
					}

					if (!inner[p].parentNode.classList.contains('result-shown')) {
						inner[p].parentNode.classList.add('result-shown');
					}
				}
			}

			// ---- WRONG WORD DISPLAY
			if (i == resHol.length - 1 && pass == false) {
				var getInfo = document.querySelector('.infoDisplay');

				if (getInfo.innerText == '') {
					getInfo.innerText = wrongWords[random(0, wrongWords.length - 1)];
					getInfo.style.background = "#e74c3c";
					getInfo.style.color = "#fff";

					setTimeout(function() {
						getInfo.innerText = '';
					}, 1000);
				}
			}
		}
	}

	var getLet = document.querySelectorAll('.letter');
	var resDis = document.querySelector('.resultDisplay .resultHolder');

	resDis.innerHTML = '';

	for(var i = 0; i < getLet.length; i++) {
		getLet[i].style.color = "initial";
		getLet[i].classList.remove('selected');
	}

	if (foundWords.length >= words[level - 1].word.length) {

		foundWords = [];

		// Level completed
		if (level < words.length) {
			var comLv = document.querySelector('.completedLevel');

			setTimeout(function () {
				comLv.style.display = 'block';
			}, 1000);
		}
	}

	resultWord = [];
	updateHP();
	saveGame();
});

function init() {
	generateWords();
	populateLevels();
}

function generateWords() {

	// Level display
	var getLvl = document.querySelector('.levelDisplay');
	getLvl.innerText = 'Level ' + level;

	var getResBox = document.querySelector('.resultBox');
	getResBox.innerHTML = '';
	// Create topPortion words from words list
	for (var i = 0; i < words[level - 1].word.sort(function(a, b) {return a.length - b.length || a.localeCompare(b)}).length; i++) {
		var resHolder = document.createElement('div');
		resHolder.setAttribute('class', 'resultHolder');
		resHolder.setAttribute('data-word', words[level - 1].word[i]);
		getResBox.appendChild(resHolder);
		for (var p = 0; p < words[level - 1].word[i].length; p++) {
			var alpha = document.createElement('div');
			alpha.setAttribute('class', 'alphaBox hidden-result');
			alpha.innerText = words[level - 1].word[i][p].toUpperCase();
			resHolder.appendChild(alpha);
		}
	}

	generateAlphaBets();
	updateHP();
	reShowWords();
	saveGame();
}

function updateHP() {
	var hp = document.querySelector('.hintPoints');

	hp.innerText = "HP : " + hintPoints;
}

function generateAlphaBets() {
	letters = [];
	var letterHol = document.querySelector('.letterHolder');
	letterHol.innerHTML = '';

	// ------- Grab longest string and parse it first ------------
	var longestStr = words[level - 1].word[0];
	for(var i = 0; i < words[level - 1].word.length; i++) {
		if (words[level - 1].word[i].length > longestStr.length) {
			longestStr = words[level - 1].word[i];
		}
	}
		// Parse the longest string
		for(var i = 0; i < longestStr.length; i++) {
			letters.push(longestStr[i]);
		}

	// Populate letters array and eliminate words that are already there
	for(var i = 0; i < words[level - 1].word.length; i++) {
		for(var p = 0; p < words[level - 1].word[i].length; p++) {
			var letter = words[level - 1].word[i][p];

			if (letters.includes(letter)) {
				continue;
			} else {
				letters.push(letter);
			}
		}
	}

	shuffle(letters);

	for (var i = 0; i < letters.length; i++) {
		var letterEl = document.createElement('div');
		letterEl.setAttribute('class', 'letter');
		letterEl.setAttribute('data-letter', letters[i]);
		letterEl.innerText = letters[i].toUpperCase();

		letterEl.addEventListener('touchstart', function() {
			if (touchDown == false) {
				touchDown = true;
			}
			if (!this.classList.contains('selected')) {
				var theletter = this.getAttribute('data-letter');
				this.style.color = "#999";
				createAndAdd(theletter);
				resultWord.push(theletter);
				this.classList.add('selected');
			}
		});

		letterHol.appendChild(letterEl);
	}
}

function populateLevels() {
	var levelHol = document.querySelector('.levelHolder');

	for (var i = 0; i < words.length; i++) {
		var ele = document.createElement('div');
		ele.setAttribute('class', 'level');
		ele.setAttribute('data-level', words[i].level);
		if (ele.getAttribute('data-level') > maxLevel) {
			ele.classList.add('locked');
		}
		ele.setAttribute('onclick', 'level = ' + words[i].level + '; ' + 'generateWords(); this.parentNode.parentNode.style.display = "none";')
		ele.innerText = "Level " + words[i].level;

		levelHol.appendChild(ele);
	}
}

function createAndAdd(string) {
	var appendTo = document.querySelector('.resultDisplay .resultHolder');
	var alpha = document.createElement('div');
	alpha.setAttribute('class', 'alphaBox');
	alpha.innerText = string.toUpperCase();

	appendTo.appendChild(alpha);
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
}

function random(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function nextLevel(ele) {
	var parent = ele.parentNode;
	var maxLevel = words.length;

	if (level <= maxLevel) {
		level++;
		generateWords();
	}

	parent.style.display = 'none';
}

function maxInc() {
	if (level > maxLevel) {
		maxLevel++;
	}

	var locked = document.querySelectorAll('.level.locked');

	for(var i = 0; i < locked.length; i++) {
		var l = locked[i].getAttribute('data-level');

		if (l <= maxLevel) {
			if (locked[i].classList.contains('locked')) {
				locked[i].classList.remove('locked');
			}
		}
	}

}

document.body.addEventListener('touchmove', function(e){
	var x = e.changedTouches[0].pageX;
	var y = e.changedTouches[0].pageY;

	var secondElement = document.elementFromPoint(x, y);
	var getLet = document.querySelectorAll('.letter');

	for(var i = 0; i < getLet.length; i++) {
		if (getLet[i] == secondElement) {
			if (touchDown == true) {
				if (!getLet[i].classList.contains('selected')) {
					var theletter = getLet[i].getAttribute('data-letter');
					getLet[i].style.color = "#999";
					createAndAdd(theletter);
					resultWord.push(theletter);
					getLet[i].classList.add('selected');
				}
			}
		}
	}

}, false);

function saveToLocal(name, value) {
	localStorage.setItem(name, value);
}

function loadFromLocal(name) {
	return localStorage.getItem(name);
}

function saveGame() {
	saveToLocal('max-level', maxLevel);
	saveToLocal('current-level', level);
	saveToLocal('found-words', JSON.stringify(foundWords));
	saveToLocal('hint-points', hintPoints);
	saveToLocal('hinted-words', JSON.stringify(hintedWords));
}

function loadGame() {
	maxLevel = (loadFromLocal('max-level')) ? parseFloat(loadFromLocal('max-level')) : 1;
	level = (loadFromLocal('current-level')) ? parseFloat(loadFromLocal('current-level')) : 1;
	foundWords = (loadFromLocal('found-words')) ? JSON.parse(loadFromLocal('found-words')) : [];
	hintedWords = (loadFromLocal('hinted-words')) ? JSON.parse(loadFromLocal('hinted-words')) : [];
	hintPoints = (loadFromLocal('hint-points')) ? parseFloat(loadFromLocal('hint-points')) : 0;
}

function reShowWords() {
	var wordsArray = document.querySelectorAll('.resultHolder');

	if (arrayCompare(words[level - 1].word, foundWords).length == foundWords.length) {
		for(var i = 0; i < wordsArray.length; i++) {
			var theWord = wordsArray[i];
			for(var p = 0; p < foundWords.length; p++) {
				if (theWord.getAttribute('data-word') == foundWords[p]) {
					theWord.classList.add('result-shown');
					var child = theWord.querySelectorAll('.alphaBox');
					for(var x = 0; x < child.length; x++) {
						child[x].classList.add('show-result');
					}
				}
			}
		}
	} else {
		foundWords = [];
	}

	// Clear hinted words if player goes to different level
	if (!(parseFloat(loadFromLocal('current-level')) == level)) {
		hintedWords = [];
	}

	// re-show Hinted alphabets
	if (hintedWords.length > 0) {
		for(var i = 0; i < wordsArray.length; i++) {
			for(var j = 0; j < hintedWords.length; j++) {
				if (wordsArray[i].getAttribute('data-word') == hintedWords[j][0] && !(foundWords.includes(hintedWords[j][0]))) {
					for(var k = 1; k < hintedWords[j].length; k++) {
						var alpha = wordsArray[i].querySelectorAll('.alphaBox');
						alpha[hintedWords[j][k]].classList.add('show-result');
					}
				}
			}
		}
	}

}

function arrayCompare(array1, array2) {
	var result = [];

	for(var i = 0; i < array1.length; i++) {
		for(var p = 0; p < array2.length; p++) {
			if (array1[i] == array2[p]) {
				result.push(array2[p]);
			}
		}
	}

	return (result.length > 0) ? result : false;
}

function play() {
	document.querySelector('.homePage').style.display = "none";
	document.querySelector('.levelMenu').style.display = "none";
}

function back(theThis) {
	var thisPos = theThis.getAttribute('data-pos');
	var getPos = document.querySelectorAll('[data-pos]');

	document.querySelector('.infoDisplay').innerHTML = '';

	for(var i = 0; i < getPos.length; i++) {
		if (getPos[i].getAttribute('data-pos') == thisPos - 1) {
			getPos[i].style.display = "block";
		}
	}
}

function useHint() {
	var hintPrice = 15;
	var wordBoxes = document.querySelectorAll('.resultHolder:not(.result-shown)');

	// Save hinted alphabets with their words ------------
		// First reserve all words first
		// Setup the words
		if (!(hintedWords.length > 0)) {
			for(var i = 0; i < wordBoxes.length - 1; i++) {
				var word = wordBoxes[i].getAttribute('data-word');

				var wordArr = [word];

				hintedWords.push(wordArr);
			}
		}

	if (hintPoints >= hintPrice) {
		hintPoints -= hintPrice;
		updateHP();
		var chosen = wordBoxes[Math.floor(Math.random() * (wordBoxes.length - 1))].querySelectorAll('.alphaBox');

		// Show alphabets
		for(var i = 0; i < chosen.length; i++) {
			if (!(chosen[i].classList.contains('show-result'))) {
				chosen[i].classList.add('show-result');

				for(var x = 0; x < hintedWords.length; x++) {
					if (hintedWords[x][0] == chosen[i].parentNode.getAttribute('data-word')) {
						hintedWords[x].push(i);
					}
				}

				if (chosen[i] == chosen[chosen.length - 1]) {
					chosen[i].parentNode.classList.add('result-shown');
					foundWords.push(chosen[i].parentNode.getAttribute('data-word'));
				}
				break;
			}
		}

		// Check for game done
		if (foundWords.length >= words[level - 1].word.length) {

			foundWords = [];

			// Level completed
			if (level < words.length) {
				var comLv = document.querySelector('.completedLevel');

				setTimeout(function () {
					comLv.style.display = 'block';
				}, 1000);
			}
		}

		saveGame();
	} else {
		document.querySelector('.infoDisplay').innerText = "Hint point in a daih lo";
		document.querySelector('.infoDisplay').style.background = "#fff";

		setTimeout(function () {
			document.querySelector('.infoDisplay').innerText = '';
		}, 900);
	}
}


function callReset() {
	document.querySelector('.resetDialog').style.display = "block";
}

function resetGame() {
	hintedWords = [];
	hintPoints = 0;
	foundWords = [];
	maxLevel = 1;
	level = 1;
	document.querySelector('.restartGame').click();

	var levels = document.querySelectorAll('.level');

	for(var i = 0; i < levels.length; i++) {
		var thelvl = levels[i].getAttribute('data-level');

		if (thelvl != maxLevel) {
			levels[i].classList.add('locked');
		}
	}

	saveToLocal('max-level', 1);
	saveToLocal('current-level', 1);
	saveToLocal('found-words', JSON.stringify([]));
	saveToLocal('hinted-words', JSON.stringify([]));
	saveToLocal('hint-points', 0);
}

// START
init();