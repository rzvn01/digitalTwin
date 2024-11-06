function checkAndActivateSnow() {
	// Check if "snow.css" is present in the document
	const snowCSS = Array.from(document.styleSheets).some(sheet =>
	  sheet.href && sheet.href.includes("snow.css")
	);
   
	// If "snow.css" is applied, add the canvas element and start snow animation
	if (snowCSS) {
	  let canvas = document.getElementById("canvas");
	 
	  // Create the canvas element if it doesn't already exist
	  if (!canvas) {
		canvas = document.createElement("canvas");
		canvas.id = "canvas";
		document.body.appendChild(canvas);
	  }
	 
	  // Activate the snow effect
	  activateSnow();
	} else {
	  // If "snow.css" is not applied, remove the canvas if it exists
	  const existingCanvas = document.getElementById("canvas");
	  if (existingCanvas) {
		existingCanvas.remove();
	  }
	}
  }
   
  // Function to activate the snow effect
  function activateSnow() {
	const canvas = document.getElementById("canvas");
	const ctx = canvas.getContext("2d");
   
	const flakes = [];
	const flakeCount = 200;
	let mX = -100, mY = -100;
   
	// Set the canvas to cover the full viewport
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
   
	// Adjust the canvas size on window resize
	window.addEventListener("resize", () => {
	  canvas.width = window.innerWidth;
	  canvas.height = window.innerHeight;
	});
   
	// Mouse movement to add interactivity
	window.addEventListener("mousemove", (e) => {
	  mX = e.clientX;
	  mY = e.clientY;
	});
   
	// Initialize snowflakes
	for (let i = 0; i < flakeCount; i++) {
	  flakes.push({
		x: Math.random() * canvas.width,
		y: Math.random() * canvas.height,
		size: (Math.random() * 3) + 2,
		speed: (Math.random() * 1) + 0.5,
		opacity: (Math.random() * 0.5) + 0.3,
		velX: 0,
		velY: 0
	  });
	}
   
	// Reset flake position when it goes off screen
	function resetFlake(flake) {
	  flake.x = Math.floor(Math.random() * canvas.width);
	  flake.y = 0;
	  flake.size = (Math.random() * 3) + 2;
	  flake.speed = (Math.random() * 1) + 0.5;
	  flake.velY = flake.speed;
	  flake.opacity = (Math.random() * 0.5) + 0.3;
	}
   
	// Snow animation
	function snowAnimation() {
	  ctx.clearRect(0, 0, canvas.width, canvas.height);
   
	  flakes.forEach((flake) => {
		// Calculate distance from mouse for gravity effect
		const dist = Math.sqrt((flake.x - mX) * (flake.x - mX) + (flake.y - mY) * (flake.y - mY));
		const minDist = 150;
   
		// Apply gravity effect if flake is close to the mouse
		if (dist < minDist) {
		  const force = minDist / (dist * dist);
		  const xcomp = (mX - flake.x) / dist;
		  const ycomp = (mY - flake.y) / dist;
		  const deltaV = force / 2;
		  flake.velY -= deltaV * ycomp;
		} else {
		  flake.velY = Math.min(flake.velY, flake.speed);
		  flake.velY += 0.02;
		}
   
		flake.y += flake.velY;
		flake.x += flake.velX;
   
		// Reset flake if it goes off screen
		if (flake.y >= canvas.height || flake.x >= canvas.width || flake.x <= 0) {
		  resetFlake(flake);
		}
   
		// Draw the flake
		ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
		ctx.beginPath();
		ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
		ctx.fill();
	  });
   
	  requestAnimationFrame(snowAnimation);
	}
   
	snowAnimation(); // Start the animation
  }


  const root = document.documentElement;
  const style = document.getElementById('style-direction');
  onload = () => {
	setTimeout(() => document.body.classList.remove("not-loaded"), 1000);
  };
   
  let temperatureValues = [];
  let humidityValues = [];
  let pressureValues = [];
  let moistureValues = [];
  let lightIntensityValues = [];
   

  $(document).ready(() => {
    console.log("Document is ready, initiating data fetch.");
    fetchData(); // Fetch data once on load
    setInterval(fetchData, 5000); // Set up regular fetching every 5 seconds
});

  function fetchData() {
	const url = 'https://api.thingspeak.com/channels/2364561/feeds.json?results=1';
	$.ajax({
	  url: url,
	  type: 'GET',
	  contentType: "application/json",
	  success: function(data) {
		console.log("Data fetched successfully:", data);
		const latestFeed = data.feeds[data.feeds.length - 1];
		if (style) {
			console.log(latestFeed.field1);
			console.log(latestFeed.field2);
			console.log(latestFeed.field3);
			console.log(latestFeed.field4);
			console.log(latestFeed.field5);
			// Convert field values to integers for comparison
			const field1Int = parseInt(latestFeed.field1.split(".")[0], 10);
			const field2Int = parseInt(latestFeed.field2.split(".")[0], 10);
			const field4Int = parseInt(latestFeed.field4.split(".")[0], 10);
			const field5Int = parseInt(latestFeed.field5.split(".")[0], 10);
			
			var tableRows = document.querySelectorAll("#data_table tbody tr");

			tableRows[0].children[1].textContent = `${field1Int}`;
  			tableRows[1].children[1].textContent = `${field5Int}`;
  			tableRows[2].children[1].textContent = `${field2Int}`;
  			tableRows[3].children[1].textContent = `${field4Int}`;
			
			if (field5Int > 50) {
				style.href = 'light.css';
			} else {
				style.href = 'dark.css';
			}

			if (field2Int > 50) {
				const link = document.createElement('link'); // Create a new link element
				link.rel = 'stylesheet'; // Set the relationship to "stylesheet"
				link.href = 'rain.css'; // Set the href to the CSS file path
				document.head.appendChild(link);
				checkAndActivateRain();
				tableRows[2].style.backgroundColor = 'red';
			} 

			if (field4Int < 0) {
				const link = document.createElement('link'); // Create a new link element
				link.rel = 'stylesheet'; // Set the relationship to "stylesheet"
				link.href = 'moist.css'; // Set the href to the CSS file path
				document.head.appendChild(link);
				tableRows[3].style.backgroundColor = 'red';
			} 

		  	if (field1Int > 25) {
				const link = document.createElement('link'); // Create a new link element
				link.rel = 'stylesheet'; // Set the relationship to "stylesheet"
				link.href = 'fire.css'; // Set the href to the CSS file path
				document.head.appendChild(link);
				tableRows[0].style.backgroundColor = 'red';
			}
		  	if(field1Int < 10)  {
				const link = document.createElement('link'); // Create a new link element
				link.rel = 'stylesheet'; // Set the relationship to "stylesheet"
				link.href = 'snow.css'; // Set the href to the CSS file path
				document.head.appendChild(link);
				tableRows[0].style.backgroundColor = 'red';
		  	}

		} else {
		  console.warn("Element with id 'style-direction' not found.");
		}
	  },
	  error: function() {
		console.error("Error fetching data.");
	  }
	});
  }
   
   
   
   
  // Falling rain simulation using 2D canvas
  // - vanilla JS, no frameworks
  // - framerate independent physics
  // - slow-mo / fast-forward support via demo.speed
  // - supports high-DPI screens
  // - falling rain particles are drawn as vector lines
  // - splash particles are lazily pre-rendered so gradients aren't computed each frame
  // - all particles make use of object pooling to further boost performance
   
  function checkAndActivateRain() {
	// Check if "snow.css" is present in the document
	const rainCSS = Array.from(document.styleSheets).some(sheet =>
	  sheet.href && sheet.href.includes("rain.css")
	);
   
	// If "rain.css" is applied, add the canvas element and start snow animation
	if (rainCSS) {
	  let canvas = document.getElementById("canvas");
	 
	  // Create the canvas element if it doesn't already exist
	  if (!canvas) {
		canvas = document.createElement("canvas");
		canvas.id = "canvas";
		document.body.appendChild(canvas);
	  }
	 
	  // Activate the rain effect
	  activateRain();
	} else {
	  // If "rain.css" is not applied, remove the canvas if it exists
	  const existingCanvas = document.getElementById("canvas");
	  if (existingCanvas) {
		existingCanvas.remove();
	  }
	}
  }
   
   
   
  // demo namespace
  var demo = {
	// CUSTOMIZABLE PROPERTIES
	// - physics speed multiplier: allows slowing down or speeding up simulation
	speed: 1,
	// - color of particles
	color: {
	  r: '80',
	  g: '175',
	  b: '255',
	  a: '0.5'
	},
   
	// END CUSTOMIZATION
	// whether demo is running
	started: false,
	// canvas and associated context references
	canvas: null,
	ctx: null,
	// viewport dimensions (DIPs)
	width: 0,
	height: 0,
	// devicePixelRatio alias (should only be used for rendering, physics shouldn't care)
	dpr: window.devicePixelRatio || 1,
	// time since last drop
	drop_time: 0,
	// ideal time between drops (changed with mouse/finger)
	drop_delay: 25,
	// wind applied to rain (changed with mouse/finger)
	wind: 4,
	// color of rain (set in init)
	rain_color: null,
	rain_color_clear: null,
	// rain particles
	rain: [],
	rain_pool: [],
	// rain droplet (splash) particles
	drops: [],
	drop_pool: []
  };
   
  // demo initialization (should only run once)
  demo.init = function() {
	if (!demo.started) {
	  demo.started = true;
	  demo.canvas = document.getElementById('canvas');
	  demo.ctx = demo.canvas.getContext('2d');
	  var c = demo.color;
	  demo.rain_color = 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + c.a + ')';
	  demo.rain_color_clear = 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',0)';
	  demo.resize();
	  Ticker.addListener(demo.step);
	 
	  //
	  const gui = new dat.GUI();
	  gui.add(demo, 'speed', 0.2, 2);
	 
	  // fade out instructions after a few seconds
	  var instructions = document.getElementById('instructions');
	  setTimeout(function() {
		instructions.style.opacity = 0;
		setTimeout(function(){
		  instructions.parentNode.removeChild(instructions);
		}, 2000);
	  }, 4000);
	}
  }
   
  // (re)size canvas (clears all particles)
  demo.resize = function() {
	// localize common references
	var rain = demo.rain;
	var drops = demo.drops;
	// recycle particles
	for (var i = rain.length - 1; i >= 0; i--) {
		rain.pop().recycle();
	}
	for (var i = drops.length - 1; i >= 0; i--) {
		drops.pop().recycle();
	}
	// resize
	demo.width = window.innerWidth;
	demo.height = window.innerHeight;
	demo.canvas.width = demo.width * demo.dpr;
	demo.canvas.height = demo.height * demo.dpr;
  }
   
  demo.step = function(time, lag) {
	// localize common references
	var demo = window.demo;
	var speed = demo.speed;
	var width = demo.width;
	var height = demo.height;
	var wind = demo.wind;
	var rain = demo.rain;
	var rain_pool = demo.rain_pool;
	var drops = demo.drops;
	var drop_pool = demo.drop_pool;
   
	// multiplier for physics
	var multiplier = speed ;
   
	// spawn drops
	demo.drop_time += time * speed;
	while (demo.drop_time > demo.drop_delay) {
	  demo.drop_time -= demo.drop_delay;
	  var new_rain = rain_pool.pop() || new Rain();
	  new_rain.init();
	  var wind_expand = Math.abs(height / new_rain.speed * wind); // expand spawn width as wind increases
	  var spawn_x = Math.random() * (width + wind_expand);
	  if (wind > 0) spawn_x -= wind_expand;
	  new_rain.x = spawn_x;
	  rain.push(new_rain);
	}
   
	// rain physics
	for (var i = rain.length - 1; i >= 0; i--) {
	  var r = rain[i];
	  r.y += r.speed * r.z * multiplier;
	  r.x += r.z * wind * multiplier;
	  // remove rain when out of view
	  if (r.y > height) {
		// if rain reached bottom of view, show a splash
		r.splash();
	  }
	  // recycle rain
	  if (r.y > height + Rain.height * r.z || (wind < 0 && r.x < wind) || (wind > 0 && r.x > width + wind)) {
		r.recycle();
		rain.splice(i, 1);
	  }
	}
   
	// splash drop physics
	var drop_max_speed = Drop.max_speed;
	for (var i = drops.length - 1; i >= 0; i--) {
	  var d = drops[i];
	  d.x += d.speed_x * multiplier;
	  d.y += d.speed_y * multiplier;
	  // apply gravity - magic number 0.3 represents a faked gravity constant
	  d.speed_y += 0.3 * multiplier;
	  // apply wind (but scale back the force)
	  d.speed_x += wind / 25 * multiplier;
	  if (d.speed_x < -drop_max_speed) {
		d.speed_x = -drop_max_speed;
	  }else if (d.speed_x > drop_max_speed) {
		d.speed_x = drop_max_speed;
	  }
	  // recycle
	  if (d.y > height + d.radius) {
		d.recycle();
		drops.splice(i, 1);
	  }
	}
   
	demo.draw();
  }
   
  demo.draw = function() {
	// localize common references
	var demo = window.demo;
	var width = demo.width;
	var height = demo.height;
	var dpr = demo.dpr;
	var rain = demo.rain;
	var drops = demo.drops;
	var ctx = demo.ctx;
   
	// start fresh
	ctx.clearRect(0, 0, width*dpr, height*dpr);
   
	// draw rain (trace all paths first, then stroke once)
	ctx.beginPath();
	var rain_height = Rain.height * dpr;
	for (var i = rain.length - 1; i >= 0; i--) {
	  var r = rain[i];
	  var real_x = r.x * dpr;
	  var real_y = r.y * dpr;
	  ctx.moveTo(real_x, real_y);
	  // magic number 1.5 compensates for lack of trig in drawing angled rain
	  ctx.lineTo(real_x - demo.wind * r.z * dpr * 1.5, real_y - rain_height * r.z);
	}
	ctx.lineWidth = Rain.width * dpr;
	ctx.strokeStyle = demo.rain_color;
	ctx.stroke();
   
	// draw splash drops (just copy pre-rendered canvas)
	for (var i = drops.length - 1; i >= 0; i--) {
	  var d = drops[i];
	  var real_x = d.x * dpr - d.radius;
	  var real_y = d.y * dpr - d.radius;
	  ctx.drawImage(d.canvas, real_x, real_y);
	}
  }
   
   
  // Rain definition
  function Rain() {
	this.x = 0;
	this.y = 0;
	this.z = 0;
	this.speed = 25;
	this.splashed = false;
  }
  Rain.width = 2;
  Rain.height = 40;
  Rain.prototype.init = function() {
	this.y = Math.random() * -100;
	this.z = Math.random() * 0.5 + 0.5;
	this.splashed = false;
  }
  Rain.prototype.recycle = function() {
	demo.rain_pool.push(this);
  }
  // recycle rain particle and create a burst of droplets
  Rain.prototype.splash = function() {
	if (!this.splashed) {
	  this.splashed = true;
	  var drops = demo.drops;
	  var drop_pool = demo.drop_pool;
   
	  for (var i=0; i<16; i++) {
		var drop = drop_pool.pop() || new Drop();
		drops.push(drop);
		drop.init(this.x);
	  }
	}
  }
   
   
  // Droplet definition
  function Drop() {
	this.x = 0;
	this.y = 0;
	this.radius = Math.round(Math.random() * 2 + 1) * demo.dpr;
	this.speed_x = 0;
	this.speed_y = 0;
	this.canvas = document.createElement('canvas');
	this.ctx = this.canvas.getContext('2d');
   
	// render once and cache
	var diameter = this.radius * 2;
	this.canvas.width = diameter;
	this.canvas.height = diameter;
   
	var grd = this.ctx.createRadialGradient(this.radius, this.radius , 1, this.radius, this.radius, this.radius);
	grd.addColorStop(0, demo.rain_color);
	grd.addColorStop(1, demo.rain_color_clear);
	this.ctx.fillStyle = grd;
	this.ctx.fillRect(0, 0, diameter, diameter);
  }
   
  Drop.max_speed = 5;
   
  Drop.prototype.init = function(x) {
	this.x = x;
	this.y = demo.height;
	var angle = Math.random() * Math.PI - (Math.PI * 0.5);
	var speed = Math.random() * Drop.max_speed;
	this.speed_x = Math.sin(angle) * speed;
	this.speed_y = -Math.cos(angle) * speed;
  }
  Drop.prototype.recycle = function() {
	demo.drop_pool.push(this);
  }
   
   

   
  // Frame ticker helper module
  var Ticker = (function(){
	var PUBLIC_API = {};
   
	// public
	// will call function reference repeatedly once registered, passing elapsed time and a lag multiplier as parameters
	PUBLIC_API.addListener = function addListener(fn) {
	  if (typeof fn !== 'function') throw('Ticker.addListener() requires a function reference passed in.');
   
	  listeners.push(fn);
   
	  // start frame-loop lazily
	  if (!started) {
		started = true;
		queueFrame();
	  }
	};
   
	// private
	var started = false;
	var last_timestamp = 0;
	var listeners = [];
	// queue up a new frame (calls frameHandler)
	function queueFrame() {
	  if (window.requestAnimationFrame) {
		requestAnimationFrame(frameHandler);
	  } else {
		webkitRequestAnimationFrame(frameHandler);
	  }
	}
	function frameHandler(timestamp) {
	  var frame_time = timestamp - last_timestamp;
	  last_timestamp = timestamp;
	  // make sure negative time isn't reported (first frame can be whacky)
	  if (frame_time < 0) {
		frame_time = 17;
	  }
	  // - cap minimum framerate to 15fps[~68ms] (assuming 60fps[~17ms] as 'normal')
	  else if (frame_time > 68) {
		frame_time = 68;
	  }
   
	  // fire custom listeners
	  for (var i = 0, len = listeners.length; i < len; i++) {
		listeners[i].call(window, frame_time, frame_time / 16.67);
	  }
	 
	  // always queue another frame
	  queueFrame();
	}
   
	return PUBLIC_API;
  }());
// Function to activate the rain effect
function activateRain() {
	const canvas = document.getElementById("canvas");
	const ctx = canvas.getContext("2d");
  
	// Rain configuration
	const rainConfig = {
	  speed: 5, // Speed of the raindrops
	  color: {
		r: 80,
		g: 175,
		b: 255,
		a: 0.5
	  },
	  width: window.innerWidth,
	  height: window.innerHeight,
	  dpr: window.devicePixelRatio || 1,
	  raindrops: [],
	  dropInterval: 25, // Interval in milliseconds between raindrop creation
	};
  
	// Resize canvas to fit viewport
	function resizeCanvas() {
	  rainConfig.width = window.innerWidth;
	  rainConfig.height = window.innerHeight;
	  canvas.width = rainConfig.width * rainConfig.dpr;
	  canvas.height = rainConfig.height * rainConfig.dpr;
	  ctx.scale(rainConfig.dpr, rainConfig.dpr);
	}
  
	// Raindrop class
	class Raindrop {
	  constructor(x, y, length, speed) {
		this.x = x;
		this.y = y;
		this.length = length;
		this.speed = speed;
	  }
  
	  update() {
		this.y += this.speed;
		if (this.y > rainConfig.height) {
		  this.y = -this.length;
		}
	  }
  
	  draw() {
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.x, this.y + this.length);
		ctx.strokeStyle = `rgba(${rainConfig.color.r}, ${rainConfig.color.g}, ${rainConfig.color.b}, ${rainConfig.color.a})`;
		ctx.lineWidth = 2;
		ctx.stroke();
	  }
	}
  
	// Create raindrops at intervals
	function createRaindrops() {
	  const x = Math.random() * rainConfig.width;
	  const length = Math.random() * 20 + 10;
	  const speed = rainConfig.speed;
	  const raindrop = new Raindrop(x, -length, length, speed);
	  rainConfig.raindrops.push(raindrop);
	}
  
	// Animation loop
	function animate() {
	  ctx.clearRect(0, 0, rainConfig.width, rainConfig.height);
	  rainConfig.raindrops.forEach((raindrop) => {
		raindrop.update();
		raindrop.draw();
	  });
	  requestAnimationFrame(animate);
	}
  
	// Initialize rain effect
	function initRain() {
	  resizeCanvas();
	  setInterval(createRaindrops, rainConfig.dropInterval);
	  animate();
	}
  
	// Start the rain effect
	initRain();
	window.addEventListener("resize", resizeCanvas);
  }
  