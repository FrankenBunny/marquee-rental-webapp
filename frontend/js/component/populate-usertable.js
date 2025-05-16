function populateUsersTable(users) {
  const tableBody = document.querySelector('#usersTable tbody');
  tableBody.innerHTML = ''; // Clear any existing rows

  users.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${user.id}</td><td>${user.username}</td>`;
    tableBody.appendChild(row);
  });

  document.getElementById('loadingMessage').style.display = 'none';
}