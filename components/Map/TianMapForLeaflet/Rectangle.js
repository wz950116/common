/**
 * 绘制矩形
 */
class Rectangle {
  constructor(map, mapRect) {
    this.mapRect = mapRect;
    this.map = map;
    this.latlngs = []; // 展现矩形的坐标
    this.cb = function() {};
  }

  addEventListen(cb = function() {}) {
    this.cb = cb;
  }

  removeEventListen() {
    this.cb = function() {};
  }

  startDraw() {
    const map = this.map;
    map.addEvent('mousedown', this._mousedown); // 鼠标按下，开始绘制矩形
    map.addEvent('mouseup', this._mouseup); // 鼠标松开事件,矩形绘制完成
  }

  stopDraw() {
    const map = this.map;
    map.removeEvent('mousedown', this._mousedown);
    map.removeEvent('mouseup', this._mouseup);
    map.draggingEnable();
    this.latlngs = [];
  }

  _mousedown = event => {
    event = this.mapRect.getEvent(event);
    if (event.originalEvent.button === 2) {
      const map = this.map;
      map.draggingDisable(); // 禁止地图拖拽
      this.latlngs[0] = [event.latlng.lat, event.latlng.lng]; // 左上角坐标
      map.addEvent('mousemove', this._mousemove);
    }
  }

  _mousemove= event => {
    event = this.mapRect.getEvent(event);
    const latlngs = this.latlngs;
    const { lat, lng } = event.latlng;
    if (!(lat === latlngs[0][0] && lng === latlngs[0][1])) {
      latlngs[1] = [lat, lng]; //右下角坐标
    }
    this.mapRect.draw(latlngs);
  }

  _mouseup= event => {
    event = this.mapRect.getEvent(event);
    if (event.originalEvent.button === 2) {
      const map = this.map;
      map.removeEvent('mousemove', this._mousemove); //停止监听鼠标移动事件
      map.draggingEnable();
      this.mapRect.remove();
      this.latlngs.length === 2 && this.cb(this.latlngs);
      this.latlngs = [];
    }
  }

  destroy() {
    const map = this.map;
    map.removeEvent('mousedown', this._mousedown);
    map.removeEvent('mouseup', this._mouseup);
    map.draggingEnable();
    this.map = null;
    this.latlngs = [];
    this.cb = null;
    this.mapRect = null;
  }
}

export default Rectangle;
