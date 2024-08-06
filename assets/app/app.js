let lastPage = 2;
let currentPage = 1;
async function getJsonPosts(pageNumber) {
	try {
		let currentPageUrl = getPostsUrl + `?page=${pageNumber}`;
		let response = await axios.get(currentPageUrl);
		let data = await response.data;
		if (pageNumber == 1) lastPage = data.meta.last_page;
		return data.data;
	} catch (error) {
		throw error;
	}
}

class cPost {
	FillPostTags() {
		const arrTags = Array.from(this.tags);

		for (let i = 0; i < arrTags.length; i++) {
			if (i == 3) return;
			this.tagContent += `<a href="#" class=" btn text-secondary btn-outline-secondary  ">${arrTags[i]}</a>	`;
		}
	}
	checkValidValues() {
		if (this.profile instanceof Object) {
			this.profile = backupProfileImg;
		}

		if (this.bodyImg instanceof Object) {
			this.bodyImg = backupBodyImg;
		}
		if (this.name == null) {
			this.name = "no Name";
		}
		if (this.title == null) {
			this.title = "No Title";
		}
		if (this.bodyText == null) {
			this.bodyText = "No Body";
		}

		if (this.tags.length > 0) {
			this.FillPostTags();
		}
	}

	constructor(id, profileImg, username, name, bodyImg, createdDate, title, bodyText, tags, comments) {
		this.id = id;
		this.profile = profileImg;
		this.name = name;
		this.username = username;
		this.bodyImg = bodyImg;
		this.createdDate = createdDate;
		this.title = title;
		this.bodyText = bodyText;
		this.tags = tags;
		this.tagContent = "";
		this.comments = comments;
		this.checkValidValues();
	}
}

function postJsonToHtml(jsonPost) {
	let PostObject = new cPost(jsonPost.id, jsonPost.author.profile_image, jsonPost.author.username, jsonPost.author.name, (bodyImage = jsonPost.image), jsonPost.created_at, jsonPost.title, jsonPost.body, jsonPost.tags, jsonPost.comments_count);

	let user = JSON.parse(localStorage.getItem("user"));
	let isUserPost = user != null && user.id == jsonPost.author.id;

	let headerContent = `
    <div class="card-header d-flex align-items-end gap-2 position-relative  headerContent" >
    <img src="${PostObject.profile}" alt="profile img" class="rounded-circle border border-2" style="width: 44px; height: 44px;  margin-left: 1px" onclick="showUserProfile(${jsonPost.author.id})" />
    <h4 class="text-dark" id="postUsername"><span class="text-secondary" >@</span>${PostObject.username}</h4>
</div>
    `;
	if (isUserPost) {
		let strPost = JSON.stringify(PostObject);
		strPost = encodeURIComponent(strPost);

		headerContent = `
        <div class="card-header d-flex align-items-end gap-2 bg-dark headerContent " style="padding-right: 7px;" >
    <img src="${PostObject.profile}" alt="profile img" class="rounded-circle border border-2" style="width: 44px; height: 44px;  margin-left: 1px" />
    <h4 class="text-white" id="postUsername"><span class="text-warning">@</span>${PostObject.username}</h4>
    <div class="postButtons d-flex justify-content-end flex-grow-1 gap-3 "">
    <button class="btn btn-warning px-23 fw-bold" id="deletePostBtn" style=" font-size: 1rem;" onclick="deletePost(this.parentElement.parentElement.parentElement,${PostObject.id})">Delete</button>
    <button class="btn btn-warning px-4  fw-bold" id="editPostBtn" style="font-size: 1rem;" onclick="editPost('${strPost}',this.parentElement.parentElement.parentElement)">Edit</button>
    </div>
  

</div>
        `;
	}

	htmlPost = `
            <div class="card w-100 shadow-sm" style="width: 18rem;transition : 0.4s;">
                                ${headerContent}
                                <img src="${PostObject.bodyImg}" class="img-fluid" alt="Post img " style="aspect-ratio: 16/9; object-fit: contain" />
                                <h6 class="px-1 pt-1 text-end mt-2 me-1 ">${PostObject.createdDate}</h6>
                                <div class="card-body pt-1">
                                    <h5 class="card-title">${PostObject.title}</h5>
                                    <p class="card-text">${PostObject.bodyText}.</p>
                                    <hr />
                                  
                                    <div class="tagCommentContent d-flex justify-content-between  align-items-center g-2">

                                    <a  class="btn btn-primary" data-bs-toggle="tooltip" data-bs-html="true" data-bs-title="<b>${PostObject.comments}</b>" data-bs-custom-class="custom-tooltip" onclick="showPostDetails(${jsonPost.id})"> Comments</a>
                                 <div class="tagContent d-flex gap-2 w-75 justify-content-end  overflow-hidden ">
                                             ${PostObject.tagContent}
                                 
                                </div>
                            
                                </div>
            </div>
            
            `;
	return htmlPost;
}

function getMainBeforePosts() {
	return `
	<div class="card w-100 shadow-sm" style="width: 18rem">
        <div class="card-header d-flex align-items-end gap-2">
            <img src="./assets/imgs/profile.png " alt="profile img" class="rounded-circle border border-2" style="width: 44px; height: 44px;  margin-left: 1px" />
            <h4 class="text-secondary"><span class="text-black">M</span>ajid</h4>
        </div>
        <img src="assets/imgs/body.jpg" class="img-fluid" alt="Post img " style="aspect-ratio: 16/9; object-fit: cover" />
        <h6 class="px-1 pt-1 text-end">2 min</h6>
        <div class="card-body pt-1">
            <h5 class="card-title">Card title</h5>
            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            <hr />
            <a  class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-html="true" data-bs-title="<b>3</b>" data-bs-custom-class="custom-tooltip"> Comments</a>
        </div>
    </div>`;
}

async function PushPostToDom(pageNumber) {
	try {
		let arrPosts = Array.from(await getJsonPosts(pageNumber));
		if (arrPosts.length == 0) return;
		arrPosts.forEach((post) => {
			// get post as html
			htmlPost = postJsonToHtml(post);

			// push post to dom
			domPostsParent.innerHTML += htmlPost;
		});
	} catch (error) {
		await delay(20);
		appendAlert(error, "danger");
		await clearAlert();
	}

	initializeTooltips();
}

function checkScrollEnd() {
	// Current scroll position
	var scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

	// Total height of the webpage
	var totalHeight = document.documentElement.scrollHeight;

	// Window height
	var windowHeight = window.innerHeight;
	// Check if the scroll position plus the window height equals or exceeds the total height
	if (scrollTop + windowHeight >= totalHeight - 80) return true;
	return false;
}
// Throttle function to limit the rate of function execution
function throttle(callback, wait) {
	var timeout;
	return function () {
		var context = this;
		var args = arguments;
		if (!timeout) {
			timeout = setTimeout(function () {
				timeout = null;
				callback.apply(context, args);
			}, wait);
		}
	};
}

async function insertNewPageToDom() {
	if (currentPage === 1) {
		domPostsParent.innerHTML = "";
		await PushPostToDom(currentPage++);
	} else if (checkScrollEnd()) {
		if (currentPage > lastPage) return;
		await PushPostToDom(currentPage++);
	}
}

// Applying throttling to the event listener
var throttledInsertNewPageToDom = throttle(insertNewPageToDom, 500);

window.onscroll = throttledInsertNewPageToDom;
window.addEventListener("load", insertNewPageToDom);

/*
```javascript
function throttle(callback, wait) {
    var timeout;

    return function () {
        var context = this;
        var args = arguments;

        if (!timeout) {
            timeout = setTimeout(function () {
                timeout = null;
                callback.apply(context, args);
            }, wait);
        }
    };
}
```

1. **`function throttle(callback, wait) { ... }`:**
   - This is a function named `throttle` that takes two parameters:
     - `callback`: The function to be throttled.
     - `wait`: The minimum time (in milliseconds) to wait between consecutive invocations of the throttled function.

2. **`var timeout;`:**
   - This variable will be used to store the timeout ID returned by `setTimeout`. It keeps track of whether 
   the function is currently throttled.

3. **`return function () { ... };`:**
   - The `throttle` function returns a new function (a closure). This returned function will be used 
   as the throttled version of the original `callback`.

4. **`var context = this;` and `var args = arguments;`:**
   - These lines capture the current `this` value and the arguments passed to the throttled function.
    This ensures that the original context (`this`) and arguments are preserved when invoking the `callback`.

5. **`if (!timeout) { ... }`:**
   - This condition checks if there is an existing timeout. If there is no existing timeout (`!timeout` is true),
    the block of code inside the `if` statement is executed.

6. **`timeout = setTimeout(function () { ... }, wait);`:**
   - This line sets a new timeout using `setTimeout`. The purpose of this timeout 
   is to delay the execution of the `callback` by the specified `wait` duration.

7. **`function () { ... }`:**
   - This is the callback function that will be executed after the timeout.

8. **`timeout = null;`:**
   - Once the timeout has triggered and the callback has been executed, `timeout`
    is set back to `null`. This is crucial because it allows the next invocation 
	to set a new timeout, controlling the rate at which the original function is called.

9. **`callback.apply(context, args);`:**
   - This line invokes the original `callback` using the `apply` method. The `apply`
    method is used to set the `this` value (`context`) and pass the arguments (`args`) to the `callback`. 
	This ensures that the `callback` is executed in the correct context with the correct arguments.

In summary, the `throttle` function is designed to limit the rate at which 
a function can be invoked. It achieves this by setting a timeout and ensuring that the original function is only called 
once within the specified time interval. The captured `this` and `arguments` ensure that the context and arguments 
of the original function are preserved during throttled invocations.
 */

function showPostDetails(postId) {
	window.location = `postDetails.html?postId=${postId}`;
}
function showUserProfile(userId = "") {
	if (userId == "") window.location = `profile.html`;
	else window.location = `profile.html?userId=${userId}`;
}
