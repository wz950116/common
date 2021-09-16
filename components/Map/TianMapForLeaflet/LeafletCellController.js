import MapCellBase from '../MapCellBase.js';
import {
  shapeAreaCode,
  areaPoint,
  gridFrame
} from '@/common/api/ad-web/adms_div.js';
import { gridShapes } from '@/common/api/ad-web/grid.js';

class CellGridPolygon {
  selectOptions = {
    fillColor: '#0041FF',
    fillOpacity: 0.4
  };

  noSelectOptions = {
    fillColor: '#0041FF',
    fillOpacity: 0.1
  };

  disabledOptions = {
    fillColor: '#BDBDBD',
    fillOpacity: 0.8
  };

  constructor(polygon) {
    this.polygon = polygon;
    this.isSelect = false;
    this.isDisabled = false;
  }

  click() {
    if (this.isDisabled) return;
    this.isSelect ? this.cancelSelect() : this.select();
  }

  select() {
    if (this.isSelect) return;
    this._setStyle(this.selectOptions);
    this.isSelect = true;
    this.isDisabled = false;
  }

  cancelSelect() {
    if (!this.isSelect) return;
    this._setStyle(this.noSelectOptions);
    this.isSelect = false;
    this.isDisabled = false;
  }

  disabled() {
    if (this.isDisabled) return;
    this._setStyle(this.disabledOptions);
    this.isDisabled = true;
    this.isSelect = false;
  }

  unDisabled() {
    if (!this.isDisabled) return;
    this._setStyle(this.noSelectOptions);
    this.isDisabled = false;
  }

  _setStyle(options = {}) {
    this.polygon.setStyle(options);
  }

  remove() {
    this.polygon.remove();
    this.polygon = null;
  }
}

/**
 * leaflet 网格管理
 */
class LeafletCellController extends MapCellBase {
  constructor(map) {
    super(map);
    this.isStartDrawRectangle = false;
  }

  /** 根据行政区划编码查询并绘制行政区划形状 */
  async drawShapeAreaCode(areaCode) {
    if (!areaCode) return;
    if (this.areaCode === areaCode) {
      this.cellGridMap.forEach(item => item.cancelSelect());
      return;
    } else {
      this.removeCellGridMap(this.cellGridMap);
    }
    this.areaCode = areaCode;
    const { areaCenterPoints } = this.map.gisConfig;
    const currentPoints = areaCenterPoints.find(
      item => item.areaCode === areaCode
    );
    if (currentPoints) {
      this.map.fitBounds(currentPoints.coordinates);
    }
    if (this.currentAreaGrid) {
      this.currentAreaGrid.remove();
    }
    const { data } = await shapeAreaCode(areaCode);
    if (data) {
      this.currentAreaGrid = this.map.polygon(data.geom);
    }
  }

  /** 绘制当前责任网格选择的单元网格 */
  drawSelectCellGridMap(cellGridCodes = []) {
    this.drawAddSelectCellGrid(cellGridCodes, 'select');
  }

  /** 绘制已经被其他责任网格选择的单元网格 */
  async drawRecordedCellGridMap(cellGridCodes = []) {
    this.drawAddSelectCellGrid(cellGridCodes, 'disabled');
  }

  /** 通过单元网格code查询并绘制单元网格 */
  async getCellGridsByCode(cellGridCodes = []) {
    if (cellGridCodes.length === 0) return [];
    const { data: gridShapeList } = await gridShapes(cellGridCodes);
    return Array.isArray(gridShapeList) ? gridShapeList : [];
  }

  /** 绘制并选择单元网格 */
  async drawAddSelectCellGrid(cellGridCodes = [], type = 'cancelSelect') {
    const cellGridMap = this.cellGridMap;
    const _cellGridCodes = [];
    cellGridCodes.forEach(gridCode => {
      const cellGridPolygon = cellGridMap.get(gridCode);
      if (cellGridPolygon) {
        cellGridPolygon[type]();
      } else {
        _cellGridCodes.push(gridCode);
      }
    });
    if (_cellGridCodes.length === 0) return;
    const gridShapeList = await this.getCellGridsByCode(_cellGridCodes);
    // * 当需要绘制的网格数量超出 500 时, 采用异步分批绘制
    if (gridShapeList.length >= 500) {
      this._drawCellGridByAnimation(gridShapeList, type);
    } else {
      this._drawCellGridByOnTime(gridShapeList, type);
    }
  }

  /** 绘制单元网格 */
  drawCellGrid(shape, type = 'select', options) {
    if (!shape) return false;
    const polygon = this.map.polygon(shape.geoJson, options);
    if (polygon) {
      const cellGridPolygon = new CellGridPolygon(polygon);
      cellGridPolygon[type]();
      this.cellGridMap.set(shape.code, cellGridPolygon);
    }
  }

  /** 通过 code 点击单元网格 */
  clickCellGridByGridCode(gridCodes) {
    const cellGridMap = this.cellGridMap;
    if (typeof gridCodes === 'string') {
      const cellGridPolygon = cellGridMap.get(gridCodes);
      if (cellGridPolygon) {
        cellGridPolygon.click();
      } else {
        this.drawAddSelectCellGrid([gridCodes], 'click');
      }
    }

    if (Array.isArray(gridCodes)) {
      this.drawAddSelectCellGrid(gridCodes, 'click');
    }
  }

  /** 网格点选 */
  async cellGridClick(val) {
    try {
      const { data: pointDetail } = await areaPoint(val.latlng);
      if (!pointDetail) return false;
      if (pointDetail.districtCode !== this.areaCode) {
        return false; // 不在当前行政区划
      }
      this.clickCellGridByGridCode(pointDetail.gridCode);
    } catch (error) {
      console.log(error);
    }
  }

  /** 网格框选 */
  async mapRecSelect(val) {
    if (!this.areaCode) return;
    const { data: gridShapeList } = await gridFrame(val, this.areaCode);
    if (gridShapeList && Array.isArray(gridShapeList)) {
      const cellGridMap = this.cellGridMap;
      const _gridShapeList = [];
      gridShapeList.forEach(item => {
        const cellGridPolygon = cellGridMap.get(item.code);
        if (cellGridPolygon) {
          cellGridPolygon.click();
        } else {
          _gridShapeList.push(item);
        }
      });
      if (_gridShapeList.length >= 2000) {
        this._drawCellGridByAnimation(_gridShapeList, 'click');
      } else {
        this._drawCellGridByOnTime(_gridShapeList, 'click');
      }
    }
  }

  /** 移除所有单元格 */
  removeAllCellGridMap() {
    this.removeCellGridMap(this.cellGridMap);
    this.currentAreaGrid && this.currentAreaGrid.remove();
    this.currentAreaGrid = null;
  }
}

export default LeafletCellController;
