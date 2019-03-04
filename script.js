function log(message){
  console.log(message)
  var p = document.getElementById("log")
  p.innerHTML += '<br>' + message;
  p.scrollTop = p.scrollHeight;
}
window.addEventListener("load", function(e) {
  var color = {r: 240, g: 100, b: 100};
  var slider = document.getElementById("tolerance");
  var canvas  = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var webcam = document.getElementById('webcam');
  var swatch = document.getElementById("color");
  tracking.ColorTracker.registerColor('dynamic', function(r, g, b) {
    return getColorDistance(color, {r: r, g: g, b: b}) < slider.value
  });
  var tracker = new tracking.ColorTracker("dynamic");
  tracker.on('track', function(e) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (e.data.length !== 0) {
      e.data.forEach(function(rect) {
        drawRect(rect, context, color);
      });
    }
  });
  tracking.track(webcam, tracker, { camera: true } );
  webcam.addEventListener("click", function (e) {
    var c = getColorAt(webcam, e.offsetX, e.offsetY);
    color.r = c.r;
    color.g = c.g;
    color.b = c.b;
    swatch.style.backgroundColor = "rgb(" + c.r + ", " + c.g + ", " + c.b + ")";
  });
});
function getColorDistance(target, actual) {
  return Math.sqrt(
    (target.r - actual.r) * (target.r - actual.r) +
    (target.g - actual.g) * (target.g - actual.g) +
    (target.b - actual.b) * (target.b - actual.b)
  );
}
function getColorAt(webcam, x, y) {
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  canvas.width = webcam.width;
  canvas.height = webcam.height;
  context.drawImage(webcam, 0, 0, webcam.width, webcam.height);
  var pixel = context.getImageData(x, y, 1, 1).data;
  return {r: pixel[0], g: pixel[1], b: pixel[2]};
}
function drawRect(rect, context, color) {
  context.strokeStyle = "rgb(" + color.r + ", " + color.g + ", " + color.b + ")";
  
  context.strokeRect(rect.x, rect.y, rect.width, rect.height);
  log("x: "+rect.x+ " y: "+rect.y)
}
