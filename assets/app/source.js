// shared between all
const baseUrl = "https://tarmeezacademy.com/api/v1";

//  app  resources :
const getPostsUrl = baseUrl + "/posts";
const backupProfileImg = "./assets/imgs/profile.png";
const backupBodyImg = "./assets/imgs/body.jpg";
let domPostsParent = document.getElementById("posts");

// login resources :
const loginUrl = baseUrl + "/login";

const errorMsgDom = document.getElementById("errorMsg");
const loginBtn = document.getElementById("loginBtn");
const closeBtn = document.getElementById("closeBtn");
const navBarBtnsParent = document.getElementById("navBarButtons");
const alertPlaceholder = document.getElementById("liveAlertPlaceholder");

const loginModal = document.getElementById("loginModal");
const mainContent = document.getElementById("mainContent");
const LoginForm = document.getElementById("loginForm");

// register resources :
const registerUrl = baseUrl + "/register";

const errorRegisterMsgDom = document.getElementById("errorRegisterMsg");
const registerBtn = document.getElementById("registerBtn");
const closeRegisterBtn = document.getElementById("closeRegisterBtn");
const registerForm = document.getElementById("registerForm");

// add post resource :
const imgContainer = document.querySelector("#addPostForm .imgContainer");
const imgContainerContent = document.querySelector("#addPostForm .imgContainer .content");

const postTitle = document.getElementById("postTitle");
const postBody = document.getElementById("postBody");
const postFileInput = document.getElementById("postImg");
const postTags = document.getElementById("postTags");
const AddPostFrom = document.getElementById("addPostForm");
const addPostBtn = document.getElementById("addPostBtn");
const closeAddPostBtn = document.getElementById("closeAddPostBtn");
// const addCommentForm=document.getElementById('addComments');

// update post resources :

const imgUpdateContainer = document.querySelector("#updatePostForm .imgContainer");
const imgUpdateContainerContent = document.querySelector("#updatePostForm .imgContainer .content");

const updatePostModal = document.getElementById("updatePostModal");
const updatePostTitle = document.getElementById("updatePostTitle");
const updatePostBody = document.getElementById("updatePostBody");
const updatePostFileInput = document.getElementById("updatePostImg");
const updatePostTags = document.getElementById("updatePostTags");
const updatePostFrom = document.getElementById("updatePostForm");
const updatePostBtn = document.getElementById("updatePostBtn");
const updateClosePostBtn = document.getElementById("closeUpdatePostBtn");
const updateImg = document.getElementById("updateImg");

// delete post resources :
const deletePostModal = document.getElementById("deletePostModal");
const deletePostBtn = document.getElementById("deletePostBtn");

// profile resources :
const profileImg = document.querySelector(".userInfo img");

const profileGmail = document.getElementById("gmail");
const profileUsername = document.getElementById("username");
const profileName = document.getElementById("name");

const profilePostCount = document.querySelector("#postCount span");
const profileCommentCount = document.querySelector("#CommentCount span");
