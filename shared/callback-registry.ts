type GenericCallback = (...args: any[]) => void

const registry = new Map<string, GenericCallback>()

export const registerCallback = <T extends GenericCallback>(
    id: string,
    fn: T
) => {
    registry.set(id, fn)
}

export const getCallback = <T extends GenericCallback>(
    id: string
): T | undefined => {
    return registry.get(id) as T | undefined
}

export const removeCallback = (id: string) => {
    registry.delete(id)
}
