import React, { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import type { Incident } from "../../types/incident";
import type { ResourceItem } from "../../types/resource";
import type { Vehicle } from "../../types/vehicle";
import type { Shelter } from "../../types/shelter";

import styles from "./MapView.module.css";

interface RouteStop {
  demandId: string;
  requestId: string;
  latitude: number;
  longitude: number;
  quantity: number;
  unit: string;
  priority: string;
}

interface OptimizedRoute {
  vehicleId: string;
  stops: RouteStop[];
  distanceMeters: number;
  load: number;
  capacity: number;
  capacityUnit?: string;
}

interface RoutingResponse {
  status: string;
  routes: OptimizedRoute[];
  unassignedDemands?: string[];
}

interface MapViewProps {
  incidents?: Incident[];
  resources?: ResourceItem[];
  vehicles?: Vehicle[];
  shelters?: Shelter[];

  selectedIncident?: Incident | null;
  selectedVehicle?: Vehicle | null;

  hoveredIncidentId?: string | null;
  focusMode?: boolean;

  onSelectIncident?: (incident: Incident) => void;
  onSelectShelter?: (shelter: Shelter) => void;
  onSelectVehicle?: (vehicle: Vehicle) => void;

  layerFilters: {
    incidents: boolean;
    resources: boolean;
    vehicles: boolean;
    shelters: boolean;
    routes: boolean;
  };
}

export const MapView: React.FC<MapViewProps> = ({
  incidents = [],
  resources = [],
  vehicles = [],
  shelters = [],
  selectedIncident,
  selectedVehicle,
  hoveredIncidentId,
  focusMode = false,
  onSelectIncident,
  onSelectShelter,
  onSelectVehicle,
  layerFilters,
}) => {
  const mapContainerRef =
    useRef<HTMLDivElement>(null);

  const mapRef =
    useRef<maplibregl.Map | null>(null);

  const markersRef =
    useRef<maplibregl.Marker[]>([]);

  const incidentMarkerEls =
    useRef<Map<string, HTMLElement>>(
      new Map()
    );

  const [routingResult, setRoutingResult] =
    useState<RoutingResponse | null>(null);

  /*
   * Receive optimized routes from RoutingPanel.
   */
  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent =
        event as CustomEvent<RoutingResponse>;

      if (!customEvent.detail) return;

      setRoutingResult(customEvent.detail);
    };

    window.addEventListener(
      "routing:updated",
      handler
    );

    return () => {
      window.removeEventListener(
        "routing:updated",
        handler
      );
    };
  }, []);

  /*
   * Initialize MapLibre.
   */
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,

      style:
        "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",

      center: [77.22, 28.61],

      zoom: 5,

      minZoom: 3,

      maxZoom: 18,
    });

    map.addControl(
      new maplibregl.NavigationControl({
        showCompass: false,
      }),
      "bottom-right"
    );

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  /*
   * Draw incidents, shelters,
   * vehicles and resources.
   */
  useEffect(() => {
    const map = mapRef.current;

    if (!map) return;

    markersRef.current.forEach((marker) =>
      marker.remove()
    );

    markersRef.current = [];

    incidentMarkerEls.current.clear();

    /*
     * INCIDENTS
     */
    if (layerFilters.incidents) {
      incidents.forEach((incident) => {
        // Protect the map from incomplete backend data.
        if (
          !incident.coordinates ||
          incident.coordinates.lng === undefined ||
          incident.coordinates.lat === undefined
        ) {
          console.warn(
            "SAKSHAM: Incident skipped because coordinates are missing:",
            incident
          );
          return;
        }

        const el =
          document.createElement("div");

        el.className = `${styles.marker} ${
          incident.severity === "CRITICAL"
            ? styles.markerCritical
            : incident.severity === "HIGH"
            ? styles.markerHigh
            : styles.markerMedium
        }`;

        el.setAttribute(
          "data-incident-id",
          incident.id
        );

        const dot =
          document.createElement("div");

        dot.className =
          styles.markerDot;

        el.appendChild(dot);

        el.addEventListener(
          "click",
          (e) => {
            e.stopPropagation();

            onSelectIncident?.(
              incident
            );
          }
        );

        const popup =
          new maplibregl.Popup({
            offset: 15,
            closeButton: false,
          }).setHTML(`
            <div class="${styles.mapPopup}">
              <span class="${styles.popupBadge}">
                ${incident.severity}
              </span>

              <h4 class="${styles.popupTitle}">
                ${incident.type.replace(
                  /_/g,
                  " "
                )}
              </h4>

              <p class="${styles.popupLoc}">
                ${incident.location}
              </p>

              ${
                incident.displacedCount
                  ? `<p class="${styles.popupCapText}">
                      ~${incident.displacedCount}
                      displaced
                    </p>`
                  : ""
              }
            </div>
          `);

        const marker =
          new maplibregl.Marker({
            element: el,
          })
            .setLngLat([
              Number(incident.coordinates.lng),
              Number(incident.coordinates.lat),
            ])
            .setPopup(popup)
            .addTo(map);

        markersRef.current.push(
          marker
        );

        incidentMarkerEls.current.set(
          incident.id,
          el
        );
      });
    }

    /*
     * SHELTERS
     */
    if (layerFilters.shelters) {
      shelters.forEach((shelter) => {
        // Protect the map from incomplete backend data.
        if (
          !shelter.coordinates ||
          shelter.coordinates.lng === undefined ||
          shelter.coordinates.lat === undefined
        ) {
          console.warn(
            "SAKSHAM: Shelter skipped because coordinates are missing:",
            shelter
          );
          return;
        }

        const el =
          document.createElement("div");

        el.className = `${styles.marker} ${styles.markerShelter} ${
          shelter.status === "FULL"
            ? styles.markerShelterFull
            : ""
        }`;

        const label =
          document.createElement("span");

        label.innerText = "S";

        el.appendChild(label);

        el.addEventListener(
          "click",
          (e) => {
            e.stopPropagation();

            onSelectShelter?.(
              shelter
            );
          }
        );

        const pct =
          shelter.capacityTotal > 0
            ? Math.round(
                (shelter.capacityOccupied /
                  shelter.capacityTotal) *
                  100
              )
            : 0;

        const popup =
          new maplibregl.Popup({
            offset: 15,
            closeButton: false,
          }).setHTML(`
            <div class="${styles.mapPopup}">
              <span class="${styles.popupBadge}">
                SHELTER · ${shelter.status}
              </span>

              <h4 class="${styles.popupTitle}">
                ${shelter.name}
              </h4>

              <p class="${styles.popupLoc}">
                ${shelter.locationName}
              </p>

              <p class="${styles.popupCapText}">
                ${shelter.capacityOccupied}/
                ${shelter.capacityTotal}
                occupied · ${pct}% full
              </p>
            </div>
          `);

        const marker =
          new maplibregl.Marker({
            element: el,
          })
            .setLngLat([
              Number(shelter.coordinates.lng),
              Number(shelter.coordinates.lat),
            ])
            .setPopup(popup)
            .addTo(map);

        markersRef.current.push(
          marker
        );
      });
    }

    /*
     * VEHICLES
     *
     * IMPORTANT:
     * Backend vehicle data may sometimes arrive
     * without a location object.
     *
     * We skip such vehicles instead of allowing
     * vehicle.location.lng to crash the whole map.
     */
    if (layerFilters.vehicles) {
      vehicles.forEach((vehicle) => {

        if (
          !vehicle.location ||
          vehicle.location.lng === undefined ||
          vehicle.location.lat === undefined
        ) {
          console.warn(
            "SAKSHAM: Vehicle skipped because location is missing:",
            vehicle
          );

          return;
        }

        const el =
          document.createElement("div");

        el.className = `${styles.marker} ${
          styles.markerVehicle
        } ${
          styles[
            "markerVehicle" +
              vehicle.status
          ] || ""
        }`;

        const arrow =
          document.createElement("div");

        arrow.className =
          styles.vehicleInner;

        el.appendChild(arrow);

        el.addEventListener(
          "click",
          (e) => {
            e.stopPropagation();

            onSelectVehicle?.(
              vehicle
            );
          }
        );

        const popup =
          new maplibregl.Popup({
            offset: 15,
            closeButton: false,
          }).setHTML(`
            <div class="${styles.mapPopup}">
              <span class="${styles.popupBadge}">
                ${vehicle.type ?? "VEHICLE"} ·
                ${vehicle.status ?? "UNKNOWN"}
              </span>

              <h4 class="${styles.popupTitle}">
                ${vehicle.name ?? vehicle.id ?? "Vehicle"}
              </h4>

              <p class="${styles.popupCapText}">
                Capacity: ${vehicle.capacity ?? "N/A"}
              </p>
            </div>
          `);

        const marker =
          new maplibregl.Marker({
            element: el,
          })
            .setLngLat([
              Number(vehicle.location.lng),
              Number(vehicle.location.lat),
            ])
            .setPopup(popup)
            .addTo(map);

        markersRef.current.push(
          marker
        );
      });
    }

    /*
     * RESOURCES
     */
    if (layerFilters.resources) {
      resources.forEach((res) => {
        if (
          !res.coordinates ||
          res.coordinates.lng === undefined ||
          res.coordinates.lat === undefined
        ) {
          console.warn(
            "SAKSHAM: Resource skipped because coordinates are missing:",
            res
          );

          return;
        }

        const el =
          document.createElement("div");

        el.className = `${styles.marker} ${
          styles.markerResource
        }`;

        const dot =
          document.createElement("div");

        dot.className =
          styles.markerDot;

        el.appendChild(dot);

        const popup =
          new maplibregl.Popup({
            offset: 15,
            closeButton: false,
          }).setHTML(`
            <div class="${styles.mapPopup}">
              <span class="${styles.popupBadge}">
                ${res.category} ·
                ${res.status}
              </span>

              <h4 class="${styles.popupTitle}">
                ${res.name}
              </h4>

              <p class="${styles.popupLoc}">
                ${res.locationName}
              </p>

              <p class="${styles.popupCapText}">
                Stock:
                ${res.quantity}
                ${res.unit}
              </p>
            </div>
          `);

        const marker =
          new maplibregl.Marker({
            element: el,
          })
            .setLngLat([
              Number(res.coordinates.lng),
              Number(res.coordinates.lat),
            ])
            .setPopup(popup)
            .addTo(map);

        markersRef.current.push(
          marker
        );
      });
    }
  }, [
    incidents,
    resources,
    vehicles,
    shelters,
    layerFilters,
    onSelectIncident,
    onSelectShelter,
    onSelectVehicle,
  ]);

  /*
   * Hover incident.
   */
  useEffect(() => {
    incidentMarkerEls.current.forEach(
      (el, id) => {
        if (id === hoveredIncidentId) {
          el.classList.add(
            styles.markerHovered
          );
        } else {
          el.classList.remove(
            styles.markerHovered
          );
        }
      }
    );
  }, [hoveredIncidentId]);

  /*
   * Focus selected incident.
   */
  useEffect(() => {
    incidentMarkerEls.current.forEach(
      (el, id) => {
        if (!focusMode) {
          el.classList.remove(
            styles.markerDimmed
          );

          el.classList.remove(
            styles.markerActive
          );

          return;
        }

        if (
          selectedIncident &&
          id === selectedIncident.id
        ) {
          el.classList.remove(
            styles.markerDimmed
          );

          el.classList.add(
            styles.markerActive
          );
        } else {
          el.classList.add(
            styles.markerDimmed
          );

          el.classList.remove(
            styles.markerActive
          );
        }
      }
    );
  }, [
    focusMode,
    selectedIncident,
  ]);

  /*
   * Fly to selected incident.
   */
  useEffect(() => {
    const map = mapRef.current;

    if (
      !map ||
      !selectedIncident ||
      !selectedIncident.coordinates
    ) {
      return;
    }

    if (
      selectedIncident.coordinates.lng === undefined ||
      selectedIncident.coordinates.lat === undefined
    ) {
      return;
    }

    map.flyTo({
      center: [
        Number(selectedIncident.coordinates.lng),
        Number(selectedIncident.coordinates.lat),
      ],
      zoom: 14,
      essential: true,
      duration: 1000,
    });
  }, [selectedIncident]);

  /*
   * Fly to selected vehicle.
   *
   * IMPORTANT:
   * Protect against selected vehicles without
   * location information.
   */
  useEffect(() => {
    const map = mapRef.current;

    if (
      !map ||
      !selectedVehicle ||
      !selectedVehicle.location
    ) {
      return;
    }

    if (
      selectedVehicle.location.lng === undefined ||
      selectedVehicle.location.lat === undefined
    ) {
      return;
    }

    map.flyTo({
      center: [
        Number(selectedVehicle.location.lng),
        Number(selectedVehicle.location.lat),
      ],
      zoom: 14,
      essential: true,
      duration: 1000,
    });
  }, [selectedVehicle]);

  /*
   * DRAW OPTIMIZED ROUTES
   *
   * Backend:
   *
   * vehicle
   *   ↓
   * demand 1
   *   ↓
   * demand 2
   *   ↓
   * demand 3
   *
   * We draw the actual optimized
   * sequence returned by OR-Tools.
   */
  useEffect(() => {
    const map = mapRef.current;

    if (!map) return;

    const drawRoutes = () => {
      /*
       * Remove previous optimized routes.
       */
      const styleLayers =
        map.getStyle()?.layers || [];

      styleLayers.forEach((layer) => {
        if (
          layer.id.startsWith(
            "optimized-route-"
          )
        ) {
          try {
            map.removeLayer(layer.id);
          } catch {}
        }
      });

      /*
       * Remove previous sources.
       */
      const sources =
        map.getStyle()?.sources || {};

      Object.keys(sources).forEach(
        (sourceId) => {
          if (
            sourceId.startsWith(
              "optimized-route-"
            )
          ) {
            try {
              map.removeSource(
                sourceId
              );
            } catch {}
          }
        }
      );

      if (
        !layerFilters.routes ||
        !routingResult?.routes
      ) {
        return;
      }

      /*
       * Create lookup of frontend vehicles.
       */
      const vehicleLookup =
        new Map(
          vehicles.map((vehicle) => [
            vehicle.id,
            vehicle,
          ])
        );

      /*
       * Draw every optimized route.
       */
      routingResult.routes.forEach(
        (route, routeIndex) => {
          if (!route.stops?.length)
            return;

          const frontendVehicle =
            vehicleLookup.get(
              route.vehicleId
            );

          /*
           * Backend vehicleId is
           * VEH-IND-001 etc.
           *
           * Frontend vehicle.id may
           * be UUID, so also search
           * by vehicleId if available.
           */
          const vehicle =
            frontendVehicle ||
            vehicles.find(
              (v: any) =>
                v.vehicleId ===
                route.vehicleId
            );

          if (!vehicle) {
            console.warn(
              "Vehicle not found:",
              route.vehicleId
            );
          }

          const coordinates: [
            number,
            number
          ][] = [];

          /*
           * Start from vehicle location.
           *
           * If vehicle exists but has no
           * location, start from the first
           * demand instead.
           */
          if (
            vehicle &&
            vehicle.location &&
            vehicle.location.lng !== undefined &&
            vehicle.location.lat !== undefined
          ) {
            coordinates.push([
              Number(vehicle.location.lng),
              Number(vehicle.location.lat),
            ]);
          } else {
            /*
             * If vehicle isn't found or has
             * no location, start from first
             * demand.
             */
            coordinates.push([
              Number(route.stops[0].longitude),
              Number(route.stops[0].latitude),
            ]);
          }

          /*
           * Add optimized demand
           * sequence.
           */
          route.stops.forEach((stop) => {
            if (
              stop.longitude === undefined ||
              stop.latitude === undefined
            ) {
              return;
            }

            coordinates.push([
              Number(stop.longitude),
              Number(stop.latitude),
            ]);
          });

          if (coordinates.length < 2)
            return;

          const sourceId =
            `optimized-route-${routeIndex}`;

          const layerId =
            `optimized-route-${routeIndex}`;

          /*
           * Main route.
           */
          map.addSource(sourceId, {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {
                vehicleId:
                  route.vehicleId,
              },
              geometry: {
                type: "LineString",
                coordinates,
              },
            },
          });

          map.addLayer({
            id: layerId,
            type: "line",
            source: sourceId,

            layout: {
              "line-join": "round",
              "line-cap": "round",
            },

            paint: {
              "line-color":
                "#00D4FF",
              "line-width": 4,
              "line-opacity": 0.85,
            },
          });
        }
      );
    };

    if (map.isStyleLoaded()) {
      drawRoutes();
    } else {
      map.once(
        "style.load",
        drawRoutes
      );
    }

    return () => {
      const currentMap =
        mapRef.current;

      if (!currentMap) return;

      const layers =
        currentMap
          .getStyle()
          ?.layers || [];

      layers.forEach((layer) => {
        if (
          layer.id.startsWith(
            "optimized-route-"
          )
        ) {
          try {
            currentMap.removeLayer(
              layer.id
            );
          } catch {}
        }
      });

      const sources =
        currentMap
          .getStyle()
          ?.sources || {};

      Object.keys(sources).forEach(
        (sourceId) => {
          if (
            sourceId.startsWith(
              "optimized-route-"
            )
          ) {
            try {
              currentMap.removeSource(
                sourceId
              );
            } catch {}
          }
        }
      );
    };
  }, [
    routingResult,
    vehicles,
    layerFilters.routes,
  ]);

  /*
   * Fit map to optimized routes.
   */
  useEffect(() => {
    const map = mapRef.current;

    if (
      !map ||
      !routingResult?.routes?.length ||
      !layerFilters.routes
    ) {
      return;
    }

    const bounds =
      new maplibregl.LngLatBounds();

    let hasCoordinates = false;

    routingResult.routes.forEach(
      (route) => {
        route.stops.forEach(
          (stop) => {
            if (
              stop.longitude === undefined ||
              stop.latitude === undefined
            ) {
              return;
            }

            bounds.extend([
              Number(stop.longitude),
              Number(stop.latitude),
            ]);

            hasCoordinates = true;
          }
        );
      }
    );

    if (hasCoordinates) {
      map.fitBounds(bounds, {
        padding: 80,
        maxZoom: 7,
        duration: 1200,
      });
    }
  }, [
    routingResult,
    layerFilters.routes,
  ]);

  return (
    <div className={styles.mapWrapper}>
      <div
        ref={mapContainerRef}
        className={styles.mapContainer}
      />

      <div
        className={styles.overlayOverlay}
      />
    </div>
  );
};

export default MapView;