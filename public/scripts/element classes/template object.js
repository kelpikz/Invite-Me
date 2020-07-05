export default class template {
  constructor(src, width, height) {
    this.type = 'Template';
    this.id = ' ';
    this.x1 = {};
    this.x2 = {};
    this.y1 = {};
    this.y2 = {};
    this.x1.dx = 0;
    this.x2.dx = 1;
    this.y1.dy = 0;
    this.y2.dy = 1;
    this.img = new Image();
    this.img.src = src;
    this.img.onload = () => {return true;};
    this.src = src;
  }
  sketch(context, w, h) {
    context.drawImage(this.img, this.x1.dx, this.y1.dy, (this.x2.dx*w), (this.y2.dy*h));
  }
}