import type { Question } from '../types';

export const vibrationsQuestions: Question[] = [
  // VIB-001 — Multiple Choice
  {
    id: 'vib-001',
    type: 'multiple-choice',
    topic: 'vibrations',
    subtopic: 'Free Vibration',
    difficulty: 'beginner',
    question: 'A machine weighing 500 kg sits on rubber mounts with a combined stiffness of 200,000 N/m. What is the natural frequency of the system?',
    options: [
      { id: 'a', text: 'About 3.2 Hz' },
      { id: 'b', text: 'About 20 Hz' },
      { id: 'c', text: 'About 100 Hz' },
      { id: 'd', text: 'About 400 Hz' },
    ],
    correctAnswer: 'a',
    explanation: 'Natural frequency f_n = (1/2π) × √(k/m) = (1/2π) × √(200,000/500) = (1/2π) × √400 = (1/2π) × 20 = 3.18 Hz. This corresponds to about 191 RPM. This calculation is one of the most fundamental in vibration engineering — you should be able to do it in your head for interviews.',
    interviewInsight: 'The √(k/m) natural frequency formula is the single most important vibration equation. If the interviewer asks anything about vibrations, this formula will appear within the first two minutes.',
    realWorldConnection: 'Every piece of rotating machinery must operate away from the mount natural frequency. If the machine runs at 3000 RPM (50 Hz), these mounts provide excellent isolation because the operating frequency is well above the natural frequency.',
    commonMistake: 'Forgetting the 1/(2π) factor to convert from rad/s to Hz. Also, confusing mass with weight — k/m uses mass in kg, not weight in N.',
    tags: ['natural-frequency', 'spring-mass', 'vibration', 'isolation', 'rubber-mount'],
  },

  // VIB-002 — Scenario
  {
    id: 'vib-002',
    type: 'scenario',
    topic: 'vibrations',
    subtopic: 'Forced Vibration & Resonance',
    difficulty: 'advanced',
    question: 'A factory floor is vibrating excessively, causing quality problems on a precision grinding machine. Diagnose and solve the problem.',
    context: 'A new stamping press was installed 20 meters from the grinding machine. The press operates at 120 strokes per minute. Since the press installation, the grinding machine produces parts with visible chatter marks at exactly 2 Hz.',
    steps: [
      {
        prompt: 'What is the likely cause of the vibration?',
        idealResponse: 'The stamping press operates at 120 strokes/min = 2 Hz. This excitation frequency matches the 2 Hz vibration observed on the grinding machine. The floor structure between the press and the grinder is transmitting the vibration. If the floor has a natural frequency near 2 Hz, it is amplifying the vibration through resonance.',
      },
      {
        prompt: 'How would you verify this diagnosis?',
        idealResponse: 'Use an accelerometer on the grinder base and the floor at several points between the press and grinder. Measure the frequency spectrum — you should see a dominant peak at 2 Hz that correlates with press operation. Perform an impact test (hammer test) on the floor to measure its natural frequency. If the floor natural frequency is near 2 Hz, resonance is confirmed.',
      },
      {
        prompt: 'What solutions would you propose?',
        idealResponse: 'Several options, ranked by effectiveness: (1) Install vibration isolation pads under the stamping press to reduce transmitted force (most effective at source). (2) Install an inertia block (massive concrete foundation) under the press to reduce vibration amplitude. (3) Isolate the grinding machine with tuned vibration isolation mounts. (4) Stiffen the floor between the machines (raise its natural frequency above 2 Hz). (5) As a last resort, relocate one machine. Best practice: isolate both the source AND the receiver.',
      },
    ],
    keyTakeaway: 'Vibration problems are best solved at the source. Identifying the excitation frequency, the transmission path, and any resonances allows systematic problem-solving rather than trial and error.',
    explanation: 'This is a classic transmitted vibration problem. The combination of a strong excitation source (stamping press), an efficient transmission path (floor structure), and a sensitive receiver (precision grinder) creates a quality problem.',
    interviewInsight: 'The interviewer wants to see a systematic approach: identify the source, characterize the transmission path, understand any resonances, and propose solutions ranked by effectiveness.',
    commonMistake: 'Jumping to "move the machine" without diagnosing the actual mechanism. Vibration isolation at the source is almost always cheaper and more effective than relocation.',
    tags: ['resonance', 'vibration-isolation', 'floor-vibration', 'frequency-matching', 'diagnosis'],
  },

  // VIB-003 — Confidence Rated
  {
    id: 'vib-003',
    type: 'confidence-rated',
    topic: 'vibrations',
    subtopic: 'Vibration Isolation',
    difficulty: 'intermediate',
    question: 'For effective vibration isolation, the operating frequency should be:',
    options: [
      { id: 'a', text: 'Below the natural frequency of the isolation system' },
      { id: 'b', text: 'At the natural frequency to maximize energy absorption' },
      { id: 'c', text: 'At least √2 times the natural frequency, ideally 3-5× or more' },
      { id: 'd', text: 'Exactly twice the natural frequency for optimal damping' },
    ],
    correctAnswer: 'c',
    confidenceLevels: ['Guessing', 'Somewhat sure', 'Very confident'],
    explanation: 'Vibration isolation begins when the frequency ratio r = ω/ω_n exceeds √2 (about 1.41). Below this, the mount actually amplifies vibration. At resonance (r=1), amplification is maximum and can be catastrophic. For practical isolation (>80% reduction), you want r > 3, meaning the operating frequency should be at least 3× the mount natural frequency. This is why soft mounts (low natural frequency) provide better isolation.',
    interviewInsight: 'The √2 threshold is a critical design number. Any vibration engineer must know that isolation only begins above this frequency ratio. The follow-up question is usually about the role of damping.',
    realWorldConnection: 'This is why sensitive equipment (electron microscopes, laser tables) sit on very soft air springs with natural frequencies below 1 Hz — to isolate from building vibrations at 5-30 Hz.',
    commonMistake: 'Choosing option (b) — operating AT resonance maximizes vibration, not isolation. This is the single most dangerous condition for any vibrating system.',
    tags: ['vibration-isolation', 'frequency-ratio', 'transmissibility', 'resonance', 'natural-frequency'],
  },

  // VIB-004 — Multiple Choice
  {
    id: 'vib-004',
    type: 'multiple-choice',
    topic: 'vibrations',
    subtopic: 'Rotordynamics',
    difficulty: 'advanced',
    question: 'A turbine rotor has a critical speed (first bending mode) at 6,000 RPM. The operating speed is 10,000 RPM. During startup, the rotor must pass through the critical speed. What precaution is essential?',
    options: [
      { id: 'a', text: 'Operate briefly at 6,000 RPM to test the response before proceeding' },
      { id: 'b', text: 'Accelerate through the critical speed as quickly as possible to minimize time at resonance' },
      { id: 'c', text: 'Avoid ever reaching 10,000 RPM — always operate below the critical speed' },
      { id: 'd', text: 'Remove all damping to let the rotor pass through the critical speed freely' },
    ],
    correctAnswer: 'b',
    explanation: 'When passing through a critical speed, the rotor experiences resonant amplification. The key is to minimize the TIME spent near the critical speed. Fast acceleration means the rotor spends only fractions of a second in the resonance zone, limiting the amplitude buildup. Dwelling at the critical speed (option a) allows amplitude to grow to dangerous levels. Operating below the critical (option c) wastes the machine\'s capability. Removing damping (option d) makes the resonance response worse, not better.',
    interviewInsight: 'Critical speed management is tested in every turbomachinery interview. The concept of "passing through" a critical speed quickly is fundamental to safe operation of supercritical rotors.',
    realWorldConnection: 'Nearly all modern gas turbines, turbochargers, and centrifuges operate above their first critical speed. The startup and shutdown procedures specifically include fast acceleration through critical speeds.',
    commonMistake: 'Thinking you should never exceed the critical speed. Many machines are designed to operate above one or more critical speeds — they just need to pass through them quickly.',
    tags: ['critical-speed', 'rotor', 'resonance', 'turbomachinery', 'startup', 'acceleration'],
  },
];
