var playerList = [
	{
		Name:'Austen',
		Number:"7",
		Id:0,
		curPos:"None",
		libero:false,
		Kill:{
			Error:0,
			Attempt:0,
			Kill:0
		},
		Set:{
			Error:0,
			Attempt:0,
			Assist:0
		},
		Pass:{
			Error:0,
			Pass:0
		},
		Dig:{
			Error:0,
			Dig:0
		},
		Serve:{
			Error:0,
			Attempt:0,
			Ace:0
		},
		ServeReceivePass:{
			'0':0,
			'1':0,
			'2':0,
			'3':0,
			onchangeFunction:SRPChangeHandler
		},
		SoloBlock:{
			Error:0,
			Attempt:0,
			Block:0
		},
		CombineBlock:{
			Error:0,
			Attempt:0,
			Block:0
		}
	}
];
var currentPlayers = {1:null,2:null,3:null,4:null,5:null,6:null};
var selectedPlayer = null;
function addPlayerHandler(){
	var modal = document.getElementById("myModal");
	modal.style.display="block";
}
function exportButtonHandler(){
	var modal = document.getElementById("myModal2");
	modal.style.display="block";
}
function SRPChangeHandler(val){
	console.log('Change');
}
function savePlayerHandler(){
	var pName = document.getElementById('pName');
	var pNum = document.getElementById('pNum');
	var liberoEl = document.getElementById('libero');
	playerList.push({
		Name:pName.value,
		Number:pNum.value,
		Id:playerList.length,
		curPos:"None",
		libero:liberoEl.checked,
		Kill:{
			Error:0,
			Attempt:0,
			Kill:0
		},
		Set:{
			Error:0,
			Attempt:0,
			Assist:0
		},
		Pass:{
			Error:0,
			Pass:0
		},
		Dig:{
			Error:0,
			Dig:0
		},
		Serve:{
			Error:0,
			Attempt:0,
			Ace:0
		},
		ServeReceivePass:{
			'0':0,
			'1':0,
			'2':0,
			'3':0,
			onchangeFunction:SRPChangeHandler
		},
		SoloBlock:{
			Error:0,
			Attempt:0,
			Block:0
		},
		CombineBlock:{
			Error:0,
			Attempt:0,
			Block:0
		}
	});
	populateTable();
	var modal = document.getElementById("myModal");
	modal.style.display="none";
	pName.value = '';
	pNum.value='';
	liberoEl.checked = false;
	console.log(playerList);
}
function cancelPlayerHandler(){
	var modal = document.getElementById("myModal");
	modal.style.display="none";
}
function benchPlayerClickHandler(event){
	let player = null;
	for(var i = 0;i<playerList.length;i++){
		if(playerList[i].Id == event.target.parentNode.id){
			player = playerList[i];
		}
	}
	if(player == null){
		alert('error');
	}else{
		for( key in currentPlayers){
			if(currentPlayers[key] == player.Id){
				let banner = document.getElementById("banner");
				banner.style.display = "inline-block";
				banner.className = "banner error";
				banner.innerHTML = player.Name+' is already playing!';
				setTimeout( function(){
					let bannerIn = document.getElementById("banner");
					//bannerIn.style.display="none";
					banner.innerHTML = '';
				},2500);
				return;
			}
		}
		let banner = document.getElementById("banner");
		banner.style.display = "inline-block";
		banner.className = "banner success";
		banner.innerHTML = player.Name+' found! Please select sub position.';
		let foundTiles=document.getElementsByClassName('player-tile');
		for(var i =0;i<foundTiles.length;i++){
			foundTiles[i].className = "player-tile selected";
			foundTiles[i].onclick = handleTileClick;
		}
		selectedPlayer = player;
	}
}
function populateTable(){
	let innerTableBody = '';
	for(var i = 0;i<playerList.length;i++){
		innerTableBody+='<tr class="playerRow" name="test" Id="'+playerList[i].Id+'"><td>'+playerList[i].Name+'</td><td>'+playerList[i].Number+'</td><td>'+playerList[i].curPos+'</td><td>'+ (playerList[i].libero ? '&#10003;' : '&#10006;') +'</td></tr>';
	}
	let tableBody = document.getElementById('tableBody');
	tableBody.innerHTML = innerTableBody;
	let rows = document.getElementsByClassName("playerRow");
	for(var i = 0;i<rows.length;i++){
		rows[i].onclick = benchPlayerClickHandler;
	}
}
function handleTileClick(event){
	if(selectedPlayer == null)return;
	let parent = event.target.parentNode;
	while(!parent.id.includes('player')){
		parent = parent.parentNode;
	}
	let tileId = parent.id[parent.id.length -1];
	performSub(selectedPlayer,tileId);
	for(var i = 0;i<playerList.length;i++){
		if(playerList[i].Id == selectedPlayer.Id){
			playerList[i].curPos = tileId;
		}
	}
	populateTable();

	let banner = document.getElementById("banner");
	//banner.style.display="none";
	banner.innerHTML = '';
	let foundTiles=document.getElementsByClassName('player-tile');
	for(var i =0;i<foundTiles.length;i++){
		foundTiles[i].className = "player-tile";
		foundTiles[i].onclick = null;
	}
	selectedPlayer = null;
}
function performSub(player,tileNumber){
	let head = document.getElementById("pHead"+tileNumber);
	head.innerHTML = player.Name+' #'+player.Number;
	currentPlayers[tileNumber] = player.Id;
	let body = document.getElementById("pBody"+tileNumber);
	body.className = "player-body";
	let innerHTML = "";
	for(key in player){
		if(typeof player[key] == "object"){
			innerHTML+="<div style=\"width:100%;text-align:center;border-bottom:1px solid black\"><p style=\"font-size:16px;margin-top:5px;margin-bottom:5px;\">"+key+"</p>";
			let innerCount = 0;
			for(key2 in player[key]){
				if(typeof player[key][key2] != 'function'){
					innerCount+=1;
				}
			}
			for(key2 in player[key]){
				if(typeof player[key][key2] == 'function'){
					console.log('functionFound');
				}else{
					innerHTML+="<div style=\"width:"+Math.floor((100/innerCount)-1)+"%;display:inline-block;text-align:center;\" Id=\""+key+"-"+key2+"-"+player.Id+"-"+tileNumber+"\"><p style=\"font-size:14px;margin:0px\">"+key2+"</p><button style=\"display:inline-block;\" class=\"negButton\">-</button><p style=\"display:inline-block;padding-right:5px;padding-left:5px;margin-top:5px;margin-bottom:5px;\">"+player[key][key2]+"</p><button style=\"display:inline-block;\" class=\"posButton\">+</button></div>";
				}
			}
			
			innerHTML+="</div>";
		}
	}
	body.innerHTML = innerHTML;
	let negButtons = document.getElementsByClassName("negButton");
	for(var i = 0;i<negButtons.length;i++){
		negButtons[i].onclick = negativeButtonHandler;
	}
	let posButtons = document.getElementsByClassName("posButton");
	for(var i = 0;i<posButtons.length;i++){
		posButtons[i].onclick = positiveButtonHandler;
	}
}
function negativeButtonHandler(event){
	let Ids = event.target.parentNode.id.split('-');
	for(var i = 0;i<playerList.length;i++){
		if(playerList[i].Id == Ids[2]){
			playerList[i][Ids[0]][Ids[1]] -=1;
			performSub(playerList[i],Ids[3]);
		}
	}
}
function positiveButtonHandler(event){
	let Ids = event.target.parentNode.id.split('-');
	for(var i = 0;i<playerList.length;i++){
		if(playerList[i].Id == Ids[2]){
			playerList[i][Ids[0]][Ids[1]] +=1;
			performSub(playerList[i],Ids[3]);
		}
	}
}
function handleRotation(){
	alert('Rotate!');
}
function saveCurrentStats(){
	let matchNum = document.getElementById('mNum');
	let oppTeam = document.getElementById('oName');
	let date = new Date();
	let day = date.getDate();
	let month = date.getMonth() + 1;
	let year = date.getFullYear();
	let dateString = month+'-'+day+'-'+year;
	let internalHTML = '<div style="font-size:24px;width:100%;text-align:center;">Stats</div>';
	internalHTML+='<table style="width:100%;" border="1"><tr><th>Name</th><th>Number</th></tr></table>';
	html2pdf().from(internalHTML,'string').save(oppTeam.value+'-'+matchNum.value+'_'+dateString+'.pdf');
	matchNum.value = '';
	oppTeam.value = '';
	var modal = document.getElementById("myModal2");
	modal.style.display="none";
}
function cancelExportHandler(){
	let matchNum = document.getElementById('mNum');
	let oppTeam = document.getElementById('oName');
	matchNum.value = '';
	oppTeam.value = '';
	var modal = document.getElementById("myModal2");
	modal.style.display="none";
}
window.onload = populateTable;