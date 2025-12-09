"use strict";

import "./uint8array_extensions.mjs";

const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

async function getPatch(name) {
	return await (await fetch(`./patches/${name}.js`)).text();
}

async function applyPatchBase(base_name, name) {
	const base_contents = await (await fetch(`./patches/${base_name}.js`)).text();
	const patch_contents = await (await fetch(`./patches/${name}.js`)).text();
	const patch = new AsyncFunction("base", patch_contents);
	return await patch(base_contents) || base_contents;
}

async function calculateSHA256(bytes) {
	const hashBuffer = await crypto.subtle.digest('SHA-256', bytes);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const games = {
	None: {
		title: "Unknown",
		platform: null,
		identifier: null,
		patch: null
	},

	BLES00323: {
		title: "Mercenaries 2: World in Flames™ [BLES00323] [01.03]",
		platform: "PowerPC64",
		elfSHA256: "a220ff195c16b9718657a3b3b7977562ed3bfee5d6118ff8139cf7cb2af77a3e",
		patch: await getPatch("BLES00323")
	},

	BLES00323: {
		title: "Mercenaries 2: World in Flames™ [BLUS30056] [01.03]",
		platform: "PowerPC64",
		elfSHA256: "a220ff195c16b9718657a3b3b7977562ed3bfee5d6118ff8139cf7cb2af77a3e",
		patch: await getPatch("BLUS30056")
	},
}

export const GameLoading = {
	findFromElf: async (elf) => {
		const platform_matches = [];
		for(const game_info of Object.values(games)) {
			if(elf.machine === game_info.platform) platform_matches.push(game_info);
		}

		if (platform_matches.length === 0) throw "No pre-configured games that match this ELF's ISA have been found";
		
		// Calculate SHA256 of the ELF
		const elfSHA256 = await calculateSHA256(elf.bytes);
		console.log(`ELF SHA256: ${elfSHA256}`);
		
		// Try to find a match by SHA256
		let found_game = undefined;
		for(const game_info of platform_matches) {
			if(game_info.elfSHA256 && game_info.elfSHA256.toLowerCase() === elfSHA256.toLowerCase()) {
				if(found_game !== undefined) throw `Multiple matches for game in ELF: ${game_info.title} and ${found_game.title}`;
				found_game = game_info;
			}
		}
		
		if(found_game === undefined) {
			throw `No pre-configured games for this ELF have been found. ELF SHA256: ${elfSHA256}`;
		}
		
		return found_game;
	},
	
	calculateSHA256: calculateSHA256
};

export default GameLoading;