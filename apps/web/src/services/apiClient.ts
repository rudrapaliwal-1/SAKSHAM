/**
 * SAKSHAM Centralized API Client Service
 * Bridges React frontend modules to backend REST APIs.
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1";


// ============================================================
// GENERIC FETCH HELPER
// ============================================================

async function fetchJson<T>(
  path: string,
  options?: RequestInit
): Promise<{ data: T; meta?: any }> {

  const url = `${API_BASE_URL}${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {

    const errorBody = await response
      .json()
      .catch(() => ({}));

    throw new Error(
      errorBody?.error?.message ||
      errorBody?.detail ||
      `HTTP Error ${response.status}: ${response.statusText}`
    );
  }

  const json = await response.json();

  /*
   * Backend can return either:
   *
   * 1. Raw data:
   *    [...]
   *
   * 2. Wrapped data:
   *    {
   *      data: [...]
   *    }
   *
   * Normalize both formats into:
   *
   * {
   *    data: [...]
   * }
   */

  if (
    json !== null &&
    typeof json === "object" &&
    "data" in json
  ) {
    return json;
  }

  return {
    data: json,
  };
}


// ============================================================
// API CLIENT
// ============================================================

export const apiClient = {

  // ==========================================================
  // INCIDENTS
  // ==========================================================

  async getIncidents(params?: {
    status?: string;
    severity?: string;
    search?: string;
    region?: string;
    limit?: number;
    offset?: number;
  }) {

    const query = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, val]) => {

        if (
          val !== undefined &&
          val !== null &&
          val !== ""
        ) {
          query.set(key, String(val));
        }

      });
    }

    const queryString = query.toString();

    return fetchJson<any[]>(
      `/incidents${queryString ? `?${queryString}` : ""}`
    );
  },


  async getIncidentById(id: string) {
    return fetchJson<any>(
      `/incidents/${id}`
    );
  },


  async createIncident(data: any) {

    return fetchJson<any>(
      "/incidents",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },


  async updateIncident(
    id: string,
    data: any
  ) {

    return fetchJson<any>(
      `/incidents/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );
  },


  async updateIncidentStatus(
    id: string,
    status: string
  ) {

    return fetchJson<any>(
      `/incidents/${id}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }
    );
  },


  // ==========================================================
  // DEMANDS
  // ==========================================================

  async getDemands(params?: {
    status?: string;
    priority?: string;
    incidentId?: string;
    limit?: number;
    offset?: number;
  }) {

    const query = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, val]) => {

        if (
          val !== undefined &&
          val !== null &&
          val !== ""
        ) {
          query.set(key, String(val));
        }

      });
    }

    const queryString = query.toString();

    return fetchJson<any[]>(
      `/demands${queryString ? `?${queryString}` : ""}`
    );
  },


  async getDemandById(id: string) {

    return fetchJson<any>(
      `/demands/${id}`
    );
  },


  async createDemand(data: any) {

    return fetchJson<any>(
      "/demands",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },


  async updateDemand(
    id: string,
    data: any
  ) {

    return fetchJson<any>(
      `/demands/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );
  },


  async updateDemandStatus(
    id: string,
    status: string
  ) {

    return fetchJson<any>(
      `/demands/${id}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }
    );
  },


  // ==========================================================
  // RESOURCES
  // ==========================================================

  async getResources(params?: {
    category?: string;
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {

    const query = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, val]) => {

        if (
          val !== undefined &&
          val !== null &&
          val !== ""
        ) {
          query.set(key, String(val));
        }

      });
    }

    const queryString = query.toString();

    return fetchJson<any[]>(
      `/resources${queryString ? `?${queryString}` : ""}`
    );
  },


  async getResourceById(id: string) {

    return fetchJson<any>(
      `/resources/${id}`
    );
  },


  // ==========================================================
  // VEHICLES
  // ==========================================================

  async getVehicles(params?: {
    status?: string;
    type?: string;
    limit?: number;
    offset?: number;
  }) {

    const query = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, val]) => {

        if (
          val !== undefined &&
          val !== null &&
          val !== ""
        ) {
          query.set(key, String(val));
        }

      });
    }

    const queryString = query.toString();

    return fetchJson<any[]>(
      `/vehicles${queryString ? `?${queryString}` : ""}`
    );
  },


  async getVehicleById(id: string) {

    return fetchJson<any>(
      `/vehicles/${id}`
    );
  },


  // ==========================================================
  // SHELTERS
  // ==========================================================

  async getShelters(params?: {
    status?: string;
    region?: string;
    limit?: number;
    offset?: number;
  }) {

    const query = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, val]) => {

        if (
          val !== undefined &&
          val !== null &&
          val !== ""
        ) {
          query.set(key, String(val));
        }

      });
    }

    const queryString = query.toString();

    return fetchJson<any[]>(
      `/shelters${queryString ? `?${queryString}` : ""}`
    );
  },


  async getShelterById(id: string) {

    return fetchJson<any>(
      `/shelters/${id}`
    );
  },


  // ==========================================================
  // INCIDENT TIMELINE
  // ==========================================================

  async getIncidentTimeline(
    incidentId: string
  ) {

    return fetchJson<any[]>(
      `/incidents/${incidentId}/timeline`
    );
  },


  async createIncidentTimelineEvent(
    incidentId: string,
    data: {
      eventType: string;
      message: string;
      actorId?: string;
      metadata?: any;
    }
  ) {

    return fetchJson<any>(
      `/incidents/${incidentId}/timeline`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },


  // ==========================================================
  // MATCHING
  // ==========================================================

  async getMatchingRecommendations(
    demandId: string
  ) {

    return fetchJson<any>(
      `/matching/demands/${demandId}/recommendations`
    );
  },


  // ==========================================================
  // ALLOCATIONS
  // ==========================================================

  async getAllocations(params?: {
    status?: string;
    demandId?: string;
    resourceId?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {

    const query = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, val]) => {

        if (
          val !== undefined &&
          val !== null &&
          val !== ""
        ) {
          query.set(key, String(val));
        }

      });
    }

    const queryString = query.toString();

    return fetchJson<any[]>(
      `/allocations${queryString ? `?${queryString}` : ""}`
    );
  },


  async getAllocation(id: string) {

    return fetchJson<any>(
      `/allocations/${id}`
    );
  },


  async createAllocation(data: {
    demandId: string;
    resourceId: string;
    quantity: number;
    vehicleId?: string;
  }) {

    return fetchJson<any>(
      "/allocations",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },


  async approveAllocation(id: string) {

    return fetchJson<any>(
      `/allocations/${id}/approve`,
      {
        method: "POST",
      }
    );
  },


  async rejectAllocation(
    id: string,
    reason: string
  ) {

    return fetchJson<any>(
      `/allocations/${id}/reject`,
      {
        method: "POST",
        body: JSON.stringify({ reason }),
      }
    );
  },


  // ==========================================================
  // ROUTE OPTIMIZATION
  // ==========================================================

  async optimizeRoutes() {

    return fetchJson<any>(
      "/routing/optimize",
      {
        method: "POST",
      }
    );
  },

};


// ============================================================
// DEFAULT EXPORT
// ============================================================

export default apiClient;