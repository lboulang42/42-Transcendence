import * as THREE from '/media/three.module.js';
import { linearInterpolation} from "./pong_utils.js";

export default class Paddle {
    #render_height;
	#height;
	#width;
	#maxSpeed;
	#keys = [];
	#light;

	constructor(x, color, size_renderer) {                
    	this.#render_height = size_renderer.height;
    	this.#height = size_renderer.height / 5;
    	this.#width = 10;
    	this.#maxSpeed = size_renderer.height / 100;
    	this.geometry = new THREE.CapsuleGeometry(this.#width, this.#height, 16, 31);
    	this.material = new THREE.MeshPhongMaterial({color: color, side: THREE.DoubleSide});
    	this.mesh = new THREE.Mesh(this.geometry, this.material);
    	this.mesh.position.set(x, 0, 0);

		this.#light = new THREE.PointLight(color, 4, 350, 0);
		this.#light.position.set(x, 0, 0);

	}

	reset() {
		this.#light.position.y = 0;
		this.mesh.position.y = 0;
	}

	set_y(value) {
		let halfPaddleLength = this.halfLength;

		if (this.mesh.position.y + value - halfPaddleLength <= -(this.#render_height / 2)) {
			value = -(this.#render_height / 2);
			this.mesh.position.y = value + halfPaddleLength; // makes sure paddle doesnt go out of bounds for the top boundary
		} else if (this.mesh.position.y + value + halfPaddleLength >= this.#render_height / 2) {
			value = this.#render_height / 2;
			this.mesh.position.y = value - halfPaddleLength; // and bottom boundary
		} else {
			this.mesh.position.y += value; // within the boudaries so simply adds the value (amount by which its moved) the to the current y pos
		}
		this.#light.position.y = this.mesh.position.y; // light matches the position of the paddle 
	}

    rect() { // hitbox of the paddle
		return {
			top: this.mesh.position.y - this.#height / 2,
			bottom: this.mesh.position.y + this.#height / 2,
			left: this.mesh.position.x - this.#width / 2,
			right: this.mesh.position.x + this.#width / 2,
		}
	}

    get paddlePos() { // min mid max of the paddle
		return {
			min: this.mesh.position.y - this.halfLength,
			mid: this.mesh.position.y,
			max: this.mesh.position.y + this.halfLength,
		}
	}

    get halfLength() {
		return (this.rect().bottom - this.rect().top) / 2
	}

	get height() {
		return this.#height
	}

	get width() {
		return this.#width
	}

    linearInterpolationBounce(ballPos) { // different bounce angle depending on if it hits the top edge or bottom edge of the paddle
		let minBounceChange = -Math.PI / 6
		let maxBounceChange = Math.PI / 6
		return linearInterpolation(ballPos, this.paddlePos.min, minBounceChange, this.paddlePos.max, maxBounceChange)
		// calculates a bounce angle proportionnal to where the ball hits the paddle 
	}

    updateIA(heightCollision, size_renderer ) {
		if (heightCollision >= ((size_renderer.height / 2) - (this.#height/2)))
			heightCollision -= this.#height/2;
		if (heightCollision <= (-(size_renderer.height / 2) + (this.#height/2)))
			heightCollision += this.#height/2;
		// neg when ball is above, pos when below, bigger when far
		// if (((this.mesh.position.y + this.#height/2) <= size_renderer.height / 2 )&& ((this.mesh.position.y - this.#height/2) >= -size_renderer.height / 2 ) )
			if (heightCollision < this.mesh.position.y ) 
				this.goUp();
			if (heightCollision > this.mesh.position.y )
				this.goDown();
	}

	draw(scene) {
        scene.add(this.mesh);
        scene.add(this.#light);
    }

    handleKeyDown(event) { // key press
		this.#keys[event.key] = true;
	}

	handleKeyUp(event) { // key release
		this.#keys[event.key] = false;
	}

	updateWithKeyboard() { // setting up even listeners
		this.bindHandleKeyDown = this.handleKeyDown.bind(this);
		this.bindHandleKeyUp = this.handleKeyUp.bind(this);
		document.addEventListener("keydown", this.bindHandleKeyDown);
		document.addEventListener("keyup", this.bindHandleKeyUp);
	}

	updateLeft() { // left paddle
		if (this.#keys['w']) {
			this.set_y(this.#maxSpeed);
		}
		if (this.#keys['s']) {
			this.set_y(-this.#maxSpeed);
		}
	}

	goUp() {
		this.mesh.position.y -= this.#maxSpeed;
		this.#light.position.y = this.mesh.position.y;
	}
	
	goDown(){
		this.mesh.position.y += this.#maxSpeed;
		this.#light.position.y = this.mesh.position.y;
	}

	updateRight() { // right paddle
		if (this.#keys['ArrowUp']) {
			this.set_y(this.#maxSpeed);
		}
		if (this.#keys['ArrowDown']) {
			this.set_y(-this.#maxSpeed);
		}
	}

	removeListener() {
		document.removeEventListener("keydown", this.bindHandleKeyDown);
		document.removeEventListener("keyup", this.bindHandleKeyUp);
	}
}
