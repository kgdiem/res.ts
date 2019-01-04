export interface ApiDefinition {
    auth?: AuthDescriptor;
    baseUrl?: string;
    entities: Entity[];
}

export interface Entity {
    methods: RequestMethod[];
    name: string;
    url: string;
}

export interface AuthDescriptor {
    type: AuthType;
    OAuthProviders?: string[];
    OAuthDescriptors?: OAuthDescriptors;
}

export enum AuthType {
    Basic = "basic",
    BearerToken = "bearer",
    OAuth2 = "oauth2",
}

export interface OAuthDescriptors {
    [key: string]: OAuthProvider;
}

export interface OAuthProvider {
    accessTokenUrl: string;
    authUrl: string;
    clientIdEnvKey: string;
    clientSecretEnvKey: string;
    name: string;
    grantType: string;
}

export interface RequestMethod {
    auth: boolean;
    method: string;
    body: boolean;
    queryParams: boolean;
}
