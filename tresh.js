
			console.log(msg.location);
			txt = 'null';
			var srch = new SearchUser(users[userN], msg.location);
			var searchUsersArray = jf.readFileSync('./data/Search.json').searchUsersArray;
			var enemy = BinSearch2(searchUsersArray, srch.searchPoints, searchUsersArray.length-1, 0, 30);
			if(enemy === null)
			{
				for(var i = searchUsersArray.length; i>=0; i--)
				{
					if(i>0)
					{
						if(srch.searchPoints<searchUsersArray[i-1].searchPoints)
						{
							searchUsersArray[i] = searchUsersArray[i-1]
						}
						else
						{
							searchUsersArray[i] = srch;
							break
						}
					}
					else
					{
						searchUsersArray[0] = srch;
					}
				}
				fs.writeFile('./data/Search.json', JSON.stringify({searchUsersArray}, null, 4));
				users[userN].state = "search_menu";
				bot.sendMessage(chatId, 'Поиск соперника...', {reply_markup : require('./data/menu/search_menu.json')});
				fs.writeFile('./data/Users.json', JSON.stringify({users}, null, 4))
			}
			else
			{
				var enemyN = BinSearch(users, {id : enemy[0].userId}, users.length-1, 0)[1];
				var searchN = enemy[1];
				bot.sendMessage(enemy[0].chatId, 'Противник найден', {reply_markup : require('./data/menu/fight_menu.json')});
				bot.sendMessage(chatId, 'Противник найден', {reply_markup : require('./data/menu/fight_menu.json')});
				users[userN].state = 'fight_menu';
				users[enemyN].state = "fight_menu";
				for(var i = searchN; i<searchUsersArray.length; i++)
				{
					if(i < searchUsersArray.length-1)
					{
						searchUsersArray[i] = searchUsersArray[i+1]
					}
					else
					{
						searchUsersArray[i] = null;
					}
				}
				var room = new Room(new FightUser(users[userN]), new FightUser(users[enemyN]));
				var rooms = jf.readFileSync('./data/Rooms.json').rooms;
				rooms[rooms.length] = room;
				fs.writeFile('./data/Users.json', JSON.stringify({users}, null, 4))
				fs.writeFile('./data/Search.json', JSON.stringify({searchUsersArray}, null, 4))
				fs.writeFile('./data/Rooms.json', JSON.stringify({rooms}, null, 4))
			}
			
			function BinSearch2(arr, searchPoints, h, l, d)
{
	if(l>h){
		return null
	}
	if(l===h)
	{
		if(arr[l].searchPoints - searchPoints <= d)
		{
			return [arr[l], l];
		}
		else
		{
			return null
		}
	}
	else
	{
		if (l+1 === h)
		{
			if(arr[l].searchPoints - searchPoints<=d)
			{
				return [arr[l], l]
			}
			else
			{
				if(arr[h].searchPoints - searchPoints<=d)
				{
					return [arr[h], h]
				}
				else
				{
					return null
				}			
			}
		}
		else
		{
			var m = Math.floor((l + h)/2);
			if (arr[m].searchPoints - searchPoints <= d)
			{
				return [arr[m], m]
			}
			else
			{
				if(searchElement.searchPoints>arr[m].searchPoints)
				{
					return search(arr, searchPoints, h, m+1, d)
				}
				else
				{
					return search(arr, searchPoints, m-1, l, d)
				}
			}
		}
	}
}
