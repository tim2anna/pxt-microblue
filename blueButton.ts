//% color=#546de5
//% icon="\uf06c"
//% block="blueButton"
//% blockId="blueButton"
namespace blueButton {
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
}