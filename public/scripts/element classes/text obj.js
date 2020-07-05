export default class word {
  constructor(text, size, color, font, tag) {
    console.log("new word creation");
    size = Number(size);
    this.type = 'Text';
    this.id  = tag;
    this.text = text;
    this.color = color;
    this.font = font;
    this.size = size;
    this.x1 = {};
    this.x2  = { };
    this.y1 = {};
    this.y2 = { };
    this.x1.dx = 0.02;  this.x2.dx = 0.2; this.x1.toggle = false; this.x2.toggle = false;  this.insidex = false;
    this.y1.dy = 0.02;  this.y2.dy = (((size * 0.7) + 10)/500); this.y1.toggle = false; this.y2.toggle = false;  this.insidey = false;
    this.offest = 0; this.edit = false; this.inside = 0;

  }

  sketch(context, w, h) {
    this.size = ((this.y2.dy*h) - (this.y1.dy*h)) * 1.43;
    context.font = `${this.size}px ${this.font}`;
    context.fillStyle= this.color;
    context.fillText(this.text, (this.x1.dx*w), (this.y2.dy*h), ((this.x2.dx-this.x1.dx)*w));
    if(this.edit){
      this.offest += 1;
      if(this.offest>16) this.offest = 0;
      context.setLineDash([4, 2]);
      context.lineDashOffset = -this.offset;
      context.strokeRect  ((this.x1.dx*w),         (this.y1.dy*h),  ((this.x2.dx*w)-(this.x1.dx*w)), ((this.y2.dy*h) -(this.y1.dy*h)));
      context.fillRect( ((this.x1.dx*w)-5), ((this.y1.dy*h)-5),  5,  5);
      context.fillRect(     (this.x2.dx*w), ((this.y1.dy*h)-5),  5,  5);
      context.fillRect( ((this.x1.dx*w) -5),     (this.y2.dy*h),  5,  5);
      context.fillRect(    (this.x2.dx*w) ,     (this.y2.dy*h),  5,  5);
    }
  }
}