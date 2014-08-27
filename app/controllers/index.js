

var dataSources = ['data0.json', 'data1.json', 'data2.json', 'data3.json', 'data4.json'];
var allLoaded = false;

/**
 * Adds data to the table
 */
function addData(){ 
	var json = loadFile('userData/'+dataSources.shift());
	if(json !== -1){
		var newUsers = JSON.parse(json).users;
	
		if(newUsers) {
			var dataToAdd = preprocessForListView(newUsers);
			
			Ti.API.debug(JSON.stringify(dataToAdd));
			var animationStyle = OS_IOS ? (!$.listView.sections[0].items.length ? Ti.UI.iPhone.RowAnimationStyle.NONE : null) : null;
			$.listView.sections[0].appendItems(dataToAdd, animationStyle);
		}
	}
}

/**
 *	Convert a list of data from a JSON file into a format that can be added to the ListView
 * 	@param {Object} rawElements the elements from the JSON file.
 */
var preprocessForListView = function(rawData) {
	return _.map(rawData, function(item) {
		return {
			properties: {
				searchableText: item.name + ' ' + item.company + ' ' + item.email,
				itemId: item.guid
			},
			userName: {text: item.name},
			userPhoto: {image: item.picture+"/img"+Math.floor(Math.random()*100)},
			userEmail: {text: item.email}
		};
	});	
};


/**
 * Event triggered when a ListView item is clicked
 * @param {Object} e
 */
function onItemClick(e){
	alert("Item clicked");
}

/**
 * Event triggered when ListView is scrolled passed the "marker"
 * @param {Object} e
 */
function onMarkerEvent(e) {
	if(!allLoaded){
		addData();
		$.listView.setMarker({
			sectionIndex:0,
			itemIndex: ($.listView.sections[0].items.length - 10)
		});
	}
}


/**
 * 	Loads the contents of a file and returns it.
 */
function loadFile(filename) {
	
	var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + filename); 
	
	if(file.exists()){
		var result = file.read().text;
		return result;
	}
	else{
		allLoaded = true;
	}
	
	return -1;
};

/**
 * Open the Window
 */
$.index.open();
addData();
$.listView.setMarker({sectionIndex:0,itemIndex:15});
