import { Activity, Insight, MetricsSnapshot, PerformanceDNA } from "@/lib/types/performance";
import { generateId } from "@/lib/utils";

/**
 * Approximate TRIMP score based on duration and heart rate zone.
 * If HR data is missing, falls back to RPE or Duration/Pace.
 */
export function calculateTrainingLoad(activity: Activity): number {
    const durationMin = activity.durationSec / 60;

    // 1. HR based load (Ideal)
    if (activity.avgHr && activity.maxHr) {
        const hrReserve = activity.maxHr - 50; // Assume 50 resting if unknown
        const intensity = (activity.avgHr - 50) / hrReserve;
        // Formula similar to Banister's TRIMP but simplified exponential
        return durationMin * Math.exp(1.92 * intensity);
    }

    // 2. RPE based load (Duration * RPE)
    if (activity.rpe) {
        // RPE 1-10. Scale to match TRIMP roughly (RPE 5 ~ zone 2/3)
        return durationMin * (activity.rpe * 1.5); // Heuristic
    }

    // 3. Fallback (Duration only)
    return durationMin * 2; // Assume moderate effort
}

/**
 * Calculates Acute (7-day) and Chronic (28-day) Load.
 * Uses exponentially weighted moving average (EWMA) in a real system, 
 * but here we simple sum for clarity/mock.
 */
export function calculateLoadStats(activities: Activity[], refDate: Date = new Date()) {
    const oneDay = 24 * 60 * 60 * 1000;

    const acuteStart = new Date(refDate.getTime() - 7 * oneDay);
    const chronicStart = new Date(refDate.getTime() - 28 * oneDay);

    let acuteLoad = 0;
    let chronicLoad = 0;

    // Helper to group by week for consistency
    const weeksWithTraining = new Set<string>();

    activities.forEach(a => {
        const d = new Date(a.timestamp);
        if (d > refDate) return; // Future

        const load = calculateTrainingLoad(a);

        if (d >= acuteStart) acuteLoad += load;
        if (d >= chronicStart) chronicLoad += load;

        if (d >= chronicStart) {
            // Use absolute time to determine unique week since epoch
            const weekKey = Math.floor(d.getTime() / (oneDay * 7));
            weeksWithTraining.add(weekKey.toString());
        }
    });

    // Normalize Chronic to weekly average equivalent for ratio? 
    // Usually AC Ratio is (Acute Load) / (Chronic Load) where both are daily averages or typically:
    // Acute = 7 day avg, Chronic = 28 day avg.
    const acuteAvg = acuteLoad / 7;
    const chronicAvg = chronicLoad / 28;

    const acRatio = chronicAvg === 0 ? 0 : acuteAvg / chronicAvg;

    // Consistency: % of last 4 weeks with at least 1 session?
    // Let's settle for simple logic: 
    const consistencyScore = Math.min(100, (weeksWithTraining.size / 4) * 100);

    return { acuteAvg, chronicAvg, acRatio, consistencyScore };
}

/**
 * Determines Performance DNA based on training history.
 */
export function detectPerformanceDNA(activities: Activity[]): PerformanceDNA[] {
    const dna: PerformanceDNA[] = [];

    if (activities.length === 0) return ["Balanced"];

    const runActivities = activities.filter(a => a.type === "Run");
    const avgDist = runActivities.reduce((sum, a) => sum + a.distanceMeters, 0) / (runActivities.length || 1);

    // Volume Responder: High volume
    if (avgDist > 10000) dna.push("Endurance Monster");
    else if (avgDist < 5000) dna.push("Speedster");

    // Consistency
    // (Simplistic check)
    if (activities.length > 20) dna.push("Consistency King");

    return dna.length ? dna : ["Balanced"];
}

/**
 * Generates textual insights based on metrics.
 */
export function generateInsights(stats: { acRatio: number, consistency: number }): Insight[] {
    const insights: Insight[] = [];

    if (stats.acRatio > 1.5) {
        insights.push({
            id: generateId(),
            type: "Warning",
            title: "High Injury Risk",
            description: "Your acute load is significantly higher than your chronic load. Consider tapering.",
            metric: "AC Ratio",
            value: stats.acRatio.toFixed(2)
        });
    } else if (stats.acRatio < 0.8) {
        insights.push({
            id: generateId(),
            type: "Neutral",
            title: "Detraining Risk",
            description: "Your recent training volume has dropped compared to your monthly average.",
            metric: "AC Ratio",
            value: stats.acRatio.toFixed(2)
        });
    } else {
        insights.push({
            id: generateId(),
            type: "Positive",
            title: "Optimal Training Zone",
            description: "Your training load is perfectly balanced for progressive overload.",
            metric: "AC Ratio",
            value: stats.acRatio.toFixed(2)
        });
    }

    if (stats.consistency > 80) {
        insights.push({
            id: generateId(),
            type: "Positive",
            title: "Consistent Effort",
            description: "You've maintained a solid training rhythm over the last month.",
            metric: "Consistency"
        });
    }

    return insights;
}

/**
 * Main function to refresh metrics for an athlete.
 * In a real app, this runs via cron or queue.
 */
export function refreshAthleteMetrics(athleteId: string, activities: Activity[]): MetricsSnapshot {
    const stats = calculateLoadStats(activities);
    const dna = detectPerformanceDNA(activities);
    const insights = generateInsights({ acRatio: stats.acRatio, consistency: stats.consistencyScore });

    return {
        athleteId,
        date: new Date().toISOString(),
        acuteLoad: stats.acuteAvg * 7, // Return total week load for display? Or avg? Let's use total for "Load"
        chronicLoad: stats.chronicAvg * 28,
        acRatio: stats.acRatio,
        consistencyScore: stats.consistencyScore,
        rampRate: 0, // Need previous week to calc
        performanceDna: dna,
        insights
    };
}
