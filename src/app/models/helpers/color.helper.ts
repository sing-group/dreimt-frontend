/*
 * DREIMT Frontend
 *
 *  Copyright (C) 2019 - Hugo López-Fernández,
 *  Daniel González-Peña, Miguel Reboiro-Jato, Kevin Troulé,
 *  Fátima Al-Sharhour and Gonzalo Gómez-López.
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

export class RgbColor {
  public readonly red: number;
  public readonly green: number;
  public readonly blue: number;

  public static rgbColor(red: number, green: number, blue: number): RgbColor {
    return {
      'red': red,
      'green': green,
      'blue': blue
    };
  }
}

export class ColorHelper {

  constructor(private lowColor: RgbColor, private highColor: RgbColor, private lowValue: number, private highValue: number, private breaks: number) {
  }

  public getColor(val: number): RgbColor {
    let n = this.breaks;
    let pos = parseInt((Math.round((val / this.highValue) * 100)).toFixed(0));
    // Define the ending colour, which is white
    let xr = this.highColor.red; // 255; // Red value
    let xg = this.highColor.green; //  = 255; // Green value
    let xb = this.highColor.blue; //  = 255; // Blue value

    // Define the starting colour #f32075
    let yr = this.lowColor.red; //  = 243; // Red value
    let yg = this.lowColor.green; //   = 32; // Green value
    let yb = this.lowColor.blue; //  =  = 117; // Blue value

    let red = parseInt((xr + ((pos * (yr - xr)) / (n - 1))).toFixed(0));
    let green = parseInt((xg + ((pos * (yg - xg)) / (n - 1))).toFixed(0));
    let blue = parseInt((xb + ((pos * (yb - xb)) / (n - 1))).toFixed(0));

    return RgbColor.rgbColor(red, green, blue);
  }
}
