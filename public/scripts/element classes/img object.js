export default class image {
  constructor(src, tag) {
    this.type = 'Image';
    this.id  = tag;
    this.x1 = {};
    this.x2  = { };
    this.y1 = {};
    this.y2 = { };
    this.src = src;
    this.x1.dx = 0.02;  this.x2.dx = 0.2; this.x1.toggle = false; this.x2.toggle = false;  this.insidex = 0;
    this.y1.dy = 0.02;  this.y2.dy = 0.2; this.y1.toggle = false; this.y2.toggle = false;  this.insidey = 0;
    this.offest = 0; this.edit = false; this.inside = 0;
    this.img = new Image();
    this.img.src = src;
    this.img.onload = () => {return true;};
  }

  sketch(context, w, h) {
    context.drawImage(this.img, (this.x1.dx*w), (this.y1.dy*h), ((this.x2.dx*w)-(this.x1.dx*w)), ((this.y2.dy*h)-(this.y1.dy*h)));
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
