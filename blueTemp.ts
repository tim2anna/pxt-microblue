//% color=#2494F4
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

    //% blockId="celsius" block="temperature (\u00B0\\C) on %pin|"
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
    //% blockId="error" block="temperature sensor error"
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
    };
}
