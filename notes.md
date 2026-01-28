//to run files: node fileName.js

//to update files: tsc

Three.js fundamentals
https://threejs.org/manual/#en/fundamentals

If we wanted to create two cubes, we need two meshes, but meshes can reference the same Geometry and Material objects
Geometry - holds cube vertex data
Material - holds thing like color properties, or how shiny an object is

MashBasicMaterial not affected by lights

General Flow
Create A Scene
Create a Camera, with args passed
Create a Renderer

Create your geometry and material then create your mesh.
Add the geometry and metrial to the mesh

add the mesh to the scene

Responsive Design
https://threejs.org/manual/#en/responsive


//For Screensohtting the phone Scrren capture API
https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API/Using_Screen_Capture



// Creating new colors
//Hexadecimal color (recommended)
const color2 = new THREE.Color( 0xff0000 );

//RGB string
const color3 = new THREE.Color("rgb(255, 0, 0)");


//adding color picker html <input type = "color">


basic classes
start with SceneManagerClass


App - orchestrates everything
├── SceneManager - handles Three.js scene/camera/renderer
├── PhoneModel - manages phone 3D model (multiple types)
├── LightingSystem - manages multiple lights
│   └── Light[] - individual light controls
├── ScreenshotManager - handles screenshot texture/positioning
├── ControlPanel - UI state and event handling
└── Exporter - handles rendering to image




What Behaviour would users want
    -   Maintain Session State
    -   Automatic Save Session State
    -   


Session state must remeber
    - Color information of all lights, meshes, etc
    - Position information of Camera, meshes, lights, etc
    - Toolbar settings



////////////////////////

NEED TO BOTH COMPILE TSC AND RUN TAILWIND STYLING

TODO

All behaviour that has to do with the Scene as a whole

Use Vite For Bundling - LATER

In the GUI class  - DONE
    - Adjust light position with sliders
    - Toggle the GUI on when clicking on a light helper.
    - Toggle GUI off when clicking the close button, use dialog built in functions
    - Attach the light sliders to functionality
    - Make sure only one light is selected at any time, and one lightGui showing at any time
    - Add Rotation of lights
    - Change Light Color in GUI

Get an Iphone model and add it to the Scene - DONE

Pick a Color Palete for the site/GUIS model it off of a service I like - IN PROGRESS

Change the toolbar so that its only collapsable not adjustable - DONE

Make backgrounds allow for gradients - QUEUED
https://discourse.threejs.org/t/radial-gradient-shader-for-the-scene-background/25079
https://threejs.org/docs/#ShaderMaterial

Allow Light Gui To:
    - Change the type of light in the GUI - QUEUED
    - Trash the light active in the Scene - QUEUED

Adjust The Phone Model Rotation with a slider - DONE

When I trash the light the light doesnt actually delete - DONE

Begin designing and creating UI for the toolbar - IN PROGRESS
    - Buttons and functionality to create light
    - Scene items UI, to show every item a user has added to a scene
    - Toggle lights on and off, lock positions

Camera Zoom in and out Buttons - IN PROGRESS

Phone Presets "Front View" / "3/4 View" / "Side View" / "Top Down" - IN PROGRESS

Add visibility toggle to all components in the scece object.visible = !object.visible  - QUEUED

Relabel the list after deleting an element from it - QUEUED
    -if the ul is empty then restart the count from 0?

Offer 2d and 3d text options?
    - General Flow of the program
    - Allow users to add images all at once
    - Tell them to model the scene how they would like it
    - Then once they snap their photo, ask if they would like to take or more photos or continue to the next page to add text

Create an overlay of that mimics the lens of the camera and what what scene entities will be in/ out of frame - QUEUED

On window resize app should automatically update to the new window size - QUEUED

If a uer adds text automatically move the camera up one notch?  - QUEUED

Allow users to adjust camera in the Y direction to allow more or less room for text - QUEUED

Allow users to adjust camera in the Z direction to get closer/further from the phone - QUEUED

Allow users to add their apps logo to the scene THREE.Sprite() - QUEUED








Problem current setup is good if users want to take 1 screenshot, but users will want more than 1, they will want a whole set, how do we fix this?

When items is slected in the scene and i delete it, it crashes the program


/////////////////////////

3. Side-by-Side Screenshot Manager (My recommendation)
Combine both approaches with a panel:
┌─────────────────┬──────────────┐
│   3D Scene      │  Screenshot  │
│   (with phone)  │   Manager    │
│                 │              │
│                 │ □ Image 1    │
│                 │ □ Image 2    │
│                 │ ✓ Image 3    │
│                 │ □ Image 4    │
│                 │              │
│                 │ [+ Add More] │
│                 │ [Capture]    │
│                 │ [Export All] │
└─────────────────┴──────────────┘
Features:

Checkbox list of uploaded screenshots
Click any image to instantly load it on the phone
Scene/lighting stays the same
Capture button saves current view
"Export All" button to batch render all images with current setup



-In the initial app we have an initial event listener that is listening for clicks
-We pass the clicks to the selectLight function which uses the raycaster to click on threejs geometry
-if we click on a piece of threejs geometry we call the selectLightByID function
-in selectLightByID we emit a "lightSelected" event
-In the toolbar component we are listening for the "lightSelectedEvent", when that happens we set the state of the selectedLight
-We then conditionally render a GUI based on the selected lights id
