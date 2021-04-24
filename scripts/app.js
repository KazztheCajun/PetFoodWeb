import * as http from "./http.js";
import * as view from "./view.js";
import * as controller from "./controller.js";
const API_KEY = "$2b$10$kTV7Q2uzktXPthN9WDakYeAxmR.14E41CHUxjeRRSODrXtjjd1pfm"; // Key needed to create new bins in the collection
const COL_ID = "6084a3c3f6655022c46b0330"; // ID to associate bin with my Pet Food App collection
const HOME_PATH = "https://api.jsonbin.io/v3/b"; // generic path to access home bins
const SAVED_PATH = "https://api.jsonbin.io/v3/b/607f68f0027da70c476d4eb2"; // Tracks currently created homes
const state = 
{
    selected: undefined, // holds a reference to the currently selected pet
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
        addPetEventListners();
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
//    console.log(state.current);
    state.current.pets.push(pet);
    http.updateHomeDB(JSON.stringify(state.current), state.current.ID, HOME_PATH);
    view.update(state);
    addPetEventListners();
//    console.log(state.current);
    alert(`Added ${pet.name} to ${state.current.home}. Congratulations!!`);
}

const addPetEventListners = function()
{
    let children = Array.from(view.petList.children);
    children.forEach(c =>
    {
        c.addEventListener('click', updateSelectedPetInfo);
    });
}

// add a meal/treat to a pet
const createNewEvent = function()
{
    let e = controller.getNewEventInfo();
    state.current.log.push(e);
    http.updateHomeDB(JSON.stringify(state.current), state.current.ID, HOME_PATH);
//    console.log(state.current);
    alert(`Fed ${e["pets-fed"]} ${e.mass} ${e.unit} of ${e.brand} ${e.title}.`);
}

// update selected pet info
const updateSelectedPetInfo = function(event)
{
//    console.log(event);
    state.selected = event.path[1].getElementsByTagName("h3")[0].innerHTML;
//    console.log(pet);
    console.log(state);
    view.updateSelectedPet(state);
    let total = 0;
    let number = 0;
    // calculate detailed caloric & nutritional information
}

const updateSelectedPetLists = function()
{
    if (typeof state.selected != 'undefined')
    {
        view.updateSelectedPetDayList(state);
        view.updateSelectedPetEventList(state);
    }
}

const updateSelectedPetEventsListener = function()
{
    view.updateSelectedPetEventList(state);
}


// handler for new Home calls
controller.newHomeButton.addEventListener('click', createHome);
// handler for load Home calls
controller.loadHomeButton.addEventListener('click', loadHome);
// handler for new Pet calls
controller.newPetButton.addEventListener('click', createNewPet);
// handler for new Event calls
controller.newEventButton.addEventListener('click', createNewEvent);
controller.newEventButton.addEventListener('click', updateSelectedPetLists);
// handler for new Event list for a selected pet
view.selectedPetEventDays.addEventListener('change', updateSelectedPetEventsListener);
// handler for starting the app
window.addEventListener("load", start);