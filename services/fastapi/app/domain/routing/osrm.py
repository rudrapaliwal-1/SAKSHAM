import httpx


class OSRMProvider:
    """
    Provides road-distance and travel-time matrices using OSRM.

    Uses the public OSRM routing server so a full local
    India routing dataset is not required.
    """

    def __init__(
        self,
        base_url: str = "https://router.project-osrm.org",
        timeout: float = 30.0,
    ):
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout

    def get_distance_matrix(self, locations):
        """
        locations:
            [
                (latitude, longitude),
                ...
            ]

        Returns:
            {
                "distances": [[meters, ...], ...],
                "durations": [[seconds, ...], ...]
            }
        """

        if not locations:
            return {
                "distances": [],
                "durations": [],
            }

        # OSRM expects longitude,latitude
        coordinates = ";".join(
            f"{longitude},{latitude}"
            for latitude, longitude in locations
        )

        url = (
            f"{self.base_url}/table/v1/driving/"
            f"{coordinates}"
        )

        response = httpx.get(
            url,
            params={
                "annotations": "distance,duration",
            },
            timeout=self.timeout,
        )

        response.raise_for_status()

        data = response.json()

        if data.get("code") != "Ok":
            raise RuntimeError(
                f"OSRM request failed: "
                f"{data.get('message', data.get('code', 'Unknown error'))}"
            )

        return {
            "distances": data.get("distances", []),
            "durations": data.get("durations", []),
        }