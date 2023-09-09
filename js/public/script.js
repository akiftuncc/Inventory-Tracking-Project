const innerHtmlOfForm = `<form
id="myForm"
class="user-form"
action="form_create.php"
method="POST"
enctype="multipart/form-data"
>
<div class="bars-10-grid">
  <select name="site" id="site" class="bars-all inventory-bars">
    <option value="B11">B11</option>
    <option value="B12">B12</option>
    <option value="B20">B20</option>
    <option value="B21">B21</option>
    <option value="B22">B22</option>
    <option value="B41">B41</option>
    <option value="D00">D00</option>
    <option value="D10">D10</option>
    <option value="G10">G10</option>
    <option value="K00">K00</option>
    <option value="K10">K10</option>
    <option value="K11">K11</option>
  </select>

  <select name="grup" id="grup" class="bars-all inventory-bars">
    <option value="BLG">BLG</option>
    <option value="BLGK">BLGK</option>
    <option value="NTB">NTB</option>
    <option value="NTBK">NTBK</option>
    <option value="OTM">OTM</option>
    <option value="OTMK">OTMK</option>
    <option value="YZC">YZC</option>
    <option value="YZCK">YZCK</option>
    <option value="TLV">TLV</option>
    <option value="TBLT">TBLT</option>
    <option value="EXT">EXT</option>
    <option value="PRJ">PRJ</option>
  </select>

  <input
    maxlength="3"
    class="input bars-all inventory-bars"
    placeholder="no"
    type="text"
    id="numara"
    name="numara"
    required
  />

  <select name="durum" id="durum" class="bars-all inventory-bars">
    <option value="A">A</option>
    <option value="P">P</option>
  </select>

  <div class="inventory-div">
    <input
      class="input bars-all"
      placeholder="envanter"
      type="text"
      id="envanter"
      name="envanter"
    />
  </div>

  <input
    class="input bars-all"
    placeholder="ait"
    type="text"
    id="ait"
    name="ait"
    required
  />

  <input
    class="input bars-all"
    placeholder="seri no"
    type="text"
    id="seri-no"
    name="seri-no"
  />

  <input
    class="input bars-all"
    placeholder="marka-model"
    type="text"
    id="marka-model"
    name="marka-model"
    required
  />

  <input
    class="input bars-all"
    placeholder="işletim-sistemi"
    type="text"
    id="isletim-sistemi"
    name="isletim-sistemi"
    required
  />

  <input
    maxlength="29"
    class="input bars-all"
    placeholder="lisans"
    type="text"
    id="lisans"
    name="lisans"
    required
  />
</div>

</form>
<div class="btn-change-div">
            <button class="btn-change">Değiştir</button>
          </div>`;
document.addEventListener("DOMContentLoaded", function () {
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  //
  //adds "-" at every 5. character on licence input
  const input = document.querySelector("#lisans");
  input.addEventListener("input", function () {
    let value = input.value;
    value = value.replace(/-/g, "");
    let formattedValue = "";
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 5 === 0) {
        formattedValue += "-";
      }
      formattedValue += value[i];
    }
    input.value = formattedValue;
  });
  //

  // modal close
  const mainModal = document.querySelector(".modals");
  const modalModify = document.querySelector(".modals-modify");
  const deleteModal = document.querySelector(".delete-modal");

  mainModal.addEventListener("click", function (event) {
    const modal = document.querySelector(".modal");
    if (!modal.contains(event.target)) {
      mainModal.classList.add("hidden");
    }
  });

  modalModify.addEventListener("click", function (event) {
    const modal = document.querySelector(".modal-modify");
    if (!modal.contains(event.target)) {
      modalModify.classList.add("hidden");
      mainModal.classList.add("hidden");
    }
  });

  deleteModal.addEventListener("click", function (event) {
    const modal = document.querySelector(".delete-modal-container");
    if (!modal.contains(event.target)) {
      deleteModal.classList.add("hidden");
    }
  });

  // modify btn open-modal
  const modifyButton = document.querySelector(".btn-modal-modify");
  modifyButton.addEventListener("click", function (e) {
    document.querySelector(".modals-modify").classList.remove("hidden");
    const openedChangeModal = document.querySelector(".modal-modify");
    openedChangeModal.innerHTML = innerHtmlOfForm;

    //Change btn on click
    const btnChange = openedChangeModal.querySelector(".btn-change");

    btnChange.addEventListener("click", function (e) {
      e.preventDefault;
      let checkFilled = true;
      let arrChangedValues = [];
      openedChangeModal.querySelectorAll(".bars-all").forEach((element) => {
        if (element.id == "seri-no" && element.value == "") {
          element.value = "-";
        }
        if (element.value == "") {
          btnChange.style.backgroundColor = "red";
          btnChange.style.color = "#fff";
          btnChange.innerHTML =
            "Lütfen Gerekli Boşlukları Doldurup tekrar tıklayınız.";
          checkFilled = false;
        }
        arrChangedValues.push(element.value);
      });
      if (checkFilled) {
        mainModal.classList.add("hidden");
        modalModify.classList.add("hidden");
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:3000/updateData"); // updateData endpoint'e gönderiyoruz
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function () {
          if (xhr.status === 200) {
            console.log("Record updated successfully.");
            fetchRecords(); // Güncelleme işleminden sonra verileri yenilemek için fetchRecords() fonksiyonunu çağırabiliriz.
            bars.forEach((element) => {
              if (element.type === "text") {
                element.value = "";
                return;
              }
              element.value = element.children[0].value;
            });
          }
        };

        const data = {
          id: document.querySelector(".modal-id").innerHTML,
          site: arrChangedValues[0],
          grup: arrChangedValues[1],
          numara: arrChangedValues[2],
          durum: arrChangedValues[3],
          envanter: arrChangedValues[4],
          ait: arrChangedValues[5],
          "seri-no": arrChangedValues[6],
          "marka-model": arrChangedValues[7],
          "isletim-sistemi": arrChangedValues[8],
          lisans: arrChangedValues[9],
        };

        xhr.send(JSON.stringify(data));
      }
    });
    //
  });
  //

  // prints barcode
  const printButton = document.querySelector(".btn-modal-print");
  printButton.addEventListener("click", function () {
    var modalElement = document.querySelector(".printed-all");
    var printWindow = window.open("", "_blank");
    printWindow.document.write(modalElement.outerHTML);

    setTimeout(function () {
      printWindow.print();
    }, 500);

    printWindow.onfocus = function () {
      setTimeout(function () {
        printWindow.close();
      }, 500);
    };
  });
  //

  // if inventory number is valid, creates inventory number
  const strBars = document.querySelectorAll(".inventory-bars");
  const invBtn = document.querySelector(".inv-btn");
  invBtn.addEventListener("click", function (e) {
    let strInventory = "";
    e.preventDefault();
    strBars.forEach((element) => {
      if (element.id == "numara") {
        if (element.value.length == 1) {
          element.value = "00" + element.value;
        }
        if (element.value.length == 2) {
          element.value = "0" + element.value;
        }
        const elementNum = Number(element.value);
        if (isNaN(elementNum) || elementNum >= 1000) {
          element.value = "";
          console.log("hata");
        }
      }
      if (element.value == "") {
        element.classList.add("temporary-effect");
      } else {
        element.classList.remove("temporary-effect");
        strInventory += element.value;
      }
    });
    if (strInventory.length == 10 || strInventory.length == 11) {
      document.querySelector("#envanter").value = strInventory;
      document.querySelector("#envanter").style.color = "black";
    } else {
      document.querySelector("#envanter").value = "Hatalı Envanter";
      document.querySelector("#envanter").style.color = "red";
    }
  });
  //

  //function that pushes values to array if valid
  function btnGonder_bars(element) {
    if (element.value == "") {
      if (!(element.placeholder == "seri no")) {
        element.classList.add("temporary-effect");
        boolValue = false;
      }
    } else {
      element.classList.remove("temporary-effect");
      elementsArr.push(element.value);
    }
  }
  //

  // adds entered values to an array then sends it to node sql.
  let elementsArr = [];
  let boolValue = true;
  const bars = document.querySelectorAll(".bars-all");
  const btnGonder = document.querySelector("#gonder");
  btnGonder.addEventListener("click", function (e) {
    boolValue = true;
    elementsArr = [];
    e.preventDefault();

    // if serial no is empty makes input "-"
    bars.forEach((element) => {
      if (element.id == "seri-no" && element.value == "") {
        element.value = "-";
      }
      btnGonder_bars(element);
    });
    //

    if (boolValue && !elementsArr.includes("Hatalı Envanter")) {
      const data = {
        site: elementsArr[0],
        grup: elementsArr[1],
        numara: elementsArr[2],
        durum: elementsArr[3],
        envanter: elementsArr[4],
        ait: elementsArr[5],
        "seri-no": elementsArr[6],
        "marka-model": elementsArr[7],
        "isletim-sistemi": elementsArr[8],
        lisans: elementsArr[9],
      };

      // inserts record to database
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "http://localhost:3000/saveData");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onload = function () {
        if (xhr.status === 200) {
          console.log("Record inserted successfully.");
          fetchRecords();
          bars.forEach((element) => {
            if (element.type === "text") {
              element.value = "";
              return;
            }
            element.value = element.children[0].value;
          });
        }
      };
      //
      xhr.send(JSON.stringify(data));
    }
  });
  //

  // modal delete button that deletes selected row in database
  const btnModalClickHandler = (e) => {
    const modalID = document.querySelector(".modal-id");
    const id = Number(modalID.innerHTML);
    console.log(id);
    mainModal.classList.add("hidden");
    const xhr = new XMLHttpRequest();
    xhr.open("DELETE", `http://localhost:3000/deleteRecord/${id}/1`);
    xhr.onload = function () {
      if (xhr.status === 200) {
        console.log("Record deleted successfully.");
        fetchRecords();
      }
    };
    xhr.send();
  };

  const btnModal = document.querySelector(".btn-modal");
  btnModal.addEventListener("click", btnModalClickHandler);
  //

  const deleteSelectedBtn = document.querySelector(".delete-selected-btn");
  deleteSelectedBtn.addEventListener("click", function () {
    const deleteSelectedModal = document.querySelector(".delete-modal");
    deleteSelectedModal.classList.remove("hidden");
    deletedString = " ";
    deletedList.forEach((element) => {
      deletedString += `${element} `;
    });
    deleteSelectedModal.children[0].children[0].children[1].innerHTML =
      deletedString;
  });

  const yesBtn = document.querySelector(".deleted-yes");
  yesBtn.addEventListener("click", function () {
    const sortedArray = [...deletedList].sort();
    sortedArray.forEach((element) => {
      const id = element;
      let xhr = new XMLHttpRequest();
      xhr.open("DELETE", `http://localhost:3000/deleteRecord/${id}/2`);
      xhr.onload = function () {
        if (xhr.status === 200) {
          console.log("Record deleted successfully.");
        }
      };
      sleep(100);
      xhr.send();
    });

    deleteModal.classList.add("hidden");
    fetchRecords();

    location.reload();
  });

  document.querySelector(".id-sirala").addEventListener("click", function (e) {
    console.log("hhi");

    xhr = new XMLHttpRequest();
    xhr.open("POST", `http://localhost:3000/updateIdValues`);
    xhr.onload = function () {
      if (xhr.status === 200) {
        console.log("Record updated successfully.");
      }
    };
    xhr.send();
    location.reload();
  });

  const noBtn = document.querySelector(".deleted-no");
  noBtn.addEventListener("click", function () {
    deleteModal.classList.add("hidden");
  });

  const clearBtn = document.querySelector(".deleted-clear");
  clearBtn.addEventListener("click", function () {
    deleteModal.classList.add("hidden");
    location.reload();
  });

  // creates the page
  let dataArr;
  const deletedList = new Set();
  const sortedSet = new Set();
  const fetchRecords = () => {
    const allList = [];
    const rowKaan = document.querySelectorAll(".table-values-grid-container");
    rowKaan.forEach((element) => {
      element.parentNode.removeChild(element);
    });
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:3000/fetchRecords");
    xhr.onload = function () {
      if (xhr.status === 200) {
        const records = JSON.parse(xhr.responseText);

        dataArr = records;

        dataArr.forEach((element) => {
          oneList = [
            element.id,
            element.site,
            element.type,
            element.number,
            element.statu,
            element.inventory,
            element.whose,
            element.serialNum,
            element.brand_model,
            element.operatingSys,
            element.licence,
          ];
          allList.push(oneList);
          console.log("a", element);
        });
        var parentElement = document.querySelector(".container-table-div");

        allList.forEach((element) => {
          var container = document.createElement("div");
          container.classList.add("table-values-grid-container");
          let count = 0;
          element.forEach((e) => {
            count++;
            var innerDiv = document.createElement("div");
            innerDiv.classList.add("table-div");
            var paragraph = document.createElement("p");

            if (count == 6) {
              paragraph.classList.add(`barcode${element[0]}`);
            }

            paragraph.innerHTML = e;

            innerDiv.appendChild(paragraph);
            container.appendChild(innerDiv);
          });
          parentElement.appendChild(container);
        });

        const rows = document.querySelectorAll(".table-values-grid-container");
        rows.forEach((element) => {
          const inventoryChild = element.querySelectorAll(":nth-child(6)");
          const nameChild = element.querySelectorAll(":nth-child(7)");
          const idChild = element.querySelector(":nth-child(1)");

          const heading = document.querySelector(".heading-modal");
          const modalID = document.querySelector(".modal-id");
          element.addEventListener("click", function (eCtrl) {
            const inventoryValue = inventoryChild[0].children[0].innerHTML;
            JsBarcode(`#barcode`, inventoryValue);
            const nameValue = nameChild[0].children[0].innerHTML;
            heading.innerHTML = nameValue;
            const idValue = idChild.children[0].innerHTML;
            modalID.innerHTML = idValue;
            const modal = document.querySelector(".modals");

            if (eCtrl.ctrlKey) {
              if (deletedList.has(idValue)) {
                deletedList.delete(idValue);
              } else {
                deletedList.add(idValue);
              }
              const sortedArray = [...deletedList].sort();
              const sortedSet = new Set(sortedArray);
              console.log(sortedSet);
            } else {
              modal.classList.remove("hidden"); //opens modal
            }

            document;
            rows.forEach((ex) => {
              const rowsID = ex.children[0].children[0].innerHTML;
              if (deletedList.has(rowsID)) {
                ex.style.backgroundColor = "blue";
              } else {
                ex.style.backgroundColor = "#fff";
              }
            });
          });
        });
        const deleteButton = document.querySelector(".btn-modal");

        deleteButton.addEventListener("click", btnModalClickHandler);
      }
    };
    xhr.send();
  };
  fetchRecords();

  //
});
