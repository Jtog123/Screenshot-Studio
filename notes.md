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

If a user adds text automatically move the camera up one notch?  - QUEUED

Allow users to adjust camera in the Y direction to allow more or less room for text - QUEUED

Allow users to adjust camera in the Z direction to get closer/further from the phone - QUEUED

Allow users to add their apps logo to the scene THREE.Sprite() - QUEUED

ImageComponent TO DO  - QUEUED
    -   Be able to click the image and select component
    -   Be able to scale the image component, with GUI?
    -   Be able to reposition image component, with GUI?
    -   needs the raycaster


If a light Is NOT visible we should be be able to open its gui

Text Component Requirements
    -Change Text Style
    -Change Font Size  - DONE
    -Change Background Color - DONE
    -Add borders
        -border color
        -border width
        -border style dashed, solid
    -Allow for Differing Opacities - DONE
    -Allow for rounded corners
    -Allow for bolding specific words
    -Change Position of Component in X,Y,Z space - DONE
    -Width and Height of the component

    -default option is no background, have to select it
    -translucent background but able to see the text
    -text alignment

    -text doesnt show up in scene need to create custom textSprite in asset manager?

    -Text will stay text with no background, later allow user to add geometry shapes to the scene, layering system?


    -toggling visibility shrinks the text component and the image component

    -want both a left and right gradient and top bottom gradient



    Creating gradients
    Similar to how we created the text sprite, except we create a large plane as a Three.Sprite and set it as the background
    A piece of code i foud and need to test that involves vertex shaders and fragment shaders

    const vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    const fragmentShader = `
    uniform vec3 color1;
    uniform vec3 color2;
    varying vec2 vUv;
    void main() {
        gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
    }
    `;

    const material = new THREE.ShaderMaterial({
    uniforms: {
        color1: { value: new THREE.Color("red") },
        color2: { value: new THREE.Color("blue") }
    },
    vertexShader,
    fragmentShader
    });


    https://www.youtube.com/watch?v=LW9d2cqIHb4
    at 12:05 for start up code
    12:20 for vertex shader

    
    Fragment shader = colors/appearance, 
    Vertex shader = shape/position









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


-Light positions: best way to not assign the same position to every light
-Light GUI position: guis should be positioned relative to the lights, but we are mixing coordinates THREE vs Screen
-Toolbar background color not remembering state after opening and closing
- create a default screen for when phone loads "Your App Here"
-***** limit inputs to images ONLY no injection ********



iphone 16 pro instructions?
## Exact Blender Dimensions for iPhone 16 Pro

### Frame (Rounded Rectangle):
```
Width (X):  0.773 units
Height (Y): 1.627 units  
Depth (Z):  0.083 units
Border Radius: 0.12 units
```

### Screen (Flat Plane):
```
Width (X):  0.683 units
Height (Y): 1.517 units
Position Z: 0.042 units (slightly in front of frame)
```

### Aspect Ratio:
Screen: **19.6:9** (iPhone 16 Pro - slightly taller than 14)

---

## Step-by-Step in Blender:

**1. Frame:**
- Add Cube
- Press `S` → `X` → `0.773` → Enter
- Press `S` → `Y` → `1.627` → Enter  
- Press `S` → `Z` → `0.083` → Enter
- Add Bevel Modifier: Amount = 0.12, Segments = 4

**2. Screen:**
- Add Plane
- Press `S` → `X` → `0.3415` → Enter (half of 0.683)
- Press `S` → `Y` → `0.7585` → Enter (half of 1.517)
- Press `G` → `Z` → `0.042` → Enter

**3. Scale for Three.js:**
- Select both objects
- Press `S` → `10` → Enter
- Press `Ctrl + A` → "Scale"

**4. Name & Export:**
- Plane → "phone_screen"
- Cube → "phone_frame"
- Export as GLB

The iPhone 16 Pro is slightly larger and has thinner bezels than the 14, so these dimensions are more accurate! 📱