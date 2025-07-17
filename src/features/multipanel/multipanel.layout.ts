import {
    AnalogItem,
    BoardAnalog,
    BoardButton,
    BoardDisplay,
    BoardEncoder,
    BoardInterfaceType,
    BoardItem,
    BoardLed,
    BoardSwitch,
    ButtonItem,
    EncoderItem,
    LedItem,
    SwitchItem
} from "@shared/board.types.ts";
import {
    EVT_CONTROL_STAND_PARK_BRAKE_LEVER,
    EVT_GEAR_LEVER,
    EVT_LDG_LIGHTS_TOGGLE,
    EVT_LWRMAIN_CAPT_MAIN_PANEL_BRT,
    EVT_MPM_AUTOBRAKE_SELECTOR,
    EVT_OH_LIGHTS_ANT_COL,
    EVT_OH_LIGHTS_APU_START,
    EVT_OH_LIGHTS_L_ENGINE_START,
    EVT_OH_LIGHTS_POS_STROBE,
    EVT_OH_LIGHTS_R_ENGINE_START,
    EVT_OH_LIGHTS_TAXI,
    PMDG_NG3_DATA_DEFINITION,
    PMDG_NG3_DATA_ID,
    PMDG_NG3_DATA_NAME,
    PMDG_NG3_Data_Size
} from "@shared/definitions/PMDG_NG3_SDK.ts";
import {CalculateSize, DataDescriptor, ReadDescriptor, WriteDescriptor} from "@shared/sim.types.ts";
import {SimConnect_Avionics_Data} from "@shared/definitions/SIMCONNECT.ts";

export enum MULTIPANEL_SIMIDS {
    PMDG_DATA,
    SIMCONNECT_DATA,

    MULTI_LTS_LDG,
    MULTI_LTS_TAXI,
    MULTI_LTS_STROBE,
    MULTI_LTS_BEACON,
    MULTI_COCKPIT_LIGHTS,

    MULTI_LTS_LDG_READ,
    MULTI_LTS_TAXI_READ,
    MULTI_LTS_STROBE_READ,
    MULTI_LTS_BEACON_READ,
    MULTI_COCKPIT_LIGHTS_READ,

    MULTI_BARO_MB,
    MULTI_BARO_IN,
    MULTI_BARO_MODE,
    MULTI_COM1_A,
    MULTI_COM1_S,
    MULTI_COM2_A,
    MULTI_COM2_S,
    MULTI_NAV1_A,
    MULTI_NAV1_S,
    MULTI_NAV2_A,
    MULTI_NAV2_S,
    MULTI_XPNDR,
    MULTI_XPNDR_MODE,

    MULTI_ROTARY_MODE,
    MULTI_AUTOBRAKE_ROTARY,

    MULTI_APU_SW,
    MULTI_START_1_SW,
    MULTI_START_2_SW,
    MULTI_LANDING_GEAR_SW,
    MULTI_PARKING_BRAKE_SW,

    PARKING_BRAKE_LED,
    GEAR_TRANSIT_L_LED,
    GEAR_TRANSIT_F_LED,
    GEAR_TRANSIT_R_LED,
    GEAR_LOCKED_L_LED,
    GEAR_LOCKED_F_LED,
    GEAR_LOCKED_R_LED,
    APU_AVAILABLE_LED,
    FIRE_WARNING_LED,
    MASTER_CAUTION_LED,
    AUTOBRAKE_DISARMED_LED,
    SPEEDBRAKE_ARMED_LED,
    FLAPS_EXTENDED_LED,
}

export const MULTIPANEL_LAYOUT: BoardItem[] = [
    // Inputs
    {
        id: 'MULTI_LTS_LDG',
        front: {
            type: "switch",
            style: "square",
            values: [{name: "ON", value: 1}, {name: "OFF", value: 0}],
        } as SwitchItem,
        iface: {
            id: 'b_lts_ldg',
            type: BoardInterfaceType.SWITCH,
            offsets: [{name: "ON", offset: 1, value: 1}, {name: "OFF"}]
        } as BoardSwitch,
        sim: {
            id: "multi_LTS_LDG",
            simid: MULTIPANEL_SIMIDS.MULTI_LTS_LDG,
            hwid: EVT_LDG_LIGHTS_TOGGLE,
            values: {"ON": 1, "OFF": 0},
            type: "write",
            read: {
                id: "multi_LTS_LDG_read",
                type: "read",
                simid: MULTIPANEL_SIMIDS.MULTI_LTS_LDG_READ,
                name: "LTS_LandingLtRetractableSw",
                position: 0,
            }
        } as WriteDescriptor
    },
    {
        id: 'MULTI_LTS_TAXI',
        front: {
            type: "switch",
            style: "square",
            values: [{name: "ON", value: 1}, {name: "OFF", value: 0}],
        } as SwitchItem,
        iface: {
            id: 'b_lts_taxi',
            type: BoardInterfaceType.SWITCH,
            offsets: [{name: "ON", offset: 1, value: 1}, {name: "OFF"}]
        } as BoardSwitch,
        sim: {
            id: "multi_LTS_TAXI",
            simid: MULTIPANEL_SIMIDS.MULTI_LTS_TAXI,
            hwid: EVT_OH_LIGHTS_TAXI,
            values: {"ON": 1, "OFF": 0},
            type: "write",
            read: {
                id: "multi_LTS_TAXI_read",
                type: "read",
                simid: MULTIPANEL_SIMIDS.MULTI_LTS_TAXI_READ,
                name: "LTS_TaxiSw",
                position: 0,
            }
        } as WriteDescriptor
    },
    {
        id: 'MULTI_LTS_STROBE',
        front: {
            type: "switch",
            style: "square",
            values: [{name: "ON", value: 1}, {name: "OFF", value: 0}],
        } as SwitchItem,
        iface: {
            id: 'b_lts_strobe',
            type: BoardInterfaceType.SWITCH,
            offsets: [{name: "ON", offset: 1, value: 1}, {name: "OFF"}]
        } as BoardSwitch,
        sim: {
            id: "multi_LTS_STROBE",
            simid: MULTIPANEL_SIMIDS.MULTI_LTS_STROBE,
            hwid: EVT_OH_LIGHTS_POS_STROBE,
            values: {"ON": 1, "OFF": 0},
            type: "write",
            read: {
                id: "multi_LTS_STROBE_read",
                type: "read",
                simid: MULTIPANEL_SIMIDS.MULTI_LTS_STROBE_READ,
                name: "LTS_PositionSw",
                position: 0,
            }
        } as WriteDescriptor
    },
    {
        id: 'MULTI_LTS_BEACON',
        front: {
            type: "switch",
            style: "square",
            values: [{name: "ON", value: 1}, {name: "OFF", value: 0}],
        } as SwitchItem,
        iface: {
            id: 'b_lts_beacon',
            type: BoardInterfaceType.SWITCH,
            offsets: [{name: "ON", offset: 1, value: 1}, {name: "OFF"}]
        } as BoardSwitch,
        sim: {
            id: "multi_LTS_BEACON",
            simid: MULTIPANEL_SIMIDS.MULTI_LTS_BEACON,
            hwid: EVT_OH_LIGHTS_ANT_COL,
            values: {"ON": 1, "OFF": 0},
            type: "write",
            read: {
                id: "multi_LTS_BEACON_read",
                type: "read",
                simid: MULTIPANEL_SIMIDS.MULTI_LTS_BEACON_READ,
                name: "LTS_AntiCollisionSw",
                position: 0,
            }
        } as WriteDescriptor
    },
    {
        id: 'MULTI_DISP_TRS',
        front: {
            type: "button",
            style: "square",
        } as ButtonItem,
        iface: {
            id: 'b_disp_trs',
            type: BoardInterfaceType.BUTTON,
            offset: 1
        } as BoardButton,
    },
    {
        id: 'MULTI_ENCODER_BUTTON',
        front: {
            type: "button",
            style: "square",
        } as ButtonItem,
        iface: {
            id: 'b_encoder_button',
            type: BoardInterfaceType.BUTTON,
            offset: 1
        } as BoardButton,
    },

    {
        id: 'MULTI_COCKPIT_LIGHTS',
        front: {
            type: "analog",
            style: "slider",
            min: 0,
            max: 100,
        } as AnalogItem,
        iface: {
            id: 'b_lts_cockpit_lights',
            type: BoardInterfaceType.ANALOG,
            offset: 1
        } as BoardAnalog,
        sim: {
            id: "multi_LTS_COCKPIT_LIGHTS",
            simid: MULTIPANEL_SIMIDS.MULTI_COCKPIT_LIGHTS,
            hwid: EVT_LWRMAIN_CAPT_MAIN_PANEL_BRT,
            type: "write",
            read: {
                id: "multi_LTS_COCKPIT_LIGHTS_read",
                type: "read",
                simid: MULTIPANEL_SIMIDS.MULTI_COCKPIT_LIGHTS_READ,
                name: "LTS_MainPanelKnob",
                position: 0,
            }
        } as WriteDescriptor
    },
    {
        id: 'MULTI_LDG_GEAR',
        front: {
            type: "switch",
            style: "square",
            values: [{name: "UP", value: 0}, {name: "OFF", value: 1}, {name: "DOWN", value: 2}],
        } as SwitchItem,
        iface: {
            id: 'b_ldg_gear',
            type: BoardInterfaceType.SWITCH,
            offsets: [{name: "UP", offset: 2, value: 1}, {name: "OFF"}, {name: "DOWN", offset: 3, value: 1}]
        } as BoardSwitch,
        sim: {
            id: "multi_LDG_GEAR",
            simid: MULTIPANEL_SIMIDS.MULTI_LANDING_GEAR_SW,
            hwid: EVT_GEAR_LEVER,
            values: {"UP": 0, "OFF": 1, "DOWN": 2},
            type: "write"
        } as WriteDescriptor
    },
    {
        id: 'MULTI_PARKING_BRAKE',
        front: {
            type: "switch",
            style: "square",
            values: [{name: "ON", value: 1}, {name: "OFF", value: 0}],
        } as SwitchItem,
        iface: {
            id: 'b_parking_brake',
            type: BoardInterfaceType.SWITCH,
            offsets: [{name: "ON", offset: 1, value: 1}, {name: "OFF"}]
        } as BoardSwitch,
        sim: {
            id: "multi_PARKING_BRAKE",
            simid: MULTIPANEL_SIMIDS.MULTI_PARKING_BRAKE_SW,
            hwid: EVT_CONTROL_STAND_PARK_BRAKE_LEVER,
            values: {"ON": 1, "OFF": 0},
            type: "write"
        } as WriteDescriptor
    },
    {
        id: 'MULTI_APU_SW',
        front: {
            type: "switch",
            style: "square",
            values: [{name: "OFF", value: 0}, {name: "ON", value: 1}, {name: "START", value: 2}],
        } as SwitchItem,
        iface: {
            id: 'b_apu_sw',
            type: BoardInterfaceType.SWITCH,
            offsets: [{name: "START", offset: 1, value: 1}, {name: "ON"}, {name: "OFF", offset: 2, value: 1}]
        } as BoardSwitch,
        sim: {
            id: "multi_APU_SW",
            simid: MULTIPANEL_SIMIDS.MULTI_APU_SW,
            hwid: EVT_OH_LIGHTS_APU_START,
            values: {"OFF": 0, "ON": 1, "START": 2},
            type: "write"
        } as WriteDescriptor
    },
    {
        id: 'MULTI_START_1_SW',
        front: {
            type: "switch",
            style: "square",
            values: [{name: "GRD", value: 0}, {name: "OFF", value: 1}, {name: "CONT", value: 2}],
        } as SwitchItem,
        iface: {
            id: 'b_start_1_sw',
            type: BoardInterfaceType.SWITCH,
            offsets: [{name: "GRD", offset: 1, value: 1}, {name: "OFF"}, {name: "CONT", offset: 2, value: 1}]
        } as BoardSwitch,
        sim: {
            id: "multi_START_1_SW",
            simid: MULTIPANEL_SIMIDS.MULTI_START_1_SW,
            hwid: EVT_OH_LIGHTS_L_ENGINE_START,
            values: {"GRD": 0, "OFF": 1, "CONT": 2},
            type: "write"
        } as WriteDescriptor
    },
    {
        id: 'MULTI_START_2_SW',
        front: {
            type: "switch",
            style: "square",
            values: [{name: "GRD", value: 0}, {name: "OFF", value: 1}, {name: "CONT", value: 2}],
        } as SwitchItem,
        iface: {
            id: 'b_start_2_sw',
            type: BoardInterfaceType.SWITCH,
            offsets: [{name: "GRD", offset: 1, value: 1}, {name: "OFF"}, {name: "CONT", offset: 2, value: 1}]
        } as BoardSwitch,
        sim: {
            id: "multi_START_2_SW",
            simid: MULTIPANEL_SIMIDS.MULTI_START_2_SW,
            hwid: EVT_OH_LIGHTS_R_ENGINE_START,
            values: {"GRD": 0, "OFF": 1, "CONT": 2},
            type: "write"
        } as WriteDescriptor
    },
    {
        id: 'MULTI_AUTOBRAKE_ROTARY',
        front: {
            type: "switch",
            style: "rotary",
            values: [{name: "RTO", value: 0}, {name: "OFF", value: 1}, {name: "1", value: 2}, {
                name: "2",
                value: 3
            }, {name: "3", value: 4}, {name: "MAX", value: 5}],
        } as SwitchItem,
        iface: {
            id: 'b_autobrake_rotary',
            type: BoardInterfaceType.SWITCH,
            offsets: [
                {name: "RTO", offset: 1, value: 1},
                {name: "OFF"},
                {name: "1", offset: 2, value: 1},
                {name: "2", offset: 3, value: 1},
                {name: "3", offset: 4, value: 1},
                {name: "MAX", offset: 5, value: 1}
            ]
        } as BoardSwitch,
        sim: {
            id: "multi_AUTOBRAKE_ROTARY",
            simid: MULTIPANEL_SIMIDS.MULTI_AUTOBRAKE_ROTARY,
            hwid: EVT_MPM_AUTOBRAKE_SELECTOR,
            values: {"RTO": 0, "OFF": 1, "1": 2, "2": 3, "3": 4, "MAX": 5},
            type: "write"
        } as WriteDescriptor
    },
    {
        id: 'MULTI_MODE_ROTARY',
        front: {
            type: "switch",
            style: "rotary",
            values: [{name: "BARO", value: 0}, {name: "XPNDR", value: 1}, {name: "NAV1", value: 2}, {
                name: "COM1",
                value: 3
            }, {name: "NAV2", value: 4}, {name: "COM2", value: 5}],
        } as SwitchItem,
        iface: {
            id: 'b_mode_rotary',
            type: BoardInterfaceType.SWITCH,
            offsets: [
                {name: "BARO", offset: 1, value: 1},
                {name: "XPNDR"},
                {name: "NAV1", offset: 2, value: 1},
                {name: "COM1", offset: 3, value: 1},
                {name: "NAV2", offset: 4, value: 1},
                {name: "COM2", offset: 5, value: 1}
            ]
        } as BoardSwitch,
    },
    {
        id: 'ENCODER_DOWN',
        front: {
            type: "encoder",

        } as EncoderItem,
        iface: {
            id: 'b_encoder_down',
            type: BoardInterfaceType.ENCODER,
            offset: 1
        } as BoardEncoder,
    },
    {
        id: 'ENCODER_UP',
        front: {
            type: "encoder",

        } as EncoderItem,
        iface: {
            id: 'b_encoder_up',
            type: BoardInterfaceType.ENCODER,
            offset: 1
        } as BoardEncoder,
    },


    // Outputs
    {
        id: "MULTI_PARKING_BRAKE_LED",
        front: {style: "square", color: "red"} as LedItem,
        iface: {id: 'l_parking_brake', type: BoardInterfaceType.LED, offset: 1} as BoardLed,
        sim: {
            id: "multi_parking_bake_led",
            type: "read",
            simid: MULTIPANEL_SIMIDS.PARKING_BRAKE_LED,
            name: "PED_annunParkingBrake"
        } as ReadDescriptor
    },
    {
        id: "MULTI_GEAR_TRANSIT_L_LED",
        front: {style: "square", color: "red"} as LedItem,
        iface: {id: 'l_gear_transit_l', type: BoardInterfaceType.LED, offset: 1} as BoardLed,
        sim: {
            id: "multi_gear_transit_l_led",
            type: "read",
            simid: MULTIPANEL_SIMIDS.GEAR_TRANSIT_L_LED,
            name: "MAIN_annunGEAR_transit",
            position: 0,
        } as ReadDescriptor
    },
    {
        id: "MULTI_GEAR_TRANSIT_F_LED",
        front: {style: "square", color: "red"} as LedItem,
        iface: {id: 'l_gear_transit_l', type: BoardInterfaceType.LED, offset: 1} as BoardLed,
        sim: {
            id: "multi_gear_transit_f_led",
            type: "read",
            simid: MULTIPANEL_SIMIDS.GEAR_TRANSIT_F_LED,
            name: "MAIN_annunGEAR_transit",
            position: 1,
        } as ReadDescriptor
    },
    {
        id: "MULTI_GEAR_TRANSIT_R_LED",
        front: {style: "square", color: "red"} as LedItem,
        iface: {id: 'l_gear_transit_l', type: BoardInterfaceType.LED, offset: 1} as BoardLed,
        sim: {
            id: "multi_gear_transit_r_led",
            type: "read",
            simid: MULTIPANEL_SIMIDS.GEAR_TRANSIT_R_LED,
            name: "MAIN_annunGEAR_transit",
            position: 2,
        } as ReadDescriptor
    },
    {
        id: "MULTI_GEAR_LOCKED_L_LED",
        front: {style: "square", color: "green"} as LedItem,
        iface: {id: 'l_gear_locked_l', type: BoardInterfaceType.LED, offset: 1} as BoardLed,
        sim: {
            id: "multi_gear_locked_l_led",
            type: "read",
            simid: MULTIPANEL_SIMIDS.GEAR_LOCKED_L_LED,
            name: "MAIN_annunGEAR_locked",
            position: 0,
        } as ReadDescriptor
    },
    {
        id: "MULTI_GEAR_LOCKED_F_LED",
        front: {style: "square", color: "green"} as LedItem,
        iface: {id: 'l_gear_locked_l', type: BoardInterfaceType.LED, offset: 1} as BoardLed,
        sim: {
            id: "multi_gear_locked_f_led",
            type: "read",
            simid: MULTIPANEL_SIMIDS.GEAR_LOCKED_F_LED,
            name: "MAIN_annunGEAR_locked",
            position: 1,
        } as ReadDescriptor
    },
    {
        id: "MULTI_GEAR_LOCKED_R_LED",
        front: {style: "square", color: "green"} as LedItem,
        iface: {id: 'l_gear_locked_l', type: BoardInterfaceType.LED, offset: 1} as BoardLed,
        sim: {
            id: "multi_gear_locked_r_led",
            type: "read",
            simid: MULTIPANEL_SIMIDS.GEAR_LOCKED_R_LED,
            name: "MAIN_annunGEAR_locked",
            position: 2,
        } as ReadDescriptor
    },
    {
        id: "MULTI_APU_AVAILABLE_LED",
        front: {style: "square", color: "blue"} as LedItem,
        iface: {id: 'l_apu_available', type: BoardInterfaceType.LED, offset: 1} as BoardLed,
        sim: {
            id: "multi_apu_available_led",
            type: "read",
            simid: MULTIPANEL_SIMIDS.APU_AVAILABLE_LED,
            name: "ELEC_APUGenSw"
        } as ReadDescriptor
    },
    {
        id: "MULTI_FIRE_WARNING_LED",
        front: {style: "square", color: "red"} as LedItem,
        iface: {id: 'l_fire_warning', type: BoardInterfaceType.LED, offset: 1} as BoardLed,
        sim: {
            id: "multi_fire_warning_led",
            type: "read",
            simid: MULTIPANEL_SIMIDS.FIRE_WARNING_LED, // TODO
            name: "WARN_annunFIRE_WARN"
        } as ReadDescriptor
    },
    {
        id: "MULTI_MASTER_CAUTION_LED",
        front: {style: "square", color: "yellow"} as LedItem,
        iface: {id: 'l_master_caution', type: BoardInterfaceType.LED, offset: 1} as BoardLed,
        sim: {
            id: "multi_master_caution_led",
            type: "read",
            simid: MULTIPANEL_SIMIDS.MASTER_CAUTION_LED,
            name: "WARN_annunMASTER_CAUTION"
        } as ReadDescriptor
    },
    {
        id: "MULTI_AUTOBRAKE_DISARMED_LED",
        front: {style: "square", color: "yellow"} as LedItem,
        iface: {id: 'l_autobrake_disarmed', type: BoardInterfaceType.LED, offset: 1} as BoardLed,
        sim: {
            id: "multi_autobrake_disarmed_led",
            type: "read",
            simid: MULTIPANEL_SIMIDS.AUTOBRAKE_DISARMED_LED,
            name: "MAIN_annunAUTO_BRAKE_DISARM"
        } as ReadDescriptor
    },
    {
        id: "MULTI_SPEEDBRAKE_ARMED_LED",
        front: {style: "square", color: "green"} as LedItem,
        iface: {id: 'l_speedbrake_armed', type: BoardInterfaceType.LED, offset: 1} as BoardLed,
        sim: {
            id: "multi_speedbrake_armed_led",
            type: "read",
            simid: MULTIPANEL_SIMIDS.SPEEDBRAKE_ARMED_LED,
            name: "MAIN_annunSPEEDBRAKE_ARMED",
        } as ReadDescriptor
    },
    {
        id: "MULTI_FLAPS_EXTENDED_LED",
        front: {style: "square", color: "green"} as LedItem,
        iface: {id: 'l_flaps_extended', type: BoardInterfaceType.LED, offset: 1} as BoardLed,
        sim: {
            id: "multi_flaps_extended_led",
            type: "read",
            simid: MULTIPANEL_SIMIDS.FLAPS_EXTENDED_LED,
            name: "MAIN_annunLE_FLAPS_EXT",
        } as ReadDescriptor
    },

    // Displays
    {
        id: "MULTI_DISPLAY_ACTIVE",
        iface: {
            id: "multi_display_active",
            type: BoardInterfaceType.DISPLAY,
            offset: 1,
        } as BoardDisplay
    },
    {
        id: "MULTI_DISPLAY_STANDBY",
        iface: {
            id: "multi_display_active",
            type: BoardInterfaceType.DISPLAY,
            offset: 2,
        } as BoardDisplay
    },

    // Sim vars (pmdg + simconnect)
    {
        id: 'PMDG_NG3_Data',
        sim: {
            id: 'PMDG_NG3_Data',
            simid: MULTIPANEL_SIMIDS.PMDG_DATA,
            type: "data",
            size: PMDG_NG3_Data_Size(),
            dataName: PMDG_NG3_DATA_NAME,
            dataId: PMDG_NG3_DATA_ID,
            dataDefinition: PMDG_NG3_DATA_DEFINITION,
            dataUpdateOnChange: false,
        } as DataDescriptor
    },
    {
        id: 'FS_SimConnect_Avionics_Data',
        sim: {
            id: 'FS_SimConnect_Avionics_Data',
            simid: MULTIPANEL_SIMIDS.SIMCONNECT_DATA,
            type: "data",
            size: CalculateSize(SimConnect_Avionics_Data),
            dataName: PMDG_NG3_DATA_NAME, // TODO
            dataId: PMDG_NG3_DATA_ID, // TODO
            dataDefinition: PMDG_NG3_DATA_DEFINITION, // TODO
            dataUpdateOnChange: false, // TODO
        } as DataDescriptor
    },

    // Sim read vars
    {
        id: "MULTI_BARO_MB",
        sim: {
            id: "multi_BARO",
            simid: MULTIPANEL_SIMIDS.MULTI_BARO_MB,
            type: "read",
            name: "KOHLSMAN SETTING MB"
        } as ReadDescriptor
    },
    {
        id: "MULTI_BARO_IN",
        sim: {
            id: "multi_BARO",
            simid: MULTIPANEL_SIMIDS.MULTI_BARO_IN,
            type: "read",
            name: "KOHLSMAN SETTING IN"
        } as ReadDescriptor
    },
    {
        id: "MULTI_COM1_ACTIVE",
        sim: {
            id: "multi_COM1_A",
            simid: MULTIPANEL_SIMIDS.MULTI_COM1_A,
            type: "read",
            name: "COM_ACTIVE_FREQUENCY:1"
        } as ReadDescriptor
    },
    {
        id: "MULTI_COM1_STANDBY",
        sim: {
            id: "multi_COM1_S",
            simid: MULTIPANEL_SIMIDS.MULTI_COM1_S,
            type: "read",
            name: "COM_STANDBY_FREQUENCY:1"
        } as ReadDescriptor
    },
    {
        id: "MULTI_COM2_ACTIVE",
        sim: {
            id: "multi_COM1_A",
            simid: MULTIPANEL_SIMIDS.MULTI_COM2_A,
            type: "read",
            name: "COM_ACTIVE_FREQUENCY:2"
        } as ReadDescriptor
    },
    {
        id: "MULTI_COM2_STANDBY",
        sim: {
            id: "multi_COM1_S",
            simid: MULTIPANEL_SIMIDS.MULTI_COM2_S,
            type: "read",
            name: "COM_STANDBY_FREQUENCY:2"
        } as ReadDescriptor
    },
    {
        id: "MULTI_NAV1_ACTIVE",
        sim: {
            id: "multi_NAV1_A",
            simid: MULTIPANEL_SIMIDS.MULTI_NAV1_A,
            type: "read",
            name: "NAV_ACTIVE_FREQUENCY:1"
        } as ReadDescriptor
    },
    {
        id: "MULTI_NAV1_STANDBY",
        sim: {
            id: "multi_NAV1_S",
            simid: MULTIPANEL_SIMIDS.MULTI_NAV1_S,
            type: "read",
            name: "NAV_STANDBY_FREQUENCY:1"
        } as ReadDescriptor
    },
    {
        id: "MULTI_NAV2_ACTIVE",
        sim: {
            id: "multi_NAV1_A",
            simid: MULTIPANEL_SIMIDS.MULTI_NAV2_A,
            type: "read",
            name: "NAV_ACTIVE_FREQUENCY:2"
        } as ReadDescriptor
    },
    {
        id: "MULTI_NAV2_STANDBY",
        sim: {
            id: "multi_NAV1_S",
            simid: MULTIPANEL_SIMIDS.MULTI_NAV2_S,
            type: "read",
            name: "NAV_STANDBY_FREQUENCY:2"
        } as ReadDescriptor
    },
    {
        id: "MULTI_XPNDR",
        sim: {
            id: "multi_XPNDR",
            simid: MULTIPANEL_SIMIDS.MULTI_XPNDR,
            type: "read",
            name: "TRANSPONDER_CODE"
        } as ReadDescriptor
    },
]
