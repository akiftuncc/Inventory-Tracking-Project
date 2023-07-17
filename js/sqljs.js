const tableCreateBtn = document.querySelector("#table-create");
const tableDeleteBtn = document.querySelector("#table-delete");

tableCreateBtn.addEventListener("click", () => {
  fetch("http://localhost:3000/createTable")
    .then((response) => {
      if (response.ok) {
        console.log("Table created successfully.");
      } else {
        throw new Error("Table creation failed.");
      }
    })
    .catch((error) => {
      console.error(error);
    });
});

tableDeleteBtn.addEventListener("click", () => {
  fetch("http://localhost:3000/deleteTable")
    .then((response) => {
      if (response.ok) {
        console.log("Table deleted successfully.");
      } else {
        throw new Error("Table deletion failed.");
      }
    })
    .catch((error) => {
      console.error(error);
    });
});
