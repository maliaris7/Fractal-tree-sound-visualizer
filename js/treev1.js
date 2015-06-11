var red, green, blue, random, flag, depth_method;
var ctx, source, context, analyser, fbc_array;
var elem = document.getElementById('canvas');
var context_render = elem.getContext('2d');
var tree = [];
var tx1 = 0,
  tx2 = 0,
  ty1 = 0,
  ty2 = 0;
var branch = 0;
var deg_to_rad = Math.PI / 180.0;
var depth = 17;

depth_method = false;
red = false;
blue = false;
green = false;
random = true;
flag = true;
context_render.lineWidth = 1;

audio_file.onchange = function() {
  var files = this.files;
  var file = URL.createObjectURL(files[0]);
  audio_player.src = file;
  audio_player.loop = true;
  audio_player.play();
  initAudio();
};

function calcTree(x1, y1, angle, depth) {
  if (depth != 0) {
    var x2 = x1 + (Math.cos(angle * deg_to_rad) * depth * 3.0);
    var y2 = y1 + (Math.sin(angle * deg_to_rad) * depth * 3.0);

    tree.push({
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2,
      depth: depth,
    });

    calcTree(x2, y2, angle - Math.abs(45 - depth), depth - 1);
    calcTree(x2, y2, angle + Math.abs(45 - depth), depth - 1);
  }
  return true;
}

function reaarengeTree() {
  var size = tree.length;
  var temp_arr = [];

  for (j = 0; j <= depth; j++) {

    for (i = 0; i < tree.length; i++) {

      if (tree[i].depth == j) {
        temp_arr.push({
          x1: tree[i].x1,
          y1: tree[i].y1,
          x2: tree[i].x2,
          y2: tree[i].y2,
          depth: tree[i].depth
        });
      }
    }
  }
  return temp_arr;
}

function initAudio() {

  document.getElementById('audio_player');
  context = new AudioContext();
  analyser = context.createAnalyser();
  source = context.createMediaElementSource(audio_player);
  source.connect(analyser);
  analyser.connect(context.destination);
  analyser.fftSize = 32;
  console.log(audio_player.duration);
  console.log(analyser.minDecibels);
  console.log(analyser.maxDecibels);

  calcTree(800, 600, -90, depth);

  if (!depth_method) {
    tree = reaarengeTree();
    tree.reverse();
  }

  var end = setInterval(function drawtree() {

    var tcolor = '';
    tx1 = tree[branch].x1;
    ty1 = tree[branch].y1;
    tx2 = tree[branch].x2;
    ty2 = tree[branch].y2;

    fbc_array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(fbc_array);

    context_render.beginPath();
    context_render.moveTo(tx1, ty1);
    context_render.lineTo(tx2, ty2);
    context_render.closePath();

    if (red) {
      r = fbc_array[1];
      g = fbc_array[10];
      b = fbc_array[15];
    } else if (green) {
      r = fbc_array[10];
      g = fbc_array[1];
      b = fbc_array[15];
    } else if (blue) {
      r = fbc_array[15];
      g = fbc_array[10];
      b = fbc_array[1];
    } else if (random) {
      if (flag) {
        rand1 = Math.floor((Math.random() * 15) + 1)
        rand2 = Math.floor((Math.random() * 15) + 1)
        rand3 = Math.floor((Math.random() * 15) + 1)
        flag = false;
      }
      r = fbc_array[rand1];
      g = fbc_array[rand2];
      b = fbc_array[rand3];
    }

    tcolor = "rgba(" + r + "," + g + "," + b + ",0.2)";
    context_render.strokeStyle = tcolor;
    context_render.stroke();

    branch = branch + 1;

    if (branch > tree.length - 1) {
      clearInterval(end);
    }
  }, 0);
}

function change_c(clr) {

  if (clr == "blue") {
    blue = true;
    red = false;
    green = false;
    random = false;
  } else if (clr == "red") {
    red = true;
    green = false;
    blue = false;
    random = false;
  } else if (clr == "green") {
    green = true;
    blue = false;
    red = false;
    random = false;
  } else {
    flag = true;
    random = true;
    blue = false;
    red = false;
    green = false;
  }
}

function change_render(selection) {

  if (selection == "depth") {
    depth_method = true;
  } else {
    depth_method = false;
  }

}

/***********JQUERY*************/

$("button").click(function() {
  if (!$(this).hasClass("active")) {
    $(this).addClass("active");
    if ($(this).text() == "red") {
      if ($("#blue").hasClass("active")) {
        $("#blue").removeClass("active");
      } else if ($("#green").hasClass("active")) {
        $("#green").removeClass("active");
      } else {
        $("#random").removeClass("active");
      }
    } else if ($(this).text() == "green") {
      if ($("#blue").hasClass("active")) {
        $("#blue").removeClass("active");
      } else if ($("#red").hasClass("active")) {
        $("#red").removeClass("active");
      } else {
        $("#random").removeClass("active");
      }
    } else if ($(this).text() == "blue") {
      if ($("#red").hasClass("active")) {
        $("#red").removeClass("active");
      } else if ($("#green").hasClass("active")) {
        $("#green").removeClass("active");
      } else {
        $("#random").removeClass("active");
      }
    } else if ($(this).text() == "random") {
      if ($("#blue").hasClass("active")) {
        $("#blue").removeClass("active");
      } else if ($("#red").hasClass("active")) {
        $("#red").removeClass("active");
      } else if ($("#green").hasClass("active")) {
        $("#green").removeClass("active");
      }
    } else if ($(this).text() == "draw depth first") {
      if ($("#layer").hasClass("active")) {
        $("#layer").removeClass("active");
      }
    } else {
      if ($("#depth").hasClass("active")) {
        $("#depth").removeClass("active");
      }
    }

  }
});