function showloader() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.display = 'block';
    } else {
        console.error("Loader element not found!");
    }
}
 
function hideLoader() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.display = 'none';
    } else {
        console.error("Loader element not found!");
    }
}
const loader_overlay = document.querySelector('.loading-overlay');

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const submitButton = document.querySelector('.submit-btn');
    const eyeIcon = document.createElement('i');


    function preventBack() {
        window.history.forward(); 
    }
    
    setTimeout("preventBack()", 0);
    window.onload = function () { null };
    
    // Disable autofill
    loginForm.setAttribute('autocomplete', 'off');
    usernameInput.setAttribute('autocomplete', 'off');
    passwordInput.setAttribute('autocomplete', 'off');
    
    // Clear input fields when the page loads
    usernameInput.value = '';
    passwordInput.value = '';

    eyeIcon.className = 'fa-solid fa-eye-slash eye-icon';
    passwordInput.parentElement.classList.add('password-container');
    passwordInput.parentElement.appendChild(eyeIcon);
    
    let passwordVisible = false;

    eyeIcon.addEventListener('click', function() {
        passwordVisible = !passwordVisible;
        passwordInput.type = passwordVisible ? 'text' : 'password';
        eyeIcon.className = passwordVisible ? 'fa-solid fa-eye eye-icon' : 'fa-solid fa-eye-slash eye-icon';
    });
 
    function validateForm() {
        const isValid = usernameInput.value.trim() !== '' && 
                       passwordInput.value.trim() !== '';
        submitButton.disabled = !isValid;
    }
 
    function setInvalidState() {
        usernameInput.parentElement.classList.add('invalid');
        passwordInput.parentElement.classList.add('invalid');
    }
 
    function resetInvalidState() {
        usernameInput.parentElement.classList.remove('invalid');
        passwordInput.parentElement.classList.remove('invalid');
    }
 
    usernameInput.addEventListener('input', function() {
        validateForm();
        resetInvalidState();
    });
    
    passwordInput.addEventListener('input', function() {
        validateForm();
        resetInvalidState();
    });

    loginForm.addEventListener('submit', async function(e) {
        showloader();
        loader_overlay.style.display='flex';
      
 
        e.preventDefault();
        
        const loginData = {
            user: usernameInput.value.trim(),
            userPass: passwordInput.value.trim(),
        };
 
        try {
            const response = await fetch('http://localhost:6060/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });
          
            const data = await response.json();
 
            if (data.success) {
                loader_overlay.style.display='none';
                hideLoader();
                const token = data.sessionToken;
                console.log("Token:", token);
   
                // Store the session token in localStorage and sessionStorage
                localStorage.setItem('sessionToken', token);
                sessionStorage.setItem('sessionToken', token);
                
                // Redirect to dashboard and prevent back button usage
                window.location.href = "../dashboard/index.html";


            } else {
                setInvalidState();  // Handle unsuccessful login
            }
        } catch (error) {
            console.error(error);
            setInvalidState();
        }
    });
});
