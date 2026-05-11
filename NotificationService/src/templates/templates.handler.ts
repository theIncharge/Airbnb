import fs from 'fs/promises'
import path from 'path'
import Handlebars from 'handlebars'
import { InternalServerError } from '../utils/errors/app.error'

export async function renderMailTemplate(templateId:string,params:Record<string,any>):Promise<string>{

    const templatePath=path.join(__dirname,"mailers",`${templateId}.hbs`)

    try{
        const templateContent=await fs.readFile(templatePath,"utf-8")
        const template=Handlebars.compile(templateContent)

        return template(params)
        
        


    }catch(error){
        throw new InternalServerError(`template not found with template id:${templateId}`)
    }


}