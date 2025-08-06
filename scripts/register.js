

// ======================navigate-login-to-register====================
const goToLogin = document.getElementById('goToLogin');
const goToRegister = document.getElementById('goToRegister');
const registerImage = document.querySelector('.registerImage');


goToRegister.onclick = (e) => {
    e.preventDefault();
    registerImage.style.left = '50%';
}
goToLogin.onclick = (e) => {
    e.preventDefault();
    registerImage.style.left = '0px';
}

// =========================inputs-Focused-style=================

const inputs = document.querySelectorAll('.inputStyle input');
for (const input of inputs) {
    input.addEventListener('focus', function () {
        this.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', function () {
        this.parentElement.classList.remove('focused');
    });
}

// =====================togglePassword====================
const togglePassword = document.querySelectorAll('.togglePassword');

for (const icon of togglePassword) {
    icon.addEventListener('click', function () {
        const input = this.previousElementSibling;


        if (input.type === 'password') {
            input.type = 'text';
        } else {
            input.type = 'password';
        }

        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
}





// ===================================================================
// ========================register-validation========================
// ===================================================================




// =================regex=================
const nameRegex = /^[A-Za-z]{2,15}$/;
const emailRegex = /^[a-zA-Z0-9]+[._-][a-zA-Z0-9]+@(gmail|yahoo|msn)\.com$/;
const passwordRegex = /^.{6,20}$/;

// =================validation=================
function validateRegisterInput(input) {
    const name = input.name;
    const value = input.value.trim();
    const parent = input.parentElement;
    const errorSpan = parent.querySelector(".error-message");

    let isValid = true;
    let message = "";

    if (name === "firstName" || name === "lastName") {
        isValid = nameRegex.test(value);
        message = "at least 2 characters and max 15";
    } else if (name === "email") {
        isValid = emailRegex.test(value);
        message = "email like Exam2ple(.|-|_)exam5ple@(gmail|yahoo|msn).com";
    } else if (name === "password") {
        isValid = passwordRegex.test(value);
        message = "Min 6 chars and max 20";
    } else if (name === "confirmPassword") {
        const passwordValue = document.querySelector('[name="password"]').value.trim();
        isValid = value === passwordValue;
        message = "Passwords don't match";
    }

    if (!isValid) {
        parent.style.outline = "2px solid red";
        errorSpan.textContent = message;
    } else {
        parent.style.outline = "";
        errorSpan.textContent = "";
    }

    return isValid;
}

// =================registration_submit=================
const registerForm = document.querySelector(".regiser form");

registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const inputs = registerForm.querySelectorAll("input[name]");
    let allValid = true;
    for (const input of inputs) {
        const valid = validateRegisterInput(input);
        if (!valid) {
            allValid = false;
        }
    }

    if (allValid) {

        const enteredEmail = registerForm.email.value.trim();

        let usersList = localStorage.getItem("users");
        let usersArray = usersList ? JSON.parse(usersList) : [];

        let emailExists = false;

        for (const user of usersArray) {
            if (user.email === enteredEmail) {
                emailExists = true;
                break;
            }
        }



        if (emailExists) {
            const emailInput = registerForm.email;
            const emailContainer = emailInput.parentElement;
            emailContainer.style.outline = "2px solid red";
            emailContainer.querySelector(".error-message").textContent = "Email already exists";
            return;
        }



        const user = {
            id: Date.now(),
            firstName: registerForm.firstName.value.trim(),
            lastName: registerForm.lastName.value.trim(),
            email: registerForm.email.value.trim(),
            password: registerForm.password.value.trim(),
            ProfileImg: 'https://res.cloudinary.com/dj1omur11/image/upload/v1754086842/empty-user_dwkdri.png'
        };


        usersArray.push(user);
        localStorage.setItem("users", JSON.stringify(usersArray));


        window.location.href = `index.html?id=${user.id}`;
    }
});

// =================validiteOnBlure =================
const registerInputs = document.querySelectorAll(".regiser input[name]");
registerInputs.forEach(input => {
    input.addEventListener("blur", () => {
        validateRegisterInput(input);
    });
});




// ===================================================================
// ========================login-validation===========================
// ===================================================================



// =================validationFunction=================
function validateLoginInput(input) {
    const value = input.value.trim();
    const parent = input.parentElement;
    const errorSpan = parent.querySelector(".error-message");

    let isValid = value !== "";
    if (!isValid) {
        parent.style.outline = "2px solid red";
        errorSpan.textContent = "This field is required";
    } else {
        parent.style.outline = "";
        errorSpan.textContent = "";
    }

    return isValid;
}

// =================Login-Submit=================
const loginForm = document.querySelector(".login form");

loginForm?.addEventListener("submit", function (e) {
    e.preventDefault();

    const emailInput = loginForm.querySelector('[name="email"]');
    const passInput = loginForm.querySelector('[type="password"]');

    const isEmailValid = validateLoginInput(emailInput);
    const isPassValid = validateLoginInput(passInput);

    if (!isEmailValid || !isPassValid) return;

    const usersList = localStorage.getItem("users");
    const users = usersList ? JSON.parse(usersList) : [];

    // const users = JSON.parse(localStorage.getItem("users")) || [];



    const user = users.find(function (usr) {
        return usr.email === emailInput.value.trim();
    });

    // const user = users.find(u => u.email === emailInput.value.trim());

    if (!user) {
        emailInput.parentElement.style.outline = "2px solid red";
        emailInput.parentElement.querySelector(".error-message").textContent = "Email does not exist";
        return;
    }

    if (user.password !== passInput.value.trim()) {
        passInput.parentElement.style.outline = "2px solid red";
        passInput.parentElement.querySelector(".error-message").textContent = "Wrong password";
        return;
    }

    window.location.href = `index.html?id=${user.id}`;
});

// =================vlidationOnBlur=================
const loginInputs = document.querySelectorAll(".login input[name]");
loginInputs.forEach(input => {
    input.addEventListener("blur", () => {
        validateLoginInput(input);
    });
});



