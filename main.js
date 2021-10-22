//宣告網址常數
const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users/";

const dataPanel = document.querySelector("#data-panel");
const paginator = document.querySelector("#paginator");
const selectViewStyle = document.querySelector("#view-style");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const favoriteUsers = JSON.parse(localStorage.getItem("favoriteUsers")) || [];

//製作User List 容器
const users = []; // 放置全部user的資料
let filterUser = []; // 用來儲存經過搜尋得到的user資料
const USER_PER_PAGE = 16; // 每頁共16位
let currentPage = 1;
let mode = "";

//顯示所有使用者名單
//排列方式Gallery
function renderGalleryUserList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `
    <div class="user-card col-sm-2 m-3">
      <div class="card mt-3">
        <img src="${item.avatar}" class="card-img-top" alt="avatar">
        <div class="card-body">
          <h4 class="card-title" id="user-name">${item.name}</h4>
        </div>
        <div class="card-footer" id="footer-btn">
          <button class="btn btn-warning btn-show-userinfo" data-toggle="modal" data-target="#user-modal" data-id="${item.id}">MORE</button>
          <button class="btn btn-add-favorite data-id="${item.id}">
            <i class="far fa-heart"></i>
          </button>
        </div>
      </div>
    </div>
  `;
  });
  dataPanel.innerHTML = rawHTML;
}

// function for list view style 清單式排列
function renderListUserList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `
      <div class="col-12 row border-bottom d-flex justify-content-center align-items-center mb-2 pb-2">
        <div class="col-3 text-center">
          <img src="${item.avatar}" class="card-img-top rounded-circle w-50 show-user-info" alt="User-avatar" data-toggle="modal" data-target="#user-modal" data-id="${item.id}">
        </div>
        <div class="col-4 text-center pt-3">
          <h4 class="card-title">${item.name}</h4>
        </div>
        <div class="card-footer" id="footer-btn">
          <button class="btn btn-warning btn-show-userinfo" data-toggle="modal" data-target="#user-modal" data-id="${item.id}">MORE</button>
          <button class="btn btn-info btn-add-favorite data-id="${item.id}">  
            <i class="far fa-heart"></i>
          </button>
        </div>
      </div>
    `;
  });
  dataPanel.innerHTML = rawHTML;
}

//建立function：判斷顯示方式
function viewCheck(page) {
  if (viewMode === "gallery") {
    return renderGalleryUserList(getUserByPage(page));
  } else {
    renderListUserList(getUserByPage(page));
  }
}

// 建立切換排列方式監聽器
selectViewStyle.addEventListener("click", function (event) {
  if (event.target.matches(".gallery-view")) {
    renderGalleryUserList(getUserByPage(currentPage));
  } else {
    renderListUserList(getUserByPage(currentPage));
  }
});


//宣告函式抓出使用者id
function showUserModal(id) {
  const modalName = document.querySelector("#user-modal-title");
  const modalAvatar = document.querySelector("#user-avatar");
  const modalGender = document.querySelector("#user-gender");
  const modalAge = document.querySelector("#user-age");
  const modalBirthday = document.querySelector("#user-birthday");
  const modalRegion = document.querySelector("#user-region");
  const modalEmail = document.querySelector("#user-email");

  axios
    .get(INDEX_URL + id)
    .then((response) => {
      //response.data.results
      const data = response.data;
      modalName.innerText = `${data.name} ${data.surname}`;
      modalAvatar.innerHTML = `<img src="${data.avatar}" class="img-fluid" alt="Responsive image">`;
      modalGender.innerText = `Gender: ${data.gender}`;
      modalAge.innerText = `Age: ${data.age}`;
      modalBirthday.innerText = `Birthday: ${data.birthday}`;
      modalRegion.innerText = `Region: ${data.region}`;
      modalEmail.innerText = `Email: ${data.email}`;
    })
    .catch((err) => {
      console.log(err);
    });
}

//Modal
//監聽data panel
dataPanel.addEventListener("click", function onPanelClick(event) {
  if (event.target.matches(".btn-show-userinfo")) {
    showUserModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
});

//建立function存取收藏清單
function addToFavorite(id) {
  console.log(id)
}
dataPanel.addEventListener('click', function onPanelClicked(event)
{

})

//建立search form 監聽器
searchForm.addEventListener('submit',function onSearchFormSubmitted(event) {
  event.preventDefault() //請瀏覽器終止元件
  const keyword = searchInput.value.trim().toLowerCase()
  //console.log(searchInput.value)
  if(!keyword.length){
    return alert('Please enter a valid string!')
  }
 
  filterUser = users.filter(user =>
    user.name.toLowerCase().includes(keyword)
  )
  
  renderGalleryUserList(filterUser)
})


axios
  .get(INDEX_URL)
  .then((response) => {
    //console.log(response.data.results);
    users.push(...response.data.results);
    renderGalleryUserList(users);
  })
  .catch((err) => console.log(err));
