import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import {Attribution, FullScreen, defaults as defaultControls} from 'ol/control';
import TileLayer from "ol/layer/Tile";
// import * as olProj from "ol/proj";
import {XYZ,OSM,TileDebug} from "ol/source";
import {fromLonLat, transform} from 'ol/proj';
import {Select, DragBox} from "ol/interaction";
import platformModifierKeyOnly from "ol/events/condition";
import {Fill, Stroke, Style} from 'ol/style';
import {easeIn, easeOut} from "ol/easing";

const root = __dirname;
const filename = __filename;
// 返回运行文件所在的目录
console.log('__dirname : ' + __dirname);
console.log(root);
console.log(filename);
const sourceCustom = true;
let source;
let tdKey = '';
const mapUrl = {
    /****
     * 高德地图
     * lang可以通过zh_cn设置中文，en设置英文，size基本无作用，scl设置标注还是底图，scl=1代表注记，
     * scl=2代表底图（矢量或者影像），style设置影像和路网
     * https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}
     * roadLabel---路网+标注  style = 7
     * vec——街道底图  style = 8
     *
     * https://webst01.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}
     * img——卫星影像底图  style = 6
     * vec——街道底图  style = 7
     * roadLabel---路网+标注  style = 8
     */
    "aMap-img": "https://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
    "aMap-vec": "https://webst0{1-4}.is.autonavi.com/appmaptile?style=7&x={x}&y={y}&z={z}",
    "aMap-roadLabel": "https://webst0{1-4}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}",

    /***
     *高德新版地图*
     */
    "aMap-img-n": "http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=6", //为影像底图（不含路网，不含注记）
    "aMap-vec-a": "http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=7", //为矢量图（含路网、含注记）
    "aMap-img-a": "http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=8", //为影像路图（含路网，含注记）

    /***
     * 天地图 要key的
     * vec——街道底图
     * img——影像底图
     * ter——地形底图
     * cva——中文注记
     * cta/cia——道路+中文注记 ---roadLabel
     */
    "tian-img": "http://t{0-7}.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=" + tdKey,
    "tian-roadLabel": "http://t{0-7}.tianditu.gov.cn/DataServer?T=cta_w&x={x}&y={y}&l={z}&tk=" + tdKey,
    "tian-label": "http://t{0-7}.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=" + tdKey,
    "tian-vec": "http://t{0-7}.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=" + tdKey,
    "tian-ter": "http://t{0-7}.tianditu.gov.cn/DataServer?T=ter_w&x={x}&y={y}&l={z}&tk=" + tdKey,
    /***
     *geoq地图
     * http://cache1.arcgisonline.cn
     * http://map.geoq.cn
     * vec：标准彩色地图
     * gray、blue、warm
     * line 中国轮廓图
     * china 中国轮廓图+标注
     * Hydro 水系
     * green 植被
     */
    "geoq-vec": "http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}",
    "geoq-gray": "http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}",
    "geoq-blue": "http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
    "geoq-warm": "http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineStreetWarm/MapServer/tile/{z}/{y}/{x}",
    "geoq-line": "http://cache1.arcgisonline.cn/arcgis/rest/services/SimpleFeature/ChinaBoundaryLine/MapServer/tile/{z}/{y}/{x}",//不稳定
    "geoq-china": "http://thematic.geoq.cn/arcgis/rest/services/ThematicMaps/administrative_division_boundaryandlabel/MapServer/tile/{z}/{y}/{x}",//不稳定
    "geoq-Hydro": "http://thematic.geoq.cn/arcgis/rest/services/ThematicMaps/WorldHydroMap/MapServer/tile/{z}/{y}/{x}",//不稳定
    "geoq-green": "http://thematic.geoq.cn/arcgis/rest/services/ThematicMaps/vegetation/MapServer/tile/{z}/{y}/{x}",//不稳定
    /***
     * Google
     * m 街道
     * s 影像
     */
    "google-vec": "http://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}",
    "google-img": "http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}"

};
if(sourceCustom){
    source = new XYZ({
        url: mapUrl["aMap-vec-a"]
    });
}else{
    source = new OSM();
}
const style = new Style({
    fill: new Fill({
        color: '#eeeeee',
    }),
});
let tileLayer = new TileLayer({
    source: source,
});
let tileDebugLayer =  new TileLayer({
    source: new TileDebug(),
});
let vectorLayer = new VectorLayer({
    source: new VectorSource({
        format: new GeoJSON(),
        url: './data/countries.json',
    }),
    background: '#1a2b39',
    // style: function (feature) {
    //     const color = feature.get('COLOR_BIO') || '#eeeeee';
    //     style.getFill().setColor(color);
    //     return style;
    // },
});
const vectorSource = new VectorSource({
    url: './data/ecoregions.json',
    format: new GeoJSON(),
});
let vectorLayer2 =  new VectorLayer({
    source: vectorSource,
    background: '#1a2b39',
    style: function (feature) {
        const color = feature.get('COLOR_BIO') || '#eeeeee';
        style.getFill().setColor(color);
        return style;
    },
});

const attribution = new Attribution({
    collapsible: false,
});
const FullScreen = new FullScreen();//这是全屏控件
const view = new View({
    // center: [0,0],
    center: fromLonLat([121.471441, 31.22733]),
    // center: transform(
    //     [121.471441, 31.22733],//地图中心位置
    //     "EPSG:4326",
    //     "EPSG:3857"
    // ),
    // center: fromLonLat([103.879389, 37.42613]),
    // center: transform(
    //     [103.879389, 37.42613],//地图中心位置
    //     "EPSG:4326",
    //     "EPSG:3857"
    // ),
    // rotation: Math.PI / 5,
    zoom: 16,// 缩放级别
    minZoom: 0,// 最小缩放级别
    maxZoom: 18,// 最大缩放级别
    constrainResolution: true// 因为存在非整数的缩放级别，所以设置该参数为true来让每次缩放结束后自动缩放到距离最近的一个整数级别，这个必须要设置，当缩放在非整数级别时地图会糊
});
// a normal select interaction to handle click
const select = new Select({
    style: function (feature) {
        const color = feature.get('COLOR_BIO') || '#eeeeee';
        selectedStyle.getFill().setColor(color);
        return selectedStyle;
    },
});
// a DragBox interaction used to select features by drawing boxes
const dragBox = new DragBox({
    condition: platformModifierKeyOnly,
});
const map = new Map({
    target: 'map-container',
    layers: [
        tileLayer,
        tileDebugLayer,
        // vectorLayer,
        // vectorLayer2
    ],
    // controls: defaultControls({attribution: false}).extend([attribution]),
    // controls: [attribution, FullScreen],
    // interactions:[//交互
    //     select,//选择
    //     dragBox//画框
    // ],
    view: view,
});

const london = fromLonLat([-0.12755, 51.507222]);
const moscow = fromLonLat([37.6178, 55.7517]);
const istanbul = fromLonLat([28.9744, 41.0128]);
const rome = fromLonLat([12.5, 41.9]);
const bern = fromLonLat([7.4458, 46.95]);

function onClick(id, callback) {
    document.getElementById(id).addEventListener('click', callback);
}

onClick('zoom-out', function () {
    const view = map.getView();
    const zoom = view.getZoom();
    view.setZoom(zoom - 1);
});

onClick('zoom-in', function () {
    const view = map.getView();
    const zoom = view.getZoom();
    view.setZoom(zoom + 1);
});

onClick('rotate-left', function () {
    view.animate({
        rotation: view.getRotation() + Math.PI / 2,
    });
});

onClick('rotate-right', function () {
    view.animate({
        rotation: view.getRotation() - Math.PI / 2,
    });
});

onClick('pan-to-london', function () {
    view.animate({
        center: london,
        duration: 4000,
    });
});

// An elastic easing method (from https://github.com/DmitryBaranovskiy/raphael).
function elastic(t) {
    return (
        Math.pow(2, -10 * t) * Math.sin(((t - 0.075) * (2 * Math.PI)) / 0.3) + 1
    );
}

onClick('elastic-to-moscow', function () {
    view.animate({
        center: moscow,
        duration: 2000,
        easing: elastic,
    });
});

// A bounce easing method (from https://github.com/DmitryBaranovskiy/raphael).
function bounce(t) {
    const s = 7.5625;
    const p = 2.75;
    let l;
    if (t < 1 / p) {
        l = s * t * t;
    } else {
        if (t < 2 / p) {
            t -= 1.5 / p;
            l = s * t * t + 0.75;
        } else {
            if (t < 2.5 / p) {
                t -= 2.25 / p;
                l = s * t * t + 0.9375;
            } else {
                t -= 2.625 / p;
                l = s * t * t + 0.984375;
            }
        }
    }
    return l;
}

onClick('bounce-to-istanbul', function () {
    view.animate({
        center: istanbul,
        duration: 2000,
        easing: bounce,
    });
});

onClick('spin-to-rome', function () {
    // Rotation animation takes the shortest arc, so animate in two parts
    const center = view.getCenter();
    view.animate(
        {
            center: [
                center[0] + (rome[0] - center[0]) / 2,
                center[1] + (rome[1] - center[1]) / 2,
            ],
            rotation: Math.PI,
            easing: easeIn,
        },
        {
            center: rome,
            rotation: 2 * Math.PI,
            easing: easeOut,
        }
    );
});

function flyTo(location, done) {
    const duration = 2000;
    const zoom = view.getZoom();
    let parts = 2;
    let called = false;
    function callback(complete) {
        --parts;
        if (called) {
            return;
        }
        if (parts === 0 || !complete) {
            called = true;
            done(complete);
        }
    }
    view.animate(
        {
            center: location,
            duration: duration,
        },
        callback
    );
    view.animate(
        {
            zoom: zoom - 1,
            duration: duration / 2,
        },
        {
            zoom: zoom,
            duration: duration / 2,
        },
        callback
    );
}

onClick('fly-to-bern', function () {
    flyTo(bern, function () {});
});

onClick('rotate-around-rome', function () {
    // Rotation animation takes the shortest arc, so animate in two parts
    const rotation = view.getRotation();
    view.animate(
        {
            rotation: rotation + Math.PI,
            anchor: rome,
            easing: easeIn,
        },
        {
            rotation: rotation + 2 * Math.PI,
            anchor: rome,
            easing: easeOut,
        }
    );
});

function tour() {
    const locations = [london, bern, rome, moscow, istanbul];
    let index = -1;
    function next(more) {
        if (more) {
            ++index;
            if (index < locations.length) {
                const delay = index === 0 ? 0 : 750;
                setTimeout(function () {
                    flyTo(locations[index], next);
                }, delay);
            } else {
                alert('Tour complete');
            }
        } else {
            alert('Tour cancelled');
        }
    }
    next(true);
}

onClick('tour', tour);

const selectedStyle = new Style({
    fill: new Fill({
        color: 'rgba(255, 255, 255, 0.6)',
    }),
    stroke: new Stroke({
        color: 'rgba(255, 255, 255, 0.7)',
        width: 2,
    }),
});

const selectedFeatures = select.getFeatures();

dragBox.on('boxend', function () {
    const extent = dragBox.getGeometry().getExtent();
    const boxFeatures = vectorSource
        .getFeaturesInExtent(extent)
        .filter((feature) => feature.getGeometry().intersectsExtent(extent));

    // features that intersect the box geometry are added to the
    // collection of selected features

    // if the view is not obliquely rotated the box geometry and
    // its extent are equalivalent so intersecting features can
    // be added directly to the collection
    const rotation = map.getView().getRotation();
    const oblique = rotation % (Math.PI / 2) !== 0;

    // when the view is obliquely rotated the box extent will
    // exceed its geometry so both the box and the candidate
    // feature geometries are rotated around a common anchor
    // to confirm that, with the box geometry aligned with its
    // extent, the geometries intersect
    if (oblique) {
        const anchor = [0, 0];
        const geometry = dragBox.getGeometry().clone();
        geometry.rotate(-rotation, anchor);
        const extent = geometry.getExtent();
        boxFeatures.forEach(function (feature) {
            const geometry = feature.getGeometry().clone();
            geometry.rotate(-rotation, anchor);
            if (geometry.intersectsExtent(extent)) {
                selectedFeatures.push(feature);
            }
        });
    } else {
        selectedFeatures.extend(boxFeatures);
    }
});

// clear selection when drawing a new box and when clicking on the map
dragBox.on('boxstart', function () {
    selectedFeatures.clear();
});

const infoBox = document.getElementById('info');

selectedFeatures.on(['add', 'remove'], function () {
    const names = selectedFeatures.getArray().map(function (feature) {
        return feature.get('ECO_NAME');
    });
    if (names.length > 0) {
        infoBox.innerHTML = names.join(', ');
    } else {
        infoBox.innerHTML = 'None';
    }
});


function checkSize() {
    const small = map.getSize()[0] < 600;
    attribution.setCollapsible(small);
    attribution.setCollapsed(small);
}

window.addEventListener('resize', checkSize);
checkSize();

$('.ol-zoom-in, .ol-zoom-out').tooltip({
    placement: 'right',
    container: '#map-container',
});
$('.ol-rotate-reset, .ol-attribution button[title]').tooltip({
    placement: 'left',
    container: '#map-container',
});