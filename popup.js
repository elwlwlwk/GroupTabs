//chrome.tabs.create({"url":"test","selected":true}, function(tab){});
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

function load_tab_group(){
	chrome.storage.local.get("tab_group", function(result){
		tab_group= result["tab_group"];
		if(!tab_group){
			cur_group_idx=0;
			chrome.tabs.query({"currentWindow": true}, function(tabs){
				url_list=[];
				tabs.forEach(function(tab){
					url_list.push(tab.url);
				})
				tab_group={};
				tab_group[cur_group_idx]= url_list;
			})
		}
		chrome.storage.local.get("cur_group_idx", function(result){
		cur_group_idx= result["cur_group_idx"];
		});
	});
}

function close_tabs(tab_list){
	tab_list.forEach(function(tab){
		chrome.tabs.remove(tab.id, function(){});
	})
}

function restore_tab_group(group_idx){
	chrome.tabs.query({"currentWindow": true}, function(tabs){
		tab_group[group_idx].forEach(function(url){
			chrome.tabs.create({"url":url}, function(tab){});
		});//restore tab
		close_tabs(tabs);
	});
}