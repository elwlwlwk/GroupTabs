tab_group={};
cur_group_idx=0;
bool_restoring_group= false;

function Tab(favIconUrl, url){
	this.favIconUrl= favIconUrl;
	this.url= url;
}

function void_func(){};

function save_tab_group(after= void_func){
	chrome.storage.local.set({"tab_group": tab_group, "cur_group_idx": cur_group_idx});
	after();
}

function update_cur_tab_group(after= void_func){
	chrome.tabs.query({}, function(tabs){
		var tab_list=[];
		tabs.forEach(function(tab){
			tab_list.push(new Tab(tab.favIconUrl, tab.url));
		})
		var group_name;
		if (typeof tab_group[cur_group_idx] === "undefined") {
			group_name = cur_group_idx;
		} else {
			group_name = tab_group[cur_group_idx]["group_name"];
		}
		tab_group[cur_group_idx]= {"group_name":group_name, "tab_list":tab_list};
		save_tab_group();
		after();
	})
}

function load_tab_group(after= void_func){
	chrome.storage.local.get("tab_group", function(result){
		tab_group= result["tab_group"];
		if(!tab_group){
			cur_group_idx=0;
			tab_group={};
		}
		chrome.storage.local.get("cur_group_idx", function(result){
			cur_group_idx= result["cur_group_idx"];
			if(!cur_group_idx){
				cur_group_idx= 0;
			}
			after();
		});
	});
}

function close_tabs(tab_list){
	tab_list.forEach(function(tab){
		chrome.tabs.remove(tab.id, function(){});
	})
}

function close_tab_url(url){
	chrome.tabs.query({}, function(tabs){
		tabs.forEach(function(tab){
			if(tab.url=== url){
				if(tabs.length== 1){
					chrome.tabs.create({"url":"chrome://newtab/", "active": true}, function(tab){});
				}
				chrome.tabs.remove(tab.id, function(){});
			}
		})
	});
}

function restore_tab_group(group_idx, focusing_tab){
	cur_group_idx= group_idx;
	chrome.tabs.query({}, function(tabs){
		tab_group[group_idx]["tab_list"].forEach(function(restoring_tab){
			if(restoring_tab== focusing_tab){
				chrome.tabs.create({"url":restoring_tab.url, "active": true}, function(tab){});
			}else{
				chrome.tabs.create({"url":restoring_tab.url, "active": false}, function(tab){});
			}
		});//restore tab
		close_tabs(tabs);
		save_tab_group();
	});
}