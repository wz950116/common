
/**
 * leaflet 绘制矩形
 */
class LeafletMapRect {
  constructor(map, rectangle) {
    this.$map = map;
    this.rectangle = rectangle;
    this.tmprect = null;
  }

  draw(latlngs) {
    this.remove();
    this.tmprect = this.rectangle(latlngs, { dashArray: 5 }).addTo(this.$map);
  }

  remove() {
    this.tmprect && this.tmprect.remove();
  }

  getEvent(event) {
    return {
      originalEvent: event.originalEvent,
      latlng: event.latlng
    };
  }

  destroy() {
    this.$map = null;
    this.rectangle = null;
    this.tmprect = null;
  }
}

export default LeafletMapRect;
