const petList         = document.getElementById("pet-list");
const petSpecList     = document.getElementById("pet-details-box");
const homeList        = document.getElementById("home-list");
const currentHomeName = document.getElementById("home-name-box");
const petSelectBox    = document.getElementById("pet-select-box");

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
        petList.innerHTML = `<lh class="h4">No pets tracked in this home yet...</lh>`;
    }
    else
    {
        state.current.pets.forEach((p) =>
        {
            let now = new Date();
            petList.innerHTML += `<div class="list-group-item bg-dark" aria-current="true">
                                    <div class="row w-100">
                                        <div class="col-2">
                                            <img src="https://via.placeholder.com/200" class="rounded float-start pet-list-image">
                                        </div>
                                        <div class="col my-auto">
                                            <h4 id="pet-list-name">${p.name}</h4>
                                            <h6 id="pet-list-a&w">Born: ${p.birth}    Weight: ${p.weight}</h6>
                                            <p id="pet-list-breed">Breed: ${p.breed}</p>
                                        </div>
                                    </div>
                                </div>`;
        });
    }
    updateHomeList(state.homes);
    updatePetSelectList(state.current);
    console.log(state.current);
}

const clearPage = function()
{
    currentHomeName.innerHTML = `<lh class="h1 text-center">No home loaded yet...</lh>`;
    petList.innerHTML = ``;
    petSpecList.innerHTML = `<div class="h4 text-dark">Select a pet to see detailed information here...</div>`;
    homeList.innerHTML = "<option selected>Select a home to load...</option>";
    petSelectBox.innerHTML = "";
}