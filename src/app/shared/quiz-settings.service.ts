import { Injectable } from '@angular/core';

interface QuizSettings {
  questionCount?: number;
  timeAttackMode?: boolean;
  timeLimitSeconds?: number;
}

@Injectable({
  providedIn: 'root'
})
export class QuizSettingsService {
  private readonly storageKey = 'quiz-settings';
  private readonly defaultQuestionCount = 5;
  private readonly minQuestionCount = 3;
  private readonly maxQuestionCount = 20;
  private readonly defaultTimeLimitSeconds = 10;

  private getSettings(): QuizSettings {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : {};
  }

  private saveSettings(partial: QuizSettings): void {
    const merged = { ...this.getSettings(), ...partial };
    localStorage.setItem(this.storageKey, JSON.stringify(merged));
  }

  getQuestionCount(): number {
    return this.getSettings().questionCount || this.defaultQuestionCount;
  }

  setQuestionCount(count: number): void {
    const clamped = Math.min(this.maxQuestionCount, Math.max(this.minQuestionCount, count));
    this.saveSettings({ questionCount: clamped });
  }

  isTimeAttackMode(): boolean {
    return !!this.getSettings().timeAttackMode;
  }

  setTimeAttackMode(enabled: boolean): void {
    this.saveSettings({ timeAttackMode: enabled });
  }

  getTimeLimitSeconds(): number {
    return this.getSettings().timeLimitSeconds || this.defaultTimeLimitSeconds;
  }

  setTimeLimitSeconds(seconds: number): void {
    this.saveSettings({ timeLimitSeconds: seconds });
  }
}
