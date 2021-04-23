import * as http from "./http.js";
import * as view from "./view.js";
import * as controller from "./controller.js";
const API_KEY = "$2b$10$kTV7Q2uzktXPthN9WDakYeAxmR.14E41CHUxjeRRSODrXtjjd1pfm"; // Key needed to create new bins in the collection
const COL_ID = "6075ecb4ee971419c4d8e9b9"; // ID to associate bin with my Pet Food App collection
const HOME_PATH = "https://api.jsonbin.io/v3/b"; // generic path to access home bins
const SAVED_PATH = "https://api.jsonbin.io/v3/b/607f68f0027da70c476d4eb2"; // Tracks currently created homes
const state = 
{
    homes: {},  // map of all houses tracked by the app
    current: undefined // holds the currently loaded home
};

const newHomeName = document.getElementById("new-home-name");
const loadHomeName = document.getElementById("home-list");

// initialize the window and setup the app
const start = async () =>
{
    state.homes = await http.loadHouseList(SAVED_PATH);
    console.log(state.homes);
    view.initializePage(state);
}

// create a new home
const createHome = function()
{
    let temp = newHomeName.value;
    if (temp != "")
    {
        let dup = false;
        state.homes.forEach(e => 
        {
            if (e.home == temp)
            {
                alert(`${temp} already exists.`);
                dup = true;
            }
        });
        if (!dup)
        {
            http.createHomeDB(temp, HOME_PATH, COL_ID, API_KEY, SAVED_PATH, state.homes);
        }
        
    }
    else
    {
        alert("Home name must not be blank.");
    }
    
}

// load an existing home
const loadHome = async () =>
{
    let name = loadHomeName.value;
    let home = {};
    if (name != "" && name != "Select a home to load...")
    {
        state.homes.forEach((x) =>
        {
            if (x.home == name)
            {
                home = x;
            }
        });
        state.current = await http.loadHomeDB(home.ID, HOME_PATH);
        view.update(state);
    }
    else
    {
        alert("Please select a valid home.")
    }
    
}

// add a pet to a home
const createNewPet = function()
{
    let pet = controller.getNewPetInfo();
    console.log(state.current);
    state.current.pets.push(pet);
    http.updateHomeDB(JSON.stringify(state.current), state.current.ID, HOME_PATH);
    view.update(state);
    console.log(state.current);
    alert(`Added ${pet.name} to ${state.current.home}. Congratulations!!`);
}
// add a meal/treat to a pet
const createNewEvent = function()
{
    let e = controller.getNewEventInfo();
    state.current.log.push(e);
    http.updateHomeDB(JSON.stringify(state.current), state.current.ID, HOME_PATH);
    console.log(state.current);
    alert(`Fed ${e["pets-fed"]} ${e.mass} ${e.unit} of ${e.brand} ${e.title}.`);
}
// handler for new Home calls
controller.newHomeButton.addEventListener('click', createHome);
// handler for load Home calls
controller.loadHomeButton.addEventListener('click', loadHome);
// handler for new Pet calls
controller.newPetButton.addEventListener('click', createNewPet);
// handler for new Event calls
controller.newEventButton.addEventListener('click', createNewEvent);
// handler for starting the app
window.addEventListener("load", start);