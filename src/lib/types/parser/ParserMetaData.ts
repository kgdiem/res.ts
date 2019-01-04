export interface ParserMetaData {
    interfaces: Interface[];
    types: Type[];
    entity: string;
    name: string;
}

export interface Type {
    name: string;
    type: string;
}

export interface Interface {
    name: string;
    props: Prop[];
    entity: string;
}

export interface Prop {
    key: string;
    type: string;
}
