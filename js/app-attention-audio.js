(() => {
  'use strict';
  if (!window.App) return;

  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const baseInjectAttentionSettings = App.injectAttentionSettings;
  const runtime = {
    context: null,
    unlocked: false,
    lastError: '',
    lastSoundResult: 'idle',
    lastVibrationResult: 'idle',
  };

  const normaliseAudioState = context => {
    const state = context?.state || 'idle';
    return state === 'running' ? 'ready' : state === 'closed' ? 'unavailable' : state === 'interrupted' ? 'blocked' : 'waiting';
  };

  const tone = (context, frequency, start, duration, volume) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.015);
  };

  Object.assign(App, {
    attentionCapabilities() {
      return {
        sound: Boolean(AudioCtx),
        vibration: typeof navigator.vibrate === 'function',
      };
    },

    attentionAudioContext() {
      if (!AudioCtx) return null;
      if (!runtime.context || runtime.context.state === 'closed') {
        try {
          runtime.context = new AudioCtx({ latencyHint: 'interactive' });
          runtime.lastError = '';
          runtime.context.addEventListener?.('statechange', () => this.updateAttentionDiagnostics());
        } catch (error) {
          runtime.context = null;
          runtime.lastError = error?.message || 'Não foi possível iniciar o áudio.';
        }
      }
      return runtime.context;
    },

    async unlockAttentionAudio(source = 'user-gesture') {
      const prefs = this.state?.settings?.attentionFeedback || {};
      if (prefs.sound === false || !AudioCtx) {
        this.updateAttentionDiagnostics();
        return false;
      }
      const context = this.attentionAudioContext();
      if (!context) {
        runtime.lastSoundResult = 'unsupported';
        this.updateAttentionDiagnostics();
        return false;
      }
      try {
        if (context.state !== 'running') await context.resume();
        if (context.state === 'running' && !runtime.unlocked) {
          const now = context.currentTime;
          tone(context, 440, now, 0.025, 0.0002);
          runtime.unlocked = true;
        }
        runtime.lastError = '';
        runtime.lastSoundResult = context.state === 'running' ? 'ready' : 'blocked';
        this.updateAttentionDiagnostics();
        return context.state === 'running';
      } catch (error) {
        runtime.lastError = error?.message || `Áudio bloqueado (${source}).`;
        runtime.lastSoundResult = 'blocked';
        this.updateAttentionDiagnostics();
        return false;
      }
    },

    async recoverAttentionAudio() {
      if (document.hidden || !runtime.context || runtime.context.state === 'closed') return false;
      if (runtime.context.state === 'running') {
        this.updateAttentionDiagnostics();
        return true;
      }
      try {
        await runtime.context.resume();
        runtime.lastError = '';
        runtime.lastSoundResult = runtime.context.state === 'running' ? 'ready' : 'blocked';
      } catch (error) {
        runtime.lastError = error?.message || 'O navegador manteve o áudio suspenso.';
        runtime.lastSoundResult = 'blocked';
      }
      this.updateAttentionDiagnostics();
      return runtime.context.state === 'running';
    },

    async playAttentionFeedback(kind = 'success') {
      const prefs = this.state?.settings?.attentionFeedback || {};
      const capabilities = this.attentionCapabilities();
      let vibration = prefs.vibration === false ? 'disabled' : capabilities.vibration ? 'ready' : 'unsupported';
      if (prefs.vibration !== false && capabilities.vibration) {
        try {
          const accepted = navigator.vibrate(kind === 'error' ? [85, 55, 85] : [55, 35, 55]);
          vibration = accepted === false ? 'blocked' : 'played';
        } catch {
          vibration = 'blocked';
        }
      }
      runtime.lastVibrationResult = vibration;

      if (prefs.sound === false) {
        runtime.lastSoundResult = 'disabled';
        this.updateAttentionDiagnostics({ sound: 'disabled', vibration });
        return { sound: 'disabled', vibration };
      }
      if (!capabilities.sound) {
        runtime.lastSoundResult = 'unsupported';
        this.updateAttentionDiagnostics({ sound: 'unsupported', vibration });
        return { sound: 'unsupported', vibration };
      }

      const ready = await this.unlockAttentionAudio('feedback');
      const context = runtime.context;
      if (!ready || !context || context.state !== 'running') {
        runtime.lastSoundResult = 'blocked';
        this.updateAttentionDiagnostics({ sound: 'blocked', vibration });
        return { sound: 'blocked', vibration };
      }

      try {
        const now = context.currentTime + 0.006;
        if (kind === 'error') {
          tone(context, 250, now, 0.11, 0.09);
          tone(context, 210, now + 0.13, 0.13, 0.08);
        } else {
          tone(context, 760, now, 0.085, 0.075);
          tone(context, 980, now + 0.105, 0.105, 0.065);
        }
        runtime.lastError = '';
        runtime.lastSoundResult = 'played';
        this.updateAttentionDiagnostics({ sound: 'played', vibration });
        return { sound: 'played', vibration };
      } catch (error) {
        runtime.lastError = error?.message || 'Falha ao reproduzir o alerta.';
        runtime.lastSoundResult = 'error';
        this.updateAttentionDiagnostics({ sound: 'error', vibration });
        return { sound: 'error', vibration };
      }
    },

    attentionAudioStatus() {
      const capabilities = this.attentionCapabilities();
      const soundPreference = this.state?.settings?.attentionFeedback?.sound !== false;
      const vibrationPreference = this.state?.settings?.attentionFeedback?.vibration !== false;
      let soundStatus = 'unavailable';
      let soundText = 'Som não suportado neste navegador.';
      if (capabilities.sound) {
        const state = normaliseAudioState(runtime.context);
        if (!soundPreference) {
          soundStatus = 'disabled';
          soundText = 'Som desativado nas definições.';
        } else if (state === 'ready') {
          soundStatus = 'ready';
          soundText = 'Som pronto para confirmações e alertas.';
        } else if (runtime.lastError || runtime.lastSoundResult === 'blocked') {
          soundStatus = 'blocked';
          soundText = 'Som bloqueado/suspenso. Toque em “Testar alerta agora”.';
        } else {
          soundStatus = 'waiting';
          soundText = 'A aguardar um toque para ativar o áudio.';
        }
      }

      let vibrationStatus = 'unavailable';
      let vibrationText = 'Vibração indisponível neste navegador/dispositivo.';
      if (!vibrationPreference) {
        vibrationStatus = 'disabled';
        vibrationText = 'Vibração desativada nas definições.';
      } else if (capabilities.vibration) {
        vibrationStatus = runtime.lastVibrationResult === 'blocked' ? 'blocked' : 'ready';
        vibrationText = runtime.lastVibrationResult === 'blocked' ? 'O navegador recusou a vibração.' : 'Vibração disponível neste navegador.';
      }
      return { soundStatus, soundText, vibrationStatus, vibrationText };
    },

    updateAttentionDiagnostics(result = null) {
      if (result?.sound) runtime.lastSoundResult = result.sound;
      if (result?.vibration) runtime.lastVibrationResult = result.vibration;
      const status = this.attentionAudioStatus();
      const sound = document.querySelector('[data-attention-sound-status]');
      const vibration = document.querySelector('[data-attention-vibration-status]');
      const live = document.querySelector('[data-attention-live]');
      if (sound) {
        sound.dataset.status = status.soundStatus;
        sound.querySelector('strong').textContent = status.soundStatus === 'ready' ? 'Som · Pronto' : status.soundStatus === 'waiting' ? 'Som · Ativar' : status.soundStatus === 'disabled' ? 'Som · Desativado' : status.soundStatus === 'blocked' ? 'Som · Bloqueado' : 'Som · Indisponível';
        sound.querySelector('span').textContent = status.soundText;
      }
      if (vibration) {
        vibration.dataset.status = status.vibrationStatus;
        vibration.querySelector('strong').textContent = status.vibrationStatus === 'ready' ? 'Vibração · Disponível' : status.vibrationStatus === 'disabled' ? 'Vibração · Desativada' : status.vibrationStatus === 'blocked' ? 'Vibração · Bloqueada' : 'Vibração · Indisponível';
        vibration.querySelector('span').textContent = status.vibrationText;
      }
      if (live && result) {
        const parts = [];
        if (result.sound === 'played') parts.push('som reproduzido');
        else if (result.sound === 'blocked') parts.push('som bloqueado pelo navegador');
        else if (result.sound === 'unsupported') parts.push('som não suportado');
        else if (result.sound === 'disabled') parts.push('som desativado');
        if (result.vibration === 'played') parts.push('vibração executada');
        else if (result.vibration === 'unsupported') parts.push('vibração não suportada');
        else if (result.vibration === 'blocked') parts.push('vibração bloqueada');
        else if (result.vibration === 'disabled') parts.push('vibração desativada');
        live.textContent = parts.length ? `Teste: ${parts.join(' · ')}.` : 'Diagnóstico atualizado.';
      }
    },

    enhanceAttentionSettings() {
      const section = document.getElementById('attentionSettings');
      if (!section || section.querySelector('[data-attention-diagnostics]')) return;
      const test = section.querySelector('.attention-test');
      if (!test) return;
      const soundInput = document.getElementById('attentionSound');
      const vibrationInput = document.getElementById('attentionVibration');
      const capabilities = this.attentionCapabilities();
      if (soundInput && !capabilities.sound) soundInput.disabled = true;
      if (vibrationInput && !capabilities.vibration) vibrationInput.disabled = true;
      const button = test.querySelector('[data-attention-test]');
      if (button) button.textContent = 'Testar alerta agora';
      test.insertAdjacentHTML('afterend', `<div class="attention-diagnostics" data-attention-diagnostics><div class="attention-capability" data-attention-sound-status><strong>Som</strong><span>A verificar…</span></div><div class="attention-capability" data-attention-vibration-status><strong>Vibração</strong><span>A verificar…</span></div><p class="attention-live" data-attention-live role="status" aria-live="polite">Toque em “Testar alerta agora” para validar este dispositivo.</p></div>`);
      this.updateAttentionDiagnostics();
    },
  });

  App.injectAttentionSettings = function() {
    baseInjectAttentionSettings.call(this);
    this.enhanceAttentionSettings();
  };

  const unlockFromGesture = () => {
    if (App.state?.settings?.attentionFeedback?.sound === false) return;
    App.unlockAttentionAudio('user-gesture').catch(() => {});
  };
  document.addEventListener('pointerdown', unlockFromGesture, { capture: true });
  document.addEventListener('keydown', unlockFromGesture, { capture: true });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) App.recoverAttentionAudio().catch(() => {});
  });
  window.addEventListener('pageshow', () => App.recoverAttentionAudio().catch(() => {}));
})();