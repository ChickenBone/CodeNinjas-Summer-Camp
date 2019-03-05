const sample = 20
function log(message) {
  if (document.getElementById("dev").checked) {
    setTimeout(function () { }, 500)
    console.log(message)
    var p = document.getElementById("log")
    p.innerHTML += '<br>' + message;
    p.scrollTop = p.scrollHeight;
  }
}
function dir(dir){
    console.log(dir)
    if(dir != null){
    var p = document.getElementById("dir")
    p.innerHTML = dir;
    p.scrollTop = p.scrollHeight;
    }
}
function devlog(message) {
  if (document.getElementById("dev").checked) {
    setTimeout(function () { }, 500)
    console.log(message)
  }
}
function spots(x, y) {
  this.x = x;
  this.y = y;
  this.arr = []
  this.store = function (x, y) {

    if (this.arr.length >= sample) {
      tempx = this.arr["4"].x
      tempy = this.arr["4"].y
      this.arr = []
      this.arr.push({ "x": tempx, "y": tempy });
    }
    this.arr.push({ "x": x, "y": y });
  }
  this.up = function () {
    try {
      let t = 0
      for (i = 1; i <= this.arr.length; i++) {
        if (this.arr[(i - 1).toString()].y > this.arr[i.toString()].y) {
          t++
        }
        if(i == (this.arr.length-1)){
          return t
        }
      }
    } catch{ }
  }
  this.down = function () {
    try {
      let t = 0
      for (i = 1; i <= this.arr.length; i++) {
        if (this.arr[(i - 1).toString()].y < this.arr[i.toString()].y) {
          t++
        }
        if(i == (this.arr.length-1)){
          return t
        }
      }
    } catch{ }
  }
  this.left = function () {
    try {
      let t = 0
      for (i = 1; i <= this.arr.length; i++) {
        if (this.arr[(i - 1).toString()].x < this.arr[i.toString()].x) {
          t++
        }
        if(i == (this.arr.length-1)){
          return t
        }
      }
    } catch{ }
  }
  this.right = function () {
    try {
      let t = 0
      for (i = 1; i <= this.arr.length; i++) {
        if (this.arr[(i - 1).toString()].x > this.arr[i.toString()].x) {
          t++
        }
        if(i == (this.arr.length-1)){
          return t
        }
      }
    } catch{ }
  }
  this.direction = function () {
    tl = this.left()
    tr = this.right()
    tu = this.up()
    td = this.down()
    if(tl > 8) return "left"
    if(tr > 8) return "right"
    if(tu > 2) return "up"
    if(td > 2) return "down"
    return
  }
}





const s = new spots;
window.addEventListener("load", function (e) {
  var p = document.getElementById("log")
  p.innerHTML = ""
  p.scrollTop = p.scrollHeight;
  var color = { r: 240, g: 100, b: 100 };
  var slider = document.getElementById("tolerance");
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var webcam = document.getElementById('webcam');
  var swatch = document.getElementById("color");
  tracking.ColorTracker.registerColor('dynamic', function (r, g, b) {
    return getColorDistance(color, { r: r, g: g, b: b }) < slider.value
  });
  var tracker = new tracking.ColorTracker("dynamic");
  tracker.on('track', function (e) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (e.data.length !== 0) {
      e.data.forEach(function (rect) {
        drawRect(rect, context, color);
      });
    }
  });
  tracking.track(webcam, tracker, { camera: true });
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
  return { r: pixel[0], g: pixel[1], b: pixel[2] };
}
i = 0
function drawRect(rect, context, color) {
  context.strokeStyle = "rgb(" + color.r + ", " + color.g + ", " + color.b + ")";
  context.fillRect((rect.x + (rect.width) / 2), (rect.y + (rect.height) / 2), 6, 6);
  context.strokeRect(rect.x, rect.y, rect.width, rect.height);
  s.store(rect.x + (rect.width) / 2, rect.y + (rect.height) / 2)
}
setInterval(function () {
  dir(s.direction())
}, 10)
