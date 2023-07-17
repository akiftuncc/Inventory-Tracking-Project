document.addEventListener("DOMContentLoaded", function () {
  const bars = document.querySelectorAll(".bars-all");
  const strBars = document.querySelectorAll(".inventory-bars");
  const invBtn = document.querySelector(".inv-btn");

  invBtn.addEventListener("click", function (e) {
    let strInventory = "";
    e.preventDefault();
    strBars.forEach((element) => {
      if (element.value == "") {
        element.classList.add("temporary-effect");
      } else {
        element.classList.remove("temporary-effect");
        strInventory += element.value;
      }
    });
    if (strInventory.length == 10) {
      document.querySelector("#envanter").value = strInventory;
      document.querySelector("#envanter").style.color = "black";
    } else {
      document.querySelector("#envanter").value = "Hatalı Envanter";
      document.querySelector("#envanter").style.color = "red";
    }
  });

  const btnGonder = document.querySelector("#gonder");

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

  let elementsArr = [];
  let boolValue = true;
  let formData; // Declare the formData variable here

  btnGonder.addEventListener("click", function (e) {
    boolValue = true;
    elementsArr = [];
    e.preventDefault();
    bars.forEach((element) => {
      btnGonder_bars(element);
    });

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

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "http://localhost:3000/saveData");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onload = function () {
        if (xhr.status === 200) {
          console.log("Record inserted successfully.");
          fetchRecords();
        }
      };
      xhr.send(JSON.stringify(data));
    }
  });
  let dataArr;
  // Fetch records from the server,
  let paragraph;
  allList = [];
  const fetchRecords = () => {
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

        const barcodeBtn = document.querySelector(".barcode-btn");
        barcodeBtn.addEventListener("click", function () {
          if (barcodeBtn.innerHTML == "Barkod Göster") {
            barcodeBtn.innerHTML = "Barkod Gizle";
            allList.forEach((element) => {
              const par = document.querySelector(`.barcode${element[0]}`);
              console.log(par);
              par.innerHTML = ` <svg id="barcode${element[0]}"></svg>`;
              JsBarcode(`#barcode${element[0]}`, element[5]);
            });
          } else {
            barcodeBtn.innerHTML = "Barkod Göster";
            allList.forEach((element) => {
              const par = document.querySelector(`.barcode${element[0]}`);
              console.log(par);
              par.innerHTML = element[5];
            });
          }

          // if (count == 6) {
          //
          //
          // } else {
          //
          // }
        });

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
          // Get the parent element where you want to add this code
          var parentElement = document.querySelector(".container-table-div");

          // Append the main container to the parent element
          parentElement.appendChild(container);
        });
      }
    };
    xhr.send();
  };

  fetchRecords();
});
