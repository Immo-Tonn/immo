import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polygon } from 'react-leaflet';
import { Address } from '@shared/types/propertyTypes';
import { LatLngTuple } from 'leaflet';
import styles from './PropertyMap.module.css';

interface PropertyMapProps {
  address: Address;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ address }) => {
  const { district, zip, city, country } = address;

  const [polygonCoords, setPolygonCoords] = useState<LatLngTuple[][] | null>(
    null,
  );
  const [center, setCenter] = useState<LatLngTuple | null>(null);
  const [error, setError] = useState(false);

  const [query, setQuery] = useState(`${district}, ${zip} ${city}, ${country}`);

  useEffect(() => {
    const fetchBoundary = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&polygon_geojson=1&q=${encodeURIComponent(query)}`,
        );
        const data: any[] = await res.json();

        if (
          (!data || data.length === 0 || !data[0].geojson) &&
          query !== `${zip} ${city}, ${country}`
        ) {
          setQuery(`${zip} ${city}, ${country}`);
          return;
        }

        if (!data || data.length === 0 || !data[0].geojson) {
          setError(true);
          return;
        }

        const geojson = data[0].geojson;
        const coords: LatLngTuple[][] = [];

        if (geojson.type === 'Polygon') {
          // polygon: [ [lng, lat], [lng, lat], ... ]
          const polygon: LatLngTuple[] = geojson.coordinates[0].map(
            ([lng, lat]: [number, number]) => [lat, lng],
          );
          coords.push(polygon);
        } else if (geojson.type === 'MultiPolygon') {
          // geojson.coordinates: Array<Array<Array<[number, number]>>>
          coords.push(
            ...geojson.coordinates.flatMap(
              (polygon: Array<Array<[number, number]>>) =>
                polygon.map((ring: Array<[number, number]>) =>
                  ring.map(
                    ([lng, lat]: [number, number]) => [lat, lng] as LatLngTuple,
                  ),
                ),
            ),
          );
        }

        setPolygonCoords(coords);

        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setCenter([lat, lon]);
        setError(false);
      } catch {
        setError(true);
      }
    };

    fetchBoundary();
  }, [query, zip, city, country]);

  return (
    <section className={styles.mapSection}>
      <hr className={styles.hr} />
      <h2 className={styles.title}>KARTE</h2>

      <div className={styles.infoLine}>
        <span>{district},</span>{' '}
        <span>
          {zip} {city}
        </span>
      </div>

      <p className={styles.disclaimer}>
        Die vollständige Adresse der Immobilie erhalten Sie vom Anbieter.
      </p>

      {error ? (
        <p className={styles.error}>Karte konnte nicht geladen werden.</p>
      ) : polygonCoords && center ? (
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={true}
          dragging={true}
          zoomControl={true}
          doubleClickZoom={true}
          className={styles.map}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          />
          {polygonCoords.map((polygon, i) => (
            <Polygon
              key={i}
              positions={polygon}
              pathOptions={{ color: '#007BFF', weight: 2, fillOpacity: 0.2 }}
            />
          ))}
        </MapContainer>
      ) : (
        <p className={styles.loading}>Lade Karte...</p>
      )}
    </section>
  );
};

export default PropertyMap;
