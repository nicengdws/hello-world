import Map from 'ol/Map'
import View from 'ol/View'
import {Tile as TileLayer} from 'ol/layer'
import {XYZ} from 'ol/source'
import {defaults, FullScreen, MousePosition, ScaleLine} from 'ol/control'

import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import {Icon, Style, Text} from 'ol/style'
import GeoJSON from "ol/format/GeoJSON";
import CircleStyle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import LineString from "ol/geom/LineString";
import Stroke from "ol/style/Stroke";
import GPS from "./gps";
import mapTools from "./mapTools";

// 使用内置的OSM
//const tileLayer = new TileLayer({
//    source: new OSM()
//})
// 使用高德
const tileLayer = new TileLayer({
    source: new XYZ({
        url: 'https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}'
    })
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

let map = new Map({
    target: 'map-container', // DOM容器
    layers: [
        tileLayer,
        // vectorLayer,
        // pointLayer
    ],
    view: new View({
        // center: fromLonLat([120.771441, 30.756433]),//地图中心点
        center: [121.525741, 31.15453],//地图中心点
        zoom: 12,// 缩放级别
        minZoom: 0,// 最小缩放级别
        maxZoom: 18,// 最大缩放级别
        projection: 'EPSG:4326',
        constrainResolution: true// 因为存在非整数的缩放级别，所以设置该参数为true来让每次缩放结束后自动缩放到距离最近的一个整数级别，这个必须要设置，当缩放在非整数级别时地图会糊
    }),
    // interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
    controls: defaults().extend([
        new FullScreen(), // 全屏
        new MousePosition(), // 显示鼠标当前位置的经纬度
        new ScaleLine()// 显示比例尺
    ]),
});

// // 你可以给元素添加任意的内容或属性或样式，也可以给元素绑定事件
// let el = document.createElement('div');
// let longitude = 120.771441;
// let latitude = 30.756433;
// let marker = new Overlay({
//     element: el,// 要显示的元素
//     position: fromLonLat([longitude, latitude], 'EPSG:4326'),// 地图投影的位置
//     offset: [-17, -17], // 元素显示的像素偏移量
//     autoPan: true, // 自动移动地图以完整的显示元素
// });
// // 添加到地图
// map.addOverlay(marker);
// // 从地图上删除
// // map.removeOverlay(marker);

// 实例化要素
let feature = new Feature({
    title: 'jiaxing',
    geometry: new Point([121.471441, 31.22733]) // 标签位置
});
// 如果需要给要素附加一些自定义数据
// feature.set('data', data);
// 设置样式，这里就是显示一张图片icon
// feature.setStyle([
//     new Style({
//         // image: new Icon({
//         //     anchor: [0.5, 1],// 显示位置
//         //     size: [32, 32],// 尺寸
//         //     // anchorYUnits: "pixels",
//         //     src: require('./image/truck.png')// 图片url
//         // }),
//         image: new Icon({
//             src: require("./image/arrow.png"),
//             anchor: [0.5, 1],
//             scale: 0.5,
//             size:[64,64],
//             rotateWithView: true,
//             // rotation: -rotation,
//         }),
//     })
// ]);
feature.setStyle([
    new Style({
        // image: new Icon({
        //     anchor: [0.5, 19],
        //     anchorYUnits: "pixels",
        //     src: require("./image/truck.png")
        // }),
        image: new CircleStyle({
            fill: new Fill({
                color: 'red',
            }),
            radius: 4,
        }),
    })
]);
// 矢量源
let source = new VectorSource({
    features: [feature]
});
// 实例化的时候也可以不添加feature，后续通过方法添加：source.addFeatures([feature])
// 清空feature：source.clear()

// 矢量图层
let pointLayer = new VectorLayer({
    source: source
});

// 样式除了可以设置在单个feature上，也可以统一设置在矢量图层上
/*
let vector = new VectorLayer({
    source: source,
    style: new Style({
        image: new Icon({
          anchor: [0.5, 1],// 显示位置
          size: [18, 28],// 尺寸
          src: require('../../assets/images/mouse_location_ing.png')// 图片url
        })
    })
})
*/
map.addLayer(pointLayer);

let paths = [];
const lng_lat = {"time":1624939932,"lng_lat":[{"lon":121.58470333333334,"lat":31.06425,"gtm":"2021-06-26 02:41:25","spd":0},{"lon":121.58470333333334,"lat":31.06425,"gtm":"2021-06-26 02:41:55","spd":0},{"lon":121.58468666666667,"lat":31.06425,"gtm":"2021-06-26 02:42:25","spd":0},{"lon":121.58438333333334,"lat":31.06413166666667,"gtm":"2021-06-26 02:42:55","spd":0},{"lon":121.58376,"lat":31.0641,"gtm":"2021-06-26 02:43:25","spd":11},{"lon":121.58344666666666,"lat":31.065383333333333,"gtm":"2021-06-26 02:43:55","spd":22},{"lon":121.583095,"lat":31.0667,"gtm":"2021-06-26 02:44:25","spd":11},{"lon":121.58298333333333,"lat":31.0672,"gtm":"2021-06-26 02:44:55","spd":0},{"lon":121.582815,"lat":31.067765,"gtm":"2021-06-26 02:45:25","spd":15},{"lon":121.582535,"lat":31.06945,"gtm":"2021-06-26 02:45:55","spd":15},{"lon":121.58478333333333,"lat":31.069665,"gtm":"2021-06-26 02:46:26","spd":34},{"lon":121.5878,"lat":31.0699,"gtm":"2021-06-26 02:46:56","spd":28},{"lon":121.5892,"lat":31.069931666666665,"gtm":"2021-06-26 02:47:25","spd":12},{"lon":121.58984,"lat":31.069966666666666,"gtm":"2021-06-26 02:47:55","spd":11},{"lon":121.59176666666667,"lat":31.06995,"gtm":"2021-06-26 02:48:25","spd":27},{"lon":121.59492,"lat":31.06985,"gtm":"2021-06-26 02:48:55","spd":41},{"lon":121.59788666666667,"lat":31.06985,"gtm":"2021-06-26 02:49:25","spd":21},{"lon":121.59911166666667,"lat":31.070216666666667,"gtm":"2021-06-26 02:49:55","spd":20},{"lon":121.59848,"lat":31.071065,"gtm":"2021-06-26 02:50:25","spd":9},{"lon":121.59764666666666,"lat":31.072133333333333,"gtm":"2021-06-26 02:50:55","spd":22},{"lon":121.59716666666667,"lat":31.072966666666666,"gtm":"2021-06-26 02:51:25","spd":0},{"lon":121.596815,"lat":31.073983333333334,"gtm":"2021-06-26 02:51:55","spd":19},{"lon":121.59644666666667,"lat":31.07565,"gtm":"2021-06-26 02:52:25","spd":32},{"lon":121.59584666666667,"lat":31.078215,"gtm":"2021-06-26 02:52:55","spd":25},{"lon":121.59576666666666,"lat":31.078665,"gtm":"2021-06-26 02:53:25","spd":0},{"lon":121.59515166666667,"lat":31.080231666666666,"gtm":"2021-06-26 02:53:55","spd":32},{"lon":121.59392,"lat":31.08245,"gtm":"2021-06-26 02:54:25","spd":29},{"lon":121.59362333333333,"lat":31.0836,"gtm":"2021-06-26 02:54:55","spd":9},{"lon":121.593295,"lat":31.0849,"gtm":"2021-06-26 02:55:25","spd":32},{"lon":121.592735,"lat":31.087466666666668,"gtm":"2021-06-26 02:55:55","spd":34},{"lon":121.592535,"lat":31.090216666666667,"gtm":"2021-06-26 02:56:25","spd":31},{"lon":121.59268,"lat":31.092215,"gtm":"2021-06-26 02:56:55","spd":36},{"lon":121.592815,"lat":31.0945,"gtm":"2021-06-26 02:57:25","spd":24},{"lon":121.59264,"lat":31.096415,"gtm":"2021-06-26 02:57:55","spd":23},{"lon":121.59248,"lat":31.0982,"gtm":"2021-06-26 02:58:25","spd":22},{"lon":121.59238333333333,"lat":31.099883333333334,"gtm":"2021-06-26 02:58:55","spd":26},{"lon":121.59224666666667,"lat":31.101983333333333,"gtm":"2021-06-26 02:59:25","spd":31},{"lon":121.59208666666666,"lat":31.104133333333333,"gtm":"2021-06-26 02:59:55","spd":30},{"lon":121.59184666666667,"lat":31.10635,"gtm":"2021-06-26 03:00:25","spd":28},{"lon":121.59158333333333,"lat":31.108565,"gtm":"2021-06-26 03:00:55","spd":29},{"lon":121.5914,"lat":31.110566666666667,"gtm":"2021-06-26 03:01:25","spd":30},{"lon":121.59118333333333,"lat":31.1128,"gtm":"2021-06-26 03:01:55","spd":24},{"lon":121.59116,"lat":31.113065,"gtm":"2021-06-26 03:02:25","spd":0},{"lon":121.590935,"lat":31.114233333333335,"gtm":"2021-06-26 03:02:55","spd":26},{"lon":121.590495,"lat":31.115916666666667,"gtm":"2021-06-26 03:03:25","spd":19},{"lon":121.59151166666666,"lat":31.116333333333333,"gtm":"2021-06-26 03:03:56","spd":12},{"lon":121.59331166666666,"lat":31.116433333333333,"gtm":"2021-06-26 03:04:26","spd":29},{"lon":121.5952,"lat":31.116581666666665,"gtm":"2021-06-26 03:04:56","spd":0},{"lon":121.595255,"lat":31.116581666666665,"gtm":"2021-06-26 03:05:26","spd":0},{"lon":121.595815,"lat":31.116631666666667,"gtm":"2021-06-26 03:05:56","spd":22},{"lon":121.59835166666667,"lat":31.117115,"gtm":"2021-06-26 03:06:26","spd":33},{"lon":121.60056,"lat":31.117531666666668,"gtm":"2021-06-26 03:06:56","spd":14},{"lon":121.60156666666667,"lat":31.118083333333335,"gtm":"2021-06-26 03:07:26","spd":22},{"lon":121.60104666666666,"lat":31.120665,"gtm":"2021-06-26 03:07:56","spd":35},{"lon":121.60043166666667,"lat":31.122866666666667,"gtm":"2021-06-26 03:08:26","spd":34},{"lon":121.59946333333333,"lat":31.125931666666666,"gtm":"2021-06-26 03:08:55","spd":45},{"lon":121.59824666666667,"lat":31.129615,"gtm":"2021-06-26 03:09:25","spd":54},{"lon":121.59692,"lat":31.133483333333334,"gtm":"2021-06-26 03:09:55","spd":51},{"lon":121.59531166666666,"lat":31.13675,"gtm":"2021-06-26 03:10:25","spd":49},{"lon":121.59363166666667,"lat":31.140515,"gtm":"2021-06-26 03:10:55","spd":54},{"lon":121.59208666666666,"lat":31.144331666666666,"gtm":"2021-06-26 03:11:25","spd":55},{"lon":121.59128666666666,"lat":31.1475,"gtm":"2021-06-26 03:11:55","spd":33},{"lon":121.5928,"lat":31.1496,"gtm":"2021-06-26 03:12:25","spd":33},{"lon":121.59538333333333,"lat":31.150381666666668,"gtm":"2021-06-26 03:12:56","spd":33},{"lon":121.5988,"lat":31.151415,"gtm":"2021-06-26 03:13:26","spd":46},{"lon":121.6026,"lat":31.152516666666667,"gtm":"2021-06-26 03:13:56","spd":49},{"lon":121.60666333333333,"lat":31.153583333333334,"gtm":"2021-06-26 03:14:26","spd":48},{"lon":121.61087166666667,"lat":31.154215,"gtm":"2021-06-26 03:14:55","spd":46},{"lon":121.61515166666666,"lat":31.1548,"gtm":"2021-06-26 03:15:25","spd":53},{"lon":121.61972,"lat":31.15535,"gtm":"2021-06-26 03:15:56","spd":52},{"lon":121.62418333333333,"lat":31.155933333333333,"gtm":"2021-06-26 03:16:26","spd":51},{"lon":121.62878333333333,"lat":31.156533333333332,"gtm":"2021-06-26 03:16:56","spd":54},{"lon":121.63343166666667,"lat":31.15705,"gtm":"2021-06-26 03:17:26","spd":55},{"lon":121.63776,"lat":31.157216666666667,"gtm":"2021-06-26 03:17:56","spd":42},{"lon":121.641015,"lat":31.1577,"gtm":"2021-06-26 03:18:26","spd":35},{"lon":121.64308,"lat":31.15965,"gtm":"2021-06-26 03:18:56","spd":38},{"lon":121.643415,"lat":31.1624,"gtm":"2021-06-26 03:19:26","spd":39},{"lon":121.64332,"lat":31.16555,"gtm":"2021-06-26 03:19:56","spd":42},{"lon":121.64323166666667,"lat":31.169,"gtm":"2021-06-26 03:20:26","spd":43},{"lon":121.64312,"lat":31.172581666666666,"gtm":"2021-06-26 03:20:56","spd":49},{"lon":121.643,"lat":31.176316666666665,"gtm":"2021-06-26 03:21:26","spd":50},{"lon":121.642895,"lat":31.1801,"gtm":"2021-06-26 03:21:56","spd":53},{"lon":121.64271166666667,"lat":31.184,"gtm":"2021-06-26 03:22:26","spd":51},{"lon":121.6424,"lat":31.187883333333332,"gtm":"2021-06-26 03:22:56","spd":56},{"lon":121.64204,"lat":31.191666666666666,"gtm":"2021-06-26 03:23:26","spd":45},{"lon":121.641615,"lat":31.1951,"gtm":"2021-06-26 03:23:56","spd":48},{"lon":121.64124666666666,"lat":31.1985,"gtm":"2021-06-26 03:24:26","spd":48},{"lon":121.64083166666667,"lat":31.202065,"gtm":"2021-06-26 03:24:56","spd":46},{"lon":121.64043166666667,"lat":31.205565,"gtm":"2021-06-26 03:25:26","spd":52},{"lon":121.64007166666667,"lat":31.209115,"gtm":"2021-06-26 03:25:56","spd":43},{"lon":121.63990333333334,"lat":31.21268166666667,"gtm":"2021-06-26 03:26:26","spd":49},{"lon":121.63990333333334,"lat":31.216166666666666,"gtm":"2021-06-26 03:26:56","spd":48},{"lon":121.63990333333334,"lat":31.219833333333334,"gtm":"2021-06-26 03:27:26","spd":47},{"lon":121.63998333333333,"lat":31.22338166666667,"gtm":"2021-06-26 03:27:56","spd":48},{"lon":121.640055,"lat":31.226416666666665,"gtm":"2021-06-26 03:28:26","spd":31},{"lon":121.640095,"lat":31.22805,"gtm":"2021-06-26 03:28:56","spd":13},{"lon":121.64254333333334,"lat":31.22855,"gtm":"2021-06-26 03:29:26","spd":36},{"lon":121.64615166666667,"lat":31.2291,"gtm":"2021-06-26 03:29:56","spd":46},{"lon":121.65012666666667,"lat":31.229783333333334,"gtm":"2021-06-26 03:30:26","spd":44},{"lon":121.6536,"lat":31.230333333333334,"gtm":"2021-06-26 03:30:56","spd":29},{"lon":121.65474333333333,"lat":31.23055,"gtm":"2021-06-26 03:31:26","spd":0},{"lon":121.655015,"lat":31.230616666666666,"gtm":"2021-06-26 03:31:56","spd":7},{"lon":121.65716666666667,"lat":31.231033333333333,"gtm":"2021-06-26 03:32:26","spd":39},{"lon":121.66082333333334,"lat":31.231683333333333,"gtm":"2021-06-26 03:32:56","spd":41},{"lon":121.664415,"lat":31.2323,"gtm":"2021-06-26 03:33:26","spd":43},{"lon":121.66772,"lat":31.23293333333333,"gtm":"2021-06-26 03:33:56","spd":26},{"lon":121.66874333333334,"lat":31.2332,"gtm":"2021-06-26 03:34:26","spd":0},{"lon":121.668815,"lat":31.2332,"gtm":"2021-06-26 03:34:56","spd":0},{"lon":121.668815,"lat":31.2332,"gtm":"2021-06-26 03:35:26","spd":0},{"lon":121.669,"lat":31.233231666666665,"gtm":"2021-06-26 03:35:56","spd":0},{"lon":121.66923166666666,"lat":31.2337,"gtm":"2021-06-26 03:36:26","spd":17},{"lon":121.66878333333334,"lat":31.2349,"gtm":"2021-06-26 03:36:56","spd":9},{"lon":121.66848,"lat":31.23565,"gtm":"2021-06-26 03:37:26","spd":11},{"lon":121.66818333333333,"lat":31.2364,"gtm":"2021-06-26 03:37:56","spd":10},{"lon":121.668015,"lat":31.236865,"gtm":"2021-06-26 03:38:26","spd":0},{"lon":121.668015,"lat":31.236883333333335,"gtm":"2021-06-26 03:38:56","spd":0},{"lon":121.66736666666667,"lat":31.237115,"gtm":"2021-06-26 03:39:26","spd":13},{"lon":121.66626333333333,"lat":31.23678333333333,"gtm":"2021-06-26 03:39:56","spd":16},{"lon":121.66518333333333,"lat":31.236731666666667,"gtm":"2021-06-26 03:40:25","spd":0},{"lon":121.66512666666667,"lat":31.23665,"gtm":"2021-06-26 03:40:55","spd":0},{"lon":121.66512666666667,"lat":31.23665,"gtm":"2021-06-26 03:41:26","spd":0},{"lon":121.66512666666667,"lat":31.23665,"gtm":"2021-06-26 03:41:56","spd":0},{"lon":121.66512666666667,"lat":31.23665,"gtm":"2021-06-26 03:42:25","spd":0},{"lon":121.66512666666667,"lat":31.23665,"gtm":"2021-06-26 03:42:55","spd":0},{"lon":121.66512666666667,"lat":31.23665,"gtm":"2021-06-26 03:43:25","spd":0},{"lon":121.66512666666667,"lat":31.23665,"gtm":"2021-06-26 03:43:55","spd":0},{"lon":121.66512666666667,"lat":31.23665,"gtm":"2021-06-26 03:44:25","spd":0},{"lon":121.66512666666667,"lat":31.23665,"gtm":"2021-06-26 03:44:55","spd":0},{"lon":121.66512666666667,"lat":31.23665,"gtm":"2021-06-26 03:45:25","spd":0},{"lon":121.66512666666667,"lat":31.23665,"gtm":"2021-06-26 03:45:55","spd":0},{"lon":121.66512666666667,"lat":31.23665,"gtm":"2021-06-26 03:46:25","spd":0},{"lon":121.66512666666667,"lat":31.23665,"gtm":"2021-06-26 03:46:55","spd":0},{"lon":121.66512666666667,"lat":31.23665,"gtm":"2021-06-26 03:47:25","spd":0},{"lon":121.66512666666667,"lat":31.23665,"gtm":"2021-06-26 03:47:55","spd":0},{"lon":121.66512666666667,"lat":31.23665,"gtm":"2021-06-26 03:48:25","spd":0},{"lon":121.66512666666667,"lat":31.23665,"gtm":"2021-06-26 03:48:55","spd":0},{"lon":121.66512666666667,"lat":31.23665,"gtm":"2021-06-26 03:49:25","spd":0},{"lon":121.66512666666667,"lat":31.23665,"gtm":"2021-06-26 03:49:55","spd":0},{"lon":121.66512666666667,"lat":31.23665,"gtm":"2021-06-26 03:50:25","spd":0}]};
console.log(lng_lat.lng_lat);

lng_lat.lng_lat.forEach(function (e,i) {
    // const tmpPoint = fromLonLat([e.lon, e.lat], 'EPSG:4326');
    const tmpPoint = GPS.gcj_encrypt(e.lat, e.lon);
    paths.push([tmpPoint.lon, tmpPoint.lat]);
});
console.log(paths);

let line_feature = new Feature();
let line_geom = new LineString(paths);
line_feature.setGeometry(line_geom);
line_feature.id = "line";
var starPoint = new Feature({
    geometry: new Point([paths[0][0], paths[0][1]]),
});
console.log(paths[0]);
starPoint.name = "起";
var endPoint = new Feature({
    geometry: new Point([
        paths[paths.length - 1][0],
        paths[paths.length - 1][1],
    ]),
});
console.log(paths[paths.length - 1]);
endPoint.name = "终";
// this.pointTranslation([paths[0][0], paths[0][1]]);

let polyLineLayer = new VectorLayer({
    source: new VectorSource({
        features: [starPoint, endPoint, line_feature]
    }),
    style: function(feature) {
        console.log(feature);
        let geometry = '';
        if (feature.id === "line") {
            geometry = feature.getGeometry();
        }
        console.log(feature.id);
        console.log(geometry);
        var name = feature.name;
        name = name ? name.substring(0, 1) : "";
        var color = "";
        if (name === "起") {
            color = "green";
        } else if (name === "终") {
            color = "red";
        }
        var styles = [
            // linestring
            new Style({
                image: new CircleStyle({
                    radius: 15,
                    fill: new Fill({
                        color: color,
                    }),
                }),
                stroke: new Stroke({
                    color: "#26BC58",
                    width: 6,
                    // lineDash:[10, 8]
                }),
                text: new Text({
                    text: name,
                    font: "bold 15px 微软雅黑",
                    fill: new Fill({
                        color: "black",
                    }),
                    textAlign: "center",
                    textBaseline: "middle",
                }),
            }),
        ];
        if (geometry) {
            console.log('geometry');
            geometry.forEachSegment(function(start, end) {
                if (start[0] === end[0] || start[1] === end[1]) return;
                var dx = end[0] - start[0];
                var dy = end[1] - start[1];
                var rotation = Math.atan2(dy, dx);
                console.log(rotation);
                // arrows
                styles.push(
                    new Style({
                        geometry: new Point(end),
                        image: new Icon({
                            src: require("./image/arrow.png"),
                            anchor: [0.5, 0.5],
                            scale: 0.25,
                            size:[32,32],
                            rotateWithView: true,
                            rotation: -rotation,
                        }),
                    })
                );
            });
        }
        return styles;
    },
});
// map.addLayer(polyLineLayer);

// let styles = function (resolution) {
//     // var geometry = line_feature.getGeometry();
//     var geometry = line_geom;
//     console.log(resolution);
//     var length = geometry.getLength();//获取线段长度
//     var radio = (50 * resolution) / length;
//     var dradio = 1;//投影坐标系，如3857等，在EPSG:4326下可以设置dradio=10000
//     var styles = [
//         new Style({
//             stroke: new Stroke({
//                 color: "green",
//                 width: 5,
//             })
//         })
//     ];
//     console.log(radio);
//     for (var i = 0; i <= 1; i += radio) {
//         var arrowLocation = geometry.getCoordinateAt(i);
//         geometry.forEachSegment(function (start, end) {
//             if (start[0] == end[0] || start[1] == end[1]) return;
//             var dx1 = end[0] - arrowLocation[0];
//             var dy1 = end[1] - arrowLocation[1];
//             var dx2 = arrowLocation[0] - start[0];
//             var dy2 = arrowLocation[1] - start[1];
//             if (dx1 != dx2 && dy1 != dy2) {
//                 if (Math.abs(dradio * dx1 * dy2 - dradio * dx2 * dy1) < 0.001) {
//                     var dx = end[0] - start[0];
//                     var dy = end[1] - start[1];
//                     var rotation = Math.atan2(dy, dx);
//                     styles.push(new Style({
//                         geometry: new Point(arrowLocation),
//                         image: new Icon({
//                             src: require("./image/arrow.png"),
//                             anchor: [0.75, 0.5],
//                             rotateWithView: false,
//                             rotation: -rotation + Math.PI
//                         })
//                     }));
//                 }
//             }
//         });
//     }
//     return styles;
// };
// line_feature.setStyle(styles);

const type = [{'color':'red', 'lonlat': [
    [121.597156,31.067935],
    [121.284658,31.257899],
    [121.757309,30.882329],
    [120.919457,31.130231],
    [121.325887,30.728794],
    [121.44101,32.11177],
    [120.524267,32.390549],
    [121.774327,30.879159],
    [121.75417,31.719854],
    [120.496575,32.119742],
    [120.764486,31.966804],
]},
    {'color':'green', 'lonlat': [
    [121.552143,31.320081],
        [121.464393,31.10793],
        [121.51827,31.192681],
        [121.284658,31.257899],
        [121.422542,31.342693],
        [121.222255,31.30789],
        [121.887511,31.008685]
    ]},
    {'color':'blue', 'lonlat':[
[121.284658,31.257899]
    ]}
];

let features = [];
let point;
type.forEach(function (element, index) {
    element.lonlat.forEach(function (e,i) {
        // var lat_lon = GPS.bd_decrypt(e[1],e[0]);
        var lat_lon = mapTools.baiduTomars({'lng': e[0],'lat': e[1]});
        console.log(lat_lon);
        point = new Feature({
            geometry: new Point([lat_lon.lng,lat_lon.lat]),
        });
        point.clstype = element.color;
        features.push(point);
    });
});

let pointsLayer = new VectorLayer({
    source: new VectorSource({
        features: features
    }),
    style: function(feature) {
        console.log(feature);
        var color = feature.clstype;
// color = '#156BB1'

        //构建svg的Image对象
        // svg图标代码
        var svg = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 30 30" enable-background="new 0 0 30 30" xml:space="preserve">'+
            '<path fill="'+color+'" d="M22.906,10.438c0,4.367-6.281,14.312-7.906,17.031c-1.719-2.75-7.906-12.665-7.906-17.031S10.634,2.531,15,2.531S22.906,6.071,22.906,10.438z"/>'+
            '<circle fill="#FFFFFF" cx="15" cy="10.677" r="3.291"/></svg>';
        //创建图片对象
        var mysvg = new Image();
        mysvg.src = 'data:image/svg+xml,' + escape(svg);

        //图标设置样式
        // var styles = [
        //     // linestring
        //     new Style({
        //         image: new CircleStyle({
        //             radius: 15,
        //             fill: new Fill({
        //                 color: color,
        //             }),
        //         }),
        //         stroke: new Stroke({
        //             color: "#26BC58",
        //             width: 6,
        //             // lineDash:[10, 8]
        //         }),
        //         text: new Text({
        //             text: name,
        //             font: "bold 15px 微软雅黑",
        //             fill: new Fill({
        //                 color: "black",
        //             }),
        //             textAlign: "center",
        //             textBaseline: "middle",
        //         }),
        //     }),
        // ];
        return [
            new Style({
                image: new Icon({
                    img: mysvg,    // 设置Image对象
                    imgSize: [30, 30],    // 及图标大小
                    anchor: [0.5, 1],
                })
            })
        ];
    },
});
map.addLayer(pointsLayer);