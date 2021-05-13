import * as http from "./http.js";
import * as view from "./view.js";
import * as controller from "./controller.js";
const state = 
{
    selected: undefined, // holds a reference to the currently selected pet
    homes: {},  // map of all houses tracked by the app
    current: undefined, // holds the currently loaded home
    user: undefined // holds the currently logged in user info
};

const newHomeName = document.getElementById("new-home-name");
const loadHomeName = document.getElementById("home-list");
const loginName = document.getElementById("login-name");
const loginPass = document.getElementById("user-pass");

// initialize the window and setup the app
const start = async () =>
{
    state.homes = await http.loadHouseList();
    console.log(state.homes);
    view.initializePage(state);
}

// create new user
const newUser = async() =>
{
    let user = controller.getNewUserInfo();
//    console.log(user);
    if (user.name != "" && user.pass != "")
    {
        let r = await http.saveUserToDB(user);
        alert(`${r.message}`);
    }
};

const loadUser = async() =>
{
    let res = await http.signIntoUser(loginName.value, loginPass.value);
    loginName.value = "";
    loginPass.value = "";
//    console.log(res);
    state.user = res.user;
    let r = await http.loadHouseList(state.user.homes);
    state.homes = r.homes;
    console.log(state.homes);
    view.update(state);
}

// create a new home
const createHome = async () =>
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
            const r = await http.createHomeDB(temp);
            if (!r.success)
            {
                alert(`${r.message}`);
                return
            }
            state.user.homes.push(r.home._id);
            state.current = r.home;
            console.log(state.user.homes);
            await http.updateUserInDB(state.user);
            let res = await http.loadHouseList(state.user.homes);
            state.homes = res.homes
            view.update(state);
            alert(`${r.home.home} was saved`);
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
    let id = 0;
    if (name != "" && name != "Select a home to load...")
    {
        state.homes.forEach((x) =>
        {
            if (x.home == name)
            {
                id = x._id;
            }
        });
        state.current = await http.loadHomeDB(id);
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
    http.updateHomeDB(state.current, state.current._id);
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
    http.updateHomeDB(state.current, state.current._id);
    view.update(state);
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

// debug handlers


// handler for login events
controller.loginButton.addEventListener('click', loadUser);

// handler for new user calls
controller.newUserButton.addEventListener('click', newUser);
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
//window.addEventListener("load", start);