async function getCommentDetailsResponse(postId = 0, commentBody) {
	let addCommentUrl = baseUrl + "/posts/" + postId + "/comments";

	let token = localStorage.getItem("userToken");
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const body = {
		body: commentBody,
	};

	try {
		let response = await axios.post(addCommentUrl, body, config);
		let data = response.data.data;
		return data;
	} catch (error) {
		throw error.response.data.message;
	}
}

function getIdParameter() {
	var searchParams = new URLSearchParams(window.location.search);
	var params = {};

	// Iterate over all the query parameters
	for (let [key, value] of searchParams) {
		params[key] = value;
	}

	return params.postId;
}

function authorCommentJsonToHtml(commentInfo) {
	let profileImg = commentInfo.author.profile_image;

	if (profileImg instanceof Object) {
		profileImg = backupProfileImg;
	}

	return `
<div class="box d-flex   gap-4 justify-content-between py-3 shadow rounded ">
    <div class="userInfo d-flex flex-row flex-md-column  gap-2 align-items-center  text-center px-3"style="width:150px">
    <img src="${profileImg}" alt="" width="44px" height="44px" style="aspect-ratio: 4/4" class="rounded-5" onclick="showUserProfile(${commentInfo.author.id})" />
	<h6>${commentInfo.author.username}</h6>
	</div>
         
         <div class="commentContent w-100 p-2">

         <p >${commentInfo.body}</p>
         <div class="DurationCount text-end" ></div>
      </div>
    
    </div> 
	`;
}

// add comment  :
let addCommentForm = document.getElementById("commentForm");

async function handelAddComment() {
	let addCommentText = document.querySelector("#addComments textarea");
	let SubmitBtn = document.querySelector('#addComments input[type="submit"]');
	let postId = getIdParameter();
	try {
		SubmitBtn.setAttribute("disabled", true);
		let commentsInfo = await getCommentDetailsResponse(postId, addCommentText.value);

		let htmlAuthorComment = authorCommentJsonToHtml(commentsInfo);
		let comments = document.getElementById("comments");
		comments.insertAdjacentHTML("afterbegin", htmlAuthorComment);
		addCommentText.value = "";
		SubmitBtn.removeAttribute("disabled");
	} catch (error) {
		await delay(20);
		appendAlert(error, "danger");
		await clearAlert();
	}
}

function addComment() {
	handelAddComment();

	return false;
}
