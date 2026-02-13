import { MetricsSnapshot } from "@/lib/types/performance";

class MetricsRepository {
    private snapshots: Map<string, MetricsSnapshot> = new Map(); // athleteId -> latest snapshot

    getLatestMetrics(athleteId: string): MetricsSnapshot | undefined {
        return this.snapshots.get(athleteId);
    }

    getSnapshot(athleteId: string): MetricsSnapshot | undefined {
        return this.getLatestMetrics(athleteId);
    }

    saveMetrics(snapshot: MetricsSnapshot): void {
        this.snapshots.set(snapshot.athleteId, snapshot);
    }

    // For seeding
    _seed(snapshots: MetricsSnapshot[]) {
        snapshots.forEach(s => this.snapshots.set(s.athleteId, s));
    }
}

export const metricsRepo = new MetricsRepository();
