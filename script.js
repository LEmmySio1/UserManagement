const postsAPI = "https://jsonplaceholder.typicode.com/posts";
const usersAPI = "https://jsonplaceholder.typicode.com/users";

const postsContainer = document.getElementById("postsContainer");
const searchTitle = document.getElementById("searchTitle");
const authorFilter = document.getElementById("authorFilter");

let posts = [];
let users = [];

async function fetchData() {
  const [postsRes, usersRes] = await Promise.all([
    fetch(postsAPI),
    fetch(usersAPI),
  ]);
  posts = await postsRes.json();
  users = await usersRes.json();
  populateAuthors();
  renderPosts();
}

function populateAuthors() {
  users.forEach(user => {
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = `${user.name}`;
    authorFilter.appendChild(option);
  });
}

function renderPosts() {
  postsContainer.innerHTML = "";

  const titleFilter = searchTitle.value.toLowerCase();
  const authorValue = authorFilter.value;

  const filteredPosts = posts.filter(post => {
    const user = users.find(u => u.id === post.userId);
    const titleMatch = post.title.toLowerCase().includes(titleFilter);
    const authorMatch = authorValue === "all" || post.userId == authorValue;
    return titleMatch && authorMatch && user;
  });

  filteredPosts.forEach(post => {
    const user = users.find(u => u.id === post.userId);
    const col = document.createElement("div");
    col.className = "col-md-6";
    col.innerHTML = `
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title">${post.title}</h5>
          <p class="card-text">${post.body}</p>
          <button class="btn btn-primary btn-sm" onclick="showUser(${user.id})">
            ${user.name}
          </button>
        </div>
      </div>
    `;
    postsContainer.appendChild(col);
  });
}

function showUser(userId) {
  const user = users.find(u => u.id === userId);
  const modalBody = document.getElementById("userModalBody");
  modalBody.innerHTML = `
    <p><strong>Name:</strong> ${user.name}</p>
    <p><strong>Username:</strong> ${user.username}</p>
    <p><strong>Email:</strong> ${user.email}</p>
    <p><strong>Phone:</strong> ${user.phone}</p>
    <p><strong>Website:</strong> ${user.website}</p>
    <p><strong>Company:</strong> ${user.company.name}</p>
    <p><strong>Address:</strong> ${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}</p>
  `;
  new bootstrap.Modal(document.getElementById("userModal")).show();
}

searchTitle.addEventListener("input", renderPosts);
authorFilter.addEventListener("change", renderPosts);

fetchData();
