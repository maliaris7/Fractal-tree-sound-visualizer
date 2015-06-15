//variables used for user options
var red, green, blue, flag, symmetry;

flag = true;
red = true;
blue = false;
green = false;
random = false;
symmetry = false;
//variables used for render of tree
var elem = document.getElementById('mycanvas');
var context1 = elem.getContext('2d');
var tx1 = 0,tx2 = 0,ty1 = 0, ty2 = 0;
var layer = 0;
var branch = 0;
context1.lineWidth = 1;
var deg_to_rad = Math.PI / 180.0;
//tree depth 
var depth = 20;

var  ctx, source, context, analyser, fbc_array;
//load audio
audio_file.onchange = function(){
    var files = this.files;
    var file = URL.createObjectURL(files[0]); 
    audio_player.src = file; 
	audio_player.loop = true;
    audio_player.play();
	initMp3Player();
};
//user colour settings function
function change_c(clr){

	if(clr == "blue"){
		blue =true;
		red = false;
		green = false;
		random = false;
	}
	else if(clr == "red"){
		red = true;
		green = false;
		blue = false;
		random = false;
	}
	else if(clr == "green"){
		green = true;
		blue = false;
		red = false;
		random = false;
	}
	else{
		random = true;
		blue = false;
		red = false;
		green = false;
		flag = true;
	}
}
//user angle settings function
function change_sym(choise){
	if(choise == "symmetry"){
		symmetry = true;
	}else{
		symmetry = false;
	}

}
//recursive calculation and rendering of tree
function calcTree(x1, y1, angle, depth){
	if (depth != 0){
		var x2 = x1 + (Math.cos(angle * deg_to_rad) * depth * 3.0);
		var y2 = y1 + (Math.sin(angle * deg_to_rad) * depth * 3.0);
		var tcolor = '';
		var temp_angle;
		var cornerRadius = 50;
		context1.beginPath();
		context1.moveTo(x1, y1);
		context1.lineTo(x2, y2);
		context1.closePath();
		context1.stroke();
		fbc_array = new Uint8Array(analyser.frequencyBinCount);
		analyser.getByteFrequencyData(fbc_array);
		//user pre-sets options for angle calculation 
		if(symmetry){
			temp_angle = 12;
		}else{
			temp_angle = fbc_array[1]%20;
		}
		//user pre-sets options for frequency bin assignment to each rgb colour 
		if(red){
			r = fbc_array[1];
			g = fbc_array[10];
			b = fbc_array[15];
		}else if(green){
			r = fbc_array[10];
			g = fbc_array[1];
			b = fbc_array[15];
		}else if(blue){
			r = fbc_array[15];
			g = fbc_array[10];
			b = fbc_array[1];
		}else if(random){
			if(flag){
				rand1 = Math.floor((Math.random() * 15) + 1)
				rand2 = Math.floor((Math.random() * 15) + 1)
				rand3 = Math.floor((Math.random() * 15) + 1)
				flag = false;
			}
		r = fbc_array[rand1];
		g = fbc_array[rand2];
		b = fbc_array[rand3];
		}
		//colourize the branch according to the decibel level of the frequency bin assigned to each rgb value
		tcolor = "rgba("+r+","+g+","+b+",0.2)";
		context1.strokeStyle = tcolor;
		setTimeout(function(){ 
		calcTree(x2, y2, angle - temp_angle, depth - 1)}, 500);
		setTimeout(function(){ 
		calcTree(x2, y2, angle + temp_angle, depth - 1)}, 500);
		
	
	}

}
//initialize audio and start rendering process 
function initMp3Player(){
	document.getElementById('audio_player');
	context = new AudioContext();
	analyser = context.createAnalyser(); 
	source = context.createMediaElementSource(audio_player); 
	source.connect(analyser);
	analyser.connect(context.destination);
	analyser.fftSize = 32;
	calcTree(800, 800, -90, depth)
}

//***********JQUERY*************//
//jquery used for button interactivity 	
$("button").click(function(){
	if(!$(this).hasClass("active")){
		$(this).addClass("active");
		if($(this).text() == "red"){
		if($("#blue").hasClass("active")){
			$("#blue").removeClass("active");
		}
		else if($("#green").hasClass("active")){
			$("#green").removeClass("active");
		}
		else{
			$("#random").removeClass("active");
			}
		}
		else if($(this).text() == "green"){
			if($("#blue").hasClass("active")){
				$("#blue").removeClass("active");
			}
			else if($("#red").hasClass("active")){
				$("#red").removeClass("active");
			}
			else{
				$("#random").removeClass("active");
			}
		}
		else if($(this).text() == "blue"){
			if($("#red").hasClass("active")){
				$("#red").removeClass("active");
			}
			else if($("#green").hasClass("active")){
				$("#green").removeClass("active");
			}
			else{
				$("#random").removeClass("active");
			}
		}
		else if($(this).text() == "random"){
			if($("#blue").hasClass("active")){
				$("#blue").removeClass("active");
			}
			else if($("#red").hasClass("active")){
				$("#red").removeClass("active");
			}
			else if($("#green").hasClass("active")){
				$("#green").removeClass("active");
			}
		}
		else if($(this).text() == "symmetry"){
			if($("#dynamic").hasClass("active")){
				$("#dynamic").removeClass("active");
			}
		}
		else{
			if($("#symmetry").hasClass("active")){
				$("#symmetry").removeClass("active");
			}
		}
				
	}
});