import { useEffect, useState } from "react";
import { apiClient } from "../../services/apiClient";

type RouteStop = {
  demandId: string;
  requestId: string;
  latitude: number;
  longitude: number;
  quantity: number;
  unit: string;
  priority: string;
};

type Route = {
  vehicleId: string;
  stops: RouteStop[];
  distanceMeters: number;
  load: number;
  capacity: number;
  capacityUnit?: string;
};

type RoutingResponse = {
  status: string;
  routes: Route[];
  unassignedDemands?: string[];
};

export default function RoutingPanel() {
  const [result, setResult] = useState<RoutingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function optimizeRoutes() {
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.optimizeRoutes();
      const data = response.data as RoutingResponse;

      setResult(data);

      window.dispatchEvent(
        new CustomEvent("routing:updated", {
          detail: data,
        })
      );
    } catch (err) {
      console.error("Route optimization error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Route optimization failed"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    optimizeRoutes();
  }, []);

  const totalDistance =
    result?.routes.reduce(
      (sum, route) => sum + route.distanceMeters,
      0
    ) ?? 0;

  const totalStops =
    result?.routes.reduce(
      (sum, route) => sum + route.stops.length,
      0
    ) ?? 0;

  return (
    <section
      data-routing-panel="true"
      style={{
        width: "100%",
        height: "auto",
        minHeight: 0,
        maxHeight: "none",
        padding: "12px 0",
        margin: 0,
        borderTop: "1px solid rgba(11, 33, 25, 0.08)",
        borderBottom: "1px solid rgba(11, 33, 25, 0.08)",
        background: "#f7f7f2",
        boxSizing: "border-box",
        overflow: "visible",
        display: "block",
        flex: "0 0 auto",
        alignSelf: "stretch",
        position: "relative",
        zIndex: 10,
        opacity: 1,
        visibility: "visible",
        transform: "none",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          marginBottom: result ? "10px" : "0",
          minHeight: 0,
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: 700,
              color: "#0d3b2e",
            }}
          >
            Route Optimization
          </h2>

          <p
            style={{
              margin: "4px 0 0",
              fontSize: "12px",
              color: "#666",
            }}
          >
            Capacity-aware disaster relief vehicle routing
          </p>
        </div>

        <button
          onClick={optimizeRoutes}
          disabled={loading}
          style={{
            padding: "8px 14px",
            border: "none",
            borderRadius: "7px",
            background: loading ? "#999" : "#0d3b2e",
            color: "white",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 600,
            fontSize: "12px",
            whiteSpace: "nowrap",
          }}
        >
          {loading ? "Optimizing..." : "Optimize Routes"}
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div
          style={{
            padding: "10px 12px",
            marginBottom: "10px",
            borderRadius: "7px",
            background: "#ffe5e5",
            color: "#b00020",
            fontSize: "12px",
          }}
        >
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading && !result && (
        <div
          style={{
            padding: "12px",
            textAlign: "center",
            color: "#666",
            minHeight: 0,
            height: "auto",
            fontSize: "12px",
          }}
        >
          <p style={{ margin: 0 }}>
            Calculating optimal routes...
          </p>

          <p
            style={{
              margin: "5px 0 0",
              color: "#888",
            }}
          >
            OR-Tools is processing vehicle capacity and demand.
          </p>
        </div>
      )}

      {/* RESULTS */}
      {result && (
        <div
          style={{
            width: "100%",
            height: "auto",
            minHeight: 0,
            display: "block",
          }}
        >
          {/* SUMMARY CARDS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(4, minmax(0, 1fr))",
              gap: "10px",
              width: "100%",
              height: "auto",
              boxSizing: "border-box",
            }}
          >
            {/* STATUS */}
            <div
              style={{
                padding: "10px 12px",
                background: "#fff",
                borderRadius: "8px",
                border: "1px solid #e5e5e5",
                boxSizing: "border-box",
              }}
            >
              <small
                style={{
                  color: "#777",
                  fontSize: "10px",
                }}
              >
                STATUS
              </small>

              <div
                style={{
                  marginTop: "4px",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#0d3b2e",
                }}
              >
                {result.status}
              </div>
            </div>

            {/* VEHICLES */}
            <div
              style={{
                padding: "10px 12px",
                background: "#fff",
                borderRadius: "8px",
                border: "1px solid #e5e5e5",
                boxSizing: "border-box",
              }}
            >
              <small
                style={{
                  color: "#777",
                  fontSize: "10px",
                }}
              >
                VEHICLES USED
              </small>

              <div
                style={{
                  marginTop: "4px",
                  fontSize: "14px",
                  fontWeight: 700,
                }}
              >
                {result.routes.length}
              </div>
            </div>

            {/* STOPS */}
            <div
              style={{
                padding: "10px 12px",
                background: "#fff",
                borderRadius: "8px",
                border: "1px solid #e5e5e5",
                boxSizing: "border-box",
              }}
            >
              <small
                style={{
                  color: "#777",
                  fontSize: "10px",
                }}
              >
                TOTAL STOPS
              </small>

              <div
                style={{
                  marginTop: "4px",
                  fontSize: "14px",
                  fontWeight: 700,
                }}
              >
                {totalStops}
              </div>
            </div>

            {/* DISTANCE */}
            <div
              style={{
                padding: "10px 12px",
                background: "#fff",
                borderRadius: "8px",
                border: "1px solid #e5e5e5",
                boxSizing: "border-box",
              }}
            >
              <small
                style={{
                  color: "#777",
                  fontSize: "10px",
                }}
              >
                TOTAL DISTANCE
              </small>

              <div
                style={{
                  marginTop: "4px",
                  fontSize: "14px",
                  fontWeight: 700,
                }}
              >
                {(totalDistance / 1000).toFixed(2)} km
              </div>
            </div>
          </div>

          {/* ROUTES */}
          <div
            style={{
              marginTop: "10px",
              display: "grid",
              gridTemplateColumns:
                "repeat(2, minmax(0, 1fr))",
              gap: "10px",
              alignItems: "start",
              width: "100%",
              height: "auto",
              boxSizing: "border-box",
            }}
          >
            {result.routes.slice(0, 4).map((route) => {
              const loadPercentage =
                route.capacity > 0
                  ? Math.min(
                      (route.load / route.capacity) * 100,
                      100
                    )
                  : 0;

              return (
                <div
                  key={route.vehicleId}
                  style={{
                    background: "#fff",
                    borderRadius: "8px",
                    padding: "12px",
                    border: "1px solid #e5e5e5",
                    boxSizing: "border-box",
                    minWidth: 0,
                    height: "auto",
                    overflow: "hidden",
                  }}
                >
                  {/* VEHICLE HEADER */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        minWidth: 0,
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "14px",
                          color: "#0d3b2e",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        🚚 {route.vehicleId}
                      </h3>

                      <p
                        style={{
                          margin: "4px 0 0",
                          color: "#666",
                          fontSize: "11px",
                        }}
                      >
                        {(route.distanceMeters / 1000).toFixed(2)} km
                        {" • "}
                        {route.stops.length} stops
                      </p>
                    </div>

                    <strong
                      style={{
                        fontSize: "12px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {route.load} / {route.capacity}{" "}
                      {route.capacityUnit ?? ""}
                    </strong>
                  </div>

                  {/* LOAD BAR */}
                  <div
                    style={{
                      height: "6px",
                      background: "#ddd",
                      borderRadius: "10px",
                      overflow: "hidden",
                      margin: "8px 0 0",
                    }}
                  >
                    <div
                      style={{
                        width: `${loadPercentage}%`,
                        height: "100%",
                        background:
                          loadPercentage > 90
                            ? "#e74c3c"
                            : "#4ade80",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/*
          ============================================================
          UNASSIGNED DEMANDS — COMMENTED OUT
          ============================================================

          {result.unassignedDemands &&
            result.unassignedDemands.length > 0 && (
              <div
                style={{
                  marginTop: "10px",
                  padding: "10px 12px",
                  background: "#fff4e5",
                  borderRadius: "7px",
                  color: "#8a4b00",
                  fontSize: "11px",
                  boxSizing: "border-box",
                }}
              >
                <strong>Unassigned demands:</strong>{" "}
                {result.unassignedDemands.join(", ")}
              </div>
            )}

          ============================================================
          */}
        </div>
      )}
    </section>
  );
}