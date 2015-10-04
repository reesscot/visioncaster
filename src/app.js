//Setup three.js WebGL renderer
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
// Append the canvas element created by the renderer to document body element.
document.body.appendChild(renderer.domElement);
// Create a three.js scene.
var scene = new THREE.Scene();
// Create a three.js camera.
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.3, 10000);
// Apply VR headset positional data to camera.
var controls = new THREE.VRControls(camera);
// Apply VR stereo rendering to renderer.
var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);
// Create a VR manager helper to enter and exit VR mode.
var manager = new WebVRManager(renderer, effect, {hideButton: false});

/*
    OK DO YOUR STUFF HERE ------------------------------- /
*/
/*
Set up the key measurements of the cylinder that will display our mockup image. It is important to match these measurements to the size of the image, or the surface area of the cylinder will be different from the image, causing it to appear squished or stretched. We start with the circumference of the cylinder. Set it to match the width of the image. Remember that the standard unit of measurement for VR scenes is meters. If our mockup canvas is 360 centimeters wide, for example, we set the circumference value to be 3.6 (360/100).
*/

var circumference = 3.6;

/*
Set up the radius of the cylinder. We derive the radius from the circumference.
*/

var radius = circumference / 3.14 / 2;

/*
Set up the height of the cylinder. As with the circumference, we match this value to the height of our mockup, and convert to meters (from 90cm to 0.9 meters)
*/

var height = 0.9;

/*
Create the geometry for the cylinder object that will display our mockups.
The cylinder constructor takes the following arguments: CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded). We add 60 radiusSegments to make the cylinder smooth, and leave the top and bottom openEnded.
*/

var geometry = new THREE.CylinderGeometry( radius, radius, height, 60, 1, true );

/*
Invert the scale of the geometry on the X axis. This flips the faces of the cylinder so they faces inwards, which has the visible effect of displaying the mockups as we expect: facing inwards and in the correct orientation. Try removing this line to see what happens without flipping the scale.
*/

geometry.applyMatrix( new THREE.Matrix4().makeScale( -1, 1, 1 ) );

/*
Create the material that we will load our mockup into and apply to our cylinder object. We set `transparent` to true, enabling us to optionally use mockups with alpha channels. We set `side` to THREE.DoubleSide, so our material renders facing both inwards and outwards (relative to the  direction of the faces of the cylinder object). By default, materials and the faces of three.js meshes face outwards and are invisible from the reverse. Setting THREE.DoubleSide ensures the cylinder and it's material will be visible no matter which direction (inside or out) we are viewing it from. This step is not strictly necessary, since we are actually going to invert the faces of the object to face inwards in a later step, but it is good to be aware of the `side` material attribute and how to define it. We then load our mockup as a texture.
*/

var material = new THREE.MeshBasicMaterial( {
  transparent: true,
  side: THREE.DoubleSide,
  map: THREE.ImageUtils.loadTexture( 'img/africa-overlay.png' )
});

/*
Create the mesh of our cylinder object from the geometry and material.
*/

var mesh = new THREE.Mesh( geometry, material );

/*
Add our cylinder object to the scene. The default position of elements added to a three.js scene is 0,0,0, which is also the default position of our scene's camera. So our camera sits inside our cylinder.
*/

scene.add( mesh );

/*
To adjust the distance between our mockups and the user, we can optionally scale our mesh. If we apply 0.5 to the X,Y,Z, for example, the radius shrinks by half, and the mockups become twice as close to our eyes. Because we are scaling proportionally (equal on X,Y,Z) the mockups do not _appear_ any larger, but the stereo effect of the VR headset tells us they are closer. Play with this setting to find a value that you like.
*/

//mesh.scale.set( 0.5, 0.5, 0.5 );

/*
To optionally add a background image to the scene, create a large sphere and apply a bitmap to it. First, create the geometry for the sphere. The SphereGeometry constructor takes several arguments, but we only need the basic three: radius, widthSegments, and heightSegments. We set radius to a big 5000 meters so the sphere is less likely to occlude other objects in our scene. We set width and height segments to 64 and 32 respectively to make it sphere surface smooth. And we then invert the geometry on the x-axis using THREE.Matrix4().makeScale(), to flip the geometry faces so they face "inwards", as we did with the mockup cylinder.
*/

var geometry = new THREE.SphereGeometry( 5000, 64, 32 );
geometry.applyMatrix( new THREE.Matrix4().makeScale( -1, 1, 1 ) );

/*
Create the material we will load our background image into.
*/

var material = new THREE.MeshBasicMaterial( {
  map: THREE.ImageUtils.loadTexture( 'img/africa.jpg' )
} );

/*
Create the mesh of our background from the geometry and material, and add it to the scene.
*/

var mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

jQuery('body').on('touchend', function(e) {
  var material = new THREE.MeshBasicMaterial( {
  map: THREE.ImageUtils.loadTexture( 'img/india.jpg' )
} );

/*
Create the mesh of our background from the geometry and material, and add it to the scene.
*/

var mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );
});
/*  ----------------------------------------------------  */
// Request animation frame loop function
function animate(timestamp) {

/* OK DO YOUR STUFF HERE -----------------------------*/

/*  DONT EDIT BELOW THIS LINE ----------------------- */
  // Update VR headset position and apply to camera.
  controls.update();
  // Render the scene through the manager.
  manager.render(scene, camera, timestamp);
  requestAnimationFrame(animate);
}

// Kick off animation loop
animate();

// Reset the position sensor when 'z' pressed.
function onKey(event) {
  if (event.keyCode == 90) { // z
    controls.resetSensor();
  }
};

window.addEventListener('keydown', onKey, true);
// Handle window resizes
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  effect.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize, false);