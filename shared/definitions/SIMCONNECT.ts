import {DataDefinition, DataDefinitionType} from "../sim.types";


// https://docs.flightsimulator.com/html/Programming_Tools/SimVars/Simulation_Variables.htm
//https://www.prepar3d.com/SDKv3/LearningCenter/utilities/variables/simulation_variables.html
export const SimConnect_Engine_Data: DataDefinition[] = [
    {name: "NUMBER_OF_ENGINES", dataType: DataDefinitionType.UINT, size: 1, unit: "number"},

]

export const SimConnect_Weather_Data: DataDefinition[] = []


export const SimConnect_Avionics_Data: DataDefinition[] = []