

// ====================handling-loader-start=======================
window.addEventListener("load", () => {
    // document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    setTimeout(() => {
        const loader = document.querySelector(".page-loader");

        loader.style.opacity = "0";
        loader.style.pointerEvents = "none";

        // document.body.style.overflow = "";
        document.documentElement.style.overflow = "";

        setTimeout(() => {
            loader.style.display = "none";
        }, 500);
    }, 3000);
});

// ====================handling-loader-end=======================



// ====================navScripts-start=======================
const navSections = {
    shoppingCart: document.querySelector('.shopping-cart'),
    login: document.querySelector('.login-form')
};
// -----------------
function toggleSection(activeKey) {
    for (const key in navSections) {
        if (key === activeKey) {
            navSections[key].classList.toggle('active');
        } else {
            navSections[key].classList.remove('active');
        }
    }
}
// -------------------
document.querySelector('#close-cart').onclick = () => toggleSection('shoppingCart');
document.querySelector('#cart-btn').onclick = () => toggleSection('shoppingCart');
document.querySelector('#login-btn').onclick = () => toggleSection('login');
document.querySelector('#close-login').onclick = () => toggleSection('login');
// --------------------
window.onscroll = () => {
    for (const key in navSections) {
        navSections[key].classList.remove('active');
    }
};

// ====================navScripts-end=======================





// ===================handle-Dark-Mode-Start==================
const dayNight = document.querySelector('.day-night');

dayNight.addEventListener("click", function () {
    dayNight.querySelector('i').classList.toggle("fa-sun");
    dayNight.querySelector('i').classList.toggle("fa-moon");
    document.body.classList.toggle("dark");

    // ---------------modestate------------
    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }

});


window.addEventListener('load', function () {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        dayNight.querySelector('i').classList.add("fa-sun");
        dayNight.querySelector('i').classList.remove("fa-moon");
    } else {
        document.body.classList.remove("dark");
        dayNight.querySelector('i').classList.add("fa-moon");
        dayNight.querySelector('i').classList.remove("fa-sun");
    }
});
// window.addEventListener('load', function () {
//     if (document.body.classList.contains('dark')) {
//         dayNight.querySelector('i').classList.add("fa-sun");
//     }
//     else {
//         dayNight.querySelector('i').classList.add("fa-moon");

//     }
// });

// ===================handle-Dark-Mode-End==================






// =====================login-form-start==================
const registration = document.querySelector('.registration');
const userImg = document.querySelector('.userInformation');
const userName = document.querySelector('.header .login-form .userInformation .name');
const userEmail = document.querySelector('.header .login-form .userInformation .email');
const logOut = document.querySelector('.header .login-form .userInformation .logOut');

const userInformation = new URLSearchParams(window.location.search);

if (userInformation.get('id')) {
    registration.style.display = 'none';
    userImg.style.display = 'flex';
}


logOut.onclick = function () {
    // location.href = location.pathname;
    location.href = "registration.html";
    // sessionStorage.removeItem('profileImage');
}


// console.log(userInformation.size);
// console.log(userInformation.get('lastName'));

// ------------------------

const usersList = localStorage.getItem("users");
const users = usersList ? JSON.parse(usersList) : [];

const user = users.find(function (usr) {
    return usr.id == userInformation.get('id');
});
// console.log(user);
if (user) {
    userName.innerText = `${user.firstName} ${user.lastName}`;
    userEmail.innerText = `${user.email}`;
}


// =====================login-form-end====================





// =================upload-profile-image-start==================
const fileInput = document.getElementById('fileInput');
const profilePhoto = document.getElementById('profilePhoto');
const camera = document.getElementById('camera');
camera.onclick = function () {
    fileInput.click();
}
fileInput.onchange = async function () {
    let file = fileInput.files[0];
    if (file) {
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'profileImags');
        data.append('cloud_name', 'dj1omur11');
        const res = await fetch("https://api.cloudinary.com/v1_1/dj1omur11/image/upload", {
            method: 'post',
            body: data,
        })
        const uploadedImgURL = await res.json();
        // console.log(uploadedImgURL.url);

        const user = users.find(function (usr) {
            return usr.id == userInformation.get('id');
        });
        if (user) {
            user.ProfileImg = uploadedImgURL.url;
            // console.log(user);
            profilePhoto.style.backgroundImage = `url('${user.ProfileImg}')`;
            manageProfilePhoto.style.backgroundImage = `url('${user.ProfileImg}')`;
            localStorage.setItem("users", JSON.stringify(users));
        }


    }
}
if (user) {
    profilePhoto.style.backgroundImage = `url('${user.ProfileImg}')`;
}




// =================upload-profile-image-end==================



// =======================manageAccount-start=====================
const manageAccount = document.querySelector('.manageAccount');
const tomanageAccount = document.querySelector('.header .login-form .userInformation .manage');
const closemanageAccount = document.getElementById('closemanageAccount');
tomanageAccount.onclick = function (e) {
    showPopup(e, manageAccount);
    toggleSection('login');

};

closemanageAccount.onclick = function () {
    closePopup(manageAccount);
}

// -------------------mangeAccountContainer----------

const manageProfilePhoto = document.querySelector('#mangeProfilePhoto');
const manageUserName = document.querySelector('.headerManageAccount .informationUser .name');
const manageEmail = document.querySelector('.headerManageAccount .informationUser .email');
const fisrtNameUserData = document.querySelector('.manageAccountContainer .userData .firstName .value');
const lastNameUserData = document.querySelector('.manageAccountContainer .userData .LastName .value');
const emailUserData = document.querySelector('.manageAccountContainer .userData .Email .value');


if (user) {
    manageProfilePhoto.style.backgroundImage = `url('${user.ProfileImg}')`;
    manageUserName.innerText = `${user.firstName} ${user.lastName}`;
    manageEmail.innerText = `${user.email}`;
    fisrtNameUserData.innerText = `${user.firstName}`;
    lastNameUserData.innerText = `${user.lastName}`;
    emailUserData.innerText = `${user.email}`;
}


const editeInformationForm = document.querySelector(".manageAccountContainer .editeInformationForm");
// const editeDataContainer = document.querySelector('.manageAccountContainer .editeData');
const goToEditeInformation = document.querySelector('.manageAccountContainer .editeData .edite');
const showEdit = document.querySelector('#showEdit');
goToEditeInformation.addEventListener('click', function () {
    showEdit.classList.toggle("fa-angle-down");
    showEdit.classList.toggle("fa-angle-right");
    editeInformationForm.classList.toggle('hide');
});



// =================Regex=================
const nameRegex = /^[A-Za-z]{2,15}$/;
const passwordRegex = /^.{6,20}$/;

// ================validateEditedInformation==================
function validateEditedInformation(input) {
    const name = input.name;
    const value = input.value.trim();
    const parent = input.parentElement;
    const errorSpan = parent.querySelector(".error-message");

    let isValid = true;
    let message = "";

    if (name === "firstName" || name === "lastName") {
        isValid = nameRegex.test(value);
        message = "Only letters, at least 2 characters and max 15";
    } else if (name === "currentPassword") {
        if (value != user.password) {
            message = "password not correct";
            isValid = false;
        }

    } else if (name === "newPassword") {

        isValid = passwordRegex.test(value);;
        message = "Min 6 chars and max 20";
    }

    if (!isValid) {
        parent.style.borderBottom = "2px solid red";
        errorSpan.textContent = message;
    } else {
        parent.style.borderBottom = "";
        errorSpan.textContent = "";
    }

    return isValid;
}

if (user) {
    const editeInformationInputs = document.querySelectorAll(".editeInformationForm input[name]");
    editeInformationInputs.forEach(input => {
        input.addEventListener("blur", () => {
            validateEditedInformation(input);
        });
    });
}




editeInformationForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const inputs = editeInformationForm.querySelectorAll("input[name]");
    let allValid = true;
    for (const input of inputs) {
        const valid = validateEditedInformation(input);
        if (!valid) {
            allValid = false;
        }
    }
    if (allValid) {
        let newFisrtName = document.querySelector('.editeInformationForm input[name="firstName"]').value.trim();
        let newLastName = document.querySelector('.editeInformationForm input[name="lastName"]').value.trim();
        let newPassword = document.querySelector('.editeInformationForm input[name="newPassword"]').value.trim();

        user.firstName = newFisrtName;
        user.lastName = newLastName;
        user.password = newPassword;

        // حفظ التعديلات
        localStorage.setItem("users", JSON.stringify(users));


        window.location.href = `index.html?id=${user.id}`;
    }
})




// ----------------delet-account----------------
const deleteAccountBtn = document.getElementById("deletAccount");

deleteAccountBtn.addEventListener("click", function (e) {
    e.preventDefault();

    const confirmDelete = confirm("Are you sure you want to delete your account?");

    if (confirmDelete) {
        const index = users.findIndex(function (usr) {
            return usr.id == user.id;
        });
        if (index !== -1) {
            users.splice(index, 1);
            localStorage.setItem("users", JSON.stringify(users));
        }

        window.location.href = "registration.html";
    }
});




// =======================manageAccount-end=====================







// ===================popup-functions-start================
function showPopup(e, page) {
    e.preventDefault();
    page.style.transform = 'rotateY(0deg)';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = "hidden";
}

function closePopup(page) {
    page.style.transform = 'rotateY(90deg)';
    document.body.style.overflow = '';
    document.documentElement.style.overflow = "";
}

// ===================popup-functions-end================







// ============================about-us-section-start==========================
const aboutPage = document.querySelector('.aboutPage');
const toAboutPage = document.getElementById('toAboutPage');
const closeAboutImage = document.getElementById('closeAboutPage');
toAboutPage.onclick = function (e) {
    showPopup(e, aboutPage);
};

closeAboutImage.onclick = function () {
    closePopup(aboutPage);
}

// ============================about-us-section-end============================



// ============================intro-banner-section-start============================
const bannerPage = document.querySelector('.bannerPage');
const toBannerPage = document.getElementById('toBannerPage');
const closeBannerPage = document.getElementById('closeBannerPage');
toBannerPage.onclick = function (e) {
    showPopup(e, bannerPage);

}
closeBannerPage.onclick = function () {
    closePopup(bannerPage);
}

// ============================intro-banner-section-end============================


