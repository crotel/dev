const _aid = 'cM5xTQ15J3CSKHISBIy2gPzoMlIb4XfBa7jp2p1Y';
const _jsk = '8JiqGImxMbtBi3MuRrG71RH4iakJxL6WyLaBmx4Q';
const _iurl = 'https://ful.rest/api';
const _dopt = {'year': 'numeric','month': 'long','day': 'numeric'};

const _fetch = {
//	approach: function(approach,el1,el2) {
//			_swi(approach,el1,el2);
//		},
	fn:  function () {
		 fetch(`${_iurl}${this.path}`,{
			method: this.method,
			headers: this.headers,
			//credentials: 'include',
			//mode: 'cors',
			body: this.body
		}).then(res => {
			if (res.ok === true) {
				console.info('fetch res.ok true then return res.json');
				console.info('res.status => : ' + res.status);
				console.info('res.statusText => : ' + res.statusText);
				return res.json();
			} else {
				window.location.reload();
//				console.info('fetch res.ok false then write error');
//				console.info('res.status => : ' + res.status);
//				console.info('res.statusText => : ' + res.statusText);
//				if (res.status > '400' && this.approach == 'login') {
//					if (res.status == '403') {window.document.write("<div style='text-align:center;margin: 2em auto;line-height: 2em;font-size: 1.5em;'>Sorry, you had not got the permission!<br><br><input type='button' value='reload' onclick='window.location.reload();'></div>"); }
//					else if (res.status == '404') {window.document.write("<div style='text-align:center;margin: 2em auto;line-height: 2em;font-size: 1.5em;'>You got wrong username or password!<br><br><input type='button' value='reload' onclick='window.location.reload();'></div>"); }
//				} else {window.document.write("<div style='text-align:center;margin: 2em auto;line-height: 2em;font-size: 1.5em;'>You should know what you r doing!<br><br><input type='button' value='reload' onclick='window.location.reload();'></div>");
//				//sessionStorage.clear();
//				}
			}
			}).then(json => {
				
				if (json !== undefined && isNaN(json) === true) {return _dom(this.approach,json);
				} else {
				console.info(this.approach);
				console.info('if json is : ');
				console.info(json);
				console.info('fn break;');};
				});
	}
}

function _dom(approach,result) {
	
	if (approach == '_logined' || approach == '_login' || approach == '_post') {
		console.info('fn dom user detail via :');
		console.info(approach);
		document.getElementById('sectionLogin').setAttribute("class", "unactive");
		document.getElementById('sectionLoginDetail').removeAttribute("class", "unactive");
		document.getElementById('sectionPost').removeAttribute("class", "unactive");
		document.getElementById('accountDetailList').innerHTML += "<li id='a_d_username'>username: " + result.username + "</li><p>";
		document.getElementById('accountDetailList').innerHTML += "<li id='a_d_email'>email: " + result.email + "</li><p>";
		const cnTime = new Date(result.createdAt).toLocaleDateString('zh-Hans', _dopt);
		document.getElementById('accountDetailList').innerHTML += "<li id='a_d_registerAt'>registerAt: " + cnTime + "</li><p>";
		document.getElementById('accountDetailList').innerHTML += "<li id='a_d_logout'><input id='logOut' type='button' value='Logout'></li>";
		
		document.querySelector('#contentPost').addEventListener('click', event => {
		event.preventDefault();
		console.info('post click');
		let post_title = document.querySelector('#p__title').value;
		let post_tag = document.querySelector('#p__tag').value.split(' ');
		let post_content = document.querySelector('#p__content').value;
		console.info(post_tag);
		_approach('_post',post_title,post_tag,post_content);
		
		});
		document.getElementById('logOut').addEventListener('click', event => {
		console.info('logout click');
		console.info('you did a logOut click!');
		event.preventDefault();
		_approach('_logout');
		});
		if (approach == '_login') {
		console.info('set userId and session Token via:');
		console.info(approach);
		console.info('set session Id');
		sessionStorage.setItem('Uid',result.objectId);
		sessionStorage.setItem('Token',result.sessionToken);
		_approach('_sid',null,null,null);
		
		} else if (approach == '_logined') {
		console.info('fetch myPosts via:');
		console.info(approach);
		_approach('_myPosts');
		} else if (approach == '_post') {
		console.info('fetch myPosts via:');
		console.info(approach);
		_approach('_myPosts',null,null,null);
		window.location.reload();
		};
	} else if (approach == '_sid') {
		console.info('get sessiion id via:')
		console.info(approach);
		sessionStorage.setItem('Sid',result.objectId);
		_approach('_myPosts');
	} else if (approach == '_logout') {
		console.info('via:');
		console.info(approach);
		//_approach('_logout');
		sessionStorage.clear();
		localStorage.clear();
		console.info('logOut OK');
		window.location.reload();
	} else if (approach == '_myPosts') {
		console.info('myPosts title list loop');
		console.info(result.results);
		for (var i = 0; i < result.results.length; i++) {
		console.info(result.results.length);
		document.getElementById('postsTitleList').innerHTML += `<li><input type='button' id='${result.results[i].objectId}'  class='a_d_p_title' onclick='_approach("_selectPost",null,null,null,"${result.results[i].objectId}");' value='${result.results[i].title}' style='width:100%;'></li>`;
		};

	} else if (approach == '_selectPost') {
		console.info(approach);
		console.info(result);


		document.getElementById('contentPost').setAttribute("style","display:none;");
		document.getElementById('updatePost').setAttribute("style","display:none;");
		document.getElementById('deletePost').setAttribute("style","display:block;");
		document.getElementById('newPost').setAttribute("style","display:block;");
//		document.getElementById('updatePost').setAttribute("onclick",`_approach('_updatePost','${result.objectId}')`);

		
		//this.objectId,this.title,this.tag,this.content = null;
		document.querySelector('#p__objectId').value = result.objectId;
		document.querySelector('#p__title').value = result.title;
		if (result.tags.toString().match(',') !== null) {
			document.querySelector('#p__tag').value = result.tags.toString().split(',').join(' ');
		} else {document.querySelector('#p__tag').value = result.tags.toString();};
		//console.info(result.tags.toString().match(','));
		document.querySelector('#p__content').value = result.content;

		if (approach == '_selectPost') {
		document.querySelector('#p__title').oninput = handleTitle; 
		document.querySelector('#p__tag').oninput = handleTags; 
		document.querySelector('#p__content').oninput = handleContent; 
		}
		function handleTitle(e) { 
			return document.getElementById('updatePost').setAttribute("style","display:block;");
			//if (document.querySelector('#p__objectId').defalutValue !== document.querySelector('#p__objectId').value)
			
			console.info('fn handleTitle ok');
		};
		function handleTags(e) { 
			return document.getElementById('updatePost').setAttribute("style","display:block;");
			console.info('fn handleTags ok');
		};
		function handleContent(e) { 
			return document.getElementById('updatePost').setAttribute("style","display:block;");
			console.info('fn handleContent ok');
		};
			
		document.querySelector('#updatePost').addEventListener('click', event => {
		event.preventDefault();
		console.info('updatePost click');
		this.objectId = document.querySelector('#p__objectId').value;
		this.title = document.querySelector('#p__title').value;
		this.tag = document.querySelector('#p__tag').value.split(' ');
		this.content = document.querySelector('#p__content').value;
		console.info(this.title);		
		//console.info(result);
		_approach('_updatePost',this.title,this.tag,this.content,this.objectId);
		//window.location.reload();
		});
		document.querySelector('#deletePost').addEventListener('click', event => {
		event.preventDefault();
		console.info('deletePost click');
		this.objectId = document.querySelector('#p__objectId').value;
		console.info(this.objectId);		
		//console.info(result);
		_approach('_deletePost',null,null,null,this.objectId);
		window.location.reload();
		});
		
	} else if (approach == '_newPost') {
		console.info(approach);
		console.info(result);
		document.getElementById('contentPost').setAttribute("style","display:block;");
		document.getElementById('updatePost').setAttribute("style","display:none;");
		document.getElementById('deletePost').setAttribute("style","display:none;");
		document.getElementById('newPost').setAttribute("style","display:none;");
		
		document.querySelector('#p__objectId').value = null;
		document.querySelector('#p__title').value = null;
		document.querySelector('#p__tag').value = null;
		document.querySelector('#p__content').value = null;
		
		document.querySelector('#p__title').oninput = null; 
		document.querySelector('#p__tag').oninput = null; 
		document.querySelector('#p__content').oninput = null; 
	} 
//	else if (approach == '_updatePost') {
//		console.info(approach);
//		console.info(result);
//
//	}

}

function _approach(approach,el1,el2,el3,el4) {
	console.info("approach =>:");
	console.info(approach);
	const basedHeaders = {'X-Parse-Application-Id': `${_aid}`,'X-Parse-Javascript-Key': `${_jsk}`};
	if (approach == "_login" || approach == "_post" || approach == "_updatePost") {
		console.info("object _hb(has body) => approach => :");
		console.info('_hb(has body) fetch =>:');
		const _hb = Object.create(_fetch);
		_hb.method = 'POST';
		if (approach == "_login") {
			console.info(approach);
			_hb.path = "/login";
			_hb.headerOpt = {'Content-Type': 'application/json',};
			_hb.headers = Object.assign(basedHeaders, _hb.headerOpt);
			_hb.body = `{"username":"${el1}","password":"${el2}"}`;
			_hb.approach = '_login';
			_hb.fn();
		} else if (approach == "_post") {
			console.info(approach);
			const token = sessionStorage.getItem('Token');
			const uid = sessionStorage.getItem('Uid');
			_hb.path = "/classes/Posts";
			_hb.headerOpt = {'Content-Type': 'application/json','X-Parse-Session-Token': token};
			_hb.headers = Object.assign(basedHeaders, _hb.headerOpt);
			_hb.body = `{ "title": "${el1}","tags": ["${el2}"],"content": "${el3}","author": {"className": "_User","__type": "Pointer","objectId": "${uid}"}}`;
			_hb.approach = '_post';
			console.info(_hb.headers);
			console.info(_hb.body);
			_hb.fn();
		} else if (approach == "_updatePost") {
			console.info(approach);
			const token = sessionStorage.getItem('Token');
			const uid = sessionStorage.getItem('Uid');
			_hb.method = 'PUT';
			_hb.path = `/classes/Posts/${el4}`;
			_hb.headerOpt = {'Content-Type': 'application/json','X-Parse-Session-Token': token};
			_hb.headers = Object.assign(basedHeaders, _hb.headerOpt);
			_hb.body = `{ "title": "${el1}","tags": ["${el2}"],"content": "${el3}","author": {"className": "_User","__type": "Pointer","objectId": "${uid}"}}`;
			//_hb.approach = '_updatePost';
			console.info(_hb.headers);
			console.info(_hb.body);
			console.info(_hb.path);
			_hb.fn();
			document.getElementById(`${el4}`).value = el1;
		}
	} else if (approach == "_logined" || approach == "_myPosts" || approach == "_sid" || approach == "_logout" || approach == "_selectPost" || approach == "_deletePost") {
		console.info("object _nb(no body) => approach => :");
		//_fetch.body = {};
		const _nb = Object.create(_fetch);
		_nb.method = 'GET';
		const token = sessionStorage.getItem('Token');
		_nb.st = {'X-Parse-Session-Token': token };
		_nb.headers = Object.assign(basedHeaders, _nb.st);
		if (approach == "_logined") {
			console.info(approach);
			console.info('_nb(no body) fetch =>:');
		_nb.path = "/users/me";
		_nb.approach = '_logined';
		_nb.fn();
		} else if (approach == "_myPosts") {
			console.info(approach);
			console.info('_nb(no body) fetch =>:');
		const uid = sessionStorage.getItem('Uid');
		_nb.path = `/classes/Posts?where={"author": {"__type": "Pointer","className": "_User","objectId": "${uid}"}}`;
		_nb.approach = '_myPosts';
		_nb.fn();
		} else if (approach == "_sid") {
			console.info(approach);
			console.info('_nb(no body) fetch =>:');
		_nb.path = '/sessions/me';
		_nb.approach = '_sid';
		_nb.fn();
		} else if (approach == "_logout") {
			console.info(approach);
			console.info('_nb(no body) fetch =>:');
		const sid = sessionStorage.getItem('Sid');
		_nb.path = `/sessions/${sid}`;
		_nb.method = 'DELETE';
		_nb.approach = '_logout';
		_nb.fn();
		} else if (approach == "_selectPost") {
		console.info(approach);
		console.info('_nb(no body) fetch =>:');
		//const sid = sessionStorage.getItem('Sid');
		_nb.path = `/classes/Posts/${el4}`;
		_nb.method = 'GET';
		_nb.approach = '_selectPost';
		_nb.fn();
		} else if (approach == "_deletePost") {
		console.info(approach);
		console.info('_nb(no body) fetch =>:');
		//const sid = sessionStorage.getItem('Sid');
		_nb.path = `/classes/Posts/${el4}`;
		_nb.method = 'DELETE';
		//_nb.approach = '_selectPost';
		_nb.fn();
		}

	} 
}

window.onload = function () {

	if (sessionStorage.getItem('Token') !== null && sessionStorage.getItem('Token') !== 'undefined' ) {
		console.info('logined _approach fn');
		_approach('_logined');
	} else {
		document.getElementById('login').addEventListener('click', event => {
			console.info('current first login _approach fn')
			event.preventDefault();
			const el1 = document.getElementById('name').value;
			const el2 = document.getElementById('pass').value;
			if (el1 !== "" && el2 !== "" && el1 !== 'undefined' && el2 !== 'undefined') {
				console.info('name and pass');
				console.info(el1);
				console.info(el2);
				_approach('_login',el1,el2);
			} else { 
				console.info('name and pass not full fill');
				window.document.write("<div style='text-align:center;margin: 2em auto;line-height: 2em;font-size: 1.5em;'>Please full fill your username or password!<br><br><input type='button' value='reload' onclick='window.location.reload();'></div>");
				}

		});
		//console.log('login fn');
	}
}

function toggledisplay(elementID) {
	(function (style) {
		style.display = style.display === 'none' ? '' : 'none';
	})(document.getElementById(elementID).style);
}

function togglepnp(el1,el2,el3) {
	(function (style) {
		style.background = style.background === 'rgb(255, 131, 131)' ? 'rgb(0, 189, 143)' : 'rgb(255, 131, 131)';
	})(document.getElementById(el3).style);
	(function (innerHTML, style) {
			document.getElementById(el1).innerHTML = innerHTML.toString() === 'Private' ? 'Public' : 'Private';
			style.color = style.color === 'rgb(255, 131, 131)' ? 'rgb(0, 189, 143)' : 'rgb(255, 131, 131)';
	})(document.getElementById(el1).innerHTML,document.getElementById(el1).style);
	(function (style) {
			style.display = style.display === 'none' ? 'inline-block' : 'none';
	})(document.getElementById(el2).style);
		//console.info(document.getElementById(el2).innerHTML);
}
