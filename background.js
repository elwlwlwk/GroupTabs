function refresh_cur_tab_group(){
	chrome.tabs.query({}, function(tabs){
		chrome.storage.local.get("cur_group_idx", function(result){
			var cur_group_idx= result["cur_group_idx"];
			if(!cur_group_idx){
				cur_group_idx= 0;
			}
			chrome.storage.local.get("tab_group", function(result){
				var temp_tab_group= result["tab_group"];
				var new_tab_list=[];
				var old_tab_list=[];
				var tab_list=[];
				tabs.forEach(function(tab){
					new_tab_list.push(tab.url);
				});
				temp_tab_group[cur_group_idx]["tab_list"].forEach(function(tab){
					old_tab_list.push(tab.url);
				})
				if(JSON.stringify(new_tab_list)=== JSON.stringify(old_tab_list)){
					return;
				}else{
					tabs.forEach(function(tab){
						tab_list.push(new Tab(tab.favIconUrl ,tab.url));
					})
					temp_tab_group[cur_group_idx]= {"group_name":temp_tab_group[cur_group_idx]["group_name"], "tab_list":tab_list};
					chrome.storage.local.set({"tab_group": temp_tab_group, "cur_group_idx": cur_group_idx});
					tab_group= temp_tab_group;
				}
			});
		});

	})
}

function init_tab_group(){
	load_tab_group(
		function(){
			restore_tab_group(cur_group_idx, function(){
				setInterval(function(){refresh_cur_tab_group()}, 1000);
			});
		}
	)
}

init_tab_group();