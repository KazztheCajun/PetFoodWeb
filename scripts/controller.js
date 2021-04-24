
// buttons
export const newHomeButton = document.getElementById("new-home-button");
export const newPetButton = document.getElementById("new-pet-button");
export const loadHomeButton = document.getElementById("load-home-button");
export const newEventButton = document.getElementById("new-event-button"); 



export const getNewPetInfo = function()
{
    let n = document.getElementById("petName").value;
    let w = document.getElementById("petWeight").value;
    let breed = document.getElementById("petBreed").value;
    let birth = document.getElementById("petBirth").value;

    return {"name": n, "weight": w, "breed": breed, "birth": birth, "death": "alive"};
}

export const getNewEventInfo = function()
{
    let b = document.getElementById("foodBrand").value;
    let n = document.getElementById("foodName").value;
    let m = document.getElementById("itemMass").value;
    let t = document.getElementById("itemUnit").value;
    let c = document.getElementById("pet-select-box").children;
    let checked = [];
    for(let x = 1; x <= c.length; x++)
    {
        let petSelector = document.getElementById(`pet-select${x}`);
        let petName = document.getElementById(`pet-select-label${x}`);
        if(petSelector.checked)
        {
            checked.push(petName.innerHTML);
        }
    }
    let date = new Date();
    let d = {"day": date.getDay(), "month": date.getMonth(), "year": date.getFullYear(), "hours": date.getHours(), "minutes": date.getMinutes(), "seconds": date.getSeconds()};
    return {"brand": b, "title": n, "mass": m, "unit": t, "pets-fed": checked, "date": d};
}



