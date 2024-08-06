function getURLParameters() {
	var searchParams = new URLSearchParams(window.location.search);
	var params = {};

	// Iterate over all the query parameters
	for (let [key, value] of searchParams) {
		params[key] = value;
	}

	return params;
}

async function getPostDetailsResponse(postId = 0) {
	let postUrl = baseUrl + "/posts/" + postId;

	try {
		let response = await axios.get(postUrl);

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
			this.tagContent += `<a  class=" btn btn-outline-secondary  ">${arrTags[i].name}</a>	`;
		}
	}
	commentsJsonToHtml() {
		let arrComments = Array.from(this.commentsJson);

		arrComments.forEach((comment) => {
			let profileImg = comment.author.profile_image;

			if (profileImg instanceof Object) {
				profileImg = backupProfileImg;
			}

			this.commentContent += ` 
    <div class="box d-flex   gap-4 justify-content-between py-3 shadow rounded ">
    <div class="userInfo d-flex flex-row flex-md-column  gap-2 align-items-center  text-center px-3"style="width:150px">
    <img src="${profileImg}" alt="" width="44px" height="44px" style="aspect-ratio: 4/4" class="rounded-5"  onclick="showUserProfile(${comment.author.id})" />
	<h6>${comment.author.username}</h6>
	</div>
         
         <div class="commentContent w-100 p-2">

         <p >${comment.body}</p>
         <div class="DurationCount text-end" ></div>
      </div>
    
    </div>  
         `;
		});
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

		if (this.commentsCount > 0) {
			this.commentsJsonToHtml();
		}
	}

	constructor(userId, id, profileImg, username, name, bodyImg, createdDate, title, bodyText, tags, commentsCount, commentsJson) {
		this.userId = userId;
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
		this.commentsCount = commentsCount;
		this.commentsJson = commentsJson;
		this.commentContent = "";
		this.checkValidValues();
	}
}

function postJsonToHtml(jsonPost) {
	let PostObject = new cPost(jsonPost.author.id, jsonPost.id, jsonPost.author.profile_image, jsonPost.author.username, jsonPost.author.name, (bodyImage = jsonPost.image), jsonPost.created_at, jsonPost.title, jsonPost.body, jsonPost.tags, jsonPost.comments_count, jsonPost.comments);

	let user = JSON.parse(localStorage.getItem("user"));
	let isUserPost = user != null && user.id == jsonPost.author.id;

	let headerContent = `
    <div class="card-header d-flex align-items-end gap-2 position-relative  headerContent" >
    <img src="${PostObject.profile}" alt="profile img" class="rounded-circle border border-2" style="width: 44px; height: 44px;  margin-left: 1px " onclick="showUserProfile(${jsonPost.author.id})"  />
    <h4 class="text-dark" id="postUsername"><span class="text-secondary" >@</span>${PostObject.username}</h4>
</div>
    `;
	if (isUserPost) {
		let strPost = JSON.stringify(PostObject);
		strPost = encodeURIComponent(strPost);

		headerContent = `
        <div class="card-header d-flex align-items-end gap-2 position-relative bg-dark headerContent " >
    <img src="${PostObject.profile}" alt="profile img" class="rounded-circle border border-2" style="width: 44px; height: 44px;  margin-left: 1px"  onclick="showUserProfile(${jsonPost.author.id})" />
    <h4 class="text-white" id="postUsername"><span class="text-warning" >@</span>${PostObject.username}</h4>
    <button class="btn btn-warning px-4 position-absolute fw-bold" id="editPostBtn" style="right: 7px; font-size: 1rem;" onclick="editPost('${strPost}')">Edit</button>

</div>
        `;
	}

	htmlPost = `
            <div class="card w-100 shadow-sm" style="width: 18rem">
                                ${headerContent}
                                <img src="${PostObject.bodyImg}" class="img-fluid" alt="Post img " style="aspect-ratio: 16/9; object-fit: contain" />
                                <h6 class="px-1 pt-1 text-end mt-2 me-1 ">${PostObject.createdDate}</h6>
                                <div class="card-body pt-1">
                                    <h5 class="card-title">${PostObject.title}</h5>
                                    <p class="card-text">${PostObject.bodyText}.</p>
                                    <hr/>
                                  
                                    <div class="tagCommentContent d-flex justify-content-between  align-items-center g-2">

                                    <a  class="btn btn-secondary" id="commentBtn"  data-bs-toggle="tooltip" data-bs-html="true" data-bs-title="<b>${PostObject.commentsCount}</b>" data-bs-custom-class="custom-tooltip"> Comments</a>
                                 <div class="tagContent d-flex gap-2 w-75 justify-content-end  overflow-hidden ">
                                             ${PostObject.tagContent}
                                 
                                </div>
                            
                                </div>

                            <div class="comments px-4 d-flex flex-column   gap-3 m-2" style="padding-top: 10px" id="comments">

                               ${PostObject.commentContent}
        
                            </div>   
							      
                            ${getCommentForm()}
                            
            </div>
            
            `;
	return htmlPost;
}

async function PushPostDetails() {
	var urlParams = getURLParameters();

	// Check if the 'id' parameter is missing
	if (!urlParams.hasOwnProperty("postId")) {
		await delay(20);
		appendAlert("Missing post id parameter ", "danger");
		await clearAlert();
	} else if (isNaN(urlParams.postId)) {
		await delay(20);
		appendAlert("The id must be a number don't try to play with us 😒", "danger");
		await clearAlert();
	} else {
		try {
			let post = await getPostDetailsResponse(urlParams.postId);
			let htmlPost = postJsonToHtml(post);

			// push post to html :
			domPostsParent.innerHTML = htmlPost;

			// initialize to make the  comment count visible :
			initializeTooltips();
		} catch (error) {
			await delay(20);
			appendAlert(error, "danger");
			await clearAlert();
		}
	}
}
window.addEventListener("load", PushPostDetails);

function showUserProfile(userId = "") {
	if (userId == "") window.location = `profile.html`;
	else window.location = `profile.html?userId=${userId}`;
}
