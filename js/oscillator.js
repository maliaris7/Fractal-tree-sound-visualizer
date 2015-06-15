var alpha = 1;
var Gamma = 0.80;
var IntensityMax = 255;
var fade = false;
var spectrum = [];

var audio = new Audio();
audio_file.onchange = function() {
  var files = this.files;
  var file = URL.createObjectURL(files[0]);
  audio_player.src = file;
  audio_player.play();
  draw();
};

document.getElementById('audio_player');
context = new AudioContext(); // AudioContext object instance
var analyser = context.createAnalyser(); // AnalyserNode method

var source = context.createMediaElementSource(audio_player);
source.connect(analyser);
analyser.connect(context.destination);

var c = document.getElementById("myCanvas");
var canvasCtx = c.getContext("2d");

analyser.smoothingTimeConstant = 1;

analyser.fftSize = 2048;
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);
analyser.getByteTimeDomainData(dataArray);

/** Taken from Earl F. Glynn's web page:
 http://www.efg2.com/Lab/ScienceAndEngineering/Spectra.html
 * */
function waveLengthToRGB(Wavelength) {

  var factor;
  var Red, Green, Blue;

  if ((Wavelength >= 380) && (Wavelength < 440)) {
    Red = -(Wavelength - 440) / (440 - 380);
    Green = 0.0;
    Blue = 1.0;
  } else if ((Wavelength >= 440) && (Wavelength < 490)) {
    Red = 0.0;
    Green = (Wavelength - 440) / (490 - 440);
    Blue = 1.0;
  } else if ((Wavelength >= 490) && (Wavelength < 510)) {
    Red = 0.0;
    Green = 1.0;
    Blue = -(Wavelength - 510) / (510 - 490);
  } else if ((Wavelength >= 510) && (Wavelength < 580)) {
    Red = (Wavelength - 510) / (580 - 510);
    Green = 1.0;
    Blue = 0.0;
  } else if ((Wavelength >= 580) && (Wavelength < 645)) {
    Red = 1.0;
    Green = -(Wavelength - 645) / (645 - 580);
    Blue = 0.0;
  } else if ((Wavelength >= 645) && (Wavelength < 781)) {
    Red = 1.0;
    Green = 0.0;
    Blue = 0.0;
  } else {
    Red = 0.0;
    Green = 0.0;
    Blue = 0.0;
  };

  // Let the intensity fall off near the vision limits

  if ((Wavelength >= 380) && (Wavelength < 420)) {
    factor = 0.3 + 0.7 * (Wavelength - 380) / (420 - 380);
  } else if ((Wavelength >= 420) && (Wavelength < 701)) {
    factor = 1.0;
  } else if ((Wavelength >= 701) && (Wavelength < 781)) {
    factor = 0.3 + 0.7 * (780 - Wavelength) / (780 - 700);
  } else {
    factor = 0.0;
  };

  var rgb = [];

  // Don't want 0^x = 1 for x <> 0
  rgb[0] = Red == 0.0 ? 0 : Math.round(IntensityMax * Math.pow(Red * factor, Gamma));
  rgb[1] = Green == 0.0 ? 0 : Math.round(IntensityMax * Math.pow(Green * factor, Gamma));
  rgb[2] = Blue == 0.0 ? 0 : Math.round(IntensityMax * Math.pow(Blue * factor, Gamma));

  return rgb;
}



for (var i = 0; i < 310; i++) {
  spectrum[i] = waveLengthToRGB(390 + i);
}

function change_fade(option) {

  if (option == "on") {
    alpha = 0.1;
  } else {
    alpha = 1;
  }

}

function draw() {

  WIDTH = 1024;
  HEIGHT = 300;
  drawVisual = requestAnimationFrame(draw);

  analyser.getByteTimeDomainData(dataArray);
  canvasCtx.fillStyle = "rgba(0,0,0," + alpha + ")";
  canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

  canvasCtx.lineWidth = 1;

  canvasCtx.beginPath();

  var sliceWidth = WIDTH * 1.0 / bufferLength;
  var x = 0;

  for (var i = 0; i < bufferLength; i++) {

    var v = dataArray[i] / 128.0;
    var y = v * HEIGHT / 2;
    if (i === 0) {
      canvasCtx.moveTo(x, y);

    } else {
      canvasCtx.lineTo(x, y);
      canvasCtx.strokeStyle = 'rgb(' + spectrum[Math.round(1.2 * dataArray[i])][0] + ',' + spectrum[Math.round(1.2 * dataArray[i])][1] + ',' + spectrum[Math.round(1.2 * dataArray[i])][2] + ')';
    }

    x += sliceWidth;
  }

  canvasCtx.lineTo(1027, 150);
  canvasCtx.stroke();
};

$("button").click(function() {
  if (!$(this).hasClass("active")) {
    $(this).addClass("active");
    if ($(this).text() == "on") {
      if ($("#fade_off").hasClass("active")) {
        $("#fade_off").removeClass("active");
      }
    } else if ($(this).text() == "off") {
      if ($("#fade_on").hasClass("active")) {
        $("#fade_on").removeClass("active");
      }
    }
  }
});