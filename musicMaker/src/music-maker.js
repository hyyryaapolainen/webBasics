//Sample durations are estimates, not calculated. When adding a new sample, it will have correct duration
//Could Probably be Refactored for better navigation or sorting by category in all samples view

//Probably bad to do this instead of truncation or word wrap
//Too long sample names (Lorem ipsum paragraphs etc. make the samplecontainer expand and break)
const maxSampleName = 20
const defaultSampleName = "Custom sample"
const stepBetweenSamples = 150
const sampleWidthMultiplier = 10

var samples = [
    {id: 0, category: "Bass", src: "audio/bass.mp3", name: "Bass_Sample", duration: 7.49 },
    {id: 1, category: "Drum", src: "audio/drum.mp3", name: "Drum", duration: 1 },
    {id: 2, category: "Piano", src: "audio/piano.mp3", name: "Piano", duration: 34 },
    {id: 3, category: "Silence", src: "audio/silence.mp3", name: "Silence", duration: 2 },
    {id: 4, category: "Beat", src: "audio/strange-beat.mp3", name: "Strange Beat", duration: 7 },
    {id: 5, category: "Violin", src: "audio/violin.mp3", name: "Violin", duration: 6 },
    {id: 6, category: "Guitar", src: "audio/guitar.mp3", name: "Guitar", duration: 3 }
];

//Add functionality to add more categories at some point
//Refactor into a basic list, id is redundant
var categories = [
    { id: 0, name: "Bass"},
    { id: 1, name: "Drum" },
    { id: 2, name: "Piano" },
    { id: 3, name: "Silence"},
    { id: 4, name: "Beat"},
    { id: 5, name: "Violin"},
    { id: 6, name: "Guitar"},
    { id: 7, name: "All"}
]
//Refactor this into the categories list
const colorsByCategory = {
    "Bass": {
      font: "#ffffff",
      background: "#008080"
    },
    "Drum": {
      font: "#ffffff",
      background: "#800080"
    },
    "Piano": {
      font: "#ffffff",
      background: "#0000ff"
    },
    "Silence": {
      font: "#ffffff",
      background: "#000000"
    },
    "Beat": {
      font: "#ffffff",
      background: "#ff8c00"
    },
    "Violin": {
      font: "#ffffff",
      background: "#8b0000"
    },
    "Guitar": {
      font: "#ffffff",
      background: "#008000"
    },
    "All":{
        font: "#ffffff",
        background: "#b30000"
    }
  };
//Stores how many tracks have been made
var trackId = 1;

//Stores current category as a string, Probably should use reference to category list
var currentCategory = "";

//Stores all tracks as objects, should Refactor for clarity ex. {"Track1" : {trackdata here}, "Track2" etc etc}

//Better Probably use a track class
//    tracks[trackKey] = {"id" : 0, "samples": [], "looping" : false, "volume" : trackGainNode, "playing" : false};
var tracks = {}

var audioContext = new AudioContext()

var draggedSample;

//#region frontend

function addCategoryButton(category)
{
    //Get category container
    var categoryContainer = document.getElementById("category-selection")
    var button = document.createElement("button");
    button.className = "category-button";
    button.textContent = category.name;
    button.setAttribute('id', 'category-button '+category.name)

    //Use category specific coloring
    button.style.backgroundColor = 'white'
    button.style.color = colorsByCategory[category.name].font
    button.addEventListener("click", function(event) {
      //Select category functionality and update styling when selecting category (Probably bad, should Refactor)
      setCurrentCategory(category.name);
      updateCategoryButtons(event)
    });

    //Add drag and drop functionality to move samples from categories to another
    const buttonArea = document.createElement('div');
    buttonArea.classList.add('drag-drop-container');

    button.addEventListener('dragenter', function (event) {
        event.preventDefault();
        button.classList.add('drag-over');
        });
    
        button.addEventListener('dragover', function (event) {
        event.preventDefault();
        });
    
        button.addEventListener('dragleave', function (event) {
        event.preventDefault();
        button.classList.remove('drag-over');
        });
    
        button.addEventListener('drop', function (event) {
            event.preventDefault();
            button.classList.remove('drag-over');
            var sample = draggedSample;
            draggedSample = null;
            if(sample)
            {
                //Better way to get the category here?
                const droppedCategory = event.target.id.split(" ")[1]
                sample.category = droppedCategory
                //Update all of the currently visible samples to correspond to this color
                updateSampleByCategory(sample.id, droppedCategory)
            }
        });

    categoryContainer.appendChild(button);
}
function updateCategoryButtons(event)
{
    //Update category buttons to default coloring when one is selected
    var allButtons = document.querySelectorAll('.category-button')
    allButtons.forEach((button) => {
      button.style.backgroundColor = 'white'
      button.style.color = 'black'
    })
    event.target.style.backgroundColor = colorsByCategory[currentCategory].background
    event.target.style.color = colorsByCategory[currentCategory].font
}

function addDraggableSampleButton(sample)
{   
    //Creates a button that can either be dragged to a track or clicked for fast adding into a track
    var div = document.createElement("div");
    div.className = "draggable-button";
    div.style.backgroundColor = colorsByCategory[sample.category].background
    div.style.color = colorsByCategory[sample.category].font
    div.setAttribute("data-sample", sample.id)
    div.setAttribute("draggable", "true");
    div.textContent = sample.name;
    div.addEventListener("dragstart", function(event) {
        //If there are no tracks, stop drag
        let tracks = Array.from(document.getElementsByClassName("drag-drop-container"))
        if (tracks.length < 1)
        {
            return;
        }
        //Couldn't get drag-and-drop to work with default so this variable is used to store the current dragged sample info
        draggedSample = sample;
        tracks.forEach((div) => {
            //Make drag and drop areas go on top of everything to avoid dropping into a ex. sample container
            div.style.zIndex = 10;
        })
            
    })
    div.addEventListener("click", function(event){
        //Clicking on the button instead of dragging fast adds into the currently selected track
        const trackRadios = document.getElementsByName("track");
        const selectedRadio = Array.from(trackRadios).find(radio => radio.checked);
        if (selectedRadio) {
            const trackIndex = selectedRadio.value;
            var container = document.getElementById("track-samples"+trackIndex);
            var sampleArea = createSampleContainer(sample, "Track"+trackIndex);
            container.appendChild(sampleArea)
        }
    })
    div.addEventListener("dragend", function(event) {
        //When dragging stops, drop reference and make drag and drop containers go on background
        draggedSample = null;
        let tracks = Array.from(document.getElementsByClassName("drag-drop-container"))
        if (tracks.length < 1)
        {
            return;
        }
        tracks.forEach((div) => {
            div.style.zIndex = -10;
        })
    });
    //Add remove functionality to samples added to a track (Remove visually and remove from track array)
    var removeButton = document.createElement("button")
    removeButton.classList.add("delete-sample")
    removeButton.innerHTML = "X"
    removeButton.addEventListener("click", function(event){
        removeSampleFromApp(event.target.parentElement.dataset.sample)
        generateSampleMenu(findSamplesByCategory(currentCategory))
    })
    div.appendChild(removeButton)
    return div

}

function removeSampleFromApp(sampleId)
{
    //Probably could do a better search function here
    //Remove sample from sample list
    for(var i = 0; i<samples.length; i++)
    {
        if(samples[i].id == sampleId)
        {
            samples.splice(i, 1)
            return;
        }
        else{
            //This should not happen
            console.log("sample not found in backend")
        }
    }
    //Remove elements corresponding with sampleId
    const allSampleElements = document.querySelectorAll(`[data-sample="${sampleId}"`)
    allSampleElements.forEach((sample) => {
        sample.remove()
    })
}

async function getClipDuration(src) {
    //Returns the duration of the audiobuffer when decoding a mp3 file
    const response = await fetch(src);
    const buffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(buffer);

    return audioBuffer.duration;
}

async function uploadFile()
{
    //Handles upload event when a correct file and a voluntary name input is given
    const file = document.getElementById("input-sample").files[0]
    //default to sample name

    const name = document.getElementById("input-sample-name").value ?  document.getElementById("input-sample-name").value  : file.name
    if(name.length > maxSampleName)
    {
        alert(`Sample name maximum is ${maxSampleName}`)
    }
    else{
        let audioSrc = ""
        if(!file) return
        
        audioSrc = URL.createObjectURL(file)
        let clipDuration = await getClipDuration(audioSrc)
    
        let sample = {id: samples.length, category: currentCategory, src: audioSrc, name: name, duration: clipDuration }
    
        samples.push(sample)
        generateSampleMenu(findSamplesByCategory(currentCategory))
    }

}

//Add a new button to sample menu (depreciated?), usually sample menu is fully generated to account for color changes
function addToSampleMenu(sample)
{
    var container = document.getElementById("sample-menu")
    let newButton = addDraggableSampleButton(sample)
    container.appendChild(newButton)
}
function generateSampleMenu(samples)
{
    //Generates a sample button for each of the samples given
    var container = document.getElementById("sample-menu")
    container.innerHTML =""
    if(samples.length <= 0)
    {
        //If no samples are given, creates a small text notification to indicate that there are none
        var emptyDiv = document.createElement("div")
        emptyDiv.innerText = "No samples in the current category!"
        emptyDiv.style.textAlign = 'center'
        emptyDiv.style.margin = "auto"
        container.appendChild(emptyDiv)
    }
    else{
        samples.forEach((sample) => {
            let newButton = addDraggableSampleButton(sample)
            container.appendChild(newButton)
        })
    }
    var placeholder = document.getElementById("scroll-placeholder")
    placeholder.style.height = container.offsetHeight
}

//Sets current category and updates element colors based on category
function setCurrentCategory(categoryName) {
    if(currentCategory === categoryName)
    {
        return;
    }
    var selectedCategory = categories.find(function(category){
        return categoryName === category.name;
    });
    if (selectedCategory) {
      var selectSamples = findSamplesByCategory(selectedCategory.name)
      generateSampleMenu(selectSamples)
    }
    currentCategory = categoryName
    const controlPanel = document.getElementById("toolkit")
    controlPanel.style.backgroundColor = colorsByCategory[currentCategory].background
  }

//Filters samples per category, ALL returns unfiltered samplelist
function findSamplesByCategory(category)
{
    if(category === "All")
    {
        return samples;
    }
    var filteredSamples = samples.filter(function(sample) {
        return sample.category.toLowerCase() === category.toLowerCase();
      });
    
      return filteredSamples;
}

//Update all visible samples matching sampledId when the sample category is changed
function updateSampleByCategory(sampleId, newCategory)
{
    const allSampleElements = document.querySelectorAll(`[data-sample="${sampleId}"`)
    allSampleElements.forEach((sample) => {
        sample.style.backgroundColor = colorsByCategory[newCategory].background
        sample.style.color = colorsByCategory[newCategory].font
    })

}




//Creates sample container on selected track
function createSampleContainer(sample,trackKey) {
    const sampleContainer = document.createElement('div');
    sampleContainer.classList.add('sample-container');
    var sampleID = addToTrack(sample, trackKey)
    sampleContainer.style.width = (sample.duration * sampleWidthMultiplier)+"px"
    sampleContainer.style.marginRight = (stepBetweenSamples / 100) * sampleWidthMultiplier+'px'

    const removeSample = document.createElement('button')
    removeSample.classList.add("remove-sample")
    removeSample.innerText ="X"
    removeSample.style.zIndex = 8
    removeSample.style.cursor ="pointer"
    removeSample.setAttribute("data-sample", sample.id)
    removeSample.style.backgroundColor = colorsByCategory[sample.category].background
    
    removeSample.onclick = function(event){
        const sampleContainer = event.target.parentElement

        //Styling, makes a smooth transition when removing a sample
        sampleContainer.style.display = "block"
        sampleContainer.style.width = sampleContainer.offsetWidth+"px"
        const text = sampleContainer.querySelector("p")
        text.style.display = "none"
        const button = sampleContainer.querySelector("button")
        button.style.display = "none"
        sampleContainer.style.border = "none"
        setTimeout(() => {
            //Refactor this into CSS class selector
            sampleContainer.style.width = "0"
            sampleContainer.style.minWidth = "0"
            sampleContainer.style.margin = "0"
          }, 10);
        setTimeout(() => {
            sampleContainer.remove()
          }, 510);
        removeFromTrack(sampleID, trackKey)
    }
    sampleContainer.appendChild(removeSample);

    //Text container
    const sampleText = document.createElement('p');
    sampleText.textContent = sample.name;

    var fontsize = 10;
    sampleText.style.fontSize = fontsize+'px'
    sampleContainer.appendChild(sampleText);

    return sampleContainer;

}
//Add sample to track (Backend)
function addToTrack(sample, trackKey)
{
    tracks[trackKey].samples.push(sample)
    return tracks[trackKey].samples.length -1
}
//Removes sample from track (Backend)
function removeFromTrack(sampleID, trackKey)
{
    tracks[trackKey].samples.splice(sampleID, 1)
}
//Creates a drag and drop area for a container
//Depreciated in functionality as only 1 drag and drop container is needed now
function createNewDndArea()
{
    const dragDropArea = document.createElement('div');
    dragDropArea.classList.add('drag-drop-container');

    //Drag and drop functionality
    dragDropArea.addEventListener('dragenter', function (event) {
        event.preventDefault();
        dragDropArea.classList.add('drag-over');
        });
    
        dragDropArea.addEventListener('dragover', function (event) {
        event.preventDefault();
        });
    
        dragDropArea.addEventListener('dragleave', function (event) {
        event.preventDefault();
        dragDropArea.classList.remove('drag-over');
        });
    
        dragDropArea.addEventListener('drop', function (event) {
            event.preventDefault();
            dragDropArea.classList.remove('drag-over');
            var sample = draggedSample;
            draggedSample = null;
            //Handles cases where user tries to drag other content where it doesn't belong
            //Should use the DnD API to specify the content allowed
            if(sample)
            {
                var container = document.getElementById(event.target.parentElement.id);
                var trackKey = event.target.parentElement.parentElement.id
                var sampleArea = createSampleContainer(sample, trackKey);
                container.appendChild(sampleArea)
            }
        });

    return dragDropArea;
}
//Creates a new volume slider into a container and returns the volume gain node
//Probably should just return both 
function createVolumeSlider(selector, container)
{
    var trackGainNode = audioContext.createGain()
    const rangeInput = document.createElement("input");
    rangeInput.setAttribute("type", "range");
    rangeInput.setAttribute("id", selector);
    rangeInput.setAttribute("min", "0");
    rangeInput.setAttribute("max", "2");
    rangeInput.setAttribute("value", "1");
    rangeInput.setAttribute("step", "0.01");
    rangeInput.style.zIndex = 15;

    rangeInput.addEventListener("input",() => {
        trackGainNode.gain.value = rangeInput.value;
    },false);
    container.appendChild(rangeInput)
    return trackGainNode
}

//Refactor this into smaller components
function createNewTrack()
{
    trackContainer = document.getElementById("tracks")
    
    //Track containers
    const singleTrack = document.createElement('div');
    singleTrack.classList.add('single-track');
    var trackKey = "Track"+trackId;
    singleTrack.setAttribute('id', trackKey)
    
    const trackSamples = document.createElement('div');
    trackSamples.classList.add('track-samples');
    trackSamples.setAttribute('id', "track-samples"+trackId)

    const trackInfo = document.createElement('div')
    trackInfo.classList.add("track-info")

            
    //VOLUME setting
    var trackGainNode = createVolumeSlider("volume_track"+trackId, trackInfo)
    //Loop functionality
    const checkBoxDiv = document.createElement('div')
    checkBoxDiv.classList.add("loopCheckContainer")
    const checkBox = document.createElement('input')
    checkBox.classList.add("loopCheck")
    checkBox.setAttribute("id", trackId+"loop")
    checkBox.type = "checkbox"

    const checkBoxLabel = document.createElement('label')
    checkBoxLabel.classList.add("loopCheckLabel")
    checkBoxLabel.setAttribute("for", trackId+"loop")
    checkBoxLabel.innerHTML = "LOOP"
    var key = 'Track'+trackId
    checkBox.addEventListener("change", function() {
        tracks[key].looping = this.checked;
    });

    checkBoxDiv.appendChild(checkBoxLabel)
    checkBoxDiv.appendChild(checkBox)

    //Radio for selecting tracks

    const trackRadio = document.createElement("input");
    const buttonContainer = document.createElement("div");
    buttonContainer.classList += "single-radio-button"
    trackRadio.setAttribute("type", "radio");
    trackRadio.setAttribute("id", "track"+trackId);
    trackRadio.setAttribute("name", "track");
    trackRadio.setAttribute("value", trackId);
    trackRadio.classList.add("trackradio-selector")
    trackRadio.checked = false;
    
    trackRadio.addEventListener("change", updateRemoveButton);
    checkBoxDiv.appendChild(checkBox)
    checkBoxDiv.appendChild(checkBoxLabel)


    const radioLabel = document.createElement("label")
    radioLabel.classList.add("radio-button-label")
    radioLabel.setAttribute('for', "track"+trackId)

    buttonContainer.appendChild(trackRadio);
    buttonContainer.appendChild(radioLabel);
    
    //Track name input
    
    const trackNameLabel = document.createElement('div')
    const trackNameInput = document.createElement('input')
    trackNameLabel.classList.add("track-name-label")
    trackNameInput.classList.add("track-name-input")
    trackNameInput.type = 'text'
    trackNameInput.placeholder = "Track name"
    trackNameLabel.appendChild(trackNameInput)
    trackNameLabel.setAttribute("id", "Track"+trackId+"input")

    trackInfo.appendChild(checkBoxDiv)
    trackInfo.appendChild(buttonContainer)

    //Sample area elements

    const dragDropArea = createNewDndArea()
    const fullTrack =  document.createElement('div')
    const trackDiv = document.createElement('div')
    trackDiv.appendChild(trackInfo)
    trackDiv.appendChild(singleTrack)
    fullTrack.appendChild(trackDiv)

    fullTrack.classList.add("fulltrack-container")
    fullTrack.setAttribute("id", "fulltrack"+trackId)
    trackDiv.classList.add("trackinfo-container")

    trackSamples.appendChild(dragDropArea)
    singleTrack.appendChild(trackSamples);
    fullTrack.appendChild(trackNameLabel)
    fullTrack.appendChild(trackDiv)
    trackContainer.appendChild(fullTrack)

    //New tracks are automatically selected
    radioLabel.click()
    //Audio handler
    let audio = new Audio()
    let trackSource = audioContext.createMediaElementSource(audio)

    //Add track to backend
    tracks[trackKey] = {"id" : trackId, "samples": [], "looping" : false, "volume" : trackGainNode, "playing" : false, "audio" : audio, "source" : trackSource};
    trackId += 1;
}   
//Sets scroll listener for top bar options
//Set up scroll support for toolbar sticking

function setUpTopbarScroll()
{
    var navbar = document.getElementById("sample-selector");
    var title = document.getElementById("page-title")
    var toolkit = document.getElementById("toolkit")
    var placeHolder = document.getElementById("scroll-placeholder")
    window.addEventListener("scroll", () =>{
        navbar.classList.add("sticky")
        var stickyY = navbar.offsetTop;
        var stickyX = 10;
        if (window.scrollY > stickyY || window.scrollX > stickyX) {
            placeHolder.style.height = navbar.offsetHeight+"px"
            placeHolder.style.width = navbar.offsetWidth+"px"
            placeHolder.style.display ='block'
        } else if (window.scrollY < stickyY && window.scrollX < stickyX){
            navbar.classList.remove("sticky");
            placeHolder.style.display = 'none'
        }
    })
    //Add functionality for toolbar moving with scrolled window
    window.addEventListener("scroll", () =>{
        
    })

}
//Removes the selected radio track from backend and frontend
function removeSelectedTrack()
{

    const trackRadios = document.getElementsByName("track");
    const selectedRadio = Array.from(trackRadios).find(radio => radio.checked);
    
    if (selectedRadio) {
      const trackIndex = selectedRadio.value;
      const trackToRemove = document.getElementById("Track" + trackIndex);
      if (trackToRemove) {
        const trackElement = document.getElementById("fulltrack"+trackIndex)

        //STYLING
        trackElement.style.display = "block"
        trackElement.style.height = trackElement.offsetHeight+"px"
        const allElements = trackElement.querySelectorAll("div")
        allElements.forEach((element) => {
            element.style.display = "none"
        })
        setTimeout(() => {
            trackElement.style.height = "0"
          }, 10);
        setTimeout(() => {
            trackElement.remove()
          }, 510);
        selectedRadio.checked = false;
        updateRemoveButton()
        var key = 'Track'+trackIndex
        tracks[key].source.disconnect()
        delete tracks[key]
        
      }
    }
}
//Returns true if any tracks are currently playing 
function currentlyPlaying()
{
    return Object.values(tracks).some((track) => track.playing);
}
//Update coloring on remove and clear selection buttons when one track is selected
function updateRemoveButton() {
    const button = document.getElementById("remove-track")
    const clearButton = document.getElementById("clear-selection")
    const radioButtons = document.querySelectorAll(".trackradio-selector");
    for (const radioButton of radioButtons) {
      if (radioButton.checked) {
        button.classList.add("button-active")
        clearButton.classList.add("button-active-green")
        return;
      }
    }
    button.classList.remove("button-active")
    clearButton.classList.remove("button-active-green")
  }
//Clears current selection
function clearRadioSelection()
{
    const radioButtons = document.querySelectorAll(".trackradio-selector");
    for (const radioButton of radioButtons) {
        radioButton.checked = false;
    }
    updateRemoveButton()

}

//Used for minimizing toolkit
var toolKitHidden = false

//Setup toolkit for dragging and functionality
function setUpToolKit()
{
    const controlPanel = document.getElementById("toolkit");
    const minimizeButton = document.getElementById("minimize-button");

    const content = controlPanel.querySelector(".control-panel-content");
    const header = controlPanel.querySelector(".control-panel-header");
    const headerText = header.querySelector("h2")
    minimizeButton.addEventListener("click", () => {
        toolKitHidden = !toolKitHidden; 

        if (toolKitHidden) {
          content.style.display = "none";
          controlPanel.style.width = "20%"
          minimizeButton.innerHTML = "Maximize"
          headerText.classList.add("minimize")
        } else {
          controlPanel.style.width = "40%"
          content.style.display = "flex";
          minimizeButton.innerHTML = "Minimize"
          headerText.classList.remove("minimize")
        }
      });
      
    let offsetX, offsetY;
    
    //Dragging DnD window
    header.addEventListener("dragstart", (event) => {
        offsetX = event.clientX - controlPanel.offsetLeft;
        offsetY = event.clientY - controlPanel.offsetTop;
        // Don't do it :)
        event.dataTransfer.setData("text/plain", "you dragged the toolkit into the address bar didn't you?");
    });
    var navbar = document.getElementById("sample-selector");

    header.addEventListener("drag", (event) => {

        var x = event.clientX - offsetX;
        var y = event.clientY - offsetY;
        var maxX = window.innerWidth - header.offsetWidth;
        var maxY = window.innerHeight - controlPanel.offsetHeight;
        //No overlap with top navbar
        var minY = navbar.offsetHeight + window.scrollY

        maxX += window.scrollX;
        maxY += window.scrollY;
        //Refactor this into it's own function to calculate bounding window
        if (x <= 0) {
          x = 0;
        } else if (x >= maxX) {
          x = window.innerWidth - header.offsetWidth + window.scrollX;
        }
        
        if (y <= minY) {
          y = minY;
        } else if (y >= maxY) {
          y = window.innerHeight - controlPanel.offsetHeight + window.scrollY;
        }
        
        if (event.clientY === 0 && event.clientX === 0) {
          return;
        }
        controlPanel.style.left = `${x}px`;
        controlPanel.style.top = `${y}px`;
    });
    
    header.addEventListener("dragend", (event) => {
        event.preventDefault()
        var x = event.clientX - offsetX;
        var y = event.clientY - offsetY;
        var maxX = window.innerWidth - header.offsetWidth;
        var maxY = window.innerHeight - controlPanel.offsetHeight;
        //No overlap with top navbar
        var minY = navbar.offsetHeight + window.scrollY

        maxX += window.scrollX;
        maxY += window.scrollY;
        
        if (x <= 0) {
          x = 0;
        } else if (x >= maxX) {
          x = window.innerWidth - header.offsetWidth + window.scrollX;
        }
        
        if (y <= minY) {
          y = minY;
        } else if (y >= maxY) {
          y = window.innerHeight - controlPanel.offsetHeight + window.scrollY;
        }
        
        if (event.clientY === 0 && event.clientX === 0) {
          return;
        }
        controlPanel.style.left = `${x}px`;
        controlPanel.style.top = `${y}px`;
    });
    
}

//Add functionality to toolkit on resize movement


//#endregion

//#region audio functionality

//Plays entire list of tracks
function playSong() {
    let i = 0;
    Object.values(tracks).forEach((track) => {
        if(track.samples.length > 0 && !track.playing) {
            playTrack(track)
        }
        i++
    })
}
//Plays every sample on a track
function playTrack(track) {
    if(track.playing)
    {
        return
    }
    var samples = track.samples
    var audio = track.audio
    var trackSource = track.source
    trackSource.connect(track.volume).connect(audioContext.destination)
    let i = 0
    audio.src = samples[0].src
    audio.addEventListener("ended", () => {
            if(i === samples.length)
            {
                i = track.looping ? 0 : i
            }
            if(i < samples.length)
            {
                audio.src = samples[i].src
                //use this for steps between samples
                setTimeout(() => {
                    audio.play()
                    i++
                }, stepBetweenSamples)
            }
            else{
                track.playing = false;
            }        
        })
    audio.play()
    track.playing = true
    i++
}

//#endregion


//SETUP

//Enables all of the buttons and inputs
function enableButtons()
{
    var buttons = document.querySelectorAll('button')
    buttons.forEach((button) =>{
        button.disabled = false
        button.classList.remove("disabled")
    })
    var inputs = document.querySelectorAll('input')
    inputs.forEach((input) =>{
        input.disabled = false
        input.classList.remove("disabled")
    })
}
//Disables all of the buttons and inputs
function disableButtons()
{
    var buttons = document.querySelectorAll('button')
    buttons.forEach((button) =>{
        button.disabled = true
        button.classList.add("disabled")
    })
    var inputs = document.querySelectorAll('input')
    inputs.forEach((input) =>{
        input.disabled = true
        input.classList.add("disabled")
    })
}
//Updates namefield with the name of the file (- .mp3)
function fileSelected()
{
    const sampleInput = document.getElementById("input-sample")
    document.getElementById("input-sample-name").value = sampleInput.files[0].name.replace('.mp3', '');
}
//Sets up eventlisteners for document (init)
function setUpDocument()
{
    categories.forEach((category) => {
        addCategoryButton(category)
    })
    const addTrack = document.getElementById("add-track");
    addTrack.addEventListener("click", function(){
        createNewTrack();
    })
    const removeTrack  = document.getElementById("remove-track");
    removeTrack.addEventListener("click", function(){
        removeSelectedTrack();
    })
    const clearSelection  = document.getElementById("clear-selection");
    clearSelection.addEventListener("click", function(){
        clearRadioSelection()
    })
    const uploadButton = document.getElementById("upload")
    uploadButton.addEventListener("click", async function(){
        await uploadFile();
    })

    const sampleInput = document.getElementById("input-sample")
    sampleInput.addEventListener("change", function(){
        fileSelected()
    })
    const playButton = document.getElementById("play")
    playButton.addEventListener("click", function(){
        if (audioContext.state === "suspended") {
            audioContext.resume();
            Object.values(tracks).forEach((track) => track.audio.play())
        }
        else
        { 
            playSong()
        }
    })
    const pauseButton = document.getElementById("pause")
    pauseButton.addEventListener("click", function(){
        if (audioContext.state === "running") {
            Object.values(tracks).forEach((track) => track.audio.pause())
            audioContext.suspend();
        }
    })
    const stopButton = document.getElementById("stop")
    stopButton.addEventListener("click", function(){
        if(audioContext.state === "running")
        {
            audioContext.close()
        }
    })
    const quickGuide = document.getElementById("quick-guide")
    //Move this to CSS
    quickGuide.style.cursor = 'pointer'
    quickGuide.addEventListener("click", function()
    {
        enableButtons()
        createNewTrack()
        var category = document.getElementById('category-button Bass')
        category.click()
        quickGuide.remove()
    })
    setUpRecorder()
    setUpTopbarScroll()
    setUpToolKit()
    disableButtons()

    //DEV
    quickGuide.click()
}
var recording = false;
function setUpRecorder()
{
    const recordButton = document.getElementById("record-button")
    const soundClip = document.getElementById("sound-clip")
    if (navigator.mediaDevices) {
        navigator.mediaDevices.getUserMedia({"audio": true}).then((stream) => {
          const mediaRecorder = new MediaRecorder(stream);
          let chunks = [];
          mediaRecorder.ondataavailable = (event) => {
            chunks.push(event.data);
          }
          mediaRecorder.addEventListener("stop", async function(event){
            const blob = new Blob(chunks, {"type": "audio/ogg; codecs=opus"});
            const audioSrc = window.URL.createObjectURL(blob);
            var sampleName = prompt("Enter sample name here:")
            if(sampleName === null || sampleName === "")
            {
              sampleName = defaultSampleName
            }
            let clipDuration = await getClipDuration(audioSrc)
    
            let sample = {id: samples.length, category: currentCategory, src: audioSrc, name: sampleName, duration: clipDuration }
        
            samples.push(sample)
            generateSampleMenu(findSamplesByCategory(currentCategory))
            chunks = [];
          });
          recordButton.addEventListener("click", () => {
            if (recording) {
              mediaRecorder.stop();
              recording = false;
              recordButton.innerHTML = "Record"
            } else {
              mediaRecorder.start();
              recording = true;
              recordButton.innerHTML = "Stop"
            }
          });
      
        }).catch((err) => {
          // Throw alert when the browser is unable to access the microphone.
          alert("Oh no! Your browser cannot access your computer's microphone.");
        });
      } else {
        // Throw alert when the browser cannot access any media devices.
        alert("Oh no! Your browser cannot access your computer's microphone. Please update your browser.");
      }
}
//Check when page is loaded and set up (From lecture materials)
if (document.readyState !== "loading") {
    console.log("Document is ready!");
    setUpDocument();
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      console.log("Document is ready after waiting!");
      setUpDocument();
    });
  }


//Remove DEV marked content