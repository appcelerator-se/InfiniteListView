function Controller() {
    function addData() {
        var json = loadFile("userData/" + dataSources.shift());
        if (-1 !== json) {
            var newUsers = JSON.parse(loadFile("userData/" + dataSources.shift())).users;
            if (newUsers) {
                var dataToAdd = preprocessForListView(newUsers);
                Ti.API.debug(JSON.stringify(dataToAdd));
                var animationStyle = $.listView.sections[0].items.length ? null : Ti.UI.iPhone.RowAnimationStyle.NONE;
                $.listView.sections[0].appendItems(dataToAdd, animationStyle);
            }
        }
    }
    function onItemClick() {
        alert("Item clicked");
    }
    function onMarkerEvent() {
        if (!allLoaded) {
            addData();
            $.listView.setMarker({
                sectionIndex: 0,
                itemIndex: $.listView.sections[0].items.length - 10
            });
        }
    }
    function loadFile(filename) {
        var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + filename);
        if (file.exists()) {
            var result = file.read().text;
            return result;
        }
        allLoaded = true;
        return -1;
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "white",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.searchBar = Ti.UI.createSearchBar({
        id: "searchBar"
    });
    var __alloyId0 = {};
    var __alloyId2 = [];
    var __alloyId4 = {
        type: "Ti.UI.View",
        childTemplates: function() {
            var __alloyId5 = [];
            var __alloyId6 = {
                type: "Ti.UI.ImageView",
                bindId: "userPhoto",
                properties: {
                    border: 1,
                    borderColor: "#acacac",
                    height: 75,
                    width: Ti.UI.SIZE,
                    top: 12,
                    left: 0,
                    borderRadius: 35,
                    bindId: "userPhoto"
                }
            };
            __alloyId5.push(__alloyId6);
            var __alloyId8 = {
                type: "Ti.UI.View",
                childTemplates: function() {
                    var __alloyId9 = [];
                    var __alloyId10 = {
                        type: "Ti.UI.Label",
                        bindId: "userName",
                        properties: {
                            right: 10,
                            font: {
                                fontSize: 18
                            },
                            left: 85,
                            color: "#444",
                            bindId: "userName"
                        }
                    };
                    __alloyId9.push(__alloyId10);
                    var __alloyId11 = {
                        type: "Ti.UI.Label",
                        bindId: "userEmail",
                        properties: {
                            right: 10,
                            font: {
                                fontSize: 14
                            },
                            left: 85,
                            height: 20,
                            color: "#666",
                            bindId: "userEmail"
                        }
                    };
                    __alloyId9.push(__alloyId11);
                    return __alloyId9;
                }(),
                properties: {
                    left: 10,
                    layout: "vertical",
                    height: Ti.UI.SIZE,
                    width: Ti.UI.SIZE
                }
            };
            __alloyId5.push(__alloyId8);
            var __alloyId12 = {
                type: "Ti.UI.Label",
                properties: {}
            };
            __alloyId5.push(__alloyId12);
            return __alloyId5;
        }(),
        properties: {
            left: 10
        }
    };
    __alloyId2.push(__alloyId4);
    var __alloyId1 = {
        properties: {
            height: 100,
            width: Ti.UI.FILL,
            name: "userTemplate"
        },
        childTemplates: __alloyId2
    };
    __alloyId0["userTemplate"] = __alloyId1;
    $.__views.__alloyId13 = Ti.UI.createListSection({
        name: "users",
        id: "__alloyId13"
    });
    var __alloyId15 = [];
    __alloyId15.push($.__views.__alloyId13);
    $.__views.listView = Ti.UI.createListView({
        backgroundColor: "#ececec",
        sections: __alloyId15,
        templates: __alloyId0,
        searchView: $.__views.searchBar,
        id: "listView",
        defaultItemTemplate: "userTemplate"
    });
    $.__views.index.add($.__views.listView);
    onItemClick ? $.__views.listView.addEventListener("itemclick", onItemClick) : __defers["$.__views.listView!itemclick!onItemClick"] = true;
    onMarkerEvent ? $.__views.listView.addEventListener("marker", onMarkerEvent) : __defers["$.__views.listView!marker!onMarkerEvent"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var dataSources = [ "data0.json", "data1.json", "data2.json", "data3.json", "data4.json" ];
    var allLoaded = false;
    var preprocessForListView = function(rawData) {
        return _.map(rawData, function(item) {
            return {
                properties: {
                    searchableText: item.name + " " + item.company + " " + item.email,
                    itemId: item.guid
                },
                userName: {
                    text: item.name
                },
                userPhoto: {
                    image: item.picture + "?t=" + new Date().getTime()
                },
                userEmail: {
                    text: item.email
                }
            };
        });
    };
    $.index.open();
    setTimeout(function() {
        addData();
        $.listView.setMarker({
            sectionIndex: 0,
            itemIndex: 15
        });
    }, 0);
    __defers["$.__views.listView!itemclick!onItemClick"] && $.__views.listView.addEventListener("itemclick", onItemClick);
    __defers["$.__views.listView!marker!onMarkerEvent"] && $.__views.listView.addEventListener("marker", onMarkerEvent);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;