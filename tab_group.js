tab_group={};
cur_group_idx=0;
bool_restoring_group= false;

function Tab(url){
	this.url= url;
}

function void_func(){};

function save_tab_group(){
	chrome.storage.local.set({"tab_group": tab_group, "cur_group_idx": cur_group_idx});
}

function update_cur_tab_group(after= void_func){
	chrome.tabs.query({}, function(tabs){
		var tab_list=[];
		tabs.forEach(function(tab){
			tab_list.push(new Tab(tab.url));
		})
		tab_group[cur_group_idx]= {"group_name":tab_group[cur_group_idx]["group_name"], "tab_list":tab_list};
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

function restore_tab_group(group_idx){
	cur_group_idx= group_idx;
	chrome.tabs.query({}, function(tabs){
		tab_group[group_idx]["tab_list"].forEach(function(restoring_tab){
			chrome.tabs.create({"url":restoring_tab.url}, function(tab){});
		});//restore tab
		close_tabs(tabs);
		save_tab_group();
	});
}