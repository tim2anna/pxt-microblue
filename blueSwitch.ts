//% color=#546de5
//% icon="\uf06c"
//% block="blueSwitch"
//% blockId="blueSwitch"
namespace blueSwitch {
    //% blockId=pressButton block="press button module %pin pressed"
    //% group=PressButton weight=99 color=#546de5
    export function pressButton(pin: DigitalPin): boolean {
        pins.setPull(pin, PinPullMode.PullUp)
        return pins.digitalReadPin(pin) == 0
    }

    //% blockId=onPressButtonEvent block="on press button|%pin pressed"
    //% group=PressButton weight=98 color=#546de5
    export function onPressButtonEvent(pin: DigitalPin, handler: () => void): void {
        pins.setPull(pin, PinPullMode.PullUp)
        pins.onPulsed(pin, PulseValue.Low, handler)
    }

    //% blockId=touchButton block="touch sensor %pin touched"
    //% group=TouchButton weight=97 color=#546de5
    export function touchButton(pin: DigitalPin): boolean {
        return pins.digitalReadPin(pin) == 1
    }

    //% blockId=onTouchButtonEvent block="on touch button|%pin pressed"
    //% group=TouchButton weight=96 color=#546de5
    export function onTouchButtonEvent(pin: DigitalPin, handler: () => void): void {
        pins.onPulsed(pin, PulseValue.High, handler)
    }
}