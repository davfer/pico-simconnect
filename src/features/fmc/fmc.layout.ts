import {BoardButton, BoardInterfaceType, BoardItem, BoardLed} from "@shared/board.types.ts";
import {
    EVT_CDU_L_0,
    EVT_CDU_L_1,
    EVT_CDU_L_2,
    EVT_CDU_L_3,
    EVT_CDU_L_4,
    EVT_CDU_L_5,
    EVT_CDU_L_6,
    EVT_CDU_L_7,
    EVT_CDU_L_8,
    EVT_CDU_L_9,
    EVT_CDU_L_A,
    EVT_CDU_L_B,
    EVT_CDU_L_C,
    EVT_CDU_L_CLB,
    EVT_CDU_L_CLR,
    EVT_CDU_L_CRZ,
    EVT_CDU_L_D,
    EVT_CDU_L_DEL,
    EVT_CDU_L_DEP_ARR,
    EVT_CDU_L_DES,
    EVT_CDU_L_DOT,
    EVT_CDU_L_E,
    EVT_CDU_L_EXEC,
    EVT_CDU_L_F,
    EVT_CDU_L_FIX,
    EVT_CDU_L_G,
    EVT_CDU_L_H,
    EVT_CDU_L_HOLD,
    EVT_CDU_L_I,
    EVT_CDU_L_INIT_REF,
    EVT_CDU_L_J,
    EVT_CDU_L_K,
    EVT_CDU_L_L,
    EVT_CDU_L_L1,
    EVT_CDU_L_L2,
    EVT_CDU_L_L3,
    EVT_CDU_L_L4,
    EVT_CDU_L_L5,
    EVT_CDU_L_L6,
    EVT_CDU_L_LEGS,
    EVT_CDU_L_M,
    EVT_CDU_L_MENU,
    EVT_CDU_L_N,
    EVT_CDU_L_N1_LIMIT,
    EVT_CDU_L_NEXT_PAGE,
    EVT_CDU_L_O,
    EVT_CDU_L_P,
    EVT_CDU_L_PLUS_MINUS,
    EVT_CDU_L_PREV_PAGE,
    EVT_CDU_L_PROG,
    EVT_CDU_L_Q,
    EVT_CDU_L_R,
    EVT_CDU_L_R1,
    EVT_CDU_L_R2,
    EVT_CDU_L_R3,
    EVT_CDU_L_R4,
    EVT_CDU_L_R5,
    EVT_CDU_L_R6,
    EVT_CDU_L_RTE,
    EVT_CDU_L_S,
    EVT_CDU_L_SLASH,
    EVT_CDU_L_SPACE,
    EVT_CDU_L_T,
    EVT_CDU_L_U,
    EVT_CDU_L_V,
    EVT_CDU_L_W,
    EVT_CDU_L_X,
    EVT_CDU_L_Y,
    EVT_CDU_L_Z,
    PMDG_CDU_Data_Size,
    PMDG_NG3_CDU_0_DEFINITION,
    PMDG_NG3_CDU_0_ID,
    PMDG_NG3_CDU_0_NAME, PMDG_NG3_DATA_DEFINITION, PMDG_NG3_DATA_ID, PMDG_NG3_DATA_NAME,
    PMDG_NG3_Data_Size
} from "@shared/definitions/PMDG_NG3_SDK.ts";
import {DataDescriptor, ReadDescriptor, WriteDescriptor} from "@shared/sim.types.ts";

export enum FMC_SIMIDS {
    CDU_SCREEN,
    PMDG_DATA,
    CDU_L1,
    CDU_L2,
    CDU_L3,
    CDU_L4,
    CDU_L5,
    CDU_L6,
    CDU_R1,
    CDU_R2,
    CDU_R3,
    CDU_R4,
    CDU_R5,
    CDU_R6,
    CDU_INIT,
    CDU_RTE,
    CDU_CLB,
    CDU_CRZ,
    CDU_DES,
    CDU_MENU,
    CDU_LEGS,
    CDU_DEP_ARR,
    CDU_HOLD,
    CDU_PROG,
    CDU_EXEC,
    CDU_N1,
    CDU_FIX,
    CDU_PREV,
    CDU_NEXT,
    CDU_1,
    CDU_2,
    CDU_3,
    CDU_4,
    CDU_5,
    CDU_6,
    CDU_7,
    CDU_8,
    CDU_9,
    CDU_DOT,
    CDU_0,
    CDU_SIGN,
    CDU_A,
    CDU_B,
    CDU_C,
    CDU_D,
    CDU_E,
    CDU_F,
    CDU_G,
    CDU_H,
    CDU_I,
    CDU_J,
    CDU_K,
    CDU_L,
    CDU_M,
    CDU_N,
    CDU_O,
    CDU_P,
    CDU_Q,
    CDU_R,
    CDU_S,
    CDU_T,
    CDU_U,
    CDU_V,
    CDU_W,
    CDU_X,
    CDU_Y,
    CDU_Z,
    CDU_SP,
    CDU_DEL,
    CDU_SLASH,
    CDU_CLR
}


export const FMC_LAYOUT = [
    {
        id: "CDU_L1",
        front: {style: "rectangle-sm", value: "-"},
        iface: {id: 'b_l1', type: BoardInterfaceType.BUTTON, offset: 79} as BoardButton,
        sim: {
            id: "cdu_L1",
            simid: FMC_SIMIDS.CDU_L1,
            hwid: EVT_CDU_L_L1,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_L2",
        front: {style: "rectangle-sm", value: "-"},
        iface: {id: 'b_l2', type: BoardInterfaceType.BUTTON, offset: 78} as BoardButton,
        sim: {
            id: "cdu_L2",
            simid: FMC_SIMIDS.CDU_L2,
            hwid: EVT_CDU_L_L2,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_L3",
        front: {style: "rectangle-sm", value: "-"},
        iface: {id: 'b_l3', type: BoardInterfaceType.BUTTON, offset: 77} as BoardButton,
        sim: {
            id: "cdu_L3",
            simid: FMC_SIMIDS.CDU_L3,
            hwid: EVT_CDU_L_L3,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_L4",
        front: {style: "rectangle-sm", value: "-"},
        iface: {id: 'b_l4', type: BoardInterfaceType.BUTTON, offset: 76} as BoardButton,
        sim: {
            id: "cdu_L4",
            simid: FMC_SIMIDS.CDU_L4,
            hwid: EVT_CDU_L_L4,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_L5",
        front: {style: "rectangle-sm", value: "-"},
        iface: {id: 'b_l5', type: BoardInterfaceType.BUTTON, offset: 75} as BoardButton,
        sim: {
            id: "cdu_L5",
            simid: FMC_SIMIDS.CDU_L5,
            hwid: EVT_CDU_L_L5,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_L6",
        front: {style: "rectangle-sm", value: "-"},
        iface: {id: 'b_l6', type: BoardInterfaceType.BUTTON, offset: 74} as BoardButton,
        sim: {
            id: "cdu_L6",
            simid: FMC_SIMIDS.CDU_L6,
            hwid: EVT_CDU_L_L6,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_R1",
        front: {style: "rectangle-sm", value: "-"},
        iface: {id: 'b_r1', type: BoardInterfaceType.BUTTON, offset: 23} as BoardButton,
        sim: {
            id: "cdu_R1",
            simid: FMC_SIMIDS.CDU_R1,
            hwid: EVT_CDU_L_R1,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_R2",
        front: {style: "rectangle-sm", value: "-"},
        iface: {id: 'b_r2', type: BoardInterfaceType.BUTTON, offset: 22} as BoardButton,
        sim: {
            id: "cdu_R2",
            simid: FMC_SIMIDS.CDU_R2,
            hwid: EVT_CDU_L_R2,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_R3",
        front: {style: "rectangle-sm", value: "-"},
        iface: {id: 'b_r3', type: BoardInterfaceType.BUTTON, offset: 21} as BoardButton,
        sim: {
            id: "cdu_R3",
            simid: FMC_SIMIDS.CDU_R3,
            hwid: EVT_CDU_L_R3,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_R4",
        front: {style: "rectangle-sm", value: "-"},
        iface: {id: 'b_r4', type: BoardInterfaceType.BUTTON, offset: 28} as BoardButton,
        sim: {
            id: "cdu_R4",
            simid: FMC_SIMIDS.CDU_R4,
            hwid: EVT_CDU_L_R4,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_R5",
        front: {style: "rectangle-sm", value: "-"},
        iface: {id: 'b_r5', type: BoardInterfaceType.BUTTON, offset: 29} as BoardButton,
        sim: {
            id: "cdu_R5",
            simid: FMC_SIMIDS.CDU_R5,
            hwid: EVT_CDU_L_R5,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_R6",
        front: {style: "rectangle-sm", value: "-"},
        iface: {id: 'b_r6', type: BoardInterfaceType.BUTTON, offset: 30} as BoardButton,
        sim: {
            id: "cdu_R6",
            simid: FMC_SIMIDS.CDU_R6,
            hwid: EVT_CDU_L_R6,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_INIT",
        front: {style: "rectangle", value: "INIT"},
        iface: {id: 'b_init', type: BoardInterfaceType.BUTTON, offset: 39} as BoardButton,
        sim: {
            id: "cdu_INIT",
            simid: FMC_SIMIDS.CDU_INIT,
            hwid: EVT_CDU_L_INIT_REF,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_RTE",
        front: {style: "rectangle", value: "RTE"},
        iface: {id: 'b_rte', type: BoardInterfaceType.BUTTON, offset: 63} as BoardButton,
        sim: {
            id: "cdu_RTE",
            simid: FMC_SIMIDS.CDU_RTE,
            hwid: EVT_CDU_L_RTE,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_CLB",
        front: {style: "rectangle", value: "CLB"},
        iface: {id: 'b_clb', type: BoardInterfaceType.BUTTON, offset: 72} as BoardButton,
        sim: {
            id: "cdu_CLB",
            simid: FMC_SIMIDS.CDU_CLB,
            hwid: EVT_CDU_L_CLB,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_CRZ",
        front: {style: "rectangle", value: "CRZ"},
        iface: {id: 'b_crz', type: BoardInterfaceType.BUTTON, offset: 65} as BoardButton,
        sim: {
            id: "cdu_CRZ",
            simid: FMC_SIMIDS.CDU_CRZ,
            hwid: EVT_CDU_L_CRZ,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_DES",
        front: {style: "rectangle", value: "DES"},
        iface: {id: 'b_des', type: BoardInterfaceType.BUTTON, offset: 20} as BoardButton,
        sim: {
            id: "cdu_DES",
            simid: FMC_SIMIDS.CDU_DES,
            hwid: EVT_CDU_L_DES,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_MENU",
        front: {style: "rectangle", value: "MENU"},
        iface: {id: 'b_menu', type: BoardInterfaceType.BUTTON, offset: 71} as BoardButton,
        sim: {
            id: "cdu_MENU",
            simid: FMC_SIMIDS.CDU_MENU,
            hwid: EVT_CDU_L_MENU,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_LEGS",
        front: {style: "rectangle", value: "LEGS"},
        iface: {id: 'b_legs', type: BoardInterfaceType.BUTTON, offset: 61} as BoardButton,
        sim: {
            id: "cdu_LEGS",
            simid: FMC_SIMIDS.CDU_LEGS,
            hwid: EVT_CDU_L_LEGS,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_DEP_ARR",
        front: {style: "rectangle", value: "DEP ARR"},
        iface: {id: 'b_dep', type: BoardInterfaceType.BUTTON, offset: 62} as BoardButton,
        sim: {
            id: "cdu_DEP",
            simid: FMC_SIMIDS.CDU_DEP_ARR,
            hwid: EVT_CDU_L_DEP_ARR,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_HOLD",
        front: {style: "rectangle", value: "HOLD"},
        iface: {id: 'b_hold', type: BoardInterfaceType.BUTTON, offset: 19} as BoardButton,
        sim: {
            id: "cdu_HOLD",
            simid: FMC_SIMIDS.CDU_HOLD,
            hwid: EVT_CDU_L_HOLD,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_PROG",
        front: {style: "rectangle", value: "PROG"},
        iface: {id: 'b_prog', type: BoardInterfaceType.BUTTON, offset: 18} as BoardButton,
        sim: {
            id: "cdu_PROG",
            simid: FMC_SIMIDS.CDU_PROG,
            hwid: EVT_CDU_L_PROG,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_EXEC",
        front: {style: "rectangle", value: "EXEC"},
        iface: {id: 'b_exec', type: BoardInterfaceType.BUTTON, offset: 17} as BoardButton,
        sim: {
            id: "cdu_EXEC",
            simid: FMC_SIMIDS.CDU_EXEC,
            hwid: EVT_CDU_L_EXEC,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_N1",
        front: {style: "rectangle", value: "N1"},
        iface: {id: 'b_n1', type: BoardInterfaceType.BUTTON, offset: 69} as BoardButton,
        sim: {
            id: "cdu_N1",
            simid: FMC_SIMIDS.CDU_N1,
            hwid: EVT_CDU_L_N1_LIMIT,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_FIX",
        front: {style: "rectangle", value: "FIX"},
        iface: {id: 'b_fix', type: BoardInterfaceType.BUTTON, offset: 70} as BoardButton,
        sim: {
            id: "cdu_FIX",
            simid: FMC_SIMIDS.CDU_FIX,
            hwid: EVT_CDU_L_FIX,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_PREV",
        front: {style: "rectangle", value: "PREV"},
        iface: {id: 'b_prev', type: BoardInterfaceType.BUTTON, offset: 67} as BoardButton,
        sim: {
            id: "cdu_PREV",
            simid: FMC_SIMIDS.CDU_PREV,
            hwid: EVT_CDU_L_PREV_PAGE,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_NEXT",
        front: {style: "rectangle", value: "NEXT"},
        iface: {id: 'b_next', type: BoardInterfaceType.BUTTON, offset: 68} as BoardButton,
        sim: {
            id: "cdu_NEXT",
            simid: FMC_SIMIDS.CDU_NEXT,
            hwid: EVT_CDU_L_NEXT_PAGE,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_1",
        front: {style: "circle", value: "1"},
        iface: {id: 'b_1', type: BoardInterfaceType.BUTTON, offset: 53} as BoardButton,
        sim: {
            id: "cdu_1",
            simid: FMC_SIMIDS.CDU_1,
            hwid: EVT_CDU_L_1,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_2",
        front: {style: "circle", value: "2"},
        iface: {id: 'b_2', type: BoardInterfaceType.BUTTON, offset: 54} as BoardButton,
        sim: {
            id: "cdu_2",
            simid: FMC_SIMIDS.CDU_2,
            hwid: EVT_CDU_L_2,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_3",
        front: {style: "circle", value: "3"},
        iface: {id: 'b_3', type: BoardInterfaceType.BUTTON, offset: 55} as BoardButton,
        sim: {
            id: "cdu_3",
            simid: FMC_SIMIDS.CDU_3,
            hwid: EVT_CDU_L_3,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_4",
        front: {style: "circle", value: "4"},
        iface: {id: 'b_4', type: BoardInterfaceType.BUTTON, offset: 49} as BoardButton,
        sim: {
            id: "cdu_4",
            simid: FMC_SIMIDS.CDU_4,
            hwid: EVT_CDU_L_4,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_5",
        front: {style: "circle", value: "5"},
        iface: {id: 'b_5', type: BoardInterfaceType.BUTTON, offset: 50} as BoardButton,
        sim: {
            id: "cdu_5",
            simid: FMC_SIMIDS.CDU_5,
            hwid: EVT_CDU_L_5,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_6",
        front: {style: "circle", value: "6"},
        iface: {id: 'b_6', type: BoardInterfaceType.BUTTON, offset: 51} as BoardButton,
        sim: {
            id: "cdu_6",
            simid: FMC_SIMIDS.CDU_6,
            hwid: EVT_CDU_L_6,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_7",
        front: {style: "circle", value: "7"},
        iface: {id: 'b_7', type: BoardInterfaceType.BUTTON, offset: 57} as BoardButton,
        sim: {
            id: "cdu_7",
            simid: FMC_SIMIDS.CDU_7,
            hwid: EVT_CDU_L_7,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_8",
        front: {style: "circle", value: "8"},
        iface: {id: 'b_8', type: BoardInterfaceType.BUTTON, offset: 58} as BoardButton,
        sim: {
            id: "cdu_8",
            simid: FMC_SIMIDS.CDU_8,
            hwid: EVT_CDU_L_8,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_9",
        front: {style: "circle", value: "9"},
        iface: {id: 'b_9', type: BoardInterfaceType.BUTTON, offset: 59} as BoardButton,
        sim: {
            id: "cdu_9",
            simid: FMC_SIMIDS.CDU_9,
            hwid: EVT_CDU_L_9,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_DOT",
        front: {style: "circle", value: "."},
        iface: {id: 'b_dot', type: BoardInterfaceType.BUTTON, offset: 56} as BoardButton,
        sim: {
            id: "cdu_DOT",
            simid: FMC_SIMIDS.CDU_DOT,
            hwid: EVT_CDU_L_DOT,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_0",
        front: {style: "circle", value: "0"},
        iface: {id: 'b_0', type: BoardInterfaceType.BUTTON, offset: 48} as BoardButton,
        sim: {
            id: "cdu_0",
            simid: FMC_SIMIDS.CDU_0,
            hwid: EVT_CDU_L_0,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_SIGN",
        front: {style: "circle", value: "+/-"},
        iface: {id: 'b_sign', type: BoardInterfaceType.BUTTON, offset: 64} as BoardButton,
        sim: {
            id: "cdu_SIGN",
            simid: FMC_SIMIDS.CDU_SIGN,
            hwid: EVT_CDU_L_PLUS_MINUS,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_A",
        front: {style: "square", value: "A"},
        iface: {id: 'b_a', type: BoardInterfaceType.BUTTON, offset: 66} as BoardButton,
        sim: {
            id: "cdu_A",
            simid: FMC_SIMIDS.CDU_A,
            hwid: EVT_CDU_L_A,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_B",
        front: {style: "square", value: "B"},
        iface: {id: 'b_b', type: BoardInterfaceType.BUTTON, offset: 27} as BoardButton,
        sim: {
            id: "cdu_B",
            simid: FMC_SIMIDS.CDU_B,
            hwid: EVT_CDU_L_B,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_C",
        front: {style: "square", value: "C"},
        iface: {id: 'b_c', type: BoardInterfaceType.BUTTON, offset: 26} as BoardButton,
        sim: {
            id: "cdu_C",
            simid: FMC_SIMIDS.CDU_C,
            hwid: EVT_CDU_L_C,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_D",
        front: {style: "square", value: "D"},
        iface: {id: 'b_d', type: BoardInterfaceType.BUTTON, offset: 25} as BoardButton,
        sim: {
            id: "cdu_D",
            simid: FMC_SIMIDS.CDU_D,
            hwid: EVT_CDU_L_D,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_E",
        front: {style: "square", value: "E"},
        iface: {id: 'b_e', type: BoardInterfaceType.BUTTON, offset: 24} as BoardButton,
        sim: {
            id: "cdu_E",
            simid: FMC_SIMIDS.CDU_E,
            hwid: EVT_CDU_L_E,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_F",
        front: {style: "square", value: "F"},
        iface: {id: 'b_f', type: BoardInterfaceType.BUTTON, offset: 73} as BoardButton,
        sim: {
            id: "cdu_F",
            simid: FMC_SIMIDS.CDU_F,
            hwid: EVT_CDU_L_F,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_G",
        front: {style: "square", value: "G"},
        iface: {id: 'b_g', type: BoardInterfaceType.BUTTON, offset: 47} as BoardButton,
        sim: {
            id: "cdu_G",
            simid: FMC_SIMIDS.CDU_G,
            hwid: EVT_CDU_L_G,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_H",
        front: {style: "square", value: "H"},
        iface: {id: 'b_h', type: BoardInterfaceType.BUTTON, offset: 46} as BoardButton,
        sim: {
            id: "cdu_H",
            simid: FMC_SIMIDS.CDU_H,
            hwid: EVT_CDU_L_H,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_I",
        front: {style: "square", value: "I"},
        iface: {id: 'b_i', type: BoardInterfaceType.BUTTON, offset: 45} as BoardButton,
        sim: {
            id: "cdu_I",
            simid: FMC_SIMIDS.CDU_I,
            hwid: EVT_CDU_L_I,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_J",
        front: {style: "square", value: "J"},
        iface: {id: 'b_j', type: BoardInterfaceType.BUTTON, offset: 44} as BoardButton,
        sim: {
            id: "cdu_J",
            simid: FMC_SIMIDS.CDU_J,
            hwid: EVT_CDU_L_J,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_K",
        front: {style: "square", value: "K"},
        iface: {id: 'b_k', type: BoardInterfaceType.BUTTON, offset: 16} as BoardButton,
        sim: {
            id: "cdu_K",
            simid: FMC_SIMIDS.CDU_K,
            hwid: EVT_CDU_L_K,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_L",
        front: {style: "square", value: "L"},
        iface: {id: 'b_l', type: BoardInterfaceType.BUTTON, offset: 3} as BoardButton,
        sim: {
            id: "cdu_L",
            simid: FMC_SIMIDS.CDU_L,
            hwid: EVT_CDU_L_L,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_M",
        front: {style: "square", value: "M"},
        iface: {id: 'b_m', type: BoardInterfaceType.BUTTON, offset: 2} as BoardButton,
        sim: {
            id: "cdu_M",
            simid: FMC_SIMIDS.CDU_M,
            hwid: EVT_CDU_L_M,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_N",
        front: {style: "square", value: "N"},
        iface: {id: 'b_n', type: BoardInterfaceType.BUTTON, offset: 1} as BoardButton,
        sim: {
            id: "cdu_N",
            simid: FMC_SIMIDS.CDU_N,
            hwid: EVT_CDU_L_N,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_O",
        front: {style: "square", value: "O"},
        iface: {id: 'b_o', type: BoardInterfaceType.BUTTON, offset: 0} as BoardButton,
        sim: {
            id: "cdu_O",
            simid: FMC_SIMIDS.CDU_O,
            hwid: EVT_CDU_L_O,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_P",
        front: {style: "square", value: "P"},
        iface: {id: 'b_p', type: BoardInterfaceType.BUTTON, offset: 52} as BoardButton,
        sim: {
            id: "cdu_P",
            simid: FMC_SIMIDS.CDU_P,
            hwid: EVT_CDU_L_P,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_Q",
        front: {style: "square", value: "Q"},
        iface: {id: 'b_q', type: BoardInterfaceType.BUTTON, offset: 11} as BoardButton,
        sim: {
            id: "cdu_Q",
            simid: FMC_SIMIDS.CDU_Q,
            hwid: EVT_CDU_L_Q,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_R",
        front: {style: "square", value: "R"},
        iface: {id: 'b_r', type: BoardInterfaceType.BUTTON, offset: 10} as BoardButton,
        sim: {
            id: "cdu_R",
            simid: FMC_SIMIDS.CDU_R,
            hwid: EVT_CDU_L_R,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_S",
        front: {style: "square", value: "S"},
        iface: {id: 'b_s', type: BoardInterfaceType.BUTTON, offset: 9} as BoardButton,
        sim: {
            id: "cdu_S",
            simid: FMC_SIMIDS.CDU_S,
            hwid: EVT_CDU_L_S,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_T",
        front: {style: "square", value: "T"},
        iface: {id: 'b_t', type: BoardInterfaceType.BUTTON, offset: 8} as BoardButton,
        sim: {
            id: "cdu_T",
            simid: FMC_SIMIDS.CDU_T,
            hwid: EVT_CDU_L_T,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_U",
        front: {style: "square", value: "U"},
        iface: {id: 'b_u', type: BoardInterfaceType.BUTTON, offset: 37} as BoardButton,
        sim: {
            id: "cdu_U",
            simid: FMC_SIMIDS.CDU_U,
            hwid: EVT_CDU_L_U,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_V",
        front: {style: "square", value: "V"},
        iface: {id: 'b_v', type: BoardInterfaceType.BUTTON, offset: 15} as BoardButton,
        sim: {
            id: "cdu_V",
            simid: FMC_SIMIDS.CDU_V,
            hwid: EVT_CDU_L_V,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_W",
        front: {style: "square", value: "W"},
        iface: {id: 'b_w', type: BoardInterfaceType.BUTTON, offset: 14} as BoardButton,
        sim: {
            id: "cdu_W",
            simid: FMC_SIMIDS.CDU_W,
            hwid: EVT_CDU_L_W,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_X",
        front: {style: "square", value: "X"},
        iface: {id: 'b_x', type: BoardInterfaceType.BUTTON, offset: 13} as BoardButton,
        sim: {
            id: "cdu_X",
            simid: FMC_SIMIDS.CDU_X,
            hwid: EVT_CDU_L_X,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_Y",
        front: {style: "square", value: "Y"},
        iface: {id: 'b_y', type: BoardInterfaceType.BUTTON, offset: 12} as BoardButton,
        sim: {
            id: "cdu_Y",
            simid: FMC_SIMIDS.CDU_Y,
            hwid: EVT_CDU_L_Y,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_Z", front: {style: "square", value: "Z"},
        iface: {id: 'b_z', type: BoardInterfaceType.BUTTON, offset: 38} as BoardButton,
        sim: {
            id: "cdu_Z",
            simid: FMC_SIMIDS.CDU_Z,
            hwid: EVT_CDU_L_Z,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_SP",
        front: {style: "square", value: "SP"},
        iface: {id: 'b_sp', type: BoardInterfaceType.BUTTON, offset: 4} as BoardButton,
        sim: {
            id: "cdu_SP",
            simid: FMC_SIMIDS.CDU_SP,
            hwid: EVT_CDU_L_SPACE,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_DEL",
        front: {style: "square", value: "DEL"},
        iface: {id: 'b_del', type: BoardInterfaceType.BUTTON, offset: 5} as BoardButton,
        sim: {
            id: "cdu_DEL",
            simid: FMC_SIMIDS.CDU_DEL,
            hwid: EVT_CDU_L_DEL,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_SLASH",
        front: {style: "square", value: "/"},
        iface: {id: 'b_slash', type: BoardInterfaceType.BUTTON, offset: 6} as BoardButton,
        sim: {
            id: "cdu_SLASH",
            simid: FMC_SIMIDS.CDU_SLASH,
            hwid: EVT_CDU_L_SLASH,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_CLR",
        front: {style: "square", value: "CLR"},
        iface: {id: 'b_clr', type: BoardInterfaceType.BUTTON, offset: 7} as BoardButton,
        sim: {
            id: "cdu_CLR",
            simid: FMC_SIMIDS.CDU_CLR,
            hwid: EVT_CDU_L_CLR,
            type: "write"
        } as WriteDescriptor
    },
    {
        id: "CDU_EXEC_LIGHT",
        front: {style: "square"},
        iface: {id: 'l_exec', type: BoardInterfaceType.LED} as BoardLed,
        sim: {
            id: "cdu_EXEC_light",
            type: "read",
            simid: FMC_SIMIDS.PMDG_DATA,
            name: "CDU_annunEXEC"
        } as ReadDescriptor
    },
    {
        id: "CDU_CALL_LIGHT",
        front: {style: "rectangle"},
        iface: {id: 'l_call', type: BoardInterfaceType.LED} as BoardLed,
        sim: {
            id: "cdu_CALL_light",
            type: "read",
            simid: FMC_SIMIDS.PMDG_DATA,
            name: "CDU_annunCALL"
        } as ReadDescriptor
    },
    {
        id: "CDU_FAIL_LIGHT",
        front: {style: "rectangle"},
        iface: {id: 'l_fail', type: BoardInterfaceType.LED} as BoardLed,
        sim: {id: "cdu_FAIL_light", type: "read", simid: FMC_SIMIDS.PMDG_DATA, name: "CDU_annunFAIL"} as ReadDescriptor
    },
    {
        id: "CDU_MSG_LIGHT",
        front: {style: "rectangle"},
        iface: {id: 'l_msg', type: BoardInterfaceType.LED} as BoardLed,
        sim: {id: "cdu_MSG_light", type: "read", simid: FMC_SIMIDS.PMDG_DATA, name: "CDU_annunMSG"} as ReadDescriptor
    },
    {
        id: "CDU_OFST_LIGHT",
        front: {style: "rectangle"},
        iface: {id: 'l_ofst', type: BoardInterfaceType.LED} as BoardLed,
        sim: {id: "cdu_OFST_light", type: "read", simid: FMC_SIMIDS.PMDG_DATA, name: "CDU_annunOFST"} as ReadDescriptor
    },
    {
        id: "CDU_SCREEN_CONTENT",
        front: {style: "rectangle"},
        // iface: {id: 'cdu_screen', type: BoardInterfaceType.SCREEN, offset: 0} as BoardItem,
        sim: {
            id: "cdu_data_lines",
            type: "read",
            name: "CduDataLines"
        } as ReadDescriptor
    },
    {
        id: "CDU_SCREEN",
        onSimReadFnName: "CduScreenReadFn", // to send directly to hardware
        sim: {
            id: "cdu_SCREEN",
            simid: FMC_SIMIDS.CDU_SCREEN,
            type: "data",
            size: PMDG_CDU_Data_Size(),
            dataName: PMDG_NG3_CDU_0_NAME,
            dataId: PMDG_NG3_CDU_0_ID,
            dataDefinition: PMDG_NG3_CDU_0_DEFINITION,
            dataParserFnName: "CduScreenParseFn"
        } as DataDescriptor
    },
    {
        id: 'PMDG_NG3_Data',
        sim: {
            id: 'PMDG_NG3_Data',
            simid: FMC_SIMIDS.PMDG_DATA,
            type: "data",
            size: PMDG_NG3_Data_Size(),
            dataName: PMDG_NG3_DATA_NAME,
            dataId: PMDG_NG3_DATA_ID,
            dataDefinition: PMDG_NG3_DATA_DEFINITION,
            dataParserFnName: "PmdgNg3DataParseFn",
            dataUpdateOnChange: false,
        } as DataDescriptor
    }
] as BoardItem[]