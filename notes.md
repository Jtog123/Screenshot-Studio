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
-***** Screenshot manager save all cards then export them ********

If I delete an image from the manager and have already captured it do i delete the captured image? NO i dontthse are seperate containers, if a user wants to delete a captured image they do that seperatley.
There for the camera manger should set the captured image array
After capturing the image we need to somehow trigger a state update in the toolbar,
this state update should create a small iamge,
set a state variable isImageCaptured, setIsImageCaptured, camera maanger will set this true, when true we create a tiny div image box for the captured image


PRESETS make input dropdown add a whole bunch of good positions for posing the phone at specific angles

3 free photos make them wait 5 days to reset
on upgrade unlock 2 phones to pose.



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



UI colors

**Great question!** For ScreenshotSweet.io, here's a color palette that balances the playful name with prosumer professionalism:

---

## **Primary Palette - "Sweet" but Professional**

### **Brand Colors:**

**Primary (Sweet Accent):**
- `#FF6B9D` - Bubblegum pink (playful, memorable)
- Use for: CTAs, highlights, active states, logo accent

**Secondary (Professional Base):**
- `#1F2937` - Dark slate (serious, grounded)
- Use for: Main UI, text, backgrounds

**Tertiary (Balance):**
- `#8B5CF6` - Purple (creative, premium feel)
- Use for: Secondary actions, hover states, badges

---

### **UI Colors:**

**Backgrounds:**
- `#0F172A` - Deep slate (main dark bg)
- `#1E293B` - Slate 800 (cards, panels)
- `#334155` - Slate 700 (elevated elements)

**Text:**
- `#F8FAFC` - Off-white (primary text)
- `#CBD5E1` - Slate 300 (secondary text)
- `#64748B` - Slate 500 (muted text)

**Accents:**
- `#22D3EE` - Cyan (info, success)
- `#F59E0B` - Amber (warnings)
- `#EF4444` - Red (errors, delete)

---

## **"Sweet" Gradient Options:**

**Hero gradient:**
```css
background: linear-gradient(135deg, #FF6B9D 0%, #8B5CF6 100%);
```

**Subtle UI gradient:**
```css
background: linear-gradient(180deg, #1E293B 0%, #0F172A 100%);
```

---

## **Alternative Palettes (Different Vibes):**

### **Option 2: Candy Shop**
More playful, consumer-focused:
- Primary: `#FF69B4` (Hot pink)
- Secondary: `#FFB6C1` (Light pink)
- Accent: `#87CEEB` (Sky blue)
- Dark: `#2D1B3D` (Deep purple)

### **Option 3: Modern Sweet**
Sophisticated but fun:
- Primary: `#EC4899` (Pink 500)
- Secondary: `#8B5CF6` (Purple 500)
- Accent: `#06B6D4` (Cyan 500)
- Dark: `#18181B` (Zinc 900)

### **Option 4: Minimal Sweet**
Clean, Apple-esque:
- Primary: `#FF2D55` (Apple pink)
- Secondary: `#1C1C1E` (Apple dark)
- Accent: `#5E5CE6` (Apple purple)
- Light: `#F2F2F7` (Apple light gray)

---

## **My Recommendation for ScreenshotSweet:**

**Go with the first palette** (Pink `#FF6B9D` + Dark Slate + Purple):

**Why:**
- Pink is sweet/playful but not childish
- Dark slate keeps it professional
- Purple adds creative/premium vibe
- Works for prosumer audience (not too corporate, not too casual)

**Usage example:**
```tsx
// Tailwind config
colors: {
  sweet: {
    pink: '#FF6B9D',
    purple: '#8B5CF6',
    dark: '#1F2937',
    darker: '#0F172A',
  }
}

// Usage
<button className="bg-sweet-pink hover:bg-sweet-purple">
  Create Screenshot
</button>
```

---

## **Quick Visual:**

```
Toolbar:     bg-slate-900 (dark)
Buttons:     bg-sweet-pink (pink accent)
Hover:       bg-sweet-purple (purple)
Text:        text-slate-100 (light)
Borders:     border-slate-700 (subtle)
Highlights:  text-sweet-pink (pink)
```

---

## **Pro Tip:**

Keep your current **stone/slate grays** for most UI, just add **pink as accent color** for:
- Logo
- Primary CTAs ("Capture", "Export")
- Active selections
- Hover states on important actions

This keeps it professional with a sweet pop of personality! 🍬

Want me to mock up how this would look on your toolbar? 🎨

MVP
- Add Fonts to text component, GOOGLE FONTS
- Allow users to have custom background images?
- Delete image component if no added image - DONE
- Automatically adjust app background on resize
- all inputs only allow imgs pngs and jpgs

npm install @fontsource/poppins


.NET tuts
Official Documentation:
Main Docs:

ASP.NET Core Web API Tutorial: https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-web-api
ASP.NET Core Overview: https://learn.microsoft.com/en-us/aspnet/core/
Building Web APIs: https://learn.microsoft.com/en-us/aspnet/core/web-api/

Key Topics You'll Need:

Routing: https://learn.microsoft.com/en-us/aspnet/core/mvc/controllers/routing
CORS (critical for React): https://learn.microsoft.com/en-us/aspnet/core/security/cors
Controllers: https://learn.microsoft.com/en-us/aspnet/core/web-api/#controllers
Entity Framework Core (if using database): https://learn.microsoft.com/en-us/ef/core/


We are not storing any user data in cookies, that would be a security risk, In the cookie we keep a signature to look up a user in the database'


Cloudflare gives https on deployment frontend or coolify?
Railway backend https

// Background
<div className="bg-velvet-dark">

// Text
<h1 className="text-cream-light">

// Border
<div className="border-velvet">

// Hover
<button className="bg-velvet hover:bg-velvet-accent">

velvet: {
          dark: '#8B1538',
          DEFAULT: '#A42347',
          light: '#C14A5C',
          accent: '#6B1F2D',
        },
        cream: {
          light: '#FFFBF5',
          DEFAULT: '#F5F0E8',
          dark: '#E8DED0',
        },
        cocoa: {
          dark: '#3D1F1F',
          DEFAULT: '#5C2E2E',
          light: '#7A4545',
        }


        new bg?
        #1f1000
        or 
        #ffa442





- use aspect ratios rather than pixels
- paid users get more aspect ratios?
- paid users get cloud sessions/ storage?
- Maybe on homepage instead of having 50/50 split width i can have 60/40
- add "danger zone" to chart
- that way the arrow acn be posibtioned not absolutely and can look like its hitting the other side
- Create a "user scene layer" where users store all their active scenes, flow users statrs app, taken to scene layer, from scene layer they create a new scene or pick an existing scene, app opens they get to work
- adjust steps 1 and two (1 style your scene - Choose backgrounds, add lighting, and upload your apps photos ,,, 2 - Position your model , rotate tilt and position your device at the perfet angle)  
- For now use local storage and make their session expire after 48 hours?

USER TABLE
display name
first name
last name
email
profileImg
subscriptionType (free, Weekend Warrior, Monthly)


PAIN POINTS
Not wasting time
Saving frustration with other design tools
No design tools tutorials

Design without the headache


IDEA below 3 steps one professional good looking mock up that shows the results


USING IPHONE 16 PRO

For now use local storage and make their session expire after 48 hours?

FEATURES FOR NOW
 - Use LocalStoarge to persist user session data
 - Build a basic table for user analytics, track number of logins, # of times export button hit, if they are free have they consistently reached their screenshot limit? If they are not free how often are they hitting the export button? How many lights are in the scene on export? How many text components? how many image components? Return rates, user_analytics

 TABLES
 users - (Have it)
 sessions - user_id, login_timestamp, logout_timestamp, device type?
 exports - user_id, timestamp, scene_id, num_lights, num_images, num_text, aspect_ratio, num_exports_from_scene
 scenes (metadata) - user_id, created_at, exported (yes/no), num_edits, time_to_export
 subscriptions - user_id, plan_type, start_date, end_date, status, payment_amount
  - using local storage we are going to store a users
    Name (Not local storage),
    Google Icon (not local storage)
    isGradeintOn
    Background color
    Light settings
    Text content
    text placement
    image content LATER AWS?
    image placement LATER AWS - images on postgres can be a perofrmance hit
    Phone rotationHeres my list im thinking

    1. Get exports working and polished
    2. get basic database for users up and going
    3. basic analytics
    4. finish landing page
    5. integrate stripe payments
    6. Ship 1.0?

    TODAY export files, when a user exports a file update the table





UI To ADD
- SVG that handle failed exports or inccorect file extensions show a message alerting users
- Icon indicating users membership
- change UI colors
- finish footer,
- confirm functionality of app
- write business logic for weekend warrior and monthly
- Warrior icon , king crown icon
- buy domain
- stripe payments rails
- enable transprent backgrounds toggle on phonegui DONE?
- DONE?
- users can log in with sigin but it should stay free, after they ay weekend warrior, we should update the database, then the app should display it
- write a basic success page, display a message have it redirect users to the app
- Drop a user from table, sign them back in make sure they are on free tier, after sigingin them in upgrade the, and make sure they get updated to both either weekend or mothly.


Postres sql strings use single quotes '' rather than double quotes which identify columns




FEATURES TO ADD (after testing )
 - More Phone Models
 - Scene Layer, its the layer where users sign in are funneled to all their scenes. Since we want this to work across devices,      postgres will have to store scene information such as lights in scene, the lights settings, the background color the user had saved, etc. Will need to track user behavior to see how the use the app. I will add tables such as (scene, scene_asstes, scene_settings)
 - Later When implmenting better saves of scenes we will remember a users in scene components such as lights, light positions, light Colors.
 Text Components, text component positions, text colors, text size, Etc.

CRITICAL (Must-Do):
[ x?] Replace all localhost URLs with environment variables
[ x?] Update Google OAuth redirect URLs (add production)
[ x?] Add FRONTEND_URL to .env
[ x?] Update session cookie settings (secure, sameSite)
[ x?] Update CORS origin
[ ] Switch to Stripe live keys (sk_live_...)
[ x?] Generate strong SESSION_SECRET
[ x?] change captured inputs to like homepage
[] test free user logic
[x?] window resize toolbar header and footer icons bust out
[x] homepage cards line itesm dont fit on window resize
[x] switch to single page layout on window resize, get rid of your app here arrow on resize
[x] privacy policy
[x] terms of service
[x] menu card in app "upgrade" redirect to home page cards
[x?] cancel subscription logic through stripe? settings page?
[x] set up porkbun email forwarding
[x] show free user alert after they have used up exports
[] replace all localhosts in every component that makes requests
[] on user settings page better place for 'x' on resize

DEPLOY:
[ x] Buy domain
[ ] Deploy backend (Railway/Render)
[ ] Deploy frontend (Vercel/Cloudflare)
[ ] Point domain to hosting
[ ] Add SSL certificate (automatic with Vercel/Railway)

POST-DEPLOY:
[ ] Set up Stripe webhook
[ ] Test end-to-end payment flow
[ ] Test Google OAuth login
[ ] Test Weekend Warrior purchase
[ ] Test Monthly subscription
[ ] Check database updates after payment
[] User settings page make an overlay rather than a renavigation, so it saves state of project

[] rotate all secrets, Generate new Stripe keys in Stripe Dashboard,
Create new Google OAuth credentials in Google Cloud Console
Change database password
Generate new session secret

[]


Deploy Backend to Railway/Render
Deploy Frontend to Vercel/Cloudflare
Point DNS to hosting
Set up Stripe webhook (production URL)
Test with test card in production
Switch to live Stripe keys
Launch! 🚀

-Bug ,from a gradient background go to solid background change the color, refresh the page, then swtich to gradient background, it will forget the previous gradient colors. 

REMBMER
AppUser has both instacnes on Client and Server side, so when upadting one need to update both!!