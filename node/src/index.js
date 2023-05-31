async function getUsers() {
    const munDataUrl = "https://statfin.stat.fi/PxWeb/sq/4e244893-7761-4c4f-8e55-7a8d41d86eff"
    const munPromise= await fetch(munDataUrl)
    const munJSON = await munPromise.json()

    const empDataUrl= "https://statfin.stat.fi/PxWeb/sq/5e288b40-f8c8-4f1e-b3b0-61b86ce5c065"
    const empPromise = await fetch(empDataUrl);
    const empJSON = await empPromise.json();


    console.log(empJSON);

    const popData = munJSON.dataset.value;
    const dataTable = document.getElementById("data-table");
    const munData = munJSON.dataset.dimension.Alue.category.label
    const indexData = munJSON.dataset.dimension.Alue.category.index

    const empData = empJSON.dataset.value;


    for(const key in munData)
    {
        let tr = document.createElement("tr")
        let td1 = document.createElement("td")
        let td2 = document.createElement("td")
        let td3 = document.createElement("td")
        let td4 = document.createElement("td")
        td1.innerText = munData[key]
        td2.innerText = popData[indexData[key]]
        td3.innerText = empData[indexData[key]]
        let empPercent = ((empData[indexData[key]]/popData[indexData[key]])*100).toFixed(2)
        td4.innerText = empPercent
        if(empPercent > 45.0)
        {
            tr.style.backgroundColor = "#abffbd";
        }
        else if(empPercent < 25)
        {
            tr.style.backgroundColor = "#ff9e9e";
        }
        tr.appendChild(td1)
        tr.appendChild(td2)
        tr.appendChild(td3)
        tr.appendChild(td4)

        dataTable.appendChild(tr)
    }
    
}

if (document.readyState !== "loading") {
    console.log("Document is ready!");
    getUsers();
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      console.log("Document is ready after waiting!");
      getUsers();
    });
  }