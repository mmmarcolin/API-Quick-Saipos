export class AdmPermissions {
    constructor(data) {
        this.permissions = data.map(permission => ({
            ...permission,
            allowed: permission.allowed === "N" ? "S" : permission.allowed
        }))
    }
}