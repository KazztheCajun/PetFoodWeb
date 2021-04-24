export const petList = document.getElementById("pet-list");
export const petSelectBox     = document.getElementById("pet-select-box");
export const homeList        = document.getElementById("home-list");
export const currentHomeName = document.getElementById("home-name-box");
export const selectedPetBox    = document.getElementById("selected-pet-box");
export const selectedPetName   = document.getElementById("selected-pet-name");
export const selectedPetEventDays = document.getElementById("selected-pet-event-days");
export const selectedPetEventList = document.getElementById("selected-pet-event-list");
export const selectedPetCals = document.getElementById("selected-pet-avg-cals");
export const selectedPetNut = document.getElementById("selected-pet-nut-info");



// function to initialize the page
export const initializePage = function(state)
{
    clearPage();
    updateHomeList(state.homes);
    if (typeof state.current != 'undefined')
    {
        updatePetSelectList(state.current);
    }
}

export const updateHomeList = function(homes)
{
    homeList.innerHTML = "<option selected>Select a home to load...</option>";
   
    homes.forEach(e => 
    {
        homeList.innerHTML += `<option>${e.home}</option>`;
    });
}

export const updatePetSelectList = function(current)
{
    let count = 1;
    
    current.pets.forEach((p) =>
    {
        petSelectBox.innerHTML += `<div class="form-check">
                                            <input class="form-check-input" type="checkbox" value="" id="pet-select${count}">
                                            <label class="form-check-label" id="pet-select-label${count}" for="pet-select${count}">${p.name}</label>
                                    </div>`;
        count++;
    });
}

// function to update the view in response to UI actions
export const update = function(state)
{
    console.log(state);
    clearPage(state);
    currentHomeName.innerHTML = `<lh class="h1 text-center">${state.current.home}</lh>`;
    if(Object.entries(state.current.pets).length <= 0)
    {
        petList.innerHTML = `<div class="h4">No pets tracked in this home yet...</div>`;
    }
    else
    {
        state.current.pets.forEach((p) =>
        {
            petList.innerHTML += `<button class="list-group-item bg-dark" aria-current="true">
                                    <div class="row w-100">
                                        <div class="col">
                                            <img src="https://via.placeholder.com/200" class="rounded float-start pet-list-image">
                                            <div class="text-light d-flex flex-column">
                                                <h3 id="pet-list-name">${p.name}</h3>
                                                <h6 id="pet-list-a&w">Born: ${p.birth}    Weight: ${p.weight}</h6>
                                                <p id="pet-list-breed">Breed: ${p.breed}</p>
                                            </div>
                                        </div>
                                    </div>
                                </button>`;
        });
    }
    updateHomeList(state.homes);
    updatePetSelectList(state.current);
}

export const updateSelectedPet = function(state)
{
    selectedPetBox.style.display = "flex";
    selectedPetName.innerHTML = `${state.selected}`;
    updateSelectedPetDayList(state);
    let total = 0;
    let number = 0;
    // calculate detailed caloric & nutritional information
}

export const updateSelectedPetDayList = function(state)
{
    if (typeof state.selected != 'undefined');
    {
        let set = new Set();
        state.current.log.forEach((e =>
        {
            
            if(e["pets-fed"].includes(state.selected))
            {
                let day = `${e.date.month}/${e.date.day}/${e.date.year}`;
                set.add(day);
            }
        }));
    //    console.log(set);
        selectedPetEventDays.innerHTML = `<option>Select a day to see events...</option>`;
        selectedPetEventList.innerHTML = "";
        set.forEach(d =>
        {
            selectedPetEventDays.innerHTML += `<option>${d}</option>`;
        });
    }
    
}

export const updateSelectedPetEventList = function(state)
{
    let day = selectedPetEventDays.value;
    selectedPetEventList.innerHTML = "";
    state.current.log.forEach(e =>
    {
        let temp = `${e.date.month}/${e.date.day}/${e.date.year}`;
        if(day != "Select a day to see events..." && temp == day && e["pets-fed"].includes(state.selected))
        {
            selectedPetEventList.innerHTML += `<div class="list-group-item text-center">${e.brand} ${e.title} | ${e.mass} ${e.unit} | ${e.date.hours}:${e.date.minutes}:${e.date.seconds}</div>`
        }
        // calculate caloric and nutritional info once items are setup
    });
}

export const clearPage = function()
{
    currentHomeName.innerHTML = `<div class="h1 text-center">No home loaded yet...</div>`;
    petList.innerHTML = ``;
    petSelectBox.innerHTML = ``;
    homeList.innerHTML = "<option selected>Select a home to load...</option>";
    selectedPetBox.style.display = "none";
}