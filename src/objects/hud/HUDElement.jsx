export class HUDElement {

  constructor(obj = {}) {
    this.context = obj.context;
    this.center = {x:obj.x, y:obj.y};
    this.width = obj.width;
    this.height = obj.height;
    this.size = {width:obj.width, height:obj.height};
    this.teams = obj.teams;
  }

  update(delta) {
    
  }

}
