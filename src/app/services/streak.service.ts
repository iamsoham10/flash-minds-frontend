import { computed, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StreakService {

  private streaks: WritableSignal<Map<string, { count: number, lastUpdated: Date }>> = signal(new Map());

  constructor() {
    const storedSreak = localStorage.getItem("streaks");
    const initialStreak = storedSreak ? new Map(JSON.parse(storedSreak)) : new Map();
    this.streaks = signal(initialStreak);
  }

  getUserStreak(userId: string) {
    const currentStreak = this.streaks();
    const streak = currentStreak.get(userId) || { count: 0, lastUpdated: new Date(0) };
    const now = new Date();
    if (now.getTime() - new Date(streak.lastUpdated).getTime() > 48 * 60 * 60 * 1000) {
      streak.count = 0;
      currentStreak.set(userId, streak);
      this.streaks.set(new Map(currentStreak));
      this.saveStreakToLocalStorage();
    }
    return { ...streak };
  }

  markStreak(userId: string) {
    const currentStreaks = this.streaks();
    const streak = currentStreaks.get(userId) || { count: 0, lastUpdated: new Date(0) };
    const now = new Date();

    if (now.getTime() - new Date(streak.lastUpdated).getTime() > 24 * 60 * 60 * 1000) {
      streak.count += 1;
      streak.lastUpdated = now;
      currentStreaks.set(userId, streak);
      this.streaks.set(new Map(currentStreaks));
      this.saveStreakToLocalStorage();
    }
  }

  getStreakSignal(userId: string) {
    return computed(() => this.streaks().get(userId)?.count || 0);
  }

  private saveStreakToLocalStorage() {
    const streakArray = Array.from(this.streaks().entries());
    localStorage.setItem("streaks", JSON.stringify(streakArray));
  }
}
