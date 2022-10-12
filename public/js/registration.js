const passwordInput = document.querySelector('#passwordInput');
const showButton = document.querySelector('#showButton');
const form = document.querySelector('.site-form');
const usernameInput = document.querySelector('#usernameInput');
const emailInput = document.querySelector('#emailInput');
const error_msg = document.querySelector('.error-msg');

window.localStorage.removeItem('token');
window.localStorage.removeItem('userInfo');

showButton.addEventListener('click', () => {
  passwordInput.type = passwordInput.type == 'password' ? 'text' : 'password';
});

form.addEventListener('submit', async (evt) => {
  evt.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  const email = emailInput.value.trim();
  const avatar = document.querySelector('#uploadInput').files[0];

  error_msg.textContent = 'Wait...';

  let formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  formData.append("email", email);
  
  if (avatar) {
    formData.append("avatar", avatar);
  };

  const response = await fetch('https://telegram-clones.herokuapp.com/register', {
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
});
