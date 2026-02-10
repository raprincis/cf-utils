import "dotenv/config"

export type VcapService = Record<string, Array<ServiceDefinition>>

export type ServiceDefinition = {
    binding_guid: string
    binding_name: string|null
    credentials: ServiceCredential
    instance_guid: string
    instance_name: string
    label: string
    name: string
    plan: string
    provider: any
    syslog_drain_url: any
    tags: string[]
    volume_mounts: any[]
}

export type ServiceCredential = {
    apiurl: string
    clientid: string
    clientsecret: string
    "credential-type": string
    identityzone: string
    identityzoneid: string
    sburl: string
    serviceInstanceId: string
    subaccountid: string
    tenantid: string
    tenantmode: string
    uaadomain: string
    url: string
    verificationkey: string
    xsappname: string
    zoneid: string
}


class CfEnv {
    private _services: ServiceDefinition[] = []
    constructor() {
        this._services = this._flattenProcessServices()
    }

    private _flattenProcessServices():ServiceDefinition[] {
        try {
            const vcapService: VcapService = JSON.parse(process.env.VCAP_SERVICES ?? '')
            return Object.keys(vcapService)
                .reduce<ServiceDefinition[]>((previous, serviceType) => {
                    const services = vcapService[serviceType]
                    return [...previous, ...services ?? []]
                }, [])

        } catch (error) {
            return []
        }
    }

    getServiceByName(serviceName:string) {
        return this._services.find(service => service.name === serviceName)
    }
}


const cfEnv = new CfEnv()
export default cfEnv


