const form = document.querySelector('.chat-footer');
const textInput = document.querySelector('#textInput');
const uploads = document.querySelector('#uploads');
const group_members = document.querySelector('.chats-list');
const chat = document.querySelector('.chat-main');
const primaryUser = JSON.parse(window.localStorage.getItem('userInfo'));
const files = document.querySelector('.uploaded-file');

if (!window.localStorage.getItem('token')) {
  window.location.replace('/login');
}

function renderUsers(users) {
  const usersFragment = document.createDocumentFragment();
  users.forEach(user => {
    const userFragment = document.createDocumentFragment();
    const li = document.createElement('li');
    const img = document.createElement('img');
    const p = document.createElement('p');

    li.className = "chats-item";
    img.src = user.avatar.viewLink;
    img.alt = 'profile-picture';
    p.textContent = user.username;

    li.append(img);
    li.append(p);
    userFragment.append(li);
    usersFragment.append(userFragment);
  });
  
  group_members.innerHTML = null;
  group_members.appendChild(usersFragment);
}

async function getUsers() {
  const response = await fetch('http://localhost:3001/users', {
    method: "GET",
    headers: {
      "content-type": "application/json",
      "token": window.localStorage.getItem('token')
    }
  });
  const data = await response.json();
 
  if (data.message) {
    renderUsers([]);
  } else {
    renderUsers(data);
  }
}

function renderFiles(filess) {
  const filesFragment = document.createDocumentFragment();

  filess.forEach(file => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    const img = document.createElement('img');
    const p = document.createElement('p');

    p.textContent = file.name;
    img.src = './img/file.png';
    img.alt = 'file';
    img.width = 30;
    a.href = file.downloadLink;
    li.className = 'uploaded-file-item';

    a.appendChild(img);
    a.appendChild(p);
    li.appendChild(a);
    filesFragment.appendChild(li);
  });

  files.innerHTML = null;
  files.appendChild(filesFragment);
}

function renderMessages(messages) {
  chat.innerHTML = null;
  const chatFragment = document.createDocumentFragment();
  
  messages.forEach(msge => {
    const msg_wrapper = document.createElement('div');
    const img = document.createElement('img');
    const msg_text = document.createElement('div');
    const author = document.createElement('p');
    const time = document.createElement('p');

    msg_wrapper.className = msge.user.userId == primaryUser.userId ? 'msg-wrapper msg-from' : 'msg-wrapper';
    img.src = msge.user.avatar.viewLink;
    img.alt = 'profile-picture';
    msg_text.className = 'msg-text';
    author.className = 'msg-author';
    time.className = 'time';
    author.textContent = msge.user.username;
    time.textContent = new Date(msge.time).toLocaleTimeString();

    msg_text.appendChild(author);

    if (msge.file) {
      const object = document.createElement('object');
      const a = document.createElement('a');
      const dwnlImg = document.createElement('img');

      object.className = 'msg object-class';
      a.href = msge.file.downloadLink;
      dwnlImg.src = './img/download.png';
      dwnlImg.width = 25;
      object.data = msge.file.viewLink;

      a.appendChild(dwnlImg);
      msg_text.appendChild(object);
      msg_text.appendChild(a);
    }

    if (msge.body) {
      const p = document.createElement('p');
      p.className = 'msg';
      p.textContent = msge.body;

      msg_text.appendChild(p);
    }

    msg_text.appendChild(time);
    msg_wrapper.appendChild(img);
    msg_wrapper.appendChild(msg_text);
    chatFragment.appendChild(msg_wrapper);
  });

  chat.appendChild(chatFragment);
}

async function getMessages() {
  const response = await fetch('http://localhost:3001/messages', {
    method: "GET",
    headers: {
      "content-type": "application/json",
      "token": window.localStorage.getItem('token')
    }
  });
  const data = await response.json();

  if (data.message) {
    console.log(data.message);
  } else {
    renderMessages(data);
    const fs = data.filter(msg => msg.file).map(msg => msg.file);
    renderFiles(fs);
  }
}

function renderProfile(profile) {
  document.querySelector('.profile-avatar').src = profile.avatar.viewLink;
  document.querySelector('.profile-name').textContent = profile.username;
}

renderProfile(primaryUser);

form.addEventListener('submit', async (evt) => {
  evt.preventDefault();

  const text = textInput.value.trim();
  const file = uploads.files[0];

  let formData = new FormData();
  formData.append("body", text);

  if (file) {
    formData.append("file", file);
  }

  const response = await fetch('http://localhost:3001/messages', {
    method: "POST",
    headers: {
      'token': window.localStorage.getItem('token')
    },
    body: formData
  });

  const data = await response.json();

  if (data.message != 'ok') {
    console.log(data.message);
  } else {
    textInput.value = null;
    uploads.files = null;
  }

  getMessages();
});

getMessages();
getUsers();
