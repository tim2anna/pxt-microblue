//% color=#ffa502
//% icon="\uf06c"
//% block="blueTemp"
//% blockId="blueTemp"
namespace blueTemp {
    //% whenUsed
    let errorHandler:Action = null;
    //% whenUsed
    let errorObjectIdx : number = 0;
    //% whenUsed
    let errorPort : number = -1;

    // TODO: Localization
    const errorMsgs  = [ "No Error", "Not Connected", "Start Error", "Read Timeout", "Conversion Failure"];

    //% blockId="celsius" block="ds18b20 temperature (\u00B0\\C) on %pin|"
    //% group=Ds18b20 weight=99 color=#ffa502
    //% shim=blueTemp::celsius
    //% parts=blueTemp trackArgs=0
    export function celsius(pin: DigitalPin) : number {
        return 32.6;
    }

    // Helper function
    //% shim=blueTemp::setErrorHandler
    export function setErrorHandler(a: Action) {
        errorHandler = a; 
    }

    // Helper function
    //% shim=blueTemp::getErrorObjectIdx
    export function getErrorObjectIdx() : number {
        return errorObjectIdx;
    }

    // Helper function
    //% shim=blueTemp::getErrorPort
    export function getErrorPort() : number {
        return errorPort;
    }

    /**
     * Set a handler for errors 
     * @param errCallback The error handler 
     */
    //% blockId="error" block="ds18b20 temperature sensor error"
    //% group=Ds18b20 weight=98 color=#ffa502
    //% draggableParameters="reporter" weight=0
    export function sensorError(errCallback: (errorMessage: string, errorCode: number, port: number) => void) { 
        if(errCallback) {
            errorHandler = () => {
                let i  = getErrorObjectIdx(); 
                let p = getErrorPort();
                errCallback(errorMsgs[i], i, p);          
            };
        } else {
            errorHandler = null;
        }
        setErrorHandler(errorHandler);
    }

    //% blockId="dht11TemperatureC" block="dht11 temperature (\u00B0\\C) on %pin|"
    //% group=Dht11 weight=97 color=#ffa502
    export function dht11TemperatureC(pin: DigitalPin): number {
        pins.digitalWritePin(pin, 0)
		basic.pause(18)
        let i = pins.digitalReadPin(pin);
        pins.setPull(pin, PinPullMode.PullUp);
        let dhtvalue1 = 0;
        let dhtcounter1 = 0;
        let dhtcounter1d = 0;
        while (pins.digitalReadPin(pin) == 1);
        while (pins.digitalReadPin(pin) == 0);
        while (pins.digitalReadPin(pin) == 1);
        for (let i = 0; i <= 32 - 1; i++) {
            dhtcounter1d = 0
            while (pins.digitalReadPin(pin) == 0) {
                dhtcounter1d += 1;
            }
            dhtcounter1 = 0
            while (pins.digitalReadPin(pin) == 1) {
                dhtcounter1 += 1;
            }
            if (i > 15) {
                if (dhtcounter1 > dhtcounter1d) {
                    dhtvalue1 = dhtvalue1 + (1 << (31 - i));
                }
            }
        }
        return ((dhtvalue1 & 0x0000ff00) >> 8);
    }

    //% blockId="dht11TemperatureF" block="dht11 temperature (\u00B0\\F) on %pin|"
    //% group=Dht11 weight=96 color=#ffa502
    export function dht11TemperatureF(pin: DigitalPin): number {
        pins.digitalWritePin(pin, 0)
		basic.pause(18)
        let i = pins.digitalReadPin(pin);
        pins.setPull(pin, PinPullMode.PullUp);
        while (pins.digitalReadPin(pin) == 1);
        while (pins.digitalReadPin(pin) == 0);
        while (pins.digitalReadPin(pin) == 1);
        let dhtvalue = 0;
        let dhtcounter = 0;
        let dhtcounterd = 0;
        for (let i = 0; i <= 32 - 1; i++) {
            dhtcounterd = 0
            while (pins.digitalReadPin(pin) == 0) {
                dhtcounterd += 1;
            }
            dhtcounter = 0
            while (pins.digitalReadPin(pin) == 1) {
                dhtcounter += 1;
            }
            if (i > 15) {
                if (dhtcounter > dhtcounterd) {
                    dhtvalue = dhtvalue + (1 << (31 - i));
                }
            }
        }
        return Math.round((((dhtvalue & 0x0000ff00) >> 8) * 9 / 5) + 32);
    }

    //% blockId="dht11Humidity" block="dht11 humidity (0~100) on %pin|"
    //% group=Dht11 weight=95 color=#ffa502
    export function dht11Humidity(pin: DigitalPin): number {
        pins.digitalWritePin(pin, 0)
		basic.pause(18)
		let i = pins.digitalReadPin(pin)
        pins.setPull(pin, PinPullMode.PullUp);
        while (pins.digitalReadPin(pin) == 1);
        while (pins.digitalReadPin(pin) == 0);
        while (pins.digitalReadPin(pin) == 1);

        let value = 0;
        let counter = 0;
        let counterd = 0;

        for (let i = 0; i <= 8 - 1; i++) {
            counterd = 0
            while (pins.digitalReadPin(pin) == 0) {
                counterd += 1;
            }
            counter = 0
            while (pins.digitalReadPin(pin) == 1) {
                counter += 1;
            }
            if (counter > counterd) {
                value = value + (1 << (7 - i));
            }
        }
        return value;
    }

}
