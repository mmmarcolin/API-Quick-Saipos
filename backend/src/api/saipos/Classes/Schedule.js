import { storeId } from "./../../../config/variables.js"

export class Schedule {
    constructor() {
        this.upsert = []
    }
    
    addWeekDay(data) {
        this.upsert.push({
            id_store: storeId,
            day_week: data.day_week,
            start_time: data.start_time.replace(/(\d{2})(\d{2})/, "$1:$2"),
            end_time: data.end_time.replace(/(\d{2})(\d{2})/, "$1:$2"),
            new: true,
            start_schedule_time: "",
            end_schedule_time: "",
            enable_edit: false
        })
    }
}