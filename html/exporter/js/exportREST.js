/*
Original source:
https://github.com/openhab/openhab-core/blob/master/bundles/org.openhab.ui.homebuilder/web/src/textItems.js
*/


/**
 * Toggle hidden content.
 * 
 * @param {Object} id 
 */
function showText(id) {
	var x = document.getElementById(id);
	if (x.style.display === "block") {
		x.style.display = "none";
	} else {
		x.style.display = "block";
	}
}

/**
 * Opens a new window with the contend in 'id'.
 * 
 * @param {Object} id 
 * @param {Object} type
 */
function openWindow(id, type) {
	var x = document.getElementById(id);
	type = type == 'j' ? '.json' : '.txt';
	var openWindow = window.open("", "To_Download", "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes");
	openWindow.document.write("<title>" + id + type + "</title><pre>" + x.innerHTML + "</pre>");
	openWindow.document.close();
	openWindow.focus();
}

/**
 * Generates item's type
 * e.g. `Switch` or `Group`
 * or `Group:Switch:OR(ON, OFF)`
 * 
 * @param {Object} item 
 * @param {Object} model 
 * @return {string}
 */
function generateType(item) {
	let type = item.type;

	if (item.groupType) {
		type += ':' + item.groupType;
		if (item.function) {
			type += item.function.name ? ':' + item.function.name : '';
			type += item.function.params ? '(' + item.function.params.join(', ') + ')' : '';
		}
	}
	return type;
}

/**
 * Generates a "label [format]" for the Item
 * @param {Object} item 
 * @return {string}
 */
function generateLabel(item) {
	var pattern = ((item || {}).stateDescription || {}).pattern;
	pattern = typeof(pattern) != "undefined" ? ' [' + pattern  + ']' : '';
	return item.label ? '"' + item.label + pattern + '"' : '';
}


/**
 * Generates the state for the Item
 * @param {Object} item 
 * @return {string}
 */
function generateState(item) {
	return item.state != "NULL" ? item.state : '';
}

/**
 * Generates an editable for the Item
 * e.g. (RW=ReadWrite, R=ReadOnly)
 * @param {Object} item 
 * @return {string}
 */
function generateEditable(item) {
	return item.editable ? 'RW' : 'R';
}

/**
 * Generates an icon if there's any.
 * 
 * @param {Object} item 
 * @param {Object} model 
 * @return {string}
 */
function generateIcon(item, model) {
	return item.category && model.itemsIcons ? '<' + item.category + '>' : '';
//    return item.category && model.itemsIcons ? '<' + item.category + '>' : null;
}

/**
 * Generates a list of groups for the item.
 * e.g. (Home, GF_Bedroom, gTemperature)
 * @param {Object} item
 * @return {string}
 */
function generateGroups(item) {
	return item.groupNames.length ? '(' + item.groupNames.join(', ') + ')' : '';
}

/**
 * Generates a list of tags for the item.
 * e.g. ["Switchable"]
 * @param {Object} item
 * @return {string}
 */
function generateTags(item) {
	return item.tags.length ? '["' + item.tags.join('", "') + '"]' : '';
}


/**
 * Generates a "channel" string for the object item
 * e.g. `{channel=""}`
 * @param {Object} item
 * @param {Object} model
 * @return {string}
 */
function generateChannel(item, model) {
	return item.entryType === 'object' && model.itemsChannel ? '{channel=""}' : '';
//    return item.entryType === 'object' && model.itemsChannel ? '{channel=""}' : 'CHAN';
}

/**
 * Transforms array of lines
 * into column-aligned table
 * @param {Array} lines 
 */
function toTable(lines) {
	let table = new AsciiTable();

	// Create the ascii-table to auto-format file
	let result = table.addRowMatrix(lines)
		.removeBorder()
		.toString();

	// Cleanup the lines
	result = result.split('\n')
		.map((line) => line.slice(2).trimRight())
		.join('\n');

	return result
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

/**
 * Generates an array or items to be deleted!
 * 
 * @param {*} items 
 */
function generateDeleteItems(items, model) {
	let result = items.map(item => {
		return ["curl -X DELETE --header \"Accept: application/json\" \"http://localhost:8080/rest/items/" + item.name + "?force=true\""]
	});
	return result;
}


/**
 * Generates an array or items
 * to be later processed by AsciiTable
 * 
 * @param {*} items 
 */
function generateTextualItems(items, model) {
	let result = items.map(item => {
		return [
			generateEditable(item),
			generateType(item),
			item.name,
			generateLabel(item),
			generateIcon(item, model),
			generateGroups(item),
			generateTags(item),
			generateChannel(item, model),
			generateState(item)
		]
	});

	// Add some spacing between blocks
	if (result.length) {
		result.push(['']);
	}

	return result;
}


/**
 * Skip certain keys and values by returning undefined.
 * This is to dismiss duplicates of separately extracted keys.
 * Used by JSON.stringify()
 * @param {*} items
 * @return {string}
 */
function replacer(key, value) {
	if (key === 'name' || key === 'tags' || key === 'type') {
		return undefined;
	}
	return value;
}


/**
 * Generates a textual Items file
 * @param {*} items
 * @return {string}
 */
function generateItems(items) {
	var rtn = new Object();
	// itemtype itemname "labeltext [stateformat]" <iconname> (group1, group2, ...) ["tag1", "tag2", ...] {bindingconfig}
	var head = ['RW', 'itemtype', 'itemname', '"labeltext [stateformat]"', '<iconname>', '(group1, group2, ...)', '["tag1", "tag2", ...]', '{bindingconfig}', '/STATE/'];

	let linesTxt = [
		head,
		'',
		...generateTextualItems(items, {
				itemsChannel: true,
				itemsIcons: true
		})
	];

	let linesDelete = [
		...generateDeleteItems(items)
	];

	// A note about .replace(/regex/flag, ''); The regex string starts with '/' and ends with '/flags', flags: /g /i...

	let flag = 0;
	rtn['itemsNameTags'] = "[\n";
	for (x in items) {
		rtn['itemsNameTags'] += flag++ ? ",\n" : "";

		let name = (JSON.stringify(items[x], ['name']))
			.replace(/}/, '');                                     // Remove last  '}' from string since it will be part of the bigger item object.
			let tags = JSON.stringify(items[x], ['tags'])
			.replace(/{{1}/, '')                                   // Remove first '{' from string since it will be part of the bigger item object.
			.replace(/}([^}]*)/, '');                              // Remove last  '}' from string since it will be part of the bigger item object.
		let type = JSON.stringify(items[x], ['type'])
			.replace(/{{1}/, '')                                   // Remove first '{' from string since it will be part of the bigger item object.
			.replace(/}([^}]*)/, '');                              // Remove last  '}' from string since it will be part of the bigger item object.
		let rest = JSON.stringify(items[x], replacer)
			.replace(/{{1}/, '');                                  // Remove first '{' from string since it will be part of the bigger item object.

		rtn['itemsNameTags'] += name  + 
			",\n    " + tags + 
			",\n    " + type + 
			",\n    " + rest + 
			"\n";
	}
	rtn['itemsNameTags'] += "]\n\n";

	rtn['items'] = JSON.stringify(items) + '\n\n';
	rtn['itemsDelete'] = toTable(linesDelete) + '\n\n';
	rtn['itemsTxt'] = toTable(linesTxt) + '\n\n';
	return rtn;
}



/**
 * Generates a textual Links file
 * @param {*} links
 * @return {string}
 */
function generateLinks(links) {
	var rtn = new Object();
	let linksAdd = [
		...links.map(link => {return ["curl -X PUT --header \"Content-Type: application/json\" --header \"Accept: application/json\" -d \"{}\" \"http://localhost:8080/rest/links/" + link.itemName + "/" + link.channelUID + "\""]})
	];

	let linksDelete = [
		...links.map(link => {return ["curl -X DELETE --header \"Accept: application/json\" \"http://localhost:8080/rest/links/" + link.itemName + "/" + link.channelUID + "\""]})
	];

	rtn['links'] = JSON.stringify(links) + '\n\n';
	rtn['linksAdd'] = toTable(linksAdd) + '\n\n';
	rtn['linksDelete'] = toTable(linksDelete) + '\n\n';
return rtn;
}




/**
 * Generates a textual Things file
 * @param {*} things
 * @return {string}
 */
function generateThings(things) {
	var rtn = new Object();
	let thingsAdd = [
		...things.map(thing => {return ["curl -X PUT --header \"Content-Type: application/json\" --header \"Accept: application/json\" -d \"{}\" \"http://localhost:8080/rest/links/" + thing.thingName + "/" + thing.channelUID + "\""]})
	];

	let thingsDelete = [
		...things.map(thing => {return ["curl -X DELETE --header \"Accept: application/json\" \"http://localhost:8080/rest/links/" + thing.thingName + "/" + thing.channelUID + "\""]})
	];

	rtn['things'] = JSON.stringify(things) + '\n\n';
	rtn['thingsAdd'] = toTable(thingsAdd) + '\n\n';
	rtn['thingsDelete'] = toTable(thingsDelete) + '\n\n';
return rtn;
}

