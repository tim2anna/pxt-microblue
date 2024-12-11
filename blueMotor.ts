
//% color=#2ed573
//% icon="\uf06c"
//% block="blueMotor"
//% blockId="blueMotor"
namespace blueMotor {
    const MODE1 = 0x00

    const PRESCALE = 0xFE

    const LED0_ON_L = 0x06
    const PCA9685_ADDRESS = 0x40

    let initialized = false

    export enum Rotation { 
        //% blockId="forward" block="forward"
        forward = 1,
        //% blockId="reverse" block="reverse"
        reverse = 2,
        //% blockId="stop" block="stop"
        stop = 3
    }

    export enum Speed {
        lowest = 1,

    }

    export enum Servos {
        S1 = 0x01,
        S2 = 0x02,
        S3 = 0x03,
        S4 = 0x04,
        S5 = 0x05,
        S6 = 0x06,
        S7 = 0x07,
        S8 = 0x08,
    }

    export enum AllServos {
        S1 = 0x01,
        S2 = 0x02,
        S3 = 0x03,
        S4 = 0x04,
        S5 = 0x05,
        S6 = 0x06,
        S7 = 0x07,
        S8 = 0x08,
        //% blockIdentity="pins._analogPin"
        P0 = 100,  // MICROBIT_ID_IO_P0
        //% blockIdentity="pins._analogPin"
        P1 = 101,  // MICROBIT_ID_IO_P1
        //% blockIdentity="pins._analogPin"
        P2 = 102,  // MICROBIT_ID_IO_P2
        //% blockIdentity="pins._analogPin"
        P3 = 103,  // MICROBIT_ID_IO_P3
        //% blockIdentity="pins._analogPin"
        P4 = 104,  // MICROBIT_ID_IO_P4
        //% blockIdentity="pins._analogPin"
        P5 = 105,  // MICROBIT_ID_IO_P5
        //% blockIdentity="pins._analogPin"
        P6 = 106,  // MICROBIT_ID_IO_P6
        //% blockIdentity="pins._analogPin"
        P7 = 107,  // MICROBIT_ID_IO_P7
        //% blockIdentity="pins._analogPin"
        P8 = 108,  // MICROBIT_ID_IO_P8
        //% blockIdentity="pins._analogPin"
        P9 = 109,  // MICROBIT_ID_IO_P9
        //% blockIdentity="pins._analogPin"
        P10 = 110,  // MICROBIT_ID_IO_P10
        //% blockIdentity="pins._analogPin"
        P11 = 111,  // MICROBIT_ID_IO_P11
        //% blockIdentity="pins._analogPin"
        P12 = 112,  // MICROBIT_ID_IO_P12
        //% blockIdentity="pins._analogPin"
        P13 = 113,  // MICROBIT_ID_IO_P13
        //% blockIdentity="pins._analogPin"
        P14 = 114,  // MICROBIT_ID_IO_P14
        //% blockIdentity="pins._analogPin"
        P15 = 115,  // MICROBIT_ID_IO_P15
        //% blockIdentity="pins._analogPin"
        P16 = 116,  // MICROBIT_ID_IO_P16
        //% blockIdentity="pins._analogPin"
        //% blockHidden=1
        P19 = 119,  // MICROBIT_ID_IO_P19
        //% blockIdentity="pins._analogPin"
        //% blockHidden=1
        P20 = 120,  // MICROBIT_ID_IO_P20
    }

    function setFreq(freq: number): void {
        // Constrain the frequency
        let prescaleval = 25000000;
        prescaleval /= 4096;
        prescaleval /= freq;
        prescaleval -= 1;
        let prescale = prescaleval; //Math.Floor(prescaleval + 0.5);
        let oldmode = i2cread(PCA9685_ADDRESS, MODE1);
        let newmode = (oldmode & 0x7F) | 0x10; // sleep
        i2cwrite(PCA9685_ADDRESS, MODE1, newmode); // go to sleep
        i2cwrite(PCA9685_ADDRESS, PRESCALE, prescale); // set the prescaler
        i2cwrite(PCA9685_ADDRESS, MODE1, oldmode);
        control.waitMicros(5000);
        i2cwrite(PCA9685_ADDRESS, MODE1, oldmode | 0xa1);
    }

    function i2cread(addr: number, reg: number) {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        return val;
    }

    function i2cwrite(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(addr, buf)
    }

    function setPwm(channel: number, on: number, off: number): void {
        if (channel < 0 || channel > 15)
            return;
        //serial.writeValue("ch", channel)
        //serial.writeValue("on", on)
        //serial.writeValue("off", off)
    
        let buf = pins.createBuffer(5);
        buf[0] = LED0_ON_L + 4 * channel;
        buf[1] = on & 0xff;
        buf[2] = (on >> 8) & 0xff;
        buf[3] = off & 0xff;
        buf[4] = (off >> 8) & 0xff;
        pins.i2cWriteBuffer(PCA9685_ADDRESS, buf);
    }

    function initPCA9685(): void {
        i2cwrite(PCA9685_ADDRESS, MODE1, 0x00)
        setFreq(50);
        for (let idx = 0; idx < 16; idx++) {
            setPwm(idx, 0, 0);
        }
        initialized = true
    }

    //% blockId=dsServo270 block="DsServo 270 |%index|degree %degree"
    //% group=Servo weight=99 color=#2ed573
    //% degree.min=0 degree.max=270
    export function dsServo270(index: AllServos, degree: number): void {
        // 德晟270度舵机控制信号参数（Control signal parameter）：
        // - 信号周期（Signal Period）：20ms
        // - 脉冲宽度（Pulse Width）：500μs-2500μs
        // - 信号高电平电压（Signal high voltage）：2V-5V
        // - 信号低电平电压（Signal low voltage）：0.0V
        if (index == AllServos.S1 || index == AllServos.S2 || index == AllServos.S3 || index == AllServos.S4
            || index == AllServos.S5 || index == AllServos.S6 || index == AllServos.S7 || index == AllServos.S8) {
            if (!initialized) {
                initPCA9685()
            }
            let v_us = Math.floor((degree) * 2000 / 270) + 500
            let value = v_us * 4096 / 20000
            setPwm(index + 7, 0, value)
        } else {
            let us = Math.floor((degree) * 2000 / 270) + 500
            let pwm = us / 20000 * 1023
            pins.analogSetPeriod(index, 20000)
            pins.analogWritePin(index, pwm)
        }
    }

    //% blockId=dsMotor360 block="DsMotor 360 |%index|rotation %rotation|speed %speed"
    //% group=Motor weight=98 color=#2ed573
    //% speed.min=0 speed.max=100
    export function dsMotor360(index: AllServos, rotation: Rotation, speed: number): void {
        // 德晟360度电机: 500μs~CCW逆时针; 1500μs~停；2500μs~CW顺时针
        // 控制信号参数（Control signal parameter）：
        // 信号周期（Signal Period）：20ms
        // 脉冲宽度（Pulse Width）：500μs-2500μs
        // 信号高电平电压（Signal high voltage）：2V-5V
        // 信号低电平电压（Signal low voltage）：0.0V

        // 速度值0~100，对过大和过小的速度值进行处理
        if (speed > 100) {
            speed = 100
        } else if (speed < 0) {
            speed = 0
        }

        let us;
        let pwm;
        if (rotation == Rotation.stop) {
            us = 1500
        }
        else if(rotation == Rotation.forward){
            us = Math.floor((2500 - 1500) * speed / 100) + 1500
        }
        else if(rotation == Rotation.reverse){
            us = 1500 - Math.floor((1500 - 500) * speed / 100)
        }
        if (index == AllServos.S1 || index == AllServos.S2 || index == AllServos.S3 || index == AllServos.S4
            || index == AllServos.S5 || index == AllServos.S6 || index == AllServos.S7 || index == AllServos.S8) {
            if (!initialized) {
                initPCA9685()
            }
            pwm = us * 4096 / 20000;
            setPwm(index + 7, 0, pwm);
        } else {
            pwm = us / 20000 * 1023
            pins.analogSetPeriod(index, 20000)
            pins.analogWritePin(index, pwm)
        }
        
    }


}