import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import {Map, View} from 'ol';
import {fromLonLat} from 'ol/proj';
// fromLonLat方法能将坐标从经度/纬度转换为其他投影
import {easeIn, easeOut} from 'ol/easing';
import * as olProj from "ol/proj";
import { Vector as VectorLayer, Tile } from "ol/layer";
import Feature from "ol/Feature";
import { Point } from "ol/geom";
import { XYZ, Vector as VectorSource } from "ol/source";
import { Style, Icon, Fill, Stroke, Text } from "ol/style";
import GeoJSON from "ol/format/GeoJSON";

// 使用内置的OSM
// let source = new OSM();
//const tileLayer = new TileLayer({
//    source: source
//})
// 使用高德
let source = new XYZ({
    url: 'https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}'
});
// const tileLayer = new TileLayer({
//     source: new XYZ({
//         url: 'https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}'
//     })
// });

const view = new View({
    // center: fromLonLat([121.471441, 31.22733]),
    // center: fromLonLat([103.879389, 37.42613]),
    center: olProj.transform(
        [103.879389, 37.42613],//地图中心位置
        "EPSG:4326",
        "EPSG:3857"
    ),
    zoom: 7,// 缩放级别
    minZoom: 0,// 最小缩放级别
    maxZoom: 18,// 最大缩放级别
    constrainResolution: true// 因为存在非整数的缩放级别，所以设置该参数为true来让每次缩放结束后自动缩放到距离最近的一个整数级别，这个必须要设置，当缩放在非整数级别时地图会糊
});

// 初始化一个 openlayers 地图
let firstLayer = new TileLayer({
    visible: false,//控制图层的显示和隐藏
    source: new XYZ({
        url: "gis2d/terrain/{z}/{x}/{y}.jpg"//图层
    })
});
let lasterLayer = new TileLayer({
    visible: true,//控制图层的显示和隐藏
    source: new XYZ({
        url: "gis2d/terrain/{z}/{x}/{y}.jpg"//图层
    })
});

let oneLayer =  new TileLayer({
    source: source,
});

const map = new Map({
    target: 'map-container',
    layers: [oneLayer, firstLayer, lasterLayer],
    loadTilesWhileAnimating: true,//将这个设置为true，默认为false
    view: view,
});

document.getElementById('zoom-out').onclick = function () {
    const view = map.getView();
    const zoom = view.getZoom();
    view.setZoom(zoom - 1);
};

document.getElementById('zoom-in').onclick = function () {
    const view = map.getView();
    const zoom = view.getZoom();
    view.setZoom(zoom + 1);
};

const london = fromLonLat([-0.12755, 51.507222]);
const moscow = fromLonLat([37.6178, 55.7517]);
const istanbul = fromLonLat([28.9744, 41.0128]);
const rome = fromLonLat([12.5, 41.9]);
const bern = fromLonLat([7.4458, 46.95]);

function onClick(id, callback) {
    document.getElementById(id).addEventListener('click', callback);
}

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
