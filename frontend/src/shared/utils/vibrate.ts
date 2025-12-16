const VibrationPresets = {
    tap: [10],
    doubleTap: [10, 50, 10],
    selection: [15],
    toggle: [20],
    success: [10, 50, 20, 30, 30],
    error: [50, 30, 50, 30, 50],
    warning: [30, 50, 30],
    info: [15, 40, 15],
    message: [20, 100, 20],
    reminder: [10, 50, 10, 50, 10],
    urgent: [100, 50, 100, 50, 100],
    ring: [200, 100, 200, 100, 200, 100, 200],
    pullToRefresh: [5, 20, 10, 20, 15, 20, 25],
    bounce: [15, 30, 10],
    longPressStart: [5, 10, 10, 10, 20],
    longPressActivate: [40],
    dragStart: [10],
    drop: [30, 20, 10],
    collision: [50],
    explosion: [100, 30, 80, 30, 60, 30, 40, 30, 20],
    pickup: [10, 30, 5],
    shoot: [30, 10],
    damage: [80, 20, 40],
    victory: [30, 50, 30, 50, 50, 50, 100],
    defeat: [200, 100, 150, 100, 100],
    levelUp: [20, 30, 20, 30, 30, 30, 50, 50, 100],
    heartbeat: [60, 80, 30, 400],
    tick: [5],
    timerComplete: [50, 100, 50, 100, 100, 100, 200],
    loadComplete: [20, 50, 40],
    undo: [10, 30, 20, 30, 30]
} as const

type PresetName = keyof typeof VibrationPresets

export function canVibrate(): boolean {
    return 'vibrate' in navigator
}

export function vibrate(pattern: number | number[] | PresetName): boolean {
    if (!canVibrate()) {
        return false
    }

    if (!navigator.vibrate) {
        return false
    }

    if (typeof pattern === 'string') {
        return navigator.vibrate(VibrationPresets[pattern])
    }

    return navigator.vibrate(pattern)
}

export function vibrateStop(): boolean {
    if (!navigator.vibrate) {
        return false
    }
    return navigator.vibrate(0)
}

export { type PresetName, VibrationPresets }
