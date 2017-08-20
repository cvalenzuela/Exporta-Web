// Country class: creates a new particle system

import { ParticleSystem } from './ParticleSystem';
import * as latlng from './latlng.json';
import * as trade from './tradeData.json';
import { p5Instance as p5, map } from './index';
import { scale, showName, randomColor, colorPallet} from './utils';
import { soundTypes, setCurrentInstrument } from './sounds';
import * as Tone from 'tone';

let colors = colorPallet();

class Country {
  constructor(...args){
    args = args[0];
    this.Country = args[0];
    this.tradeType = args[1];
    this.Elt = args[2];
    this.Color = colors();
    this.Opacity = 200;
    this.Trail = 2;
    this.id = this.Country+this.tradeType

    this.system = new ParticleSystem();
    this.trade = trade[this.Country][this.tradeType];
    this.origin = latlng[this.Country];
    this.instrument = setCurrentInstrument(false);
    //this.soundType = soundTypes[this.instrument].sounds[0]; // Always the same sound.
    this.soundType = p5.random(soundTypes[this.instrument].sounds); // Randoms sounds.
    this.showOriginName = () => {showName(this.Country, this.id, map.latLngToPixel(this.origin), this.Color, true)};
    this.Start();
  }

  Start(){
    // Create a shuffle array with the names of the destination countries
    let destinationCountries = p5.shuffle(Object.keys(this.trade), true);
    let currentDestinationCountry = 0;
    map.onChange(this.showOriginName);

    this.loop = new Tone.Loop((time) => {
      let destinationName = destinationCountries[currentDestinationCountry];
      let destination = latlng[destinationName];
      if(latlng[destinationName]){
        let size = scale(this.trade[destinationName]);
        size = p5.constrain(size, 2, 64);
        this.system.addParticle(
          this.origin,
          destination,
          this.Country,
          destinationName,
          size,
          this.Color,
          this.Opacity,
          this.Trail,
          this.tradeType,
          this.soundType
        );
      } else {
        if(currentDestinationCountry < destinationCountries.length){
          console.warn(destinationName + " not found :(");
        }
      }
      if(currentDestinationCountry < destinationCountries.length){
        currentDestinationCountry++;
      } else {
        this.Stop();
      }
    }, '1n').start(soundTypes[this.instrument].tempo);
  }

  Stop(){
    try {
      if(this.loop != null){ this.loop.dispose()};
      map.removeOnChange(this.showOriginName);      
      let name = document.getElementById(this.id);
      name.parentNode.removeChild(name);
    } catch (error) {
      console.log(error)
    }
  }

}

export { Country };
