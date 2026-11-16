const API_URL = 'http://Localhost:7777/user/signup'

const form = document.querySelector('form')

if (form) form.addEventListener('submit', async (event) => handleFormSubmit(event))

async function handleFormSubmit(event) {
    try {
        event.preventDefault()
        const Username = event.target.Username.value
        const Email = event.target.email.value
        const phone = Number(event.target.phone.value)
        const password = event.target.password.value
        const countryPin = Number(event.target.countryPin.value)

        const payload = { Username, Email, phone, password, countryPin }

        const {data} = await axios.post(API_URL, payload)
        const token = data.token

        localStorage.setItem('token', token)
        form.reset()

        window.alert(data.message)
        window.location.href='./chatWindow.html'

    } catch (error) {
        window.alert(error)
        throw Error(error)
    }
}

const eye_btn = document.querySelector('.eye-btn')
eye_btn.addEventListener('click',()=>{
    const passwordField = document.getElementById('password')
    if(passwordField.type ==='password' || passwordField.type === null){
        passwordField.type = 'text'
    }
    else{
        passwordField.type = 'password'
    }
})