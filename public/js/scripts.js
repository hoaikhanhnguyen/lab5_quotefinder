//Event Listeners
let authorLinks = document.querySelectorAll('a');
for (authorlink of authorLinks) {
  authorlink.addEventListener('click', getAuthorInfo);
}

async function getAuthorInfo() {
  let myModal = new bootstrap.Modal(document.getElementById('authorModal'));
  myModal.show();
  let url  = `/api/author/${this.id}`;
  let response = await fetch(url);
  let data = await response.json();
  console.log(data);

  const originalDateString = data[0].dob;
  const date = new Date(originalDateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  const originalDateStringDOD = data[0].dod;
  const dateDOD = new Date(originalDateStringDOD);

  const yearDOD = dateDOD.getFullYear();
  const monthDOD = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const dayDOD = String(date.getDate()).padStart(2, '0');
  const formattedDateDOD = `${yearDOD}-${monthDOD}-${dayDOD}`;

  let authorInfo = document.querySelector('#authorInfo');
  authorInfo.innerHTML = `<h1> ${data[0].firstName}
                               ${data[0].lastName} </h1> `;
  authorInfo.innerHTML += `<img src="${data[0].portrait}"
  width="200"><br>`;
  authorInfo.innerHTML += `<p><strong>Date of birth:</strong> ${formattedDate}</p>`;
  authorInfo.innerHTML += `<p><strong>Day of death:</strong> ${formattedDateDOD}</p>`;
  authorInfo.innerHTML += `<p><strong>Sex:</strong> ${data[0].sex}</p>`;
  authorInfo.innerHTML += `<p><strong>Country of Origin:</strong> ${data[0].country}</p>`;
  authorInfo.innerHTML += `<p><strong>Profession:</strong> ${data[0].profession}</p>`;
  authorInfo.innerHTML += `<p><strong>Biography:</strong> ${data[0].biography}</p>`;
}