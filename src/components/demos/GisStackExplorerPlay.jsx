import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from './miscToolsPlays.module.css';

const LAYERS = [
  {
    id: 'desktop',
    label: 'Десктоп ГИС',
    lead: 'Анализ слоёв, геообработка, печать карт',
    tools: ['QGIS', 'GRASS GIS', 'gvSIG'],
    task: 'Открыть Shapefile/GeoPackage, построить буфер 500 м вокруг объектов',
    cmd: '# QGIS Processing\nbuffer = processing.run(\n  "native:buffer",\n  {"INPUT": layer, "DISTANCE": 500}\n)',
    format: 'GeoPackage (.gpkg) — современная замена Shapefile',
  },
  {
    id: 'server',
    label: 'Сервер карт',
    lead: 'Публикация WMS/WFS/MVT для веб-клиентов',
    tools: ['GeoServer', 'MapServer', 'QGIS Server'],
    task: 'Опубликовать слой PostGIS как WMS',
    cmd: '# docker run -p 8080:8080 kartoza/geoserver\n# Layer → PostGIS datastore → Publish WMS',
    format: 'PostGIS geometry + SRID (EPSG:4326 / 3857)',
  },
  {
    id: 'web',
    label: 'Веб-карты',
    lead: 'Интерактивные карты в браузере',
    tools: ['Leaflet', 'OpenLayers', 'Mapbox GL JS'],
    task: 'Показать GeoJSON слой с popup по клику',
    cmd: "L.geoJSON(data, {\n  onEachFeature: (f, layer) =>\n    layer.bindPopup(f.properties.name)\n}).addTo(map);",
    format: 'GeoJSON, vector tiles (MVT)',
  },
  {
    id: 'python',
    label: 'Python-стек',
    lead: 'ETL, аналитика, Jupyter-визуализация',
    tools: ['GeoPandas', 'Shapely', 'Folium', 'GDAL'],
    task: 'Прочитать слой, перепроецировать, сохранить',
    cmd: 'import geopandas as gpd\ngdf = gpd.read_file("cities.gpkg")\ngdf = gdf.to_crs(3857)\ngdf.to_file("out.gpkg")',
    format: 'Parquet + GeoArrow для больших данных',
  },
];

function GisStackExplorerPlayInner() {
  const [layerId, setLayerId] = useState('desktop');
  const l = LAYERS.find((x) => x.id === layerId) ?? LAYERS[0];

  return (
    <DemoShell>
      <DemoCard
        title="Слои геостека"
        subtitle="От десктопного анализа до публикации карты в браузере"
      >
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          {LAYERS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={clsx(toolStyles.chip, layerId === item.id && toolStyles.chipActive)}
              onClick={() => setLayerId(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className={styles.lead}>{l.lead}</p>
        <div className={styles.badgeRow}>
          {l.tools.map((t) => (
            <span key={t} className={styles.badgeGood}>
              {t}
            </span>
          ))}
        </div>
        <table className={styles.compareTable} style={{marginTop: '0.65rem'}}>
          <tbody>
            <tr>
              <th>Типовая задача</th>
              <td>{l.task}</td>
            </tr>
            <tr>
              <th>Формат данных</th>
              <td>{l.format}</td>
            </tr>
          </tbody>
        </table>
        <pre className={styles.codeSample}>{l.cmd}</pre>
      </DemoCard>
    </DemoShell>
  );
}

export default GisStackExplorerPlayInner;
