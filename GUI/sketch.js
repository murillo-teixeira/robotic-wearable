// Create WebSocket connection.
const socket = new WebSocket('ws://localhost:8765');
let connection_started = false
let data = null
let button;
let state_ahead = [0, 0];
let state_still = [0, 0];
let state_behind = [0, 0];

// Connection opened
socket.addEventListener('open', function (event) {
  connection_started = true  
  console.log("oi");
});

// Listen for messages
socket.addEventListener('message', function (event) {
  data = JSON.parse(event.data);
  // console.log(event.data)
});

let p;

function setup() {
  createCanvas(600, 600, WEBGL);
  button_still = createButton('still');
  button_still.position(0, 0);
  button_still.mousePressed(define_still);

  button_ahead = createButton('go ahead');
  button_ahead.position(50, 0);
  button_ahead.mousePressed(define_ahead);
  
  p = createP('oi');
  p.style('font-size', '22px');
  p.position(10, 0);
}

function define_ahead() {
  console.log('definig_ahead');
  state_ahead = [data.pitch, data.roll];
}

function define_still() {
  console.log('definig_still');
  state_ahead = [data.pitch, data.roll];
}

function draw() {
  background(255);
  if (data) {
    p.html(`pitch: ${data.pitch.toFixed(2)} <br/> roll: ${data.roll.toFixed(2)} <br/>  yaw: ${data.yaw.toFixed(2)}`)
  }
  
  // printAxis()
  if (connection_started && data) {
    // console.log('Message from server ', data.pitch, data.roll, data.yaw);
    push();
    translate(0, 0, 0);
    ambientLight(255);
    specularMaterial(255, 0, 0)
    rotateZ(radians(data.pitch));
    rotateX(radians(data.roll));
    cylinder(10, 400);
    pop();
    
    const current_state = [data.pitch, data.roll];
    // Calculate distance from current state, stata_ahead and state_still
    const dist_ahead = dist(current_state[0], current_state[1], state_ahead[0], state_ahead[1]);
    const dist_still = dist(current_state[0], current_state[1], state_still[0], state_still[1]);
    // compare distances and see if it is closer to ahead or still
    if (dist_ahead < dist_still) {
      console.log('ahead');
    } else {
      console.log('still');
    }
  }
}
