import Rectangle from './Rectangle.js';
import LeafletMapRect from './LeafletMapRect.js';
import LeafletCellController from './LeafletCellController.js';

window.cg_gis_config = {
  zoom: 10,
  center: [35.49425, 112.85039],
  layers: [
    {
      url:
        "http://t1.tianditu.com/vec_c/wmts?layer=vec&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=ef63801764261c156ba74a40612a717b",
      options: {
        maxZoom: 19,
        tileSize: 256,
        zoomOffset: 1
      }
    },
    {
      url:
        "http://t1.tianditu.com/cva_c/wmts?layer=cva&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=ef63801764261c156ba74a40612a717b",
      options: {
        maxZoom: 19,
        tileSize: 256,
        zoomOffset: 1
      }
    }
  ],
  wms: [
    {
      url: "/geoserver/jc/wms?service=WMS",
      options: {
        layers: "grid", //社区：community 街道：street 区：district
        format: "image/png",
        transparent: true,
        uppercase: true
      }
    }
  ]
}

/**
 * leaflet地图
 * ! leaflet 所有坐标都是纬度在前,精度在后的
 */
class LeafletMap {
  defaultConfig = {
    zoom: 10,
    center: [28.47546, 104.85901],
    layers: [],
    wms: [],
    areaCenterPoints: []
  };

  /** 多边形默认参数 */
  geojsonMarkerOptions = {
    radius: 8,
    weight: 1,
    opacity: 1,
    fillOpacity: 0.1,
    fillColor: '#0041FF',
    color: '#0041FF'
  };

  /** wms 图层相关配置 */
  wmsOptions = null;

  /** 记录当前地图监听的事件 */
  mapEvent = new Map();

  /** 记录当前地图操作 */
  methodRecord = new Map();

  /** 当前地图配置 */
  gisConfig = null;

  /** 地图实列 */
  $map = null;

  /** leaflet js */
  $L = null;

  /** 绘制矩形实列 */
  $rectangle = null;

  /** 地图挂载节点 */
  $el = null;

  /** 网格控制器 */
  cellController = null;

  constructor(el) {
    if (!window.L) throw new ReferenceError('未找到 window.L');
    this.$el = el;
    this.$L = window.L;
    this._getConfig();
  }

  /** 获取配置文件 */
  _getConfig() {
    this.gisConfig = Object.assign(
      {},
      this.defaultConfig,
      window.cg_gis_config
    );
    return this.gisConfig;
  }

  /** 初始化地图 */
  initMap() {
    const L = this.$L;
    const gisConfig = this.gisConfig;
    const map = L.map(this.$el, {
      crs: L.CRS.EPSG4326, // leaflet默认是3857坐标系
      maxZoom: 17,
      center: gisConfig.center,
      zoom: gisConfig.zoom,
      zoomControl: false, // 默认的放大缩小插件是英文的
      attributionControl: false, // 是否显示leaflet广告
      closePopupOnClick: false //  点击地图的时候是否默认关闭popup
    });
    this.$map = map;
    this.addTileLayer(gisConfig.layers);
  }

  /**
   * 添加底图
   * @param { string | { url , option }[] | { url , option } } layer
   */
  addTileLayer(layer) {
    const map = this.$map;
    if (Array.isArray(layer)) {
      layer.forEach(item => {
        map.addLayer(this.createTileLayer(item));
      });
    } else {
      map.addLayer(this.createTileLayer(layer));
    }
  }

  /** 创建底图 */
  createTileLayer(url, options) {
    if (this.isObject(url)) {
      options = url.options;
      url = url.url;
    }
    return this.$L.tileLayer(
      url,
      Object.assign(
        {
          maxZoom: 19,
          tileSize: 256,
          zoomOffset: 1
        },
        options
      )
      // 高德底图切换
      // 'http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
      // {
      //   attribution: '&copy; 高德地图',
      //   maxZoom: 19,
      //   tileSize: 256,
      //   subdomains: '1234'
      // }
    );
  }

  /** 初始化 wms */
  initWms(ops) {
    if (this.isinitWms) return;
    this.wmsOptions = ops;
    this.addWms(this.gisConfig.wms);
    this.isinitWms = true;
  }

  /**
   * 添加 wms 图层
   * @param { string | { url , option } | { url , option }[] } wms
   */
  addWms(wms) {
    // ! VUE_APP_API_URL 实际为wms的请求路径
    const VUE_APP_API_URL = process.env.VUE_APP_API_URL || '';
    const map = this.$map;
    if (Array.isArray(wms)) {
      wms.forEach(item => {
        const _item = { ...item };
        if (this.isObject(item)) {
          _item.url = VUE_APP_API_URL + item.url;
        }
        map.addLayer(this.createTileLayerWms(_item));
      });
    } else {
      map.addLayer(this.createTileLayerWms(wms));
    }
  }

  /** 创建 wms 图层 */
  createTileLayerWms(wmsUrl, options) {
    if (this.isObject(wmsUrl)) {
      options = wmsUrl.options;
      wmsUrl = wmsUrl.url;
    }
    options = Object.assign(
      {
        layers: this.layers, // 图层等级
        format: 'image/png',
        transparent: true,
        uppercase: true
      },
      options,
      this.wmsOptions
    );
    return this.$L.tileLayer.wms(wmsUrl, options);
  }

  /** 设置缩放等级 */
  setZoom(zoom) {
    const _zoom = this.gisConfig.zoom;
    this.$map.setZoom(zoom || _zoom);
  }

  /** 获取缩放等级 */
  getZoom() {
    return this.$map ? this.$map.getZoom() : this.gisConfig.center;
  }

  /** 获取地图边界 */
  getBounds() {
    return this.$map.getBounds();
  }

  /** 设置地图中心点 */
  setCenter(point) {
    const _point = this._converterPoint(point);
    this.$map.panTo(_point);
  }

  /** 获取地图中心点 */
  getCenter() {
    return this.$map.getCenter();
  }

  /** 设置中心位置并且缩放 */
  setCenterAndZoom(point, zoom) {
    const _point = this._converterPoint(point);
    zoom = zoom || point.zoom || this.getZoom();
    this.$map.setView(_point, zoom);
  }

  /** 添加 divIcon */
  addDivIcon(point) {
    this.removeDivIcon();
    const _point = this._converterPoint(point);
    this.divIconMarker = this.$L
      .marker(_point, { icon: this.creatDivIcon() })
      .addTo(this.$map);
    this.methodRecord.set('addDivIcon', [_point]);
  }

  /** 移除 divIcon */
  removeDivIcon() {
    this.divIconMarker && this.divIconMarker.remove();
  }

  /** 创建 divIcon */
  creatDivIcon() {
    if (this.creatDivIcon.divIcon) return this.creatDivIcon.divIcon;
    const divIcon = this.$L.divIcon({
      className: 'iconfont icon-dingwei mapIcon',
      iconSize: [19, 26],
      iconAnchor: [9, 13], //相对偏移的位置 把图片认为是一个正方形,点击的地方就是正方形的左上角
      popupAnchor: [] // 弹出窗口相对于图标锚点“打开”的点的坐标。
    });
    this.creatDivIcon.divIcon = divIcon;
    return divIcon;
  }

  /** 添加点击事件 */
  addClickEvent(cb) {
    this.addEvent('click', function (e) {
      cb({ latlng: e.latlng });
    });
  }

  /** 添加事件 */
  addEvent(type, cb) {
    this.mapEvent.set(type, cb);
    this.$map.on(type, cb);
  }

  /** 移除事件 */
  removeEvent(type) {
    if (this.mapEvent.has(type)) {
      this.$map.off(type, this.mapEvent.get(type));
    }
  }

  /** 移除所有事件 */
  removeAllEvent() {
    this.mapEvent.forEach((value, key) => {
      this.removeEvent(key, value);
    });
  }

  /** 初始化框选 */
  initRectangle(cb) {
    const leafletMapRect = new LeafletMapRect(this.$map, this.$L.rectangle);
    const rectangle = new Rectangle(this, leafletMapRect);
    rectangle.addEventListen(cb);
    this.$rectangle = rectangle;
  }

  /** 添加框选 */
  startDrawRectangle() {
    this.mapAddOncontextmenu();
    this.$rectangle && this.$rectangle.startDraw();
  }

  /** 取消框选 */
  stopDrawRectangle() {
    this.$el.oncontextmenu = null;
    this.$rectangle && this.$rectangle.stopDraw();
  }

  /** 移除框选 */
  removeDrawRectangle() {
    this.$el.oncontextmenu = null;
    this.$rectangle && this.$rectangle.stopDraw();
    this.$rectangle = null;
  }

  /** 禁止显示地图范围内鼠标右键点击后的浏览器菜单 */
  mapAddOncontextmenu() {
    this.$el.oncontextmenu = function (event) {
      event.preventDefault();
    };
  }

  /** 地图可移动 */
  draggingEnable() {
    this.$map.dragging.enable();
  }

  /** 禁止地图移动 */
  draggingDisable() {
    this.$map.dragging.disable();
  }

  /** 处理geojson数据 */
  geojson(geojson) {
    let _geoJson = null;
    if (typeof geojson === 'string') {
      try {
        _geoJson = JSON.parse(geojson);
      } catch (error) {
        console.log(error);
      }
    }
    if (typeof geojson === 'object') {
      _geoJson = geojson;
    }
    return _geoJson;
  }

  /** 绘制单个多边形 */
  polygon(geojson, options) {
    const _geoJson = this.geojson(geojson);
    if (!_geoJson) return null;
    const feature = this.createFeature(_geoJson, options);
    return feature.addTo(this.$map);
  }

  /** 创建一个 Feature */
  createFeature(geojsonFeature, options) {
    const _geojsonMarkerOptions = Object.assign(
      {},
      this.geojsonMarkerOptions,
      options
    );
    return this.$L.geoJSON(geojsonFeature, _geojsonMarkerOptions);
  }

  /**
   * 绘制多个单元网格
   * @param geoJSONs
   * @param {boolean} center 是否居中
   * @param options
   */
  featureGroup(geoJSONs = [], center = false, options) {
    const { featureGroup, geoJSON } = this.$L;
    const _geojsonMarkerOptions = Object.assign(
      {},
      this.geojsonMarkerOptions,
      options
    );
    const featureGroups = geoJSONs.map(item => {
      return geoJSON(item, _geojsonMarkerOptions);
    });
    const feature = featureGroup(featureGroups);
    if (center) {
      this.gridToCenter(feature);
    }
    return feature.addTo(this.$map);
  }

  /**
   * 地图网格居中
   */
  gridToCenter(geoJSON) {
    const bounds = geoJSON.getBounds();
    let rectangle = this.$L
      .rectangle(bounds, {
        opacity: 0,
        fillOpacity: 0,
        weight: 1
      })
      .addTo(this.$map);
    this.$map.fitBounds(bounds);
    rectangle.remove();
    rectangle = null;
  }

  /** 对角线居中  */
  fitBounds(bounds = []) {
    bounds = bounds.map(item => this._converterPoint(item));
    this.$map.fitBounds(bounds);
  }

  getCellController() {
    return this.cellController || new LeafletCellController(this);
  }

  /**
   * 转换坐标点
   */
  _converterPoint(args) {
    const center = this.gisConfig.center;

    const defaultPoint = {
      lng: center[1],
      lat: center[0]
    };
    let newPoint = null;

    if (this.isObject(args)) {
      newPoint = { ...args };
    }

    if (Array.isArray(args) && args.length) {
      const _args = [...args];
      if (_args[0] - _args[1] < 0) {
        [_args[0], _args[1]] = [_args[1], _args[0]];
      }
      newPoint = {
        lng: _args[0],
        lat: _args[1]
      };
    }
    return Object.assign({}, defaultPoint, newPoint);
  }

  isObject(val) {
    return Object.prototype.toString.call(val) === '[object Object]';
  }

  destroy() {
    this.wmsOptions = null;
    this.mapEvent.clear();
    this.methodRecord.clear();
    this.gisConfig = null;
    this.$el = null;
    this.$L = null;
    this.$map = null;
    this.$rectangle = null;
    this.cellController && this.cellController.destroy();
    this.cellController = null;
  }
}

export default LeafletMap;
