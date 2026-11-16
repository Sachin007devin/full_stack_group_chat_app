const API_URL = 'http://Localhost:7777/user/login'


const form = document.querySelector('form')

if (form) form.addEventListener('submit', async (event) => handleFormSubmit(event))

async function handleFormSubmit(event) {
    try {
        event.preventDefault()

        const userCredential = event.target.userCredential
        const emailOrPhone = userCredential.type === 'email' ? userCredential.value : Number(userCredential.value)
        console.log(emailOrPhone)
        const passkey = event.target.passkey.value

        const payload = { emailOrPhone, password:passkey }
        const {data} = await axios.post(API_URL, payload)
        const token = data.token

        localStorage.setItem('token', token)

        window.alert(data.message)
        window.location.href='./chatWindow.html'

    } catch (error) {
        window.alert(error)
        throw Error(error)
    }

}

function setLoginMode(mode) {
    const inputField = document.getElementById('user-handle');
    const prefixIcon = document.getElementById('input-prefix-icon');
    const btnEmail = document.getElementById('btn-email');
    const btnMobile = document.getElementById('btn-mobile');

    if (mode === 'email') {
        // Email Mode Settings
        inputField.type = 'email';
        inputField.placeholder = 'maya@loopchat.gg';
        prefixIcon.textContent = '@';

        // Active class switch
        btnEmail.classList.add('active');
        btnMobile.classList.remove('active');
    } else {
        // Mobile Number Mode Settings
        inputField.type = 'number';
        inputField.placeholder = '+91 xxxxx xxxxx';
        prefixIcon.textContent = '📞';

        // Active class switch
        btnMobile.classList.add('active');
        btnEmail.classList.remove('active');
    }
}

const toggle_eye = document.querySelector('.toggle-eye')
toggle_eye.addEventListener('click',()=>{
    const passwordField = document.getElementById('passkey')
    if(passwordField.type ==='password' || passwordField.type === null){
        passwordField.type = 'text'
    }
    else{
        passwordField.type = 'password'
    }
})