const form = document.querySelector('.site-form');
const usernameInput = document.getElementById('usernameInput');
const passwordInput = document.getElementById('passwordInput');
const showButton = document.getElementById('showButton');
const error_msg = document.querySelector('.error-msg')

window.localStorage.removeItem('token');
window.localStorage.removeItem('userInfo');

showButton.addEventListener('click', () => {
  passwordInput.type = passwordInput.type == 'password' ? 'text' : 'password';
});
  
form.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  error_msg.textContent = 'Wait...';

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  let formData = new FormData();

  formData.append("username", username);
  formData.append("password", password);

  const response = await fetch('https://telegram-clones.herokuapp.com/login', {
    method: "POST",
    body: formData
  });

  const data = await response.json();

  if (data.message != 'ok') {
    error_msg.textContent = data.message;
  }

  else {
    error_msg.textContent = 'Success!';
    window.localStorage.setItem('token', data.token);
    window.localStorage.setItem('userInfo', JSON.stringify(data.data));
    window.location.replace('/');
  }
})
