import {
    BoardButton,
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
    EVT_MCP_ALT_HOLD_SWITCH,
    EVT_MCP_ALT_INTV_SWITCH,
    EVT_MCP_ALT_SET,
    EVT_MCP_APP_SWITCH,
    EVT_MCP_AT_ARM_SWITCH,
    EVT_MCP_BANK_ANGLE_SELECTOR,
    EVT_MCP_CMD_A_SWITCH,
    EVT_MCP_CMD_B_SWITCH,
    EVT_MCP_CO_SWITCH,
    EVT_MCP_CRS_L_SET,
    EVT_MCP_CWS_A_SWITCH,
    EVT_MCP_CWS_B_SWITCH,
    EVT_MCP_DISENGAGE_BAR,
    EVT_MCP_FD_SWITCH_L,
    EVT_MCP_FD_SWITCH_R,
    EVT_MCP_HDG_SEL_SWITCH,
    EVT_MCP_HDG_SET,
    EVT_MCP_IAS_SET,
    EVT_MCP_LNAV_SWITCH,
    EVT_MCP_LVL_CHG_SWITCH,
    EVT_MCP_N1_SWITCH,
    EVT_MCP_SPD_INTV_SWITCH,
    EVT_MCP_SPEED_SWITCH,
    EVT_MCP_VNAV_SWITCH,
    EVT_MCP_VOR_LOC_SWITCH,
    EVT_MCP_VS_SET,
    EVT_MCP_VS_SWITCH
} from "@shared/definitions/PMDG_NG3_SDK.ts";
import {ReadDescriptor, WriteDescriptor} from "@shared/sim.types.ts";

export const SPD_DEC = 20;
export const SPD_INC = 21;
export const HDG_DEC = 22;
export const HDG_INC = 23;
export const ALT_DEC = 24;
export const ALT_INC = 25;
export const VS_DEC = 39;
export const VS_INC = 40;
export const CRSL_DEC = 18;
export const CRSL_INC = 19;
export const CRSR_DEC = 26;
export const CRSR_INC = 27;
export const BUTTONS_REPORT = 1;

export enum MCP_SIMIDS {
    MCP_FD_L,
    MCP_FD_L_READ,
    MCP_FD_R,
    MCP_FD_R_READ,
    MCP_AT,
    MCP_AT_LED,
    MCP_DISENGAGE,
    MCP_DISENGAGE_READ,
    MCP_MA_L_LED,
    MCP_MA_R_LED,

    MCP_N1,
    MCP_SPD,
    MCP_HDG,
    MCP_ALT,
    MCP_VS,
    MCP_VNAV,
    MCP_LVL_CHG,
    MCP_LNAV,
    MCP_VOR_LOC,
    MCP_APP,
    MCP_CMD_A,
    MCP_CMD_B,
    MCP_CWS_A,
    MCP_CWS_B,

    MCP_N1_LED,
    MCP_SPD_LED,
    MCP_HDG_LED,
    MCP_ALT_LED,
    MCP_VS_LED,
    MCP_VNAV_LED,
    MCP_LVL_CHG_LED,
    MCP_LNAV_LED,
    MCP_VOR_LOC_LED,
    MCP_APP_LED,
    MCP_CMD_A_LED,
    MCP_CMD_B_LED,
    MCP_CWS_A_LED,
    MCP_CWS_B_LED,

    MCP_CO,
    MCP_SPD_INTV,
    MCP_ALT_INTV,

    MCP_BANK_SEL,

    MCP_CRS_L_ENC,
    MCP_CRS_R_ENC,
    MCP_SPD_ENC,
    MCP_HDG_ENC,
    MCP_ALT_ENC,
    MCP_VS_ENC,
}

export const MCP_LAYOUT: BoardItem[] = [
    // Inputs
    {
        id: 'MCP_FD_L',
        front: {
            type: "switch",
            style: "square",
            values: [{name: "ON", value: 1}, {name: "OFF", value: 0}],
        } as SwitchItem,
        iface: {
            id: 'b_mcp_fd_l',
            type: BoardInterfaceType.SWITCH,
            offsets: [{name: "ON", offset: 1, value: 1}, {name: "OFF"}]
        } as BoardSwitch,
        sim: {
            id: "mcp_FD_L",
            simid: MCP_SIMIDS.MCP_FD_L,
            hwid: EVT_MCP_FD_SWITCH_L,
            values: {"ON": 1, "OFF": 0},
            type: "write",
            read: {
                id: "mcp_FD_L_read",
                type: "read",
                simid: MCP_SIMIDS.MCP_FD_L_READ,
                name: "MCP_FDSw",
                position: 0,
            }
        } as WriteDescriptor
    },
    {
        id: 'MCP_FD_R',
        front: {
            type: "switch",
            style: "square",
            values: [{name: "ON", value: 1}, {name: "OFF", value: 0}],
        } as SwitchItem,
        iface: {
            id: 'b_mcp_fd_r',
            type: BoardInterfaceType.SWITCH,
            offsets: [{name: "ON", offset: 1, value: 1}, {name: "OFF"}]
        } as BoardSwitch,
        sim: {
            id: "mcp_FD_R",
            simid: MCP_SIMIDS.MCP_FD_R,
            hwid: EVT_MCP_FD_SWITCH_R,
            values: {"ON": 1, "OFF": 0},
            type: "write",
            read: {
                id: "mcp_FD_R_read",
                type: "read",
                simid: MCP_SIMIDS.MCP_FD_R_READ,
                name: "MCP_FDSw",
                position: 1,
            }
        } as WriteDescriptor
    },
    {
        id: 'MCP_AT',
        front: {
            type: "switch",
            style: "square",
            values: [{name: "ON", value: 1}, {name: "OFF", value: 0}],
        } as SwitchItem,
        iface: {
            id: 'b_mcp_at',
            type: BoardInterfaceType.SWITCH,
            offsets: [{name: "ON", offset: 1, value: 1}, {name: "OFF"}]
        } as BoardSwitch,
        sim: {
            id: "mcp_AT",
            simid: MCP_SIMIDS.MCP_AT,
            hwid: EVT_MCP_AT_ARM_SWITCH,
            values: {"ON": 1, "OFF": 0},
            type: "write"
        } as WriteDescriptor
    },
    {
        id: 'MCP_DISENGAGE',
        front: {
            type: "switch",
            style: "square",
            values: [{name: "ON", value: 1}, {name: "OFF", value: 0}],
        } as SwitchItem,
        iface: {
            id: 'b_mcp_disengage',
            type: BoardInterfaceType.SWITCH,
            offsets: [{name: "ON", offset: 1, value: 1}, {name: "OFF"}]
        } as BoardSwitch,
        sim: {
            id: "mcp_DISENGAGE",
            simid: MCP_SIMIDS.MCP_DISENGAGE,
            hwid: EVT_MCP_DISENGAGE_BAR,
            values: {"ON": 1, "OFF": 0},
            type: "write",
            read: {
                id: "mcp_DISENGAGE_read",
                type: "read",
                simid: MCP_SIMIDS.MCP_DISENGAGE_READ,
                name: "MCP_DisengageBar",
                position: 0,
            }
        } as WriteDescriptor
    },

    {
        id: "MCP_N1",
        front: {style: "rectangle-sm", value: "-"} as ButtonItem,
        iface: {id: 'b_MCP_N1', type: BoardInterfaceType.BUTTON, offset: 1} as BoardButton,
        sim: {
            id: "mcp_N1",
            simid: MCP_SIMIDS.MCP_N1,
            hwid: EVT_MCP_N1_SWITCH,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "MCP_SPD",
        front: {style: "rectangle-sm", value: "-"} as ButtonItem,
        iface: {id: 'b_MCP_SPD', type: BoardInterfaceType.BUTTON, offset: 1} as BoardButton,
        sim: {
            id: "mcp_SPD",
            simid: MCP_SIMIDS.MCP_SPD,
            hwid: EVT_MCP_SPEED_SWITCH,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "MCP_VNAV",
        front: {style: "rectangle-sm", value: "-"} as ButtonItem,
        iface: {id: 'b_MCP_VNAV', type: BoardInterfaceType.BUTTON, offset: 1} as BoardButton,
        sim: {
            id: "mcp_VNAV",
            simid: MCP_SIMIDS.MCP_VNAV,
            hwid: EVT_MCP_VNAV_SWITCH,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "MCP_LVL_CHG",
        front: {style: "rectangle-sm", value: "-"} as ButtonItem,
        iface: {id: 'b_MCP_LVL_CHG', type: BoardInterfaceType.BUTTON, offset: 1} as BoardButton,
        sim: {
            id: "mcp_LVL_CHG",
            simid: MCP_SIMIDS.MCP_LVL_CHG,
            hwid: EVT_MCP_LVL_CHG_SWITCH,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "MCP_HDG",
        front: {style: "rectangle-sm", value: "-"} as ButtonItem,
        iface: {id: 'b_MCP_HDG', type: BoardInterfaceType.BUTTON, offset: 1} as BoardButton,
        sim: {
            id: "mcp_HDG",
            simid: MCP_SIMIDS.MCP_HDG,
            hwid: EVT_MCP_HDG_SEL_SWITCH,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "MCP_LNAV",
        front: {style: "rectangle-sm", value: "-"} as ButtonItem,
        iface: {id: 'b_MCP_LNAV', type: BoardInterfaceType.BUTTON, offset: 1} as BoardButton,
        sim: {
            id: "mcp_LNAV",
            simid: MCP_SIMIDS.MCP_LNAV,
            hwid: EVT_MCP_LNAV_SWITCH,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "MCP_APP",
        front: {style: "rectangle-sm", value: "-"} as ButtonItem,
        iface: {id: 'b_MCP_APP', type: BoardInterfaceType.BUTTON, offset: 1} as BoardButton,
        sim: {
            id: "mcp_APP",
            simid: MCP_SIMIDS.MCP_APP,
            hwid: EVT_MCP_APP_SWITCH,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "MCP_VOR_LOC",
        front: {style: "rectangle-sm", value: "-"} as ButtonItem,
        iface: {id: 'b_MCP_VOR_LOC', type: BoardInterfaceType.BUTTON, offset: 1} as BoardButton,
        sim: {
            id: "mcp_VOR_LOC",
            simid: MCP_SIMIDS.MCP_VOR_LOC,
            hwid: EVT_MCP_VOR_LOC_SWITCH,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "MCP_ALT",
        front: {style: "rectangle-sm", value: "-"} as ButtonItem,
        iface: {id: 'b_MCP_ALT', type: BoardInterfaceType.BUTTON, offset: 1} as BoardButton,
        sim: {
            id: "mcp_ALT",
            simid: MCP_SIMIDS.MCP_ALT,
            hwid: EVT_MCP_ALT_HOLD_SWITCH,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "MCP_VS",
        front: {style: "rectangle-sm", value: "-"} as ButtonItem,
        iface: {id: 'b_MCP_VS', type: BoardInterfaceType.BUTTON, offset: 1} as BoardButton,
        sim: {
            id: "mcp_VS",
            simid: MCP_SIMIDS.MCP_VS,
            hwid: EVT_MCP_VS_SWITCH,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "MCP_CMD_A",
        front: {style: "rectangle-sm", value: "-"} as ButtonItem,
        iface: {id: 'b_MCP_CMD_A', type: BoardInterfaceType.BUTTON, offset: 1} as BoardButton,
        sim: {
            id: "mcp_CMD_A",
            simid: MCP_SIMIDS.MCP_CMD_A,
            hwid: EVT_MCP_CMD_A_SWITCH,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "MCP_CMD_B",
        front: {style: "rectangle-sm", value: "-"} as ButtonItem,
        iface: {id: 'b_MCP_CMD_B', type: BoardInterfaceType.BUTTON, offset: 1} as BoardButton,
        sim: {
            id: "mcp_CMD_B",
            simid: MCP_SIMIDS.MCP_CMD_B,
            hwid: EVT_MCP_CMD_B_SWITCH,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "MCP_CWS_A",
        front: {style: "rectangle-sm", value: "-"} as ButtonItem,
        iface: {id: 'b_MCP_CWS_A', type: BoardInterfaceType.BUTTON, offset: 1} as BoardButton,
        sim: {
            id: "mcp_CWS_A",
            simid: MCP_SIMIDS.MCP_CWS_A,
            hwid: EVT_MCP_CWS_A_SWITCH,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "MCP_CWS_B",
        front: {style: "rectangle-sm", value: "-"} as ButtonItem,
        iface: {id: 'b_MCP_CWS_B', type: BoardInterfaceType.BUTTON, offset: 1} as BoardButton,
        sim: {
            id: "mcp_CWS_B",
            simid: MCP_SIMIDS.MCP_CWS_B,
            hwid: EVT_MCP_CWS_B_SWITCH,
            type: "write"
        } as WriteDescriptor
    },

    {
        id: "MCP_CO",
        front: {style: "rectangle-sm", value: "-"} as ButtonItem,
        iface: {id: 'b_MCP_CO', type: BoardInterfaceType.BUTTON, offset: 1} as BoardButton,
        sim: {
            id: "mcp_CO",
            simid: MCP_SIMIDS.MCP_CO,
            hwid: EVT_MCP_CO_SWITCH,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "MCP_SPD_INTV",
        front: {style: "rectangle-sm", value: "-"} as ButtonItem,
        iface: {id: 'b_MCP_SPD_INTV', type: BoardInterfaceType.BUTTON, offset: 1} as BoardButton,
        sim: {
            id: "mcp_SPD_INTV",
            simid: MCP_SIMIDS.MCP_SPD_INTV,
            hwid: EVT_MCP_SPD_INTV_SWITCH,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "MCP_ALT_INTV",
        front: {style: "rectangle-sm", value: "-"} as ButtonItem,
        iface: {id: 'b_MCP_ALT_INTV', type: BoardInterfaceType.BUTTON, offset: 1} as BoardButton,
        sim: {
            id: "mcp_ALT_INTV",
            simid: MCP_SIMIDS.MCP_ALT_INTV,
            hwid: EVT_MCP_ALT_INTV_SWITCH,
            type: "write"
        } as WriteDescriptor
    },

    {
        id: 'MCP_BANK_SEL',
        front: {
            type: "switch",
            style: "rotary",
            values: [{name: "10", value: 0}, {name: "15", value: 1}, {name: "20", value: 2}, {
                name: "25",
                value: 3
            }, {name: "30", value: 4}],
        } as SwitchItem,
        iface: {
            id: 'b_bank_sel',
            type: BoardInterfaceType.SWITCH,
            offsets: [
                {name: "10", offset: 0, value: 0},
                {name: "15", offset: 1, value: 1},
                {name: "20", offset: 2, value: 2},
                {name: "25", offset: 3, value: 3},
                {name: "30", offset: 4, value: 4}
            ]
        } as BoardSwitch,
        sim: {
            id: "mcp_BANK_SEL",
            simid: MCP_SIMIDS.MCP_BANK_SEL,
            hwid: EVT_MCP_BANK_ANGLE_SELECTOR,
            values: {"10": 0, "15": 1, "20": 2, "25": 3, "30": 4},
            type: "write"
        } as WriteDescriptor
    },
    {
        id: 'ENCODER_CRS_L',
        front: {
            type: "encoder",
        } as EncoderItem,
        iface: {
            id: 'b_encoder_crs_l',
            type: BoardInterfaceType.ENCODER,
            offset: 1
        } as BoardEncoder,
        sim: {
            id: "mcp_CRS_L",
            simid: MCP_SIMIDS.MCP_CRS_L_ENC,
            hwid: EVT_MCP_CRS_L_SET,
            type: "write",
        } as WriteDescriptor
    },
    {
        id: 'ENCODER_CRS_R',
        front: {
            type: "encoder",
        } as EncoderItem,
        iface: {
            id: 'b_encoder_crs_r',
            type: BoardInterfaceType.ENCODER,
            offset: 1
        } as BoardEncoder,
        sim: {
            id: "mcp_CRS_R",
            simid: MCP_SIMIDS.MCP_CRS_R_ENC,
            hwid: EVT_MCP_CRS_L_SET,
            type: "write",
        } as WriteDescriptor
    },
    {
        id: 'ENCODER_SPD',
        front: {
            type: "encoder",
        } as EncoderItem,
        iface: {
            id: 'b_encoder_spd',
            type: BoardInterfaceType.ENCODER,
            offset: 1
        } as BoardEncoder,
        sim: {
            id: "mcp_SPD",
            simid: MCP_SIMIDS.MCP_SPD_ENC,
            hwid: EVT_MCP_IAS_SET,
            type: "write",
        } as WriteDescriptor
    },
    {
        id: 'ENCODER_HDG',
        front: {
            type: "encoder",
        } as EncoderItem,
        iface: {
            id: 'b_encoder_hdg',
            type: BoardInterfaceType.ENCODER,
            offset: 1
        } as BoardEncoder,
        sim: {
            id: "mcp_HDG",
            simid: MCP_SIMIDS.MCP_HDG_ENC,
            hwid: EVT_MCP_HDG_SET,
            type: "write",
        } as WriteDescriptor
    },
    {
        id: 'ENCODER_ALT',
        front: {
            type: "encoder",
        } as EncoderItem,
        iface: {
            id: 'b_encoder_alt',
            type: BoardInterfaceType.ENCODER,
            offset: 1
        } as BoardEncoder,
        sim: {
            id: "mcp_ALT",
            simid: MCP_SIMIDS.MCP_ALT_ENC,
            hwid: EVT_MCP_ALT_SET,
            type: "write",
        } as WriteDescriptor
    },
    {
        id: 'ENCODER_VS',
        front: {
            type: "encoder",
        } as EncoderItem,
        iface: {
            id: 'b_encoder_vs',
            type: BoardInterfaceType.ENCODER,
            offset: 1
        } as BoardEncoder,
        sim: {
            id: "mcp_VS",
            simid: MCP_SIMIDS.MCP_VS_ENC,
            hwid: EVT_MCP_VS_SET,
            type: "write",
        } as WriteDescriptor
    },

    // Outputs
    {
        id: "MCP_MA_L_LED",
        front: {style: "circle"} as LedItem,
        iface: {id: 'l_MA_L_LED', type: BoardInterfaceType.LED} as BoardLed,
        sim: {
            id: "mcp_fd_l_led",
            type: "read",
            simid: MCP_SIMIDS.MCP_FD_L_READ,
            name: "MCP_annunFD",
            position: 0
        } as ReadDescriptor
    },
    {
        id: "MCP_MA_R_LED",
        front: {style: "circle"} as LedItem,
        iface: {id: 'l_MA_R_LED', type: BoardInterfaceType.LED} as BoardLed,
        sim: {
            id: "mcp_fd_r_led",
            type: "read",
            simid: MCP_SIMIDS.MCP_FD_R_READ,
            name: "MCP_annunFD",
            position: 1
        } as ReadDescriptor
    },
    {
        id: "MCP_AT_LED",
        front: {style: "circle"} as LedItem,
        iface: {id: 'l_MCP_AT_LED', type: BoardInterfaceType.LED} as BoardLed,
        sim: {
            id: "mcp_at_led",
            type: "read",
            simid: MCP_SIMIDS.MCP_AT_LED,
            name: "MCP_annunATArm",
            position: 0
        } as ReadDescriptor
    },
    {
        id: "MCP_N1_LED",
        front: {style: "circle"} as LedItem,
        iface: {id: 'l_MCP_N1_LED', type: BoardInterfaceType.LED} as BoardLed,
        sim: {
            id: "mcp_n1_led",
            type: "read",
            simid: MCP_SIMIDS.MCP_N1_LED,
            name: "MCP_annunN1",
            position: 0
        } as ReadDescriptor
    },
    {
        id: "MCP_SPD_LED",
        front: {style: "circle"} as LedItem,
        iface: {id: 'l_MCP_SPD_LED', type: BoardInterfaceType.LED} as BoardLed,
        sim: {
            id: "mcp_spd_led",
            type: "read",
            simid: MCP_SIMIDS.MCP_SPD_LED,
            name: "MCP_annunSPEED",
            position: 0
        } as ReadDescriptor
    },
    {
        id: "MCP_VNAV_LED",
        front: {style: "circle"} as LedItem,
        iface: {id: 'l_MCP_VNAV_LED', type: BoardInterfaceType.LED} as BoardLed,
        sim: {
            id: "mcp_vnav_led",
            type: "read",
            simid: MCP_SIMIDS.MCP_VNAV_LED,
            name: "MCP_annunVNAV",
            position: 0
        } as ReadDescriptor
    },
    {
        id: "MCP_LVL_CHG_LED",
        front: {style: "circle"} as LedItem,
        iface: {id: 'l_MCP_LVL_CHG_LED', type: BoardInterfaceType.LED} as BoardLed,
        sim: {
            id: "mcp_lvl_chg_led",
            type: "read",
            simid: MCP_SIMIDS.MCP_LVL_CHG_LED,
            name: "MCP_annunLVL_CHG",
            position: 0
        } as ReadDescriptor
    },
    {
        id: "MCP_HDG_LED",
        front: {style: "circle"} as LedItem,
        iface: {id: 'l_MCP_HDG_LED', type: BoardInterfaceType.LED} as BoardLed,
        sim: {
            id: "mcp_hdg_led",
            type: "read",
            simid: MCP_SIMIDS.MCP_HDG_LED,
            name: "MCP_annunHDG_SEL",
            position: 0
        } as ReadDescriptor
    },
    {
        id: "MCP_LNAV_LED",
        front: {style: "circle"} as LedItem,
        iface: {id: 'l_MCP_LNAV_LED', type: BoardInterfaceType.LED} as BoardLed,
        sim: {
            id: "mcp_lnav_led",
            type: "read",
            simid: MCP_SIMIDS.MCP_LNAV_LED,
            name: "MCP_annunLNAV",
            position: 0
        } as ReadDescriptor
    },
    {
        id: "MCP_APP_LED",
        front: {style: "circle"} as LedItem,
        iface: {id: 'l_MCP_APP_LED', type: BoardInterfaceType.LED} as BoardLed,
        sim: {
            id: "mcp_app_led",
            type: "read",
            simid: MCP_SIMIDS.MCP_APP_LED,
            name: "MCP_annunAPP",
            position: 0
        } as ReadDescriptor
    },
    {
        id: "MCP_VOR_LOC_LED",
        front: {style: "circle"} as LedItem,
        iface: {id: 'l_MCP_VOR_LOC_LED', type: BoardInterfaceType.LED} as BoardLed,
        sim: {
            id: "mcp_vor_loc_led",
            type: "read",
            simid: MCP_SIMIDS.MCP_VOR_LOC_LED,
            name: "MCP_annunVOR_LOC",
            position: 0
        } as ReadDescriptor
    },
    {
        id: "MCP_ALT_LED",
        front: {style: "circle"} as LedItem,
        iface: {id: 'l_MCP_ALT_LED', type: BoardInterfaceType.LED} as BoardLed,
        sim: {
            id: "mcp_alt_led",
            type: "read",
            simid: MCP_SIMIDS.MCP_ALT_LED,
            name: "MCP_annunALT_HOLD",
            position: 0
        } as ReadDescriptor
    },
    {
        id: "MCP_VS_LED",
        front: {style: "circle"} as LedItem,
        iface: {id: 'l_MCP_VS_LED', type: BoardInterfaceType.LED} as BoardLed,
        sim: {
            id: "mcp_vs_led",
            type: "read",
            simid: MCP_SIMIDS.MCP_VS_LED,
            name: "MCP_annunVS",
            position: 0
        } as ReadDescriptor
    },
    {
        id: "MCP_CMD_A_LED",
        front: {style: "circle"} as LedItem,
        iface: {id: 'l_MCP_CMD_A_LED', type: BoardInterfaceType.LED} as BoardLed,
        sim: {
            id: "mcp_cmd_a_led",
            type: "read",
            simid: MCP_SIMIDS.MCP_CMD_A_LED,
            name: "MCP_annunCMD_A",
            position: 0
        } as ReadDescriptor
    },
    {
        id: "MCP_CMD_B_LED",
        front: {style: "circle"} as LedItem,
        iface: {id: 'l_MCP_CMD_B_LED', type: BoardInterfaceType.LED} as BoardLed,
        sim: {
            id: "mcp_cmd_b_led",
            type: "read",
            simid: MCP_SIMIDS.MCP_CMD_B_LED,
            name: "MCP_annunCMD_B",
            position: 0
        } as ReadDescriptor
    },
    {
        id: "MCP_CWS_A_LED",
        front: {style: "circle"} as LedItem,
        iface: {id: 'l_MCP_CWS_A_LED', type: BoardInterfaceType.LED} as BoardLed,
        sim: {
            id: "mcp_cws_a_led",
            type: "read",
            simid: MCP_SIMIDS.MCP_CWS_A_LED,
            name: "MCP_annunCWS_A",
            position: 0
        } as ReadDescriptor
    },
    {
        id: "MCP_CWS_B_LED",
        front: {style: "circle"} as LedItem,
        iface: {id: 'l_MCP_CWS_B_LED', type: BoardInterfaceType.LED} as BoardLed,
        sim: {
            id: "mcp_cws_b_led",
            type: "read",
            simid: MCP_SIMIDS.MCP_CWS_B_LED,
            name: "MCP_annunCWS_B",
            position: 0
        } as ReadDescriptor
    },

    // Displays

]