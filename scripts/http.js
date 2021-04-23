import * as view from "./view.js"
// PUTs a new home into the DB
export const createHomeDB = async (homeName, path, collection, key, homeList, homes) =>
{
    const options = new Object();
    options.method = "POST";
    options.headers = {
                        "Content-Type": "application/json",
                        "X-Collection-Id": `${collection}`,
                        "X-Bin-Private": false,
                        "X-Master-Key": `${key}`
                      };
    let h = {"home": homeName, "ID": "", "pets": [], "log": []}
    options.body = JSON.stringify(h);
    const response = await fetch(path, options);
    console.log(response);
    let json = await response.json();
    if (!response.ok)
    {   
        alert(`[HTTP] Error creating home: ${json.message}`);
    }
    else
    {
        h.ID = json.metadata.id;
        updateHomeDB(JSON.stringify(h), h.ID, path);
        alert(`${json.record.home} was created successfully`);
        updateHomeListDB(homes, homeList, json.record.home, json.metadata.id);
        
    }
    
}

// updates the list of homes tracked by the DB
export const updateHomeListDB = async (homes, homeList, homeName, id) =>
{
    const options = new Object();
    options.method = "PUT";
    options.headers = {"Content-Type": "application/json"};
    homes.push({"home": `${homeName}`,"ID": `${id}`});
    options.body = JSON.stringify(homes);
    const response = await fetch(homeList, options);
    let json = await response.json();
    console.log(response);
    if (response.ok)
    {
        view.updateHomeList(homes);
        console.log(homes);
    }
    else
    {
        alert(`[HTTP] Error updating home list info: ${json.message}`);
    }
}

// GETs an existing home from the DB
export const loadHomeDB = async (homeID, path) =>
{
    const options = new Object();
    options.method = "GET";
    const response = await fetch(`${path}/${homeID}/latest`, options);
    const data = await response.json();
    return data.record;
}

// PUTs new information into a home
export const updateHomeDB = async (update, homeID, path) =>
{
    const options = new Object();
    options.method = "PUT";
    options.headers = {"Content-Type": "application/json"};
    options.body = update;
    const response = await fetch(`${path}/${homeID}`, options);
    let json = await response.json();
    if (!response.ok)
    {
        alert(`[HTTP] Error updating home ${update}: ${json.message}`);
    }
    
}

export const loadHouseList = async (path) =>
{
    const options = new Object();
    options.method = "GET";
    const response = await fetch(`${path}/latest`);
    const data = await response.json();
    return data.record;
}