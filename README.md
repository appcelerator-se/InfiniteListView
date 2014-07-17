InfiniteListView [![Alloy](http://www-static.appcelerator.com/badges/alloy-git-badge-sq.png)](http://www.appcelerator.com/alloy/)
================
This project illustrates how you can use the [Titanium.UI.ListView](http://docs.appcelerator.com/titanium/latest/#!/api/Titanium.UI.ListView) object in [Appcelerator](http://www.appcelerator.com) Titanium to create dynamic loading lists using the _marker_ feature.

*A big thanks to [Thomas Wilkinson](https://github.com/thomasdelbert) for his excellent right up and examples entiteld [Elements of ListView](https://github.com/appcelerator-services/ElementsOfListView) on Appcelerator ListViews from which this simplified example was produced*

Images are provided by [LoremPixel](http://lorempixel.com/).

## Overview
Almost every app at some point will need to list data in a table. Sometimes that data set can be VERY big - but loading all the data at once can be taxing, and not really optimal for app performance. To address this issue, app developers leverage a technique of dynamically loading data into the list as the user scrolls down or reaches the end of the list. 

This technique, often referred to as _Lazy Loading_ can be easily implemented on iOS and Android using Titanium ListViews which can dramatically improve the overall performance of your application, and is the recommended approach when having to display long lists of data.

For our example, we will be loading in random User data from local JSON files to create a searchable Contact List. The location of the data is arbitrary, as it could easily be coming from a remote source. 

### A quick not about Lazy Loading and Search behavior
Standard search capabilities on data items in a list **only** works for data that is already loaded into the table. Attempting to search for data that hasn't been loaded requires a connection to your data source and a custom search behavior.

##Features
* Dynamically loads data from JSON files to create an "infinite" list view
* Searchable Content (once its loaded)
* Leverage a ListItem Template to showcase data
* iOS and Android compatible 


##The XML View
To start we create an XML View that will act as our primary interface for this small application. In the `index.xml` file, we call out our ListView and define our template.

```
#!xml

<!-- 
ListView declaration

This XML tag creates the listview and provides the necessary event handlers for tracking the *marker* and handling click events on the List.

As we are also using Templates, we specify the defaultItemTempalte property to correspond to our userTemplate created inline below.
-->
<ListView id="listView" defaultItemTemplate="userTemplate" onItemclick="onItemClick" onMarker="onMarkerEvent">
		
		<Templates>
		
		<!-- 
		Creating a Custom ListItem using ImageViews and Labels 
		This will allows us to easily map data as properties of this template using the *bindId* associated with each UI element
		-->		
		<ItemTemplate id="userTemplate" name="userTemplate">
			<View class="left">
				<ImageView id="userPhoto" bindId="userPhoto" class="" />
				<View class="vgroup left size">
					<Label id="userName" bindId="userName" class="right" />
					<Label id="userEmail" bindId="userEmail" class="right" />
				</View>
				<Label id="userIcon" class="icon" />
			</View>
		</ItemTemplate>
		
	</Templates>
	
	<!-- Standard Searchbar for a ListView, based off of the Titanium.UI.SearchBar object -->
	<SearchBar id="searchBar" />
	
	<!-- 
	Defining a Default Section, this application only has one section, but you can easily add any number of sections to your    ListView
	-->
	<ListSection name="users">
		
</ListView>	 

```

## The Controller File

As the ListItem is properly setup in your XML view file, you now need to handle the marker event so that you can trigger the load of new data into the listView. This means that when you first load data - you need to *place* your marker somewhere near the bottom of the table so that as you scroll passed the marker, the event will trigger and you can handle lazy loading data into your table. Note, the amount of laziness depends on the latency of your data source!

To place the marker, we will load in some data so that we can assign it a location. First lets look at how we are adding the data.

```
#!javascript

/**
 * Adds data to the table
 */
function addData(){ 
	var json = loadFile('userData/'+dataSources.shift());
	if(json !== -1){
		var newUsers = JSON.parse(json).users;
	
		if(newUsers) {
			var dataToAdd = preprocessForListView(newUsers);
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
			userPhoto: {image: item.picture+"?t=" + new Date().getTime()},
			userEmail: {text: item.email}
		};
	});	
};

```
In the above function, we are using a helpfer function, `loadFile`, to grab our JSON data from locally stored in serially numbered `dataX.json` files and we'll parse that data into a valid javascript Object. We will then process each data item and make it ready for insertion into the label using another helper function, `preprocessForListView`, which iterates through each obect using the [UnderscoreJS](http://underscorejs.org/) `_.map` method and creates the bindings to the expected template properties. There is no need to require the UnderscoreJS library directly as its included as part of Appcelerator [Alloy](http://docs.appcelerator.com/titanium/latest/#!/guide/Alloy_Framework).

Once you have the data loaded, to initialize the ListView with Data, and setting the marker is easy.

```
#!javascript

addData();
$.listView.setMarker({sectionIndex:0,itemIndex:15});

```
In our case, we know that our first data set contains at least 20 items, so we are setting the marker at item index 15 so that we can populate the list with new data prior to reaching the end of the list.

This happens as you scroll down in the ListView. As you reach the marked item, it triggers an event that we are capturing on the ListView int he XML - `onMarker`. As we have assigned that event callback to the `onMarkerEvent` function we can now handle loading in more data and set the new marker position.

```
#!javascript

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

```

Not to complicated - we are checking to see if all the data has be loaded by checking a flag we can set. This isn't mandatory but reduces overhead to your application. If there is more data, we call the `addData` function we looked at earlier, and then set the new marker position. In this case, we are setting the new marker 10 items from the end of the list.

There is no need to remove the previous marker - calling `setMarker` will automatically remove the old marker. This is because at any given time, there can only be one marker on a ListView.

That's all there is to it! Now go have fun creating super long lists in Appcelerator Titanium!

*Note: You'll find the files under the `app/lib/data` directory in the repo. The definition of the helper function, `loadFile` noted above is in `index.js`.*

## Future Work

* Create a branch that demonstrates loading data from Appcelerator Cloud Services
