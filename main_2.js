import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import {Attribution, defaults as defaultControls} from 'ol/control';

const attribution = new Attribution({
    collapsible: false,
});

const map = new Map({
    target: 'map-container',
    layers: [
        new VectorLayer({
            source: new VectorSource({
                format: new GeoJSON(),
                url: './data/countries.json',
            }),
        }),
    ],
    controls: defaultControls({attribution: false}).extend([attribution]),
    view: new View({
        center: [0, 0],
        zoom: 2,
    }),
});

function checkSize() {
    const small = map.getSize()[0] < 600;
    attribution.setCollapsible(small);
    attribution.setCollapsed(small);
}

window.addEventListener('resize', checkSize);
checkSize();
