//Global variable containing WeatherAPI and MapAPI keys
let secret;

//Variable that will store the JSON file of the weather
let weather;

//Variables to construct URL
let weather_apiQ;
let weather_apiID;
let weather_units;

//Variable used for drawing the map on canvas
let map;

//Center coordinates
let clon = 0, clat = 0;

//DOM element variables
let input;
let button;

//Sets the zoom of the world map
let zoom = 1;

//Allows to freeze all locations asked
let saveFlag = 0;

async function firstLoad(data) {
	secret = data;

	let map_url = `https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/${clon},${clat},${zoom},0,0/1024x512?access_token=${secret.MapAPI}`;
	map = await loadImage(map_url);

	weather_apiQ = 'https://api.openweathermap.org/data/2.5/weather?q=';
	weather_apiID = `&APPID=${secret.WeatherAPI}`;
	weather_units = '&units=metric';
}

function setup() {
	createCanvas(1024, 512);

	//Loads secret.json file
	loadJSON('secret.json', firstLoad);
	
	input = select('#city');
	input.changed(weatherAsk)
	
  button = createButton('Mark Locations');
}

function draw() {
	//Changes saveFlag variable
  button.mousePressed(changeFlag);

	//New center is the center of canvas
  translate(width / 2, height / 2);
  imageMode(CENTER);

	//Only draws Map if it is loaded or if it is not freezed
  if (map && !saveFlag) 
		image(map, 0, 0);

	//If weather is loaded
  if (weather) {
		//Retrieve coordinates and temperature from weather variable
    let lon = weather.coord.lon;
    let lat = weather.coord.lat;
		let temp = weather.main.temp


		//Translate the given coordinates into mercator coordinates 
    let cx = mercX(clon);
    let cy = mercY(clat);
    let x = mercX(lon) - cx;
    let y = mercY(lat) - cy;
	
		//Drawing style
		let size = 6
    stroke(255, 255, 255);
    fill(255, 255, 255);
    
		//Drawing
    ellipse(x, y, size, size)
    text(temp + 'ºC', x + size, y - size)
    text(weather.name, x - 2*size, y + 2*size)
  }
}

function weatherAsk() {
	//Creates the Weather URL
  let weather_url = weather_apiQ + input.value() + weather_apiID + weather_units;
  loadJSON(weather_url, data => weather = data);
}

function changeFlag() {
  if(!saveFlag)
    button.html('Unmark Locations');
  else
     button.html('Mark Locations');
	saveFlag = !saveFlag;
}

//Mercator X-coordinate
function mercX(lon) {
	let a = (256 / PI) * pow(2, zoom);
	let b = radians(lon) + PI;
	return a * b;
}

//Mercator Y-coordinate
function mercY(lat) {
	let a = (256 / PI) * pow(2, zoom);
	let b = tan(PI / 4 + radians(lat) / 2);
	let c = PI - log(b);
	return a * c;
}
