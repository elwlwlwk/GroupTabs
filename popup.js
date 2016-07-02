//chrome.tabs.create({"url":"test","selected":true}, function(tab){});

function void_func(){};

function Tab(url){
	this.url= url;
}
tab_group={};
cur_group_idx=0;

chrome.windows.get(-2, {}, function(window){
	if(window.width*0.8 <= 800){
		document.documentElement.style.width= window.width*0.8+"px";
	}
	else{
		document.documentElement.style.width= "800px";
	}
	
	if(window.height*0.8 <= 600){
		document.documentElement.style.height= window.height*0.8+"px";
	}
	else{
		document.documentElement.style.height= "600px";
	}
})

function save_tab_group(){
	chrome.storage.local.set({"tab_group": tab_group, "cur_group_idx": cur_group_idx});
}

function update_cur_tab_group(after= void_func){
	chrome.tabs.query({"currentWindow": true}, function(tabs){
		var tab_list=[];
		tabs.forEach(function(tab){
			tab_list.push(new Tab(tab.url))
		})
		tab_group[cur_group_idx]= {"group_name":cur_group_idx, "tab_list":tab_list};
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
		});
		after();
	});
}

function close_tabs(tab_list){
	tab_list.forEach(function(tab){
		chrome.tabs.remove(tab.id, function(){});
	})
}

function restore_tab_group(group_idx){
	chrome.tabs.query({"currentWindow": true}, function(tabs){
		tab_group[group_idx]["tab_list"].forEach(function(url){
			chrome.tabs.create({"url":url}, function(tab){});
		});//restore tab
		close_tabs(tabs);
	});
}

function render_tab_group(group_idx){
	var tabs= tab_group[group_idx]["tab_list"];
	var tab_list= document.getElementById("tab_list");
	var ul_tab_groups= document.getElementById("tab_groups");

	while(tab_list.firstChild){
		tab_list.removeChild(tab_list.firstChild);
	}

	for(var idx in tab_group){
		var new_li= document.createElement("li");
		var new_a= document.createElement("a");
		var group_name= document.createTextNode(tab_group[idx]["group_name"]);

		new_a.appendChild(group_name);
		new_li.appendChild(new_a);
		ul_tab_groups.appendChild(new_li);
	}

	tabs.forEach(function(tab){
		var new_li= document.createElement("li");
		var tab_txt= document.createTextNode(tab.url);
		new_li.appendChild(tab_txt);
		tab_list.appendChild(new_li);
	})
}

function render_popup(){
	load_tab_group(function(){
		update_cur_tab_group(function(){
			render_tab_group(cur_group_idx);
		})
	})
}

render_popup();