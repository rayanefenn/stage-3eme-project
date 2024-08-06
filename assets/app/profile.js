function getURLParameters() {
	var searchParams = new URLSearchParams(window.location.search);
	var params = {};

	// Iterate over all the query parameters
	for (let [key, value] of searchParams) {
		params[key] = value;
	}
	return params;
}

function fillProfileInfo(user) {
	let profileImgUrl = user.profile_image;
	if (profileImgUrl instanceof Object) {
		profileImgUrl = backupProfileImg;
	}
	profileImg.src = profileImgUrl;

	profileGmail.innerText = user.email;
	profileUsername.innerText = user.username;
	profileName.innerText = user.name;
	profilePostCount.innerText = user.posts_count;
	profilePostCount.innerText = user.posts_count;
	profileCommentCount.innerText = user.comments_count;
}

async function getUserDetailsResponse(userId = 0) {
	let userUrl = baseUrl + "/users/" + userId;

	try {
		let response = await axios.get(userUrl);

		let data = response.data.data;
		return data;
	} catch (error) {
		throw error.response.data.message;
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
    <h4 class="text-white" id="postUsername"><span class="text-warning" >@</span>${PostObject.username}</h4>
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

async function getJsonPosts(userId) {
	try {
		let postsUrl = baseUrl + "/users/" + `${userId}` + "/posts";
		let response = await axios.get(postsUrl);
		let data = await response.data;
		return data.data;
	} catch (error) {
		throw error;
	}
}
async function PushPostToDom(userId) {
	try {
		let arrPosts = Array.from(await getJsonPosts(userId));
		if (arrPosts.length == 0) return;
		domPostsParent.innerHTML = "";
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

async function setUpProfile() {
	var urlParams = getURLParameters();

	// Check if the 'id' parameter is missing
	if (!urlParams.hasOwnProperty("userId")) {
		if (localStorage.getItem("userToken") && localStorage.getItem("user")) {
			let user = JSON.parse(localStorage.getItem("user"));
			fillProfileInfo(user);
			await PushPostToDom(user.id);
		} else {
			await delay(20);

			loginNavBtn.click();
			setTimeout(async () => {
				if (!localStorage.getItem("userToken") || !localStorage.getItem("user")) {
					await delay(40);
					appendAlert("Your Time is up", "warning");
					await clearAlert();
					window.location = `index.html`;
				}
			}, 10000);

			await delay(40);
			appendAlert("You should sign up first  to login   ", "warning");
			await clearAlert();
		}
	} else if (isNaN(urlParams.userId) || urlParams.userId == "") {
		await delay(20);
		appendAlert("The user  id must be a number don't try to play with us 😒", "danger");
		await delay(40);
		await clearAlert();
		await delay(40);
		window.location = `index.html`;
	} else {
		let userId = urlParams.userId;
		try {
			let user = await getUserDetailsResponse(userId);
			fillProfileInfo(user);
			await PushPostToDom(userId);
		} catch (error) {
			await delay(20);
			appendAlert(error, "danger");
			await clearAlert();
		}
	}
}
function showPostDetails(postId) {
	window.location = `postDetails.html?postId=${postId}`;
}

window.addEventListener("load", setUpProfile);
