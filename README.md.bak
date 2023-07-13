### Web programming basics, Summer 2023 Aapo Hyyryläinen

# Contents 
1. [Project description and thoughts](#project-description)
2. [Features and requirements](#features-and-requirements)
    1. [Requirements](#requirements)
    2. [Features](#features-specified-in-instructions)
    3. [Additional features](#added-features)

## Project description

This repo is for the final project for the Summer 2023 web programming basics course. I decided on continuing the music maker application from week 2 and worked on updating the UX flow of the application and adding some track based features.

First I updated the site to a centered view and added support for adding more tracks to the view. I decided to add a small track controller to the side as well as a track naming field, in case the user wants to customize based on track.

Next, I added sample visualization so that when samples are added to a track, they are shown with a colored box that indicates the category and the sample's duration in width. Samples can either be added by selecting a track and clicking a sample, or by dragging and dropping a sample to the desired track. Samples can be deleted from the track or from the top bar menu. If removing from top view, a page refresh will return the page to it's default state.

Then I moved on to adding categories based on the current samples from the lecture materials. I then added drag and dropping for moving samples into different categories as well as an update function to use with any samples that are currently already on a track for a visual effect. I also wanted to add color specific themes for categories so adding more categories would've required a color picker functionality or similar, I decided against adding a category adding feature as the colorpicker was hard to fit inside the page in mobile view. Categories could be better formatted and refactored to support the proposed color picker + category add feature.

I expanded the drag and drop functionality to multiple things inside the page such as the toolbar. I thought having the top navbar and toolkit follow the editor gave it more fluidity, as the user wouldn't need to scroll back up top to add samples or create new tracks. Also gave me a good understanding of different positioning options with CSS. I wanted to explore adding freeform samples to the track container so that it would give the user more control on when to play the sounds to create a better user experience. As it stands now, the music maker can only be used to play sounds one after the other.

I worked entirely on a fullscreen application before moving onto mobile views, which turned out to not work out that well. Although I used relative sizes and planned out the application, fitting everything inside the mobile screen as well as the control panel turned out to be more difficult than I anticipated. I also tried to comment everything out and laid out a roadmap using the features given in the project instructions to make a more clear plan on where the application was headed. Unfortunately due to having work and other courses I had no time to implement a couple of features that I would've liked such as adding custom steps between samples (currently set inside the javascript at 0.25s intervals), drag and dropping to reposition samples inside tracks and adding more options to the track controls such as oscillator nodes.


## Features and requirements

### Requirements

| Requirement | Max Points | Done | Description |
|--|--|--|--|
| Well-written report | 2 | YES | The application includes a well-written report providing clear documentation and explanation of its features |
| No report | -30 | NO | If no report is provided, a penalty of -30 points will be applied|
|Application is responsive and can be used on both desktop and mobile environment | 4 | |The application is designed to be responsive, allowing it to function well on both desktop and mobile devices |
| Application is not responsive | -2 | NO | If the application is not responsive, a penalty of -2 points will be applied |
| Application works on Firefox, Safari, Edge, and Chrome | 2 | | The application is tested and verified to work on Firefox, Safari, Edge, and Chrome browsers |
| Application does not work | -30 | WORKS | If the application is not functioning, a penalty of -30 points will be applied |
| CSS, JavaScript, and HTML are all in the same file | -5 | SEPARATED | If CSS, JavaScript, and HTML are combined in a single file, a penalty of -5 points will be applied |
| Inappropriate content, including hate speech-related memes and other trash | -100 | NOPE | If the application contains inappropriate content, including hate speech-related memes or other offensive material, a penalty of -100 points will be applied |

### Features specified in instructions


| Feature | Max points | Implemented | Description |
|--|--|--|--|
| Drag'n'drop new instruments to the tracks | 4 | YES | Allows users to add samples to tracks by dragging and dropping them using the mouse or touch screen |
| Adjustable volume per track | 2 | YES | Each track has its own volume slider for adjusting the volume level |
| Instrument's length visualized in the track | 4 | YES | The width of samples in the track corresponds to the duration of the audio clip * 20 in pixels |
| Available instruments categorized | 2 | YES | Instruments are categorized, such as basses, guitars, drums, with an 'ALL' samples category |
| Users can add as many tracks as they see fit | 1 | YES | Users can add an unlimited number of tracks (Infinite scroll) |
| Looping and one-time tracks | 1 | YES | Tracks can be set to loop or play only once |
| Recording songs through microphone | 3 | YES | Users can record songs using the web audio API and the microphone |
| User can delete tracks and instrument items | 3 | YES | Users have the ability to remove tracks and individual instrument items from the composition if needed |
| Adjustable volume per instrument item | 1 | NO | Each instrument item within a track can have its own adjustable volume level |
| One can change the category of an instrument | 1 | YES | Users can change the category of an instrument, allowing it to be moved to a different category or group |
| Able to download the final song | 3 | | Users have the option to download the final composition as a song file, allowing them to save and share it |

### Added features

| Feature | Points | Comments and justifications |
|--|--|--|--|
| Drag 'n' drop toolbox for ease of use | 2 | Implement CSS and JavaScript to create a drag and drop toolbox window that stays within the screen boundaries with scroll functionality |
| Track selections for play and pause functionality | 2  | Enable users to select individual tracks for play and pause functionality via the toolbox |
| Infinite track visualization | 1  | Implement visualization of tracks that can be continued infinitely to the right |
| Category expansion and custom categories | 1  | Implement adding custom categories |
| CSS Styling | 3  | Implement custom CSS styling for samples, Dnd, functionality, category selection and responsiveness |

