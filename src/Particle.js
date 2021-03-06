// Base Particle

import { p5Instance as p5, map } from './index'
import { showName } from './utils';
import { playSound } from './sounds';

class Particle {
  constructor(...args){
    args = args[0]

    this.origin = args[0];
    this.destination = args[1];
    this.originName = args[2];
    this.destinationName = args[3];
    this.maxSize = args[4];
    this.color = args[5];
    this.opacity = args[6];
    this.trail = args[7];
    this.tradeType = args[8];
    this.soundType = args[9];

    this.id = this.originName+this.destinationName;
    this.amount = p5.createVector(0,0);
    this.position = p5.createVector(0,0);
    this.steps = 0.003;
    this.size = 0;
    this.reachSize = false;
    this.history = [];
  }

  display() {

    // Get latlng everytime since the map can change
    try {
      this.posOrigin = map.latLngToPixel(this.origin.lat, this.origin.lng);
      this.posDestination = map.latLngToPixel(this.destination.lat, this.destination.lng);
  
      // Handle the size
      (this.size < this.maxSize && !this.reachSize) && (this.size += 1);
      this.size >= this.maxSize && (this.reachSize = true);
      //(this.amount.x > 0.97 && this.reachSize) && (this.size -= 1);
  
      // Play sounds at start
      if (this.amount.x == 0){
          playSound(this.soundType);
      }
  
      // Calculate distance and path
      if(this.amount.x < 1){
        (this.tradeType == 'imports') ? this.position.x = p5.lerp(this.posDestination.x, this.posOrigin.x, this.amount.x) : this.position.x = p5.lerp(this.posOrigin.x, this.posDestination.x, this.amount.x);
        this.amount.x += this.steps;
      }
      if(this.amount.y < 1){
        (this.tradeType == 'imports') ? this.position.y = p5.lerp(this.posDestination.y, this.posOrigin.y, this.amount.y) : this.position.y = p5.lerp(this.posOrigin.y, this.posDestination.y, this.amount.y);
        this.amount.y += this.steps;
      }
  
      // Particle's trail
      this.history.push(this.position.copy())
      this.history.length > this.trail && (this.history.splice(0, 1));
      for(let i = 0; i < this.history.length; i++){
        let pos = this.history[i];
        p5.fill(this.color[0], this.color[1], this.color[2], this.opacity/15*i);
        p5.ellipse(pos.x, pos.y, this.size, this.size);
      }
  
      // Show Countries Name
      // Show partner country only when the particle is really close
      if(this.tradeType == 'imports'){
        (this.amount.x < 0.1) && (showName(this.destinationName, this.id, this.posDestination, this.color, false));
        ((this.amount.x > 0.1) && document.getElementById(this.id)) && document.getElementById(this.id).remove(); // delete the dom text
      } else {
        (this.amount.x > 0.9) && (showName(this.destinationName, this.id, this.posDestination, this.color, false));
        (this.amount.x > 0.99) && document.getElementById(this.id).remove(); // delete the dom text
      }
  
      // Actual Particle
      p5.fill(this.color[0], this.color[1], this.color[2], this.opacity);
      p5.ellipse(this.position.x, this.position.y, this.size, this.size);
  
      // If arrived, erase from particle array
      if(this.amount.x >= 1 && this.amount.y >= 1) {
        this.lifespan = -1;
      }
    } catch (error) {
      console.log('Error! :(', error);
    }
    
  };

  // Erase once it has arrived
  isDead() {
    if (this.lifespan < 0) {
      return true;
    } else {
      return false;
    }
  }
}

export { Particle };
