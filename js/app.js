window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;


var
    imageElement = document.querySelector('#image'),
    videoImageCanvas = document.querySelector('#video-canvas-buffer'),
    videoImageCanvasContext = videoImageCanvas.getContext('2d'),
    videoTexture = new THREE.Texture(videoImageCanvas),
    width = window.innerWidth,
    height = window.innerHeight,

    radius = 1000,
    segments = 32,
    rings = 32,

    sphereMaterial = new THREE.MeshBasicMaterial({
        map: videoTexture,
        overdraw: true,
        side: THREE.DoubleSide
    }),

    sphere = new THREE.Mesh(
        new THREE.SphereGeometry(
            radius,
            segments,
            rings
        ),
        sphereMaterial
    ),

    renderer = new THREE.WebGLRenderer(),
    canvasContainer = document.querySelector('#canvas'),

    fov = 80,
    aspect = width / height,
    nearPlane = 1,
    farPlane = 1000,
    camera = new THREE.PerspectiveCamera(fov, aspect, nearPlane, farPlane),
    scene = new THREE.Scene(),
    controls = new THREE.OrbitControls(camera);


videoImageCanvasContext.fillStyle = "#000000";
videoImageCanvasContext.fillRect(0, 0, videoImageCanvas.width, videoImageCanvas.height);

videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;


controls.noPan = true;
controls.noZoom = true;
controls.autoRotate = false;

camera.position.x = 0.1;
canvasContainer.appendChild(renderer.domElement);
var effect = new THREE.StereoEffect(renderer);

renderer.setSize(width, height);

sphere.scale.x = -1;
scene.add(sphere);

// Our preferred controls via DeviceOrientation
function setOrientationControls(e) {
    if (!e.alpha) {
        return;
    }
    controls = new THREE.DeviceOrientationControls(camera, true);
    controls.connect();
    controls.update();
    element.addEventListener('click', fullscreen, false);
    window.removeEventListener('deviceorientation', setOrientationControls, true);
}
window.addEventListener('deviceorientation', setOrientationControls, true);

var loop = (function render() {
    controls.update();
    requestAnimationFrame(render);

    videoImageCanvasContext.drawImage(imageElement, 0, 0, videoImageCanvas.width, videoImageCanvas.height);

    videoTexture.needsUpdate = true;

    renderer.render(scene, camera);

})();