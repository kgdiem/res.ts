export interface ParserMetaData {
    interfaces: Interface[],
    types: string[],
    entity: string
}

export interface Interface {
    name: string,
    props: Prop[],
    entity: string
}

export interface Prop {
    key: string,
    type: string
}
