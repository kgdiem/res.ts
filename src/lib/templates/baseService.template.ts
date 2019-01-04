class Service {
    constructor(){}

    protected async _fetch<T>(url: string, config: any): Promise<T> {
        const res = await fetch(url, config);

        const json = await res.json();

        return json;
    }
}