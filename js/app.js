window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

var videomonitor = document.querySelector('#camera');

function streamCb(stream) {
    videomonitor.src = window.URL.createObjectURL(stream);
}

function errorCb(e) {

}

navigator.getUserMedia({video: true}, streamCb, errorCb);

var
    videoElement = document.querySelector('#camera'),
    imageElement = document.querySelector('#image'),
    videoImageCanvas = document.querySelector('#video-canvas-buffer'),
    videoImageCanvasContext = videoImageCanvas.getContext('2d'),
    videoTexture = new THREE.Texture(videoImageCanvas),
    width = window.innerWidth,
    height = window.innerHeight,

    radius = 1000,
    segments = 32,
    rings = 32,

    sphereMaterial = new THREE.MeshBasicMaterial({map: videoTexture, overdraw: true, side:THREE.DoubleSide}),

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
    aspect = width/height,
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
renderer.setSize(width, height);

sphere.scale.x = -1;
scene.add(sphere);

var loop = (function render() {
    controls.update();
    requestAnimationFrame(render);

    if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
        videoImageCanvasContext.drawImage(videoElement, 0, 0, videoImageCanvas.width, videoImageCanvas.height);
    }
    else
    {
        videoImageCanvasContext.drawImage(imageElement, 0, 0, videoImageCanvas.width, videoImageCanvas.height);
    }

    videoTexture.needsUpdate = true;

    renderer.render(scene, camera);

})();
