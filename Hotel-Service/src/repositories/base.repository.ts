import { CreationAttributes, Model, ModelStatic, WhereOptions } from "sequelize";

abstract class BaseRepository<T extends Model>{


    protected model:ModelStatic<T>

    constructor(model: ModelStatic<T> ){
        this.model=model
    }

   async findById(id:number):Promise<T | null>{

    const record=await this.model.findByPk(id)
    if(!record) return null

    else return record

   }


   async findAll():Promise<T[]>{
        const records=await this.model.findAll()
        if(!records) return []
        return records
   }

   async deleteById(whereOptions:WhereOptions<T>):Promise<void>{
    const record=await this.model.destroy({
        where:{
            ...whereOptions
        }
    })

    if(!record){
        throw new Error(`Record not found with deletion options ${JSON.stringify(whereOptions)}`)
    }

    return
   

   }

   async create(data:CreationAttributes<T>):Promise<T>{
        const record=await this.model.create(data)
        return record

   }


   async update(id:number,data:Partial<T>):Promise<T|null>{
    const record=await this.model.findByPk(id)
    if(!record){
        return null
    }

    Object.assign(record,data)
    await record.save()
    return record

   }


}

export default BaseRepository