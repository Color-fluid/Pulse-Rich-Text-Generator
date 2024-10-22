window.onload = init;
selectFlag = false;

function init()
{
	carotLocation = 0;
	document.getElementById('inputText').addEventListener('keyup', e => {
		carotLocation = e.target.selectionStart;
		if (e.target.selectionStart == e.target.selectionEnd)
		{
			if (e.altKey && e.keyCode == 73) { // this is mostly an attempt to get hotkeys working. it only really worked in the electron form of this tool, but like... who the fuck wants that?
				e.preventDefault();
				tagInsert('Italics');
			} else if (e.altKey && e.keyCode == 83) {
				e.preventDefault();
				tagInsert('ST');
			}  else if (e.altKey && e.keyCode == 85) {
				e.preventDefault();
				tagInsert('UL');
			}
			updateCharCount();
			generatePreview();
			return selectFlag = false;
		}
		if (e.target.selectionStart != e.target.selectionEnd)
		{
			carotLocation = e.target.selectionStart;
			carotEndSelection = e.target.selectionEnd;
			selectFlag = true;

			if (e.shiftKey && e.altKey && e.keyCode == 73) { // this is mostly an attempt to get hotkeys working. it only really worked in the electron form of this tool, but like... who the fuck wants that?
				e.preventDefault();
				tagEncase('Italics');
			} else if (e.shiftKey && e.altKey && e.keyCode == 83) {
				e.preventDefault();
				tagEncase('ST');
			}  else if (e.shiftKey && e.altKey && e.keyCode == 85) {
				e.preventDefault();
				tagEncase('UL');
			}
		}
		updateCharCount();
	});
	document.getElementById('inputText').addEventListener('click', e => {
		carotLocation = e.target.selectionStart;
		generatePreview();
		updateCharCount();
		if (e.target.selectionStart == e.target.selectionEnd)
			return selectFlag = false;
		if (e.target.selectionStart != e.target.selectionEnd)
		{
			carotLocation = e.target.selectionStart;
			carotEndSelection = e.target.selectionEnd;
			selectFlag = true;
		}
	});
}

function updateCharCount()
{
	txt = document.getElementById('inputText').value;
	txtRemaining = 200 - txt.length;
	if (txtRemaining == 1)
		return document.getElementById('charsLeft').innerHTML = "You have " + txtRemaining + " character remaining."
	if (txtRemaining < 0)
		return document.getElementById('charsLeft').innerHTML = "You're in the negatives. Your message will not send correctly."
	return document.getElementById('charsLeft').innerHTML = "You have " + txtRemaining + " characters remaining."
}

function encaseColorTag()
{
	let userInput = document.getElementById('inputText').value;
	let theColor = document.getElementById('colorValue').value;

	if (!selectFlag)
		return document.getElementById('warning').innerHTML = "Make sure that you have selected the text you would like to have Rich Text applied to."

	if (selectFlag)
		document.getElementById('warning').innerHTML = ''

	let colorTagString1 = '<font color="' + theColor + '">'
	let colorTagString2 = '</font>'
	let output = userInput.slice(0, carotLocation) + colorTagString1 + userInput.slice(carotLocation, carotEndSelection) + colorTagString2 + userInput.slice(carotEndSelection);
	document.getElementById('inputText').value = output;
	updateCharCount();
}

function encaseFontFace()
{
	let userInput = document.getElementById('inputText').value;
	let theFont = document.getElementById('fontFace').value;
	let fontFace = iHateThis(theFont);
	if (!selectFlag)
		return document.getElementById('warning').innerHTML = "Make sure that you have selected the text you would like to have Rich Text applied to."
	if (fontFace == null)
		return document.getElementById('warning').innerHTML = "You didn't assign a Font Face, please assign one." // this shouldn't be visible, but, just in case
	if (fontFace)
		document.getElementById('warning').innerHTML = ''
	let fontTagString1 = '<font face="' + fontFace + '">'
	let fontTagString2 = "</font>"
	let output = userInput.slice(0, carotLocation) + fontTagString1 + userInput.slice(carotLocation, carotEndSelection) + fontTagString2 + userInput.slice(carotEndSelection);
	document.getElementById('inputText').value = output;
	updateCharCount();
}

function encaseStroke()
{
	let userInput = document.getElementById('inputText').value;
	let strokeColor = document.getElementById('strokeColorValue').value;
	let strokeTag1 = `<stroke color="${strokeColor}">`;
	let strokeTag2 = '</stroke>'
	let output = userInput.slice(0, carotLocation) + strokeTag1 + userInput.slice(carotLocation, carotEndSelection) + strokeTag2 + userInput.slice(carotEndSelection);
	updateCSSVariables(strokeColor);
	document.getElementById('inputText').value = output;
	updateCharCount();
	// i say it again: this is so character intensive. who uses this???
}

function tagEncase(type)
{
	let userInput = document.getElementById('inputText').value;
	if (!selectFlag)
		return document.getElementById('warning').innerHTML = "Make sure that you have selected the text you would like to have Rich Text applied to."

	if (selectFlag)
		document.getElementById('warning').innerHTML = ''

	switch (type) {
		case 'Italics':
			var insert1 = "<i>"
			var insert2 = "</i>"
			break;
		case 'Bold':
			var insert1 = "<b>"
			var insert2 = "</b>"
			break;
		case 'ST':
			var insert1 = "<s>"
			var insert2 = "</s>"
			break;
		case 'UL':
			var insert1 = "<u>"
			var insert2 = "</u>"
			break;
		default:
			return console.log("color you fucking idiot you mistyped the tagencase");
	}
	let output = userInput.slice(0, carotLocation) + insert1 + userInput.slice(carotLocation, carotEndSelection) + insert2 + userInput.slice(carotEndSelection) // illegible dogshit mb
	document.getElementById('inputText').value = output;
	updateCharCount();
}

function generatePreview() // 10/18/24 y'know, after putting in "parsedInputXX", i'm beginning to realize there's probably a better way to do this. don't care.
{
	let userInput = document.getElementById('inputText').value;
	let parsedInput = userInput.replace(/\n/g, "<br>");
	let parsedInput2 = parsedInput.replace("<stroke", "<custom-stroke");
	let parsedInput3 = parsedInput2.replace("</stroke>", "</custom-stroke>");
	if (parsedInput3.includes("<custom-stroke")) {
		var parsedInput4 = parsedInput3.replace(/(color..........)/, ""); // i love regex i love regex i love regex i love
	} else {
		var parsedInput4 = parsedInput3;
	}
	let parsedInput5 = parsedInput4.replace('face="Antique"', 'face="roman antique"'); 			// thanks cdnfont for not fucking naming your fonts correctly
	let parsedInput6 = parsedInput5.replace('face="Bodoni"', 'face="Bodoni Moda"'); 			// bodoni is formally known as bodoni moda
	let parsedInput7 = parsedInput6.replace('face="Cartoon"', 'face="Comic Neue"');				// cartoon is formally known as comic neue
	let parsedInput8 = parsedInput7.replace('face="Fantasy"', 'face="Balthazart"');				// fantasy is formally known as balthazart
	let parsedInput9 = parsedInput8.replace('face="FredokaOne"', 'face="Fredoka"');				// fredoka one is formally just fredoka (idk why). i love regex.
	let parsedInput10 = parsedInput9.replace('face="GrenzeGotisch"', 'face="Grenze Gotisch"');	// GIVE IT UP FOR PARSED INPUT NUMBER 10!!!
	let parsedInput11 = parsedInput10.replace('face=""');
	let previewP = document.getElementById('previewText');
	let strokeColor = document.getElementById('strokeColorValue').value;
	updateCSSVariables(strokeColor);
	previewP.innerHTML = '<font face="Arial">[YourNameHere]: </font>' + parsedInput10;
	// this is really janky and i don't apologize: this forces a repaint as to allow the stroke tag to work a little more properly. maybe.
	previewP.style.display='none';
	previewP.offsetHeight;
	previewP.style.display='';
}

// function insertAllOptions() 								// 7-28-24: there's gotta be a better way to do this, man. i may be stupid.
// {														// 10-9-24: WHY DID I DO THIS LIKE THIS TIME TO RIP IT ALL OUT AND DO A SWITCH-CASE INSTEAD (note: this was ALL IF STATEMENTS) (and im committing a worse crime)
// 	document.getElementById('warning').innerHTML = ""		// 10-21-24: this entire thing is scrapped now anyways, time to pick apart its code to repurpose into the "encase" stuff
// 	let userInput = document.getElementById('inputText').value;
// 	let colorBool = document.getElementById('textColorCheck').checked;
// 	let fontBool = document.getElementById('textFaceCheck').checked;
// 	let strokeBool = document.getElementById('strokeCheck').checked; // this is always set to true if we're talking about me after writing this shit
// 	var baseString = "";

// 	// time to do something really stupid. but at least the logic will function correctly... maybe. update after implementation: it works :)
// 	switch(`${colorBool} ${fontBool} ${strokeBool}`)
// 	{
// 		case "false false false":
// 			return document.getElementById('warning').innerHTML = "hey you don't have anything selected (for checkmarks)"
// 		case "true false false": // colorBool
// 			theColor = document.getElementById('colorValue').value;
// 			baseString = `<font color="${theColor}"></font>`
// 			break;
// 		case "false true false": // fontBool
// 			theFont = document.getElementById('fontFace').value;
// 			fontFace = iHateThis(theFont);
// 			baseString = `<font face="${fontFace}"></font>`
// 			break;
// 		case "false false true": // strokeBool
// 			strokeColor = document.getElementById('strokeColorValue').value;
// 			baseString = `<stroke color="${strokeColor}"></stroke>`;
// 			break;
// 		case "true true false": // colorBool + fontBool
// 			theColor = document.getElementById('colorValue').value;
// 			theFont = document.getElementById('fontFace').value;
// 			fontFace = iHateThis(theFont);
// 			baseString = `<font face="${fontFace}" color="${theColor}"></font>`
// 			break;
// 		case "true false true": // colorBool + strokeBool
// 			theColor = document.getElementById('colorValue').value;
// 			strokeColor = document.getElementById('strokeColorValue').value;
// 			baseString = `<stroke color="${strokeColor}"><font color="${theColor}"></font></stroke>`
// 			break;
// 		case "false true true": // fontBool + strokeBool
// 			theFont = document.getElementById('fontFace').value;
// 			fontFace = iHateThis(theFont);
// 			strokeColor = document.getElementById('strokeColorValue').value;
// 			baseString = `<stroke color="${strokeColor}"><font face="${fontFace}"></font></stroke>`
// 			break;
// 		case "true true true": // colorBool + fontBool + strokeBool
// 			theColor = document.getElementById('colorValue').value;
// 			theFont = document.getElementById('fontFace').value;
// 			fontFace = iHateThis(theFont);
// 			strokeColor = document.getElementById('strokeColorValue').value;
// 			baseString = `<stroke color="${strokeColor}"><font face="${fontFace}" color="${theColor}"></font></stroke>`
// 			break;
// 		default:
// 			return window.alert("not implemented yet, yell at color / peinte");
// 	}
//     let output = userInput.slice(0, carotLocation) + baseString + userInput.slice(carotLocation);
//     document.getElementById('inputText').value = output;
//     updateCharCount();
// }


function encaseAllOptions() // 10-18-24 i am now doing what i did to the insert options because evidently, it worked.
{							// 10-21-24 only now am i doing what i did to the insert options
	let userInput = document.getElementById('inputText').value;
	let colorBool = document.getElementById('textColorCheck').checked;
	let fontBool = document.getElementById('textFaceCheck').checked;
	let strokeBool = document.getElementById('strokeCheck').checked; // this is always set to true if we're talking about me after writing this shit (no officer i didn't copy paste this code wdym)
	var baseString = "";
	if (!selectFlag)
 		return document.getElementById('warning').innerHTML = "hey you didn't highlight the text (or use CTRL+A) can you try that again"
 	else {
 		document.getElementById('warning').innerHTML = ''
 	}
	switch(`${colorBool} ${fontBool} ${strokeBool}`)
	{
		case "false false false":
			return document.getElementById('warning').innerHTML = "hey you don't have any font options selected"
		case "true false false": // colorBool
			theColor = document.getElementById('colorValue').value;
			let colorTag1 = `<font color="${theColor}">`
			let colorTag2 = "</font>"
			baseString = userInput.slice(0, carotLocation) + colorTag1 + userInput.slice(carotLocation, carotEndSelection) + colorTag2 + userInput.slice(carotEndSelection); 
			break;
		case "false true false": // fontBool
			theFont = document.getElementById('fontFace').value;
			fontFace = iHateThis(theFont);
			let fontFTag1 = `<font face="${fontFace}">`
			let fontFTag2 = "</font>"
			baseString = userInput.slice(0, carotLocation) + fontFTag1 + userInput.slice(carotLocation, carotEndSelection) + fontFTag2 + userInput.slice(carotEndSelection); 
			break;
		case "false false true": // strokeBool
			strokeColor = document.getElementById('strokeColorValue').value;
			let strokeCTag1 = `<stroke color="${strokeColor}">`
			let strokeCTag2 = "</stroke>"
			baseString = userInput.slice(0, carotLocation) + strokeCTag1 + userInput.slice(carotLocation, carotEndSelection) + strokeCTag2 + userInput.slice(carotEndSelection);
			break;
		case "true true false": // colorBool + fontBool
			theColor = document.getElementById('colorValue').value;
			theFont = document.getElementById('fontFace').value;
			fontFace = iHateThis(theFont);
			let fontCFTag1 = `<font face="${fontFace}" color="${theColor}">`
			let fontCFTag2 = "</font>"
			baseString = userInput.slice(0, carotLocation) + fontCFTag1 + userInput.slice(carotLocation, carotEndSelection) + fontCFTag2 + userInput.slice(carotEndSelection);
			break;
		case "true false true": // colorBool + strokeBool
			theColor = document.getElementById('colorValue').value;
			strokeColor = document.getElementById('strokeColorValue').value;
			let FCSCTag1 = `<stroke color="${strokeColor}"><font color="${theColor}">`
			let FCSCTag2 = "</font></stroke>"
			baseString = userInput.slice(0, carotLocation) + FCSCTag1 + userInput.slice(carotLocation, carotEndSelection) + FCSCTag2 + userInput.slice(carotEndSelection);
			break;
		case "false true true": // fontBool + strokeBool
			theFont = document.getElementById('fontFace').value;
			fontFace = iHateThis(theFont);
			strokeColor = document.getElementById('strokeColorValue').value;
			let FFSCTag1 = `<stroke color="${strokeColor}"><font face="${fontFace}">`
			let FFSCTag2 = "</font></stroke>"
			baseString = userInput.slice(0, carotLocation) + FFSCTag1 + userInput.slice(carotLocation, carotEndSelection) + FFSCTag2 + userInput.slice(carotEndSelection);
			break;
		case "true true true": // colorBool + fontBool + strokeBool
			theColor = document.getElementById('colorValue').value;
			theFont = document.getElementById('fontFace').value;
			fontFace = iHateThis(theFont);
			strokeColor = document.getElementById('strokeColorValue').value;
			let FCFFSCTag1 = `<stroke color="${strokeColor}"><font face="${fontFace}" color="${theColor}">`
			let FCFFSCTag2 = "</font></stroke>"
			baseString = userInput.slice(0, carotLocation) + FCFFSCTag1 + userInput.slice(carotLocation, carotEndSelection) + FCFFSCTag2 + userInput.slice(carotEndSelection);
			break;
		default:
			return window.alert("not implemented yet, yell at color / peinte");
	}
	document.getElementById('inputText').value = baseString;
	updateCharCount();
}

function updateCSSVariables(color, width, transparency) // the "makeTheDamnRGBAValue" is unnecessary now as i'm pretty sure stroke transparency isn't supported in pulse. sooo...
{
	let theRGBAValue = makeTheDamnRGBAValue(color, 0.7)
	document.documentElement.style.setProperty('--stroke-color', theRGBAValue);
	document.documentElement.style.setProperty('--stroke-width', "2px");
}

function makeTheDamnRGBAValue(color, transparency) // this function is technical debt. it gets called even though it really doesn't have to anymore. :\ when i rewrite this project, this is gonna be gone
{
	let colorVal = color;
	let transparentVal = transparency;
	let themultiplystep = Math.floor(255 * transparentVal);
	let hexVal = themultiplystep.toString(16);
	if (hexVal == "0") {
		hexVal = "00";
	}
	let RGBAValue = colorVal + hexVal;
	return RGBAValue;
}

function iHateThis(theFont) // actual name: getFontFace
{
	// i dread what i am about to do
	// there are probably 50 better ways to do this; i do not care, i have power/neoclassical metal playing
	// future me here, 5/6/2024, i could've just made this a json and parsed it. fuck. WELL, IT'S HERE NOW
	if (!theFont) return null;
	switch (theFont) {
		case 'amatic':
			fontFaceUsed = "AmaticSC"
			break;
		case 'antique':
			fontFaceUsed = "Antique"
			break;
		case 'arcade':
			fontFaceUsed = "Arcade"
			break;
		case 'arimo':
			fontFaceUsed = "Arimo" // 6/21/2024: did you know that they phased out arial? wtf?
			break;
		case 'Legacy':
			fontFaceUsed = "Legacy"
			break;
		case 'bangers':
			fontFaceUsed = "Bangers"
			break;
		case 'bodoni':
			fontFaceUsed = "Bodoni"
			break;
		case 'cartoon':
			fontFaceUsed = "Cartoon"
			break;
		case 'code':
			fontFaceUsed = "TitilliumWeb"
			break; /* another re-used font? i believe this points to titilliumweb-regular, so...
				  	  5/10/24 update: it totally did (i checked the docs on roblox's fonts) */
		case 'creepster':
			fontFaceUsed = "Creepster"
			break;
		case 'denkOne':
			fontFaceUsed = "DenkOne"
			break;
		case 'fondamento':
			fontFaceUsed = "Fondamento"
			break;
		case 'fredokaOne':
			fontFaceUsed = "FredokaOne"
			break;
		case 'garamond':
			fontFaceUsed = "Bodoni" // for some reason, "garamond" and "bardoni" are literally the same fonts. garamond is just smaller. so...
			break;
		case 'grenzeGotisch':
			fontFaceUsed = "GrenzeGotisch"
			break;
		case 'indieFlower':
			fontFaceUsed = "IndieFlower"
			break;
		case 'josefinSans':
			fontFaceUsed = "JosefinSans"
			break;
		case 'jura':
			fontFaceUsed = "Jura"
			break;
		case 'kalam':
			fontFaceUsed = "Kalam"
			break;
		case 'luckiestGuy':
			fontFaceUsed = "LuckiestGuy"
			break;
		case 'merriweather':
			fontFaceUsed = "Merriweather"
			break;
		case 'michroma':
			fontFaceUsed = "Michroma"
			break;
		case 'nunito':
			fontFaceUsed = "Nunito"
			break;
		case 'oswald':
			fontFaceUsed = "Oswald"
			break;
		case 'patrickHand':
			fontFaceUsed = "PatrickHand"
			break;
		case 'permanentMarker':
			fontFaceUsed = "PermanentMarker"
			break;
		case 'roboto':
			fontFaceUsed = "Roboto"
			break;
		case 'robotoCondensed':
			fontFaceUsed = "RobotoCondensed"
			break;
		case 'robotoMono':
			fontFaceUsed = "RobotoMono"
			break;
		case 'sarpanch':
			fontFaceUsed = "Sarpanch"
			break;
		case 'scifi':
			fontFaceUsed = "Zekton"
			break;
		case 'sourceSans':
			fontFaceUsed = "SourceSans"
			break;
		case 'specialElite':
			fontFaceUsed = "SpecialElite"
			break;
		case 'titilliumWeb':
			fontFaceUsed = "TitilliumWeb"
			break;
		case 'ubuntu':
			fontFaceUsed = "Ubuntu"
			break;
		default:
			fontFaceUsed = null
			alert("color you fucking idiot you don't have that font in the list");
	}
	return fontFaceUsed;
}